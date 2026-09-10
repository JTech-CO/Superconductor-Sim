import { DEFAULT_EC, LORENZ, clamp } from './constants.js';
import { jcEffective } from './physics.js';

const CU_K_RRR100 = {
  a:2.2154, b:-0.47461, c:-0.88068, d:0.13871, e:0.29505,
  f:-0.02043, g:-0.04831, h:0.001281, i:0.003207
};

const CU_CP = {
  a:-1.91844, b:-0.15973, c:8.61013, d:-18.996, e:21.9661,
  f:-12.7328, g:3.54322, h:-0.3797, i:0
};

export function copperThermalConductivity(T, rrr = 100) {
  // Repository currently bundles all RRR fits, but the simulator intentionally implements
  // the verified RRR=100 path only. Other RRR values are mapped conservatively by scaling
  // around 100 and flagged by the UI as an approximation.
  const temp = clamp(T, 4, 300);
  const c = CU_K_RRR100;
  const s = Math.sqrt(temp);
  const numerator = c.a + c.c * s + c.e * temp + c.g * temp * s + c.i * temp * temp;
  const denominator = 1 + c.b * s + c.d * temp + c.f * temp * s + c.h * temp * temp;
  const k100 = Math.pow(10, numerator / denominator);
  if (rrr === 100) return k100;
  const scale = Math.pow(Math.max(10, rrr) / 100, 0.45);
  return k100 * scale;
}

export function copperSpecificHeat(T) {
  const temp = clamp(T, 4, 300);
  const x = Math.log10(temp);
  const c = CU_CP;
  const poly = c.a + c.b*x + c.c*x**2 + c.d*x**3 + c.e*x**4 + c.f*x**5 + c.g*x**6 + c.h*x**7 + c.i*x**8;
  return Math.pow(10, poly);
}

export function copperResistivityWF(T, rrr = 100) {
  // Wiedemann-Franz inversion is used only as an engineering approximation in this app.
  // It is not a replacement for magnetoresistance or a measured residual-resistivity curve.
  const k = copperThermalConductivity(T, rrr);
  return LORENZ * Math.max(T, 1e-6) / Math.max(k, 1e-12);
}

export function currentSharing({ currentA, T, BabsT, angleDeg, params, geometry, rrr = 100 }) {
  const widthM = Math.max(1e-9, geometry.widthM);
  const asc = widthM * Math.max(1e-12, geometry.scThicknessM);
  const acu = widthM * Math.max(0, geometry.copperThicknessM);
  const jc = jcEffective(params, T, BabsT, angleDeg);
  const rhoCu = copperResistivityWF(T, rrr);
  const rhoSc = Math.max(1e-12, params.normalResistivityOhmM || 1e-6);
  const n = Math.max(1, params.nValue || 20);
  const target = Math.max(0, Math.abs(currentA));

  if (target === 0) return { eVm:0, iScA:0, iCuA:0, jcAm2:jc, rhoCuOhmM:rhoCu };

  const totalAtE = (E) => {
    let iSc;
    if (T >= params.tcK || jc <= 0) {
      iSc = E * asc / rhoSc;
    } else {
      iSc = asc * jc * Math.pow(Math.max(E, 0) / DEFAULT_EC, 1 / n);
      // Softly blend toward the normal branch above 1 V/m to avoid unbounded power-law current.
      const blend = clamp(Math.log10(Math.max(E, 1e-12)) + 6, 0, 1) * clamp(E, 0, 1);
      const iNormal = E * asc / rhoSc;
      iSc = (1 - blend) * iSc + blend * iNormal;
    }
    const iCu = acu > 0 ? E * acu / rhoCu : 0;
    return { total:iSc + iCu, iSc, iCu };
  };

  let lo = 0;
  let hi = DEFAULT_EC;
  for (let k = 0; k < 80 && totalAtE(hi).total < target; k++) hi *= 4;
  hi = Math.min(hi, 1e8);
  for (let k = 0; k < 90; k++) {
    const mid = 0.5 * (lo + hi);
    if (totalAtE(mid).total < target) lo = mid; else hi = mid;
  }
  const E = 0.5 * (lo + hi);
  const solved = totalAtE(E);
  return { eVm:E, iScA:solved.iSc, iCuA:solved.iCu, jcAm2:jc, rhoCuOhmM:rhoCu };
}

export function thermalStep(state, inputs, dt) {
  const T = Math.max(0.01, state.temperatureK);
  const geom = inputs.geometry;
  const widthM = geom.widthM;
  const scT = geom.scThicknessM;
  const cuT = geom.copperThicknessM;
  const asc = widthM * scT;
  const acu = widthM * cuT;
  const totalT = scT + cuT;
  const perimeterM = 2 * (widthM + totalT);
  const sharing = currentSharing({
    currentA: inputs.currentA,
    T,
    BabsT: Math.abs(inputs.appliedFieldT),
    angleDeg: inputs.fieldAngleDeg,
    params: inputs.params,
    geometry: geom,
    rrr: inputs.copperRrr
  });

  const pPerLength = Math.abs(sharing.eVm * inputs.currentA); // W/m
  const cpCu = copperSpecificHeat(T);
  const cPerLength =
    inputs.params.densityScKgM3 * asc * Math.max(1, inputs.params.cpScJkgK) +
    8960 * acu * cpCu;
  const qCoolPerLength = inputs.heatTransferWm2K * perimeterM * (T - inputs.bathTemperatureK);
  const dTdt = (pPerLength - qCoolPerLength) / Math.max(1e-12, cPerLength);
  const nextT = Math.max(0.01, T + dTdt * dt);
  return {
    temperatureK: nextT,
    dTdtKps: dTdt,
    pPerLengthWm: pPerLength,
    qCoolPerLengthWm: qCoolPerLength,
    cpCuJkgK: cpCu,
    kCuWmK: copperThermalConductivity(T, inputs.copperRrr),
    ...sharing
  };
}

export class QuenchRun {
  constructor() {
    this.reset(77);
  }

  reset(temperatureK = 77) {
    this.timeS = 0;
    this.temperatureK = temperatureK;
    this.running = false;
    this.samples = [{ t:0, temperatureK, eVm:0, iScA:0, iCuA:0, pWm:0 }];
    this.last = null;
  }

  step(inputs, dt = 0.002) {
    const result = thermalStep({ temperatureK:this.temperatureK }, inputs, dt);
    this.temperatureK = result.temperatureK;
    this.timeS += dt;
    this.last = result;
    if (this.samples.length === 0 || this.timeS - this.samples[this.samples.length - 1].t >= 0.02) {
      this.samples.push({
        t:this.timeS,
        temperatureK:this.temperatureK,
        eVm:result.eVm,
        iScA:result.iScA,
        iCuA:result.iCuA,
        pWm:result.pPerLengthWm
      });
      if (this.samples.length > 1200) this.samples.shift();
    }
    return result;
  }
}
