import test from 'node:test';
import assert from 'node:assert/strict';
import { BeanSlab } from '../js/core/bean.js';
import { copperThermalConductivity, copperSpecificHeat, thermalStep } from '../js/core/thermal.js';
import { londonSlabProfile, criticalFields, allenDynesTc, jcEffective } from '../js/core/physics.js';

const generic = {
  tcK:92, lambda0Nm:150, xi0Nm:2, jc0Am2:3e10, jcB0T:0.6,
  jcTempExp:1.5, jcFieldExp:0.65, anisotropyGamma:5, nValue:25,
  normalResistivityOhmM:1e-6, densityScKgM3:6300, cpScJkgK:180
};

test('NIST RRR100 copper k(77 K) matches repository verification value', () => {
  const k = copperThermalConductivity(77, 100);
  assert.ok(Math.abs(k - 547.199698) < 0.002, `k=${k}`);
});

test('NIST copper specific heat is finite in published range', () => {
  const cp = copperSpecificHeat(77);
  assert.ok(Number.isFinite(cp) && cp > 0);
});

test('London slab screens the center more strongly than the surface', () => {
  const p = londonSlabProfile(0.01, 2e-6, 100e-9, 101);
  const center = p[Math.floor(p.length/2)].bT;
  assert.ok(Math.abs(center) < Math.abs(p[0].bT));
  assert.ok(Math.abs(p[0].bT - 0.01) < 1e-12);
});

test('Bean slab retains flux after an up/down field cycle', () => {
  const b = new BeanSlab(101);
  b.reset(0);
  b.update(0.5, 2e9, 5e-4);
  b.update(0, 2e9, 5e-4);
  assert.ok(Math.abs(b.averageB()) > 1e-5);
});

test('critical fields are positive below Tc', () => {
  const f = criticalFields({ lambdaM:150e-9, xiM:2e-9, T:0, Tc:92 });
  assert.ok(f.bc2T > f.bc1T);
  assert.ok(f.bcT > 0);
});

test('phenomenological Jc decreases with temperature and field', () => {
  const j0 = jcEffective(generic, 10, 0, 0);
  const jt = jcEffective(generic, 70, 0, 0);
  const jb = jcEffective(generic, 10, 5, 0);
  assert.ok(jt < j0);
  assert.ok(jb < j0);
});

test('simplified Allen-Dynes estimator returns a finite positive Tc in-domain', () => {
  const tc = allenDynesTc(1.0, 0.1, 300);
  assert.ok(Number.isFinite(tc) && tc > 0 && tc < 300);
});

test('electrothermal step remains finite', () => {
  const result = thermalStep({temperatureK:77}, {
    currentA:40, appliedFieldT:0.08, fieldAngleDeg:90, params:generic,
    geometry:{widthM:4e-3,scThicknessM:1e-6,copperThicknessM:40e-6,lengthM:0.1},
    copperRrr:100, bathTemperatureK:77, heatTransferWm2K:900
  }, 0.001);
  assert.ok(Number.isFinite(result.temperatureK));
  assert.ok(Number.isFinite(result.eVm));
});
