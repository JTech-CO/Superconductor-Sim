import { K_B, PHI0, TYPE_BOUNDARY, DEFAULT_EC, clamp, MU0 } from './constants.js';

export function reducedTemperature(T, Tc) {
  if (!(Tc > 0)) return 1;
  return clamp(T / Tc, 0, 100);
}

export function lambdaAtTemperature(lambda0M, T, Tc) {
  const t = reducedTemperature(T, Tc);
  if (t >= 1) return Infinity;
  const denom = Math.sqrt(Math.max(1e-12, 1 - Math.pow(t, 4)));
  return lambda0M / denom;
}

export function xiAtTemperature(xi0M, T, Tc) {
  const t = reducedTemperature(T, Tc);
  if (t >= 1) return Infinity;
  const denom = Math.sqrt(Math.max(1e-12, 1 - t * t));
  return xi0M / denom;
}

export function glKappa(lambdaM, xiM) {
  return lambdaM / xiM;
}

export function classifyType(kappa) {
  if (!Number.isFinite(kappa)) return 'normal';
  if (Math.abs(kappa - TYPE_BOUNDARY) < 0.08) return 'borderline';
  return kappa < TYPE_BOUNDARY ? 'type-i' : 'type-ii';
}

export function criticalFields({ lambdaM, xiM, T, Tc }) {
  if (T >= Tc || !Number.isFinite(lambdaM) || !Number.isFinite(xiM)) {
    return { type:'normal', kappa:Infinity, bc1T:0, bcT:0, bc2T:0 };
  }
  const kappa = glKappa(lambdaM, xiM);
  const type = classifyType(kappa);
  const bc2T = PHI0 / (2 * Math.PI * xiM * xiM);
  const bcT = PHI0 / (2 * Math.sqrt(2) * Math.PI * lambdaM * xiM);
  let bc1T = bcT;
  if (kappa > TYPE_BOUNDARY) {
    bc1T = PHI0 / (4 * Math.PI * lambdaM * lambdaM) * Math.max(0, Math.log(Math.max(kappa, 1e-12)) + 0.5);
  }
  return { type, kappa, bc1T, bcT, bc2T };
}

export function phaseState({ T, Tc, BabsT, fields }) {
  if (T >= Tc) return 'normal';
  if (fields.type === 'type-i' || fields.type === 'borderline') {
    return BabsT < fields.bcT ? 'meissner' : 'normal';
  }
  if (BabsT < fields.bc1T) return 'meissner';
  if (BabsT < fields.bc2T) return 'mixed';
  return 'normal';
}

export function jcEffective(params, T, BabsT, angleDeg = 0) {
  const t = reducedTemperature(T, params.tcK);
  if (t >= 1) return 0;
  const gamma = Math.max(1, params.anisotropyGamma || 1);
  const theta = angleDeg * Math.PI / 180;
  const epsilon = Math.sqrt(Math.cos(theta) ** 2 + Math.sin(theta) ** 2 / (gamma * gamma));
  const effectiveField = Math.abs(BabsT) * epsilon;
  const tempFactor = Math.pow(Math.max(0, 1 - t * t), Math.max(0.01, params.jcTempExp || 1.5));
  const b0 = Math.max(1e-9, params.jcB0T || 0.5);
  const q = Math.max(0.01, params.jcFieldExp || 0.7);
  const fieldFactor = 1 / (1 + Math.pow(effectiveField / b0, q));
  return Math.max(0, params.jc0Am2 * tempFactor * fieldFactor);
}

export function electricFieldFromJ(J, Jc, nValue, ec = DEFAULT_EC) {
  if (!(Jc > 0)) return Infinity;
  const sign = Math.sign(J) || 1;
  const ratio = Math.abs(J) / Jc;
  return sign * ec * Math.pow(ratio, Math.max(1, nValue));
}

export function vortexDensity(BavgT) {
  return Math.max(0, Math.abs(BavgT)) / PHI0;
}

export function triangularVortexSpacing(BavgT) {
  const density = vortexDensity(BavgT);
  if (!(density > 0)) return Infinity;
  return Math.sqrt(2 / (Math.sqrt(3) * density));
}

function stableCoshRatio(z, A) {
  const a = Math.abs(A);
  const zz = Math.abs(z);
  if (a < 20) return Math.cosh(zz) / Math.cosh(a);
  const e1 = Math.exp(zz - a);
  const e2 = Math.exp(-zz - a);
  const den = 1 + Math.exp(-2 * a);
  return (e1 + e2) / den;
}

export function londonSlabProfile(BappT, halfWidthM, lambdaM, points = 161) {
  const result = [];
  if (!(halfWidthM > 0) || !(lambdaM > 0) || !Number.isFinite(lambdaM)) {
    for (let i = 0; i < points; i++) {
      const x = -halfWidthM + (2 * halfWidthM * i) / (points - 1);
      result.push({ xM:x, bT:BappT });
    }
    return result;
  }
  const A = halfWidthM / lambdaM;
  for (let i = 0; i < points; i++) {
    const x = -halfWidthM + (2 * halfWidthM * i) / (points - 1);
    const ratio = stableCoshRatio(x / lambdaM, A);
    result.push({ xM:x, bT:BappT * ratio });
  }
  return result;
}

export function allenDynesTc(lambdaEpc, muStar, omegaLogK) {
  const lam = Number(lambdaEpc);
  const mu = Number(muStar);
  const omega = Number(omegaLogK);
  const denominator = lam - mu * (1 + 0.62 * lam);
  if (!(lam > 0) || !(omega > 0) || denominator <= 0) return NaN;
  const exponent = -1.04 * (1 + lam) / denominator;
  return omega / 1.2 * Math.exp(exponent);
}

export function weakCouplingGapMeV(TcK) {
  if (!(TcK > 0)) return 0;
  return 1.764 * K_B * TcK / 1.602176634e-22;
}

export function orderParameterAmplitude(T, Tc) {
  const t = reducedTemperature(T, Tc);
  return t >= 1 ? 0 : Math.sqrt(Math.max(0, 1 - t));
}

export function estimateIcA(jcAm2, widthM, scThicknessM) {
  return Math.max(0, jcAm2 * Math.max(0, widthM) * Math.max(0, scThicknessM));
}

function levitationCoupling(gapM, magnetRadiusM) {
  return Math.exp(-Math.max(0, gapM) / Math.max(1e-5, 0.55 * magnetRadiusM));
}

export function shieldingFraction({ phase, lambdaM, thicknessM, orderAmplitude }) {
  if (phase === 'normal') return 0;
  const base = 1 - Math.exp(-Math.max(0, thicknessM) / Math.max(1e-12, 2 * Math.max(lambdaM, 1e-12)));
  if (phase === 'meissner') return clamp(0.72 + 0.28 * base, 0, 1);
  return clamp((0.28 + 0.48 * base) * (0.55 + 0.45 * Math.max(0, orderAmplitude)), 0, 1);
}

export function pinningIndex({ phase, jcAm2, orderAmplitude }) {
  if (phase !== 'mixed') return phase === 'meissner' ? 0.08 : 0;
  const jcScale = Math.max(0, jcAm2) / (Math.max(0, jcAm2) + 3e9);
  return clamp((0.4 + 0.6 * jcScale) * (0.55 + 0.45 * Math.max(0, orderAmplitude)), 0, 1.3);
}

export function levitationEstimate({
  phase, BappT, radiusM, thicknessM, gapM, magnetRadiusM, magnetHeightM,
  lambdaM, orderAmplitude, jcAm2
}) {
  const area = Math.PI * Math.max(1e-10, radiusM) * Math.max(1e-10, radiusM);
  const coupling = levitationCoupling(gapM, magnetRadiusM);
  const faceBoost = 1 + 0.2 * clamp(magnetHeightM / Math.max(1e-6, magnetRadiusM), 0, 2.5);
  const gapFieldT = Math.abs(BappT) * coupling * faceBoost;
  const shield = shieldingFraction({ phase, lambdaM, thicknessM, orderAmplitude });
  const pinning = pinningIndex({ phase, jcAm2, orderAmplitude });
  const pressurePa = 0.5 * shield * gapFieldT * gapFieldT / MU0 * (1 + 0.65 * pinning);
  const forceN = pressurePa * area;
  const gap2 = gapM + Math.max(1e-5, 0.0004 * Math.max(1, radiusM * 1000));
  const coupling2 = levitationCoupling(gap2, magnetRadiusM);
  const gapField2 = Math.abs(BappT) * coupling2 * faceBoost;
  const pressure2 = 0.5 * shield * gapField2 * gapField2 / MU0 * (1 + 0.65 * pinning);
  const force2 = pressure2 * area;
  const stiffnessNm = (force2 - forceN) / Math.max(1e-9, gap2 - gapM);
  return {
    areaM2: area,
    gapFieldT,
    shielding: shield,
    pinning,
    pressurePa,
    forceN,
    stiffnessNm,
    coupling
  };
}
