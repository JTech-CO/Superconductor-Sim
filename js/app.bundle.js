/* Superconductor Sim compatibility bundle.
 * Generated from split source modules by scripts/build-compat.mjs.
 * No external bundler or dependency is required.
 */
(function () {
'use strict';

/* ---- js/core/constants.js ---- */
const MU0 = 4e-7 * Math.PI;
const EPS0 = 8.8541878128e-12;
const H = 6.62607015e-34;
const HBAR = H / (2 * Math.PI);
const E_CHARGE = 1.602176634e-19;
const K_B = 1.380649e-23;
const PHI0 = H / (2 * E_CHARGE);
const LORENZ = 2.44e-8;
const TYPE_BOUNDARY = 1 / Math.sqrt(2);
const DEFAULT_EC = 1e-4; // 1 µV/cm

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}


/* ---- js/data/materials.js ---- */
const SOURCE_LINKS = {
  researchRepo: {
    id: 'REPO',
    title: 'Superconductor Data Research',
    url: 'https://github.com/JTech-CO/Superconductor-Data-Research/',
    noteEn: 'Primary data-research repository used as the simulator contract and provenance baseline.',
    noteKo: '시뮬레이터의 데이터 계약과 출처 추적 기준으로 사용한 원 연구 저장소.'
  },
  jarvis2022: {
    id: 'JARVIS-2022',
    title: 'Choudhary & Garrity (2022)',
    url: 'https://arxiv.org/abs/2205.00060',
    noteEn: 'Tc benchmark table and conventional-superconductor screening context.',
    noteKo: 'Tc 비교표와 전통적 초전도체 탐색 맥락.'
  },
  nistCu: {
    id: 'NIST-CU',
    title: 'NIST OFHC Copper Cryogenic Fits',
    url: 'https://trc.nist.gov/cryogenics/materials/OFHC%20Copper/OFHC_Copper_rev1.htm',
    noteEn: 'RRR-dependent thermal conductivity and specific-heat fits used by the electrothermal module.',
    noteKo: '전기열 모듈에 사용하는 RRR 의존 열전도율 및 비열 피팅.'
  },
  pytdgl: {
    id: 'PYTDGL',
    title: 'pyTDGL theoretical background',
    url: 'https://py-tdgl.readthedocs.io/en/latest/background.html',
    noteEn: 'Reference for TDGL validity boundaries; this browser app does not claim to solve full TDGL.',
    noteKo: 'TDGL 적용 범위 참고. 이 브라우저 앱은 완전한 TDGL 해석을 수행한다고 주장하지 않음.'
  },
  nb2026: {
    id: 'NB-2026-APS',
    title: 'McFadden et al., Phys. Rev. B 113, L060508 (2026)',
    url: 'https://journals.aps.org/prb/abstract/10.1103/2nsw-n8gf',
    noteEn: 'Recent direct Nb penetration-depth and intrinsic coherence-length measurements.',
    noteKo: '최근 Nb 침투 깊이 및 고유 결맞음 길이 직접 측정.'
  },
  uci: {
    id: 'UCI-SC',
    title: 'UCI Superconductivity Data',
    url: 'https://archive.ics.uci.edu/dataset/464/superconductivty%2Bdata',
    noteEn: 'Composition-derived feature dataset for Tc regression; not a sample-complete simulation dataset.',
    noteKo: 'Tc 회귀용 조성 특징 데이터셋이며 시료 단위 완성형 시뮬레이션 데이터가 아님.'
  },
  levitation: {
    id: 'LEVITATION',
    title: 'Levitation benchmark literature (qualitative scope)',
    url: 'https://arxiv.org/abs/cond-mat/0111316',
    noteEn: 'Context for magnet-superconductor levitation and hysteretic force; this app uses only a heuristic display layer.',
    noteKo: '자기부상과 히스테리시스 힘의 맥락 참고. 이 앱은 정량 보정보다는 휴리스틱 표현층만 사용한다.'
  }
};

const TC_BENCHMARKS = [
  { formula:'Al', sg:225, jarvis:'JVASP-816', tcExp:1.2, tcScdft:1.55, tcLm:0.3, tcJscr:1.6, status:'literature_reference_only' },
  { formula:'Ta', sg:229, jarvis:'JVASP-1014', tcExp:4.5, tcScdft:5.17, tcLm:2.45, tcJscr:7.6, status:'literature_reference_only' },
  { formula:'Pb', sg:225, jarvis:'JVASP-961', tcExp:7.2, tcScdft:6.06, tcLm:4.95, tcJscr:5.4, status:'literature_reference_only' },
  { formula:'Nb', sg:229, jarvis:'JVASP-934', tcExp:9.3, tcScdft:10.29, tcLm:7.0, tcJscr:10.7, status:'literature_reference_only' },
  { formula:'ZrN', sg:225, jarvis:'JVASP-19679', tcExp:10.0, tcScdft:11.6, tcLm:6.12, tcJscr:10.0, status:'literature_reference_only' },
  { formula:'V3Si', sg:223, jarvis:'JVASP-14960', tcExp:17.0, tcScdft:18.1, tcLm:13.1, tcJscr:17.6, status:'literature_reference_only' },
  { formula:'MgB2', sg:191, jarvis:'JVASP-1151', tcExp:39.0, tcScdft:35.4, tcLm:20.04, tcJscr:33.0, status:'literature_reference_only' },
  { formula:'V', sg:229, jarvis:'JVASP-14837', tcExp:5.3, tcScdft:null, tcLm:null, tcJscr:18.3, status:'literature_reference_only' },
  { formula:'Nb3Si', sg:223, jarvis:'JVASP-15938', tcExp:18.0, tcScdft:null, tcLm:null, tcJscr:16.5, status:'literature_reference_only' },
  { formula:'NbO', sg:221, jarvis:'JVASP-14492', tcExp:1.38, tcScdft:null, tcLm:null, tcJscr:3.6, status:'literature_reference_only' },
  { formula:'NbC', sg:225, jarvis:'JVASP-19889', tcExp:12.0, tcScdft:null, tcLm:null, tcJscr:17.1, status:'literature_reference_only' },
  { formula:'NbN', sg:221, jarvis:'JVASP-36335', tcExp:16.0, tcScdft:null, tcLm:null, tcJscr:17.6, status:'literature_reference_only' },
  { formula:'YB6', sg:221, jarvis:'JVASP-20620', tcExp:7.2, tcScdft:null, tcLm:null, tcJscr:5.1, status:'literature_reference_only' },
  { formula:'Nb3Al', sg:223, jarvis:'JVASP-11981', tcExp:16.8, tcScdft:null, tcLm:null, tcJscr:9.0, status:'literature_reference_only' },
  { formula:'YH10', sg:225, jarvis:null, tcExp:260.0, tcScdft:null, tcLm:null, tcJscr:213.5, pressurePa:2.5e11, status:'quarantined' },
  { formula:'LaH10', sg:225, jarvis:null, tcExp:211.0, tcScdft:null, tcLm:null, tcJscr:190.0, pressurePa:2.5e11, status:'quarantined' }
];

const MODEL_MATRIX = [
  { id:'M01', en:'Meissner screening', ko:'마이스너 차폐', model:'London / GL', priority:'P0' },
  { id:'M02', en:'Order parameter and vortices', ko:'질서변수·보텍스', model:'GL / TDGL', priority:'P1' },
  { id:'M03', en:'Trapped flux and levitation', ko:'포획 자속·자기부상', model:'Maxwell + E-J + mechanics', priority:'P0' },
  { id:'M04', en:'Critical current and self field', ko:'임계전류·자체 자기장', model:'H or T-A formulation', priority:'P0' },
  { id:'M05', en:'AC loss and creep', ko:'교류 손실·크리프', model:'Maxwell + nonlinear transport', priority:'P1' },
  { id:'M06', en:'Electrothermal quench', ko:'전기·열 결합 퀜치', model:'E-J + heat equation + circuit', priority:'P0' },
  { id:'M07', en:'Strain and mechanical degradation', ko:'변형률·기계적 열화', model:'elasticity + calibrated Ic(strain)', priority:'P1' },
  { id:'M08', en:'Conventional pairing and gap', ko:'전통적 결합·에너지 갭', model:'DFPT + EPW / Eliashberg', priority:'P2' },
  { id:'M09', en:'Chemistry and annealing', ko:'화학·열처리', model:'diffusion/reaction + phase stability', priority:'P2' },
  { id:'M10', en:'High pressure phases', ko:'고압 상', model:'pressure-dependent structure + EPC', priority:'P2' },
  { id:'M11', en:'Josephson circuits', ko:'조셉슨 회로', model:'junction-specific effective model', priority:'P2' },
  { id:'M12', en:'Tc discovery surrogate', ko:'Tc 탐색 대리모델', model:'composition/structure regression', priority:'P2' }
];

const MATERIAL_PRESETS = [
  {
    id: 'rebco-tape-77k',
    formula: 'REBCO',
    nameEn: 'REBCO coated conductor - 77 K engineering preset',
    nameKo: 'REBCO 코팅도체 - 77 K 엔지니어링 프리셋',
    calibrationReady: false,
    provenanceClass: 'mixed',
    missing: ['sample_id','measured Jc(T,B,theta)','layer-specific thermal stack','measured E-J curve','joint resistance','force-displacement benchmark'],
    params: {
      tcK: 92,
      lambda0Nm: 150,
      xi0Nm: 2.1,
      jc0Am2: 3.2e10,
      jcB0T: 0.65,
      jcTempExp: 1.55,
      jcFieldExp: 0.68,
      anisotropyGamma: 5.4,
      nValue: 26,
      normalResistivityOhmM: 1e-6,
      densityScKgM3: 6300,
      cpScJkgK: 180,
      provenance: {
        tcK: 'representative cuprate engineering assumption',
        lambda0Nm: 'representative cuprate engineering assumption',
        xi0Nm: 'representative cuprate engineering assumption',
        jc0Am2: 'engineering-scale assumption; not sample-calibrated',
        nValue: 'engineering-scale assumption; not sample-calibrated'
      }
    }
  },
  {
    id: 'ybco-bulk-demo',
    formula: 'YBCO bulk',
    nameEn: 'Bulk YBCO - levitation-oriented demo preset',
    nameKo: '벌크 YBCO - 자기부상 시연 프리셋',
    calibrationReady: false,
    provenanceClass: 'assumed',
    missing: ['sample_id','measured trapped-flux map','force-distance loop','oxygen-order history','microstructure and pinning map'],
    params: {
      tcK: 91,
      lambda0Nm: 165,
      xi0Nm: 2.4,
      jc0Am2: 1.4e10,
      jcB0T: 0.42,
      jcTempExp: 1.6,
      jcFieldExp: 0.74,
      anisotropyGamma: 5.8,
      nValue: 22,
      normalResistivityOhmM: 1.2e-6,
      densityScKgM3: 6380,
      cpScJkgK: 190,
      provenance: {
        tcK: 'bulk YBCO demo assumption',
        lambda0Nm: 'bulk YBCO demo assumption',
        xi0Nm: 'bulk YBCO demo assumption',
        jc0Am2: 'bulk levitation demo assumption',
        nValue: 'bulk levitation demo assumption'
      }
    }
  },
  {
    id: 'mgb2-wire-demo',
    formula: 'MgB2',
    nameEn: 'MgB2 - 20 K wire-like demo preset',
    nameKo: 'MgB2 - 20 K 와이어형 시연 프리셋',
    calibrationReady: false,
    provenanceClass: 'mixed',
    missing: ['sample-specific Jc(B,T)','wire architecture','measured copper fraction','electrothermal benchmark'],
    params: {
      tcK: 39,
      lambda0Nm: 100,
      xi0Nm: 5.2,
      jc0Am2: 8.5e9,
      jcB0T: 1.6,
      jcTempExp: 1.35,
      jcFieldExp: 0.62,
      anisotropyGamma: 1.3,
      nValue: 24,
      normalResistivityOhmM: 2.2e-7,
      densityScKgM3: 2570,
      cpScJkgK: 350,
      provenance: {
        tcK: 'JARVIS literature benchmark value: MgB2 39 K',
        lambda0Nm: 'representative MgB2 engineering assumption',
        xi0Nm: 'representative MgB2 engineering assumption',
        jc0Am2: 'engineering assumption; not sample-calibrated',
        nValue: 'engineering assumption; not sample-calibrated'
      }
    }
  },
  {
    id: 'nb-hybrid-2026',
    formula: 'Nb',
    nameEn: 'Niobium - hybrid literature reference',
    nameKo: '나이오븀 - 문헌 혼합 참조',
    calibrationReady: false,
    provenanceClass: 'mixed',
    missing: ['sample-specific Jc(T,B)','sample geometry','measured E-J curve','thermal boundary data','measured levitation benchmark'],
    params: {
      tcK: 9.3,
      lambda0Nm: 29.1,
      xi0Nm: 39.9,
      jc0Am2: 1.0e9,
      jcB0T: 0.08,
      jcTempExp: 1.5,
      jcFieldExp: 0.8,
      anisotropyGamma: 1,
      nValue: 30,
      normalResistivityOhmM: 1.5e-7,
      densityScKgM3: 8570,
      cpScJkgK: 100,
      provenance: {
        tcK: 'repository JARVIS-2022 Table 1 literature reference',
        lambda0Nm: 'McFadden et al. 2026: lambdaL = 29.1(10) nm',
        xi0Nm: 'McFadden et al. 2026: xi0 = 39.9(25) nm',
        jc0Am2: 'demo assumption - not sample-calibrated',
        nValue: 'demo assumption - not sample-calibrated'
      }
    }
  },
  {
    id: 'generic-type-ii',
    formula: 'Type-II demo',
    nameEn: 'Generic Type-II - demonstration card',
    nameKo: '일반 제2종 - 시연용 카드',
    calibrationReady: false,
    provenanceClass: 'assumed',
    missing: ['sample_id','measured Jc(T,B,theta)','measured lambda(T)','measured xi(T)','raw E-J curve','cooling boundary data'],
    params: {
      tcK: 92,
      lambda0Nm: 150,
      xi0Nm: 2,
      jc0Am2: 3e10,
      jcB0T: 0.6,
      jcTempExp: 1.5,
      jcFieldExp: 0.65,
      anisotropyGamma: 5,
      nValue: 25,
      normalResistivityOhmM: 1e-6,
      densityScKgM3: 6300,
      cpScJkgK: 180,
      provenance: {
        tcK: 'demo assumption', lambda0Nm: 'demo assumption', xi0Nm: 'demo assumption',
        jc0Am2: 'demo assumption', nValue: 'demo assumption'
      }
    }
  }
];

const DEFAULT_EXPERIMENT = {
  materialId: 'rebco-tape-77k',
  temperatureK: 77,
  appliedFieldT: 0.08,
  fieldAngleDeg: 90,
  currentA: 40,
  magneticHalfWidthMm: 0.5,
  fieldOfViewUm: 3,
  widthMm: 4,
  scThicknessUm: 1,
  copperThicknessUm: 40,
  lengthCm: 10,
  bathTemperatureK: 77,
  heatTransferWm2K: 900,
  copperRrr: 100,
  sweepAmplitudeT: 0.5,
  sweepRateTPerS: 0.08,
  modelMode: 'hybrid',
  sampleRadiusMm: 12,
  sampleHeightMm: 6,
  magnetRadiusMm: 9,
  magnetHeightMm: 7,
  magnetGapMm: 5,
  autoRotate3d: true,
  showFieldLines3d: true,
  showVortices3d: true
};


/* ---- js/core/bean.js ---- */

/**
 * 1D Bean critical-state slab.
 * Internal array runs from surface (index 0) to center (last index).
 * The update rule changes the minimum amount required to obey |dB/dx| <= μ0 Jc.
 * This is an engineering critical-state approximation, not a TDGL solver.
 */
class BeanSlab {
  constructor(points = 121) {
    this.points = Math.max(21, Math.floor(points));
    this.profile = new Float64Array(this.points);
    this.lastAppliedT = 0;
    this.lastJc = 0;
    this.halfWidthM = 5e-4;
  }

  reset(appliedT = 0) {
    this.profile.fill(appliedT);
    this.lastAppliedT = appliedT;
  }

  update(appliedT, jcAm2, halfWidthM) {
    const a = Math.max(1e-9, halfWidthM);
    const jc = Math.max(0, jcAm2);
    const dx = a / (this.points - 1);
    const maxStep = MU0 * jc * dx;
    const prev = this.profile;
    const next = new Float64Array(this.points);
    const dApplied = appliedT - this.lastAppliedT;
    next[0] = appliedT;

    for (let i = 1; i < this.points; i++) {
      const lo = next[i - 1] - maxStep;
      const hi = next[i - 1] + maxStep;
      if (dApplied > 1e-12) {
        next[i] = clamp(Math.max(prev[i], lo), lo, hi);
      } else if (dApplied < -1e-12) {
        next[i] = clamp(Math.min(prev[i], hi), lo, hi);
      } else {
        next[i] = clamp(prev[i], lo, hi);
      }
    }

    this.profile = next;
    this.lastAppliedT = appliedT;
    this.lastJc = jc;
    this.halfWidthM = a;
    return this.fullProfile();
  }

  fullProfile() {
    const n = this.points;
    const a = this.halfWidthM;
    const out = [];
    // left surface -> center
    for (let i = 0; i < n; i++) {
      const x = -a + (a * i) / (n - 1);
      out.push({ xM:x, bT:this.profile[i] });
    }
    // center -> right surface
    for (let i = n - 2; i >= 0; i--) {
      const x = a - (a * i) / (n - 1);
      out.push({ xM:x, bT:this.profile[i] });
    }
    return out;
  }

  averageB() {
    if (!this.profile.length) return 0;
    let sum = 0;
    for (const value of this.profile) sum += value;
    return sum / this.profile.length;
  }

  magnetizationApm() {
    return (this.averageB() - this.lastAppliedT) / MU0;
  }

  fullPenetrationFieldT() {
    return MU0 * this.lastJc * this.halfWidthM;
  }
}


/* ---- js/core/physics.js ---- */

function reducedTemperature(T, Tc) {
  if (!(Tc > 0)) return 1;
  return clamp(T / Tc, 0, 100);
}

function lambdaAtTemperature(lambda0M, T, Tc) {
  const t = reducedTemperature(T, Tc);
  if (t >= 1) return Infinity;
  const denom = Math.sqrt(Math.max(1e-12, 1 - Math.pow(t, 4)));
  return lambda0M / denom;
}

function xiAtTemperature(xi0M, T, Tc) {
  const t = reducedTemperature(T, Tc);
  if (t >= 1) return Infinity;
  const denom = Math.sqrt(Math.max(1e-12, 1 - t * t));
  return xi0M / denom;
}

function glKappa(lambdaM, xiM) {
  return lambdaM / xiM;
}

function classifyType(kappa) {
  if (!Number.isFinite(kappa)) return 'normal';
  if (Math.abs(kappa - TYPE_BOUNDARY) < 0.08) return 'borderline';
  return kappa < TYPE_BOUNDARY ? 'type-i' : 'type-ii';
}

function criticalFields({ lambdaM, xiM, T, Tc }) {
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

function phaseState({ T, Tc, BabsT, fields }) {
  if (T >= Tc) return 'normal';
  if (fields.type === 'type-i' || fields.type === 'borderline') {
    return BabsT < fields.bcT ? 'meissner' : 'normal';
  }
  if (BabsT < fields.bc1T) return 'meissner';
  if (BabsT < fields.bc2T) return 'mixed';
  return 'normal';
}

function jcEffective(params, T, BabsT, angleDeg = 0) {
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

function electricFieldFromJ(J, Jc, nValue, ec = DEFAULT_EC) {
  if (!(Jc > 0)) return Infinity;
  const sign = Math.sign(J) || 1;
  const ratio = Math.abs(J) / Jc;
  return sign * ec * Math.pow(ratio, Math.max(1, nValue));
}

function vortexDensity(BavgT) {
  return Math.max(0, Math.abs(BavgT)) / PHI0;
}

function triangularVortexSpacing(BavgT) {
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

function londonSlabProfile(BappT, halfWidthM, lambdaM, points = 161) {
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

function allenDynesTc(lambdaEpc, muStar, omegaLogK) {
  const lam = Number(lambdaEpc);
  const mu = Number(muStar);
  const omega = Number(omegaLogK);
  const denominator = lam - mu * (1 + 0.62 * lam);
  if (!(lam > 0) || !(omega > 0) || denominator <= 0) return NaN;
  const exponent = -1.04 * (1 + lam) / denominator;
  return omega / 1.2 * Math.exp(exponent);
}

function weakCouplingGapMeV(TcK) {
  if (!(TcK > 0)) return 0;
  return 1.764 * K_B * TcK / 1.602176634e-22;
}

function orderParameterAmplitude(T, Tc) {
  const t = reducedTemperature(T, Tc);
  return t >= 1 ? 0 : Math.sqrt(Math.max(0, 1 - t));
}

function estimateIcA(jcAm2, widthM, scThicknessM) {
  return Math.max(0, jcAm2 * Math.max(0, widthM) * Math.max(0, scThicknessM));
}

function levitationCoupling(gapM, magnetRadiusM) {
  return Math.exp(-Math.max(0, gapM) / Math.max(1e-5, 0.55 * magnetRadiusM));
}

function shieldingFraction({ phase, lambdaM, thicknessM, orderAmplitude }) {
  if (phase === 'normal') return 0;
  const base = 1 - Math.exp(-Math.max(0, thicknessM) / Math.max(1e-12, 2 * Math.max(lambdaM, 1e-12)));
  if (phase === 'meissner') return clamp(0.72 + 0.28 * base, 0, 1);
  return clamp((0.28 + 0.48 * base) * (0.55 + 0.45 * Math.max(0, orderAmplitude)), 0, 1);
}

function pinningIndex({ phase, jcAm2, orderAmplitude }) {
  if (phase !== 'mixed') return phase === 'meissner' ? 0.08 : 0;
  const jcScale = Math.max(0, jcAm2) / (Math.max(0, jcAm2) + 3e9);
  return clamp((0.4 + 0.6 * jcScale) * (0.55 + 0.45 * Math.max(0, orderAmplitude)), 0, 1.3);
}

function levitationEstimate({
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


/* ---- js/core/thermal.js ---- */

const CU_K_RRR100 = {
  a:2.2154, b:-0.47461, c:-0.88068, d:0.13871, e:0.29505,
  f:-0.02043, g:-0.04831, h:0.001281, i:0.003207
};

const CU_CP = {
  a:-1.91844, b:-0.15973, c:8.61013, d:-18.996, e:21.9661,
  f:-12.7328, g:3.54322, h:-0.3797, i:0
};

function copperThermalConductivity(T, rrr = 100) {
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

function copperSpecificHeat(T) {
  const temp = clamp(T, 4, 300);
  const x = Math.log10(temp);
  const c = CU_CP;
  const poly = c.a + c.b*x + c.c*x**2 + c.d*x**3 + c.e*x**4 + c.f*x**5 + c.g*x**6 + c.h*x**7 + c.i*x**8;
  return Math.pow(10, poly);
}

function copperResistivityWF(T, rrr = 100) {
  // Wiedemann-Franz inversion is used only as an engineering approximation in this app.
  // It is not a replacement for magnetoresistance or a measured residual-resistivity curve.
  const k = copperThermalConductivity(T, rrr);
  return LORENZ * Math.max(T, 1e-6) / Math.max(k, 1e-12);
}

function currentSharing({ currentA, T, BabsT, angleDeg, params, geometry, rrr = 100 }) {
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

function thermalStep(state, inputs, dt) {
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

class QuenchRun {
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


/* ---- js/ui/i18n.js ---- */
const dict = {
  en: {
    appSubtitle: 'Data-aware multiscale browser simulator',
    notCalibrated: 'NOT SAMPLE-CALIBRATED',
    experiment: 'Experiment', materialPreset: 'Material preset', temperature: 'Temperature', appliedField: 'Applied field', fieldAngle: 'Field angle', transportCurrent: 'Transport current',
    sweep: 'Field sweep', sweepStart: 'Start sweep', sweepStop: 'Stop sweep', sweepAmplitude: 'Amplitude', sweepRate: 'Sweep rate', resetHistory: 'Reset flux history',
    geometry: 'Geometry, cooling and 3-D scene', magneticHalfWidth: 'Magnetic half-width', tapeWidth: 'Conductor width', scThickness: 'SC thickness', copperThickness: 'Cu stabilizer thickness', length: 'Conductor length', bathTemperature: 'Bath temperature', heatTransfer: 'Heat-transfer coefficient',
    sampleRadius: 'Sample radius', sampleHeight: 'Sample height', magnetRadius: 'Magnet radius', magnetHeight: 'Magnet height', magnetGap: 'Magnet-sample gap', autoRotate3d: '3-D auto-rotate', showFieldLines3d: 'Show field lines', showVortices3d: 'Show vortices',
    advanced: 'Advanced material parameters', lambda0: 'lambda reference', xi0: 'xi reference', jc0: 'Jc0', b0: 'Jc field scale B0', nValue: 'E-J exponent n', anisotropy: 'Anisotropy gamma', normalResistivity: 'SC normal resistivity', scCp: 'SC specific heat',
    lab3d: '3-D lab', field: 'Field / phase', vortices: 'Vortices', transport: 'Transport', quench: 'Quench', pairing: 'Pairing',
    phase: 'Phase', scType: 'GL type', kappa: 'kappa', bc1: 'Bc1', bc: 'Bc', bc2: 'Bc2', penetration: 'lambda(T)', coherence: 'xi(T)', orderParameter: '|psi| scale', jc: 'Jc', ic: 'Estimated Ic', eField: 'E at operating point', magnetization: 'Bean M', fullPenetration: 'Bean Bp', vortexSpacing: 'Vortex spacing', vortexDensity: 'Vortex density',
    copper: 'Copper stabilizer', cuK: 'kCu', cuCp: 'cp,Cu', cuRho: 'rhoCu (WF approx.)', provenance: 'Data provenance', missingFields: 'Missing for calibration',
    levitation: 'Levitation / 3-D', levForce: 'Heuristic Fz', levStiffness: 'dF/dz', shieldFraction: 'Shielding fraction', gapField: 'Gap field', pinningIndex: 'Pinning index',
    modelNote: 'Model note', modelNoteText: 'London/GL, Bean critical-state, phenomenological Jc and a lumped electrothermal model are coupled here. The 3-D lab and levitation force are heuristic visual and engineering layers, not a calibrated 3-D FEM solver.',
    dataLimits: 'Data & model limits', exportState: 'Export state', importState: 'Import JSON', language: '한국어',
    startQuench: 'Start thermal run', pauseQuench: 'Pause', resetQuench: 'Reset thermal run', quenchTime: 'Simulation time', conductorTemp: 'Conductor temperature', powerPerLength: 'Joule power / length', currentSharing: 'Current sharing',
    pairingTitle: 'Conventional EPC Tc estimator', lambdaEpc: 'Electron-phonon lambda', muStar: 'Coulomb mu*', omegaLog: 'omega_log (K)', estimatedTc: 'Estimated Tc', weakGap: 'Weak-coupling Delta0', pairingWarning: 'Simplified McMillan-Allen-Dynes form. Not valid as a universal Tc model for unconventional, multiband, strongly correlated, or otherwise out-of-domain systems.',
    benchmarkTitle: 'Repository Tc benchmark table', sourceTitle: 'Primary references used by this app', modelMatrixTitle: 'Research model coverage',
    close: 'Close', statusReady: 'Calibration-ready', statusNotReady: 'Exploratory / incomplete', customTc: 'Use benchmark Tc', noOverride: 'No Tc override',
    lab3dHint: 'Drag on the main canvas to orbit the 3-D scene. The levitation force and field lines are qualitative engineering estimates, not calibrated force measurements.',
    fieldHint: 'Drag the applied-field slider or run a sweep. Mixed-state hysteresis uses the 1-D Bean critical-state approximation.',
    vortexHint: 'Vortex density is set by |B|/Phi0 using the average internal Bean field. Core rendering uses xi only as a visual scale.',
    transportHint: 'The curve uses E = Ec(|J|/Jc)^n with an anisotropic phenomenological Jc(T,B,theta).',
    quenchHint: '0-D per-unit-length thermal balance with current sharing. NIST RRR100 Cu k(T) and cp(T) are evaluated in their published 4-300 K range.',
    pairingHint: 'Microscopic screening helper only; it is independent from the macroscopic field solver.',
    meissner: 'Meissner', mixed: 'Mixed / vortex', normal: 'Normal', 'type-i':'Type I', 'type-ii':'Type II', borderline:'Borderline I/II',
    sourceMeasured: 'measured/literature', sourceAssumed: 'assumed', sourceMixed: 'mixed', custom: 'Custom',
    footer: 'Static GitHub Pages build - no server - no external runtime dependencies',
    yes: 'On', no: 'Off'
  },
  ko: {
    appSubtitle: '데이터 출처를 추적하는 다중 규모 브라우저 시뮬레이터',
    notCalibrated: '시료 단위 보정 아님',
    experiment: '실험 조건', materialPreset: '재료 프리셋', temperature: '온도', appliedField: '인가 자기장', fieldAngle: '자기장 각도', transportCurrent: '수송 전류',
    sweep: '자기장 스윕', sweepStart: '스윕 시작', sweepStop: '스윕 정지', sweepAmplitude: '진폭', sweepRate: '스윕 속도', resetHistory: '자속 이력 초기화',
    geometry: '형상·냉각·3D 장면', magneticHalfWidth: '자기 모델 반폭', tapeWidth: '도체 폭', scThickness: '초전도층 두께', copperThickness: 'Cu 안정화층 두께', length: '도체 길이', bathTemperature: '냉각조 온도', heatTransfer: '열전달 계수',
    sampleRadius: '시료 반지름', sampleHeight: '시료 높이', magnetRadius: '자석 반지름', magnetHeight: '자석 높이', magnetGap: '자석-시료 간격', autoRotate3d: '3D 자동 회전', showFieldLines3d: '자기력선 표시', showVortices3d: '보텍스 표시',
    advanced: '고급 재료 파라미터', lambda0: 'lambda 기준값', xi0: 'xi 기준값', jc0: 'Jc0', b0: 'Jc 자기장 스케일 B0', nValue: 'E-J 지수 n', anisotropy: '이방성 gamma', normalResistivity: '초전도층 정상저항률', scCp: '초전도층 비열',
    lab3d: '3D 실험실', field: '자기장 / 상', vortices: '보텍스', transport: '수송', quench: '퀜치', pairing: '결합',
    phase: '상태', scType: 'GL 분류', kappa: 'kappa', bc1: 'Bc1', bc: 'Bc', bc2: 'Bc2', penetration: 'lambda(T)', coherence: 'xi(T)', orderParameter: '|psi| 스케일', jc: 'Jc', ic: '추정 Ic', eField: '운전점 E', magnetization: 'Bean M', fullPenetration: 'Bean Bp', vortexSpacing: '보텍스 간격', vortexDensity: '보텍스 밀도',
    copper: '구리 안정화층', cuK: 'kCu', cuCp: 'cp,Cu', cuRho: 'rhoCu (WF 근사)', provenance: '데이터 출처', missingFields: '보정에 필요한 미확보 항목',
    levitation: '자기부상 / 3D', levForce: '휴리스틱 Fz', levStiffness: 'dF/dz', shieldFraction: '차폐 비율', gapField: '간격 자기장', pinningIndex: '피닝 지수',
    modelNote: '모델 주의', modelNoteText: 'London/GL, Bean 임계상태, 현상론적 Jc, 집중정수 전기열 모델을 결합했다. 3D 실험실과 자기부상 힘은 정량 보정된 3차원 FEM 해석이 아니라 휴리스틱 시각화·엔지니어링 층이다.',
    dataLimits: '데이터·모델 한계', exportState: '상태 내보내기', importState: 'JSON 가져오기', language: 'EN',
    startQuench: '열 시뮬레이션 시작', pauseQuench: '일시정지', resetQuench: '열 시뮬레이션 초기화', quenchTime: '시뮬레이션 시간', conductorTemp: '도체 온도', powerPerLength: '단위길이당 줄 발열', currentSharing: '전류 분담',
    pairingTitle: '전통적 EPC Tc 추정기', lambdaEpc: '전자-포논 lambda', muStar: '쿨롱 mu*', omegaLog: 'omega_log (K)', estimatedTc: '추정 Tc', weakGap: '약결합 Delta0', pairingWarning: '단순화 McMillan-Allen-Dynes 식이다. 비전통·다중밴드·강상관 등 적용 범위 밖 계의 보편적 Tc 모델이 아니다.',
    benchmarkTitle: '저장소 Tc 비교표', sourceTitle: '이 앱이 직접 참조한 주요 출처', modelMatrixTitle: '연구 모델 범위',
    close: '닫기', statusReady: '보정 가능', statusNotReady: '탐색용 / 미완성', customTc: '비교표 Tc 적용', noOverride: 'Tc 덮어쓰기 안 함',
    lab3dHint: '메인 캔버스에서 드래그하면 3D 장면을 회전할 수 있다. 자기부상 힘과 자기력선은 정량 보정치가 아닌 정성적 엔지니어링 추정이다.',
    fieldHint: '인가 자기장 슬라이더를 움직이거나 스윕을 실행할 수 있다. 혼합상 히스테리시스는 1차원 Bean 임계상태 근사를 사용한다.',
    vortexHint: '보텍스 밀도는 평균 내부 Bean 자기장에 대해 |B|/Phi0로 계산한다. 코어 렌더링에서 xi는 시각적 스케일로만 사용한다.',
    transportHint: 'E = Ec(|J|/Jc)^n과 이방성을 포함한 현상론적 Jc(T,B,theta)를 사용한다.',
    quenchHint: '단위길이 기준 0차원 열수지와 전류 분담 모델이다. NIST RRR100 Cu k(T), cp(T)는 공개 피팅의 4-300 K 범위에서 평가한다.',
    pairingHint: '미시적 결합 탐색 보조이며 거시적 자기장 해석기와 독립되어 있다.',
    meissner: '마이스너', mixed: '혼합상 / 보텍스', normal: '정상상', 'type-i':'제1종', 'type-ii':'제2종', borderline:'제1·2종 경계',
    sourceMeasured: '측정/문헌', sourceAssumed: '가정', sourceMixed: '혼합', custom: '사용자 지정',
    footer: '정적 GitHub Pages 빌드 - 서버 없음 - 외부 런타임 의존성 없음',
    yes: '켜짐', no: '꺼짐'
  }
};

let language = (navigator.language || '').toLowerCase().startsWith('ko') ? 'ko' : 'en';

function t(key) {
  const local = dict[language] && dict[language][key];
  if (typeof local !== 'undefined') return local;
  if (typeof dict.en[key] !== 'undefined') return dict.en[key];
  return key;
}

function getLanguage() { return language; }

function setLanguage(lang) {
  language = lang === 'ko' ? 'ko' : 'en';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  window.dispatchEvent(new CustomEvent('languagechange', { detail:{ language } }));
}

function toggleLanguage() {
  setLanguage(language === 'en' ? 'ko' : 'en');
}

function initLanguage() {
  setLanguage(language);
}


/* ---- js/ui/charts.js ---- */

function prepare(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(10, rect.width || canvas.width || 640);
  const height = Math.max(10, rect.height || canvas.height || 360);
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w:width, h:height, dpr };
}

function css(name, fallback) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function base(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, css('--field-bg-top', '#0c1822'));
  bg.addColorStop(1, css('--field-bg-bottom', '#081016'));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
}

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function label(ctx, text, x, y, align = 'left', size = 15, color = null) {
  ctx.font = `500 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color || css('--muted', '#91a0ad');
  ctx.fillText(text, x, y);
}

function fmt(value, digits = 3) {
  if (!Number.isFinite(value)) return 'N/A';
  const a = Math.abs(value);
  if ((a !== 0 && a < 1e-3) || a >= 1e4) return value.toExponential(2);
  return value.toFixed(digits).replace(/\.?0+$/, '');
}

function formatForce(v) {
  if (!Number.isFinite(v)) return 'N/A';
  const a = Math.abs(v);
  if (a >= 1) return `${fmt(v, 3)} N`;
  if (a >= 1e-3) return `${fmt(v * 1e3, 2)} mN`;
  return `${fmt(v * 1e6, 2)} µN`;
}

function drawAxes(ctx, box, xLabel, yLabel) {
  const { x, y, w, h } = box;
  ctx.strokeStyle = css('--grid', '#243440');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();
  label(ctx, xLabel, x + w, y + h + 20, 'right', 16);
  label(ctx, yLabel, x - 4, y - 12, 'left', 16);
}

function rad(deg) {
  return deg * Math.PI / 180;
}

function makeCamera(w, h, scene) {
  return {
    yaw: rad(scene.yawDeg || -32),
    pitch: rad(scene.pitchDeg || 18),
    zoom: clamp(scene.zoom || 1, 0.5, 2.2),
    cx: w * 0.5,
    cy: h * 0.62,
    perspective: Math.min(w, h) * 0.9
  };
}

function transformPoint(p, camera) {
  const cy = Math.cos(camera.yaw);
  const sy = Math.sin(camera.yaw);
  const cp = Math.cos(camera.pitch);
  const sp = Math.sin(camera.pitch);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const y2 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp;
  const depth = 34 + z2;
  const scale = camera.zoom * camera.perspective / Math.max(6, depth);
  return { x:x1, y:y2, z:z2, depth, sx:camera.cx + x1 * scale, sy:camera.cy - y2 * scale, scale };
}

function polyDepth(points, camera) {
  let s = 0;
  for (let i = 0; i < points.length; i++) s += transformPoint(points[i], camera).depth;
  return s / Math.max(1, points.length);
}

function drawPolygon3D(ctx, camera, points, fill, stroke, lineWidth) {
  if (!points || points.length < 3) return;
  ctx.beginPath();
  const first = transformPoint(points[0], camera);
  ctx.moveTo(first.sx, first.sy);
  for (let i = 1; i < points.length; i++) {
    const p = transformPoint(points[i], camera);
    ctx.lineTo(p.sx, p.sy);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();
  }
}

function drawPolyline3D(ctx, camera, points, stroke, lineWidth, alpha) {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  const first = transformPoint(points[0], camera);
  ctx.moveTo(first.sx, first.sy);
  for (let i = 1; i < points.length; i++) {
    const p = transformPoint(points[i], camera);
    ctx.lineTo(p.sx, p.sy);
  }
  ctx.globalAlpha = typeof alpha === 'number' ? alpha : 1;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth || 1;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawCylinder3D(ctx, camera, options) {
  const center = options.center;
  const radius = Math.max(0.1, options.radius);
  const height = Math.max(0.1, options.height);
  const segments = options.segments || 28;
  const sidePolys = [];
  const top = [];
  const bottom = [];
  const yTop = center.y + height / 2;
  const yBottom = center.y - height / 2;

  for (let i = 0; i < segments; i++) {
    const a = Math.PI * 2 * i / segments;
    const x = center.x + radius * Math.cos(a);
    const z = center.z + radius * Math.sin(a);
    top.push({ x, y:yTop, z });
    bottom.push({ x, y:yBottom, z });
  }
  for (let i = 0; i < segments; i++) {
    const j = (i + 1) % segments;
    const poly = [bottom[i], bottom[j], top[j], top[i]];
    sidePolys.push({ depth:polyDepth(poly, camera), poly });
  }
  sidePolys.sort((a, b) => b.depth - a.depth);
  for (let i = 0; i < sidePolys.length; i++) {
    const tone = 0.8 + 0.2 * (i / Math.max(1, sidePolys.length - 1));
    const fill = options.sideFill || css('--sample-top', '#152733');
    ctx.globalAlpha = tone;
    drawPolygon3D(ctx, camera, sidePolys[i].poly, fill, options.sideStroke || css('--border-strong', '#355263'), 0.8);
  }
  ctx.globalAlpha = 1;
  drawPolygon3D(ctx, camera, bottom, options.bottomFill || options.sideFill || css('--sample-bottom', '#0d1b24'), null, 0);
  drawPolygon3D(ctx, camera, top, options.topFill || options.sideFill || css('--sample-top', '#152733'), options.topStroke || css('--border-strong', '#355263'), 1.2);
  return { top, bottom };
}

function drawGround(ctx, camera, y, width, depth) {
  ctx.strokeStyle = css('--grid', '#243440');
  ctx.lineWidth = 1;
  const lines = [];
  for (let x = -width; x <= width; x += width / 5) lines.push([{ x, y, z:-depth }, { x, y, z:depth }]);
  for (let z = -depth; z <= depth; z += depth / 5) lines.push([{ x:-width, y, z }, { x:width, y, z }]);
  lines.sort((a, b) => polyDepth(a, camera) - polyDepth(b, camera));
  for (let i = 0; i < lines.length; i++) drawPolyline3D(ctx, camera, lines[i], css('--grid', '#243440'), 1, 0.6);
}

function arrow2D(ctx, x1, y1, x2, y2, color) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(ang - Math.PI / 6), y2 - 10 * Math.sin(ang - Math.PI / 6));
  ctx.lineTo(x2 - 10 * Math.cos(ang + Math.PI / 6), y2 - 10 * Math.sin(ang + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawCallout(ctx, x, y, title, value, color) {
  const width = Math.max(160, Math.min(240, Math.max(title.length, value.length) * 7 + 38));
  const height = 44;
  roundedRect(ctx, x, y, width, height, 10);
  ctx.fillStyle = 'rgba(8,16,22,0.88)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  label(ctx, title, x + 12, y + 14, 'left', 13, css('--muted', '#91a0ad'));
  label(ctx, value, x + 12, y + 30, 'left', 16, color);
}

function drawInfoPanel(ctx, x, y, width, title, lines, accent) {
  const body = Array.isArray(lines) ? lines : [];
  const height = 22 + body.length * 18 + 20;
  roundedRect(ctx, x, y, width, height, 12);
  ctx.fillStyle = 'rgba(8,16,22,0.9)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.stroke();
  label(ctx, title, x + 12, y + 15, 'left', 17, accent);
  for (let i = 0; i < body.length; i++) {
    label(ctx, body[i], x + 12, y + 36 + i * 18, 'left', 14, i === 0 ? css('--text', '#e8f0f6') : css('--muted', '#91a0ad'));
  }
  return { width, height };
}

function ellipsePoints3D(center, rx, rz, y, segments = 40) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const a = Math.PI * 2 * i / segments;
    pts.push({ x:center.x + rx * Math.cos(a), y, z:center.z + rz * Math.sin(a) });
  }
  return pts;
}

function drawDisc3D(ctx, camera, center, rx, rz, y, fill, stroke, alpha) {
  const pts = ellipsePoints3D(center, rx, rz, y);
  ctx.globalAlpha = typeof alpha === 'number' ? alpha : 1;
  drawPolygon3D(ctx, camera, pts, fill, stroke, 1);
  ctx.globalAlpha = 1;
}

function drawLeaderLabel(ctx, x, y, dx, dy, text, color) {
  const w = Math.max(120, Math.min(210, text.length * 7 + 24));
  const h = 26;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
  const bx = x + dx + (dx >= 0 ? 0 : -w);
  const by = y + dy - h / 2;
  roundedRect(ctx, bx, by, w, h, 8);
  ctx.fillStyle = 'rgba(8,16,22,0.88)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();
  label(ctx, text, bx + 10, by + h / 2, 'left', 13, color);
}

function renderLab3DScene(canvas, { phase, fields, stateLabel, levitation, scene, geometry, experiment, orderAmplitude, avgB, vortexSpacingM }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);

  const camera = makeCamera(w, h, scene);
  const phaseColor = phase === 'normal' ? css('--danger', '#ff756d') : phase === 'mixed' ? css('--warning', '#ffcc66') : css('--success', '#65e0ad');
  const fieldColor = experiment.appliedFieldT >= 0 ? css('--field', '#61d7ff') : css('--field-negative', '#ff9e64');

  const sampleRadius = Math.max(3.4, experiment.sampleRadiusMm * 0.34);
  const sampleHeight = Math.max(1.4, experiment.sampleHeightMm * 0.32);
  const magnetRadius = Math.max(2.8, experiment.magnetRadiusMm * 0.34);
  const magnetHeight = Math.max(1.5, experiment.magnetHeightMm * 0.34);
  const gap = Math.max(1.2, experiment.magnetGapMm * 0.38);
  const stageHeight = Math.max(1.1, sampleHeight * 0.55);
  const stageRadius = sampleRadius * 1.16;
  const groundY = -8.8;
  const stageCenterY = groundY + stageHeight / 2;
  const sampleCenterY = groundY + stageHeight + sampleHeight / 2 + 0.12;
  const magnetCenterY = sampleCenterY + sampleHeight / 2 + gap + magnetHeight / 2;
  const origin = { x:0, y:0, z:0 };

  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  roundedRect(ctx, 14, 14, w - 28, h - 28, 16);
  ctx.fill();

  drawGround(ctx, camera, groundY, 20, 20);
  drawDisc3D(ctx, camera, origin, stageRadius * 1.45, stageRadius * 1.05, groundY + 0.02, phaseColor, null, 0.05);
  drawDisc3D(ctx, camera, origin, stageRadius * 1.12, stageRadius * 0.92, groundY + 0.015, 'rgba(0,0,0,0.65)', null, 0.22);

  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:stageCenterY, z:0 },
    radius:stageRadius,
    height:stageHeight,
    sideFill:'rgba(40,56,70,0.97)',
    bottomFill:'rgba(9,16,24,0.98)',
    topFill:'rgba(66,92,116,0.98)',
    topStroke:'rgba(151,183,205,0.45)',
    sideStroke:'rgba(255,255,255,0.05)'
  });

  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:sampleCenterY, z:0 },
    radius:sampleRadius,
    height:sampleHeight,
    sideFill:'rgba(114,132,142,0.96)',
    bottomFill:'rgba(60,76,88,0.98)',
    topFill: phase === 'normal' ? 'rgba(163,103,100,0.95)' : phase === 'mixed' ? 'rgba(198,164,86,0.95)' : 'rgba(98,174,177,0.96)',
    topStroke: phaseColor,
    sideStroke:'rgba(255,255,255,0.08)'
  });
  drawDisc3D(ctx, camera, origin, sampleRadius * 0.92, sampleRadius * 0.92, sampleCenterY + sampleHeight / 2 + 0.03, phaseColor, null, 0.11);

  const magnetUpperH = magnetHeight * 0.55;
  const magnetLowerH = magnetHeight - magnetUpperH;
  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:magnetCenterY + magnetLowerH / 2, z:0 },
    radius:magnetRadius,
    height:magnetUpperH,
    sideFill:'rgba(157,49,81,0.96)',
    bottomFill:'rgba(112,28,55,0.96)',
    topFill:'rgba(214,88,124,0.98)',
    topStroke:'rgba(255,203,216,0.96)',
    sideStroke:'rgba(255,255,255,0.06)'
  });
  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:magnetCenterY - magnetUpperH / 2, z:0 },
    radius:magnetRadius,
    height:magnetLowerH,
    sideFill:'rgba(47,92,144,0.95)',
    bottomFill:'rgba(22,47,79,0.97)',
    topFill:'rgba(74,134,196,0.96)',
    topStroke:'rgba(190,220,255,0.3)',
    sideStroke:'rgba(255,255,255,0.06)'
  });

  if (experiment.showFieldLines3d) {
    const lines = [];
    const lineCount = 9;
    for (let i = 0; i < lineCount; i++) {
      const t = -1 + 2 * i / (lineCount - 1);
      const x = t * magnetRadius * 0.9;
      const sideBend = (phase === 'meissner' ? 1.3 : phase === 'mixed' ? 0.78 : 0.2) * (0.9 - Math.abs(t) * 0.38);
      const z = Math.sin(i * 0.9) * magnetRadius * 0.1;
      const entryY = sampleCenterY + sampleHeight / 2 + gap * 0.12;
      const penetrateY = sampleCenterY + sampleHeight * (phase === 'mixed' ? 0.12 : 0.42);
      const exitY = sampleCenterY - sampleHeight * (phase === 'mixed' ? 0.42 : 0.02);
      lines.push([
        { x, y:magnetCenterY + magnetHeight * 0.7, z },
        { x, y:magnetCenterY + magnetHeight * 0.18, z },
        { x: x * (1 + 0.15 * sideBend), y:entryY, z: z + sideBend * 0.55 },
        { x: x * (1 + 0.45 * sideBend), y:penetrateY, z: z + sideBend * 1.15 },
        { x: x * (1 + 0.62 * sideBend), y:exitY, z: z + sideBend * 1.6 },
        { x: x * (1 + 0.75 * sideBend), y:groundY + 0.32, z: z + sideBend * 2.0 }
      ]);
    }
    for (let i = 0; i < lines.length; i++) drawPolyline3D(ctx, camera, lines[i], fieldColor, 1.6, 0.82);
  }

  if (experiment.showVortices3d && phase === 'mixed' && Number.isFinite(vortexSpacingM)) {
    const ringCounts = [1, 6, 10];
    for (let r = 0; r < ringCounts.length; r++) {
      const rr = sampleRadius * (r === 0 ? 0 : 0.28 + 0.25 * r);
      for (let i = 0; i < ringCounts[r]; i++) {
        const ang = ringCounts[r] === 1 ? 0 : 2 * Math.PI * i / ringCounts[r];
        const x = Math.cos(ang) * rr;
        const z = Math.sin(ang) * rr;
        const p1 = { x, y:sampleCenterY + sampleHeight * 0.44, z };
        const p2 = { x, y:sampleCenterY - sampleHeight * 0.44, z };
        drawPolyline3D(ctx, camera, [p1, p2], css('--warning', '#ffcc66'), 1.2, 0.88);
      }
    }
  }

  const pSample = transformPoint({ x:sampleRadius * 0.95, y:sampleCenterY + sampleHeight * 0.12, z:sampleRadius * 0.1 }, camera);
  const pStage = transformPoint({ x:stageRadius * 0.82, y:stageCenterY, z:stageRadius * 0.12 }, camera);
  const pMagTop = transformPoint({ x:magnetRadius * 0.18, y:magnetCenterY + magnetHeight * 0.42, z:magnetRadius * 0.12 }, camera);
  const pMagFront = transformPoint({ x:magnetRadius * 0.96, y:magnetCenterY - magnetHeight * 0.18, z:magnetRadius * 0.08 }, camera);
  const pGapTop = transformPoint({ x:0, y:sampleCenterY + sampleHeight / 2, z:0 }, camera);
  const pGapMag = transformPoint({ x:0, y:magnetCenterY - magnetHeight / 2, z:0 }, camera);

  drawLeaderLabel(ctx, pMagTop.sx, pMagTop.sy, 34, -26, 'Permanent magnet (N pole)', 'rgba(255,203,216,0.95)');
  drawLeaderLabel(ctx, pSample.sx, pSample.sy, 34, 8, 'Superconductor sample', phaseColor);
  drawLeaderLabel(ctx, pStage.sx, pStage.sy, 30, 28, 'Cold stage / holder', 'rgba(156,195,225,0.92)');
  drawLeaderLabel(ctx, pMagFront.sx, pMagFront.sy, 34, 20, 'S pole', 'rgba(159,205,255,0.95)');

  arrow2D(ctx, pGapTop.sx + 80, pGapTop.sy + 36, pGapTop.sx + 80, pGapTop.sy - 54, phaseColor);
  label(ctx, 'Fz', pGapTop.sx + 92, pGapTop.sy - 58, 'left', 17, phaseColor);
  arrow2D(ctx, pGapTop.sx + 106, pGapTop.sy - 50, pGapTop.sx + 106, pGapTop.sy + 34, css('--muted', '#91a0ad'));
  label(ctx, 'g', pGapTop.sx + 118, pGapTop.sy + 38, 'left', 17, css('--muted', '#91a0ad'));

  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = css('--muted-2', '#647583');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pGapTop.sx - 56, pGapTop.sy + 3);
  ctx.lineTo(pGapMag.sx - 56, pGapMag.sy - 3);
  ctx.stroke();
  ctx.setLineDash([]);
  label(ctx, `${fmt(experiment.magnetGapMm, 2)} mm gap`, pGapMag.sx - 60, (pGapTop.sy + pGapMag.sy) / 2, 'right', 14, css('--muted', '#91a0ad'));

  const leftPanelW = Math.min(320, Math.max(220, w * 0.27));
  const rightPanelW = Math.min(230, Math.max(175, w * 0.18));
  drawInfoPanel(ctx, 20, 18, leftPanelW, stateLabel.toUpperCase(), [
    `Bgap ${fmt(levitation.gapFieldT, 3)} T | gap ${fmt(experiment.magnetGapMm, 2)} mm`,
    `shielding ${fmt(levitation.shielding * 100, 1)}% | pinning ${fmt(levitation.pinning, 2)}`,
    `GL ${fields.type.toUpperCase()} | Bc2 ${fmt(fields.bc2T, 2)} T`,
    `order amplitude ${fmt(orderAmplitude, 3)}`
  ], phaseColor);
  drawCallout(ctx, w - rightPanelW - 20, 18, 'Vortex spacing', Number.isFinite(vortexSpacingM) ? `${fmt(vortexSpacingM * 1e9, 1)} nm` : 'N/A', css('--warning', '#ffcc66'));
  drawCallout(ctx, w - rightPanelW - 20, 74, 'Mean internal field', `${fmt(avgB, 3)} T`, fieldColor);
  drawCallout(ctx, 20, h - 72, 'Heuristic levitation force', formatForce(levitation.forceN), phaseColor);

  const footer = '3-D scene is qualitative. Field lines, levitation force, and labels are interpretive engineering views.';
  label(ctx, footer, 22, h - 23, 'left', 13, css('--muted-2', '#647583'));
  label(ctx, 'Drag to orbit | wheel to zoom | double-click to reset camera', w - 20, h - 23, 'right', 13, css('--muted-2', '#647583'));
}

function renderFieldScene(canvas, { profile, phase, BappT, halfWidthM, fields, stateLabel, magnetizationApm, fullPenetrationT }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const pad = Math.max(28, w * 0.055);
  const sx = pad;
  const sy = h * 0.18;
  const sw = w - 2 * pad;
  const sh = h * 0.48;

  const fieldColor = css('--field', '#61d7ff');
  ctx.strokeStyle = fieldColor;
  ctx.globalAlpha = 0.14;
  ctx.lineWidth = 1;
  const lineStep = Math.max(18, sw / 26);
  for (let x = sx % lineStep; x < w; x += lineStep) {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.lineTo(x, h - 18);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  roundedRect(ctx, sx, sy, sw, sh, 14);
  const sampleGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
  sampleGrad.addColorStop(0, css('--sample-top', '#152733'));
  sampleGrad.addColorStop(1, css('--sample-bottom', '#0d1b24'));
  ctx.fillStyle = sampleGrad;
  ctx.fill();
  ctx.strokeStyle = css('--border-strong', '#355263');
  ctx.lineWidth = 1.25;
  ctx.stroke();

  const layerY = sy + sh * 0.68;
  ctx.fillStyle = 'rgba(173, 217, 255, 0.10)';
  roundedRect(ctx, sx + 18, layerY, sw - 36, 16, 8);
  ctx.fill();
  label(ctx, 'sample cross-section', sx + sw - 18, layerY - 12, 'right', 13);

  const maxB = Math.max(1e-12, Math.abs(BappT), ...profile.map((p) => Math.abs(p.bT)));
  const stride = Math.max(1, Math.floor(profile.length / Math.max(20, Math.floor(sw / 13))));
  for (let i = 0; i < profile.length; i += stride) {
    const p = profile[i];
    const xNorm = (p.xM + halfWidthM) / (2 * halfWidthM || 1);
    const x = sx + clamp(xNorm, 0, 1) * sw;
    const alpha = clamp(Math.abs(p.bT) / maxB, 0, 1);
    if (alpha < 0.015) continue;
    ctx.strokeStyle = p.bT >= 0 ? fieldColor : css('--field-negative', '#ff9e64');
    ctx.globalAlpha = 0.08 + 0.75 * alpha;
    ctx.lineWidth = 0.8 + 2.4 * alpha;
    ctx.beginPath();
    ctx.moveTo(x, sy + 8);
    ctx.lineTo(x, sy + sh - 8);
    ctx.stroke();
    const dir = p.bT >= 0 ? 1 : -1;
    const ay = sy + sh * 0.46;
    ctx.beginPath();
    ctx.moveTo(x, ay + dir * 7);
    ctx.lineTo(x - 3.5, ay);
    ctx.lineTo(x + 3.5, ay);
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const stateColor = phase === 'normal' ? css('--danger', '#ff756d') : phase === 'mixed' ? css('--warning', '#ffcc66') : css('--success', '#65e0ad');
  ctx.fillStyle = stateColor;
  ctx.globalAlpha = 0.08;
  roundedRect(ctx, sx + sw * 0.33, sy + sh * 0.34, sw * 0.34, sh * 0.32, 12);
  ctx.fill();
  ctx.globalAlpha = 1;
  label(ctx, stateLabel.toUpperCase(), sx + sw / 2, sy + sh / 2, 'center', Math.min(20, Math.max(15, w / 42)), stateColor);

  const py = sy + sh + 42;
  const ph = Math.max(48, h - py - 28);
  const zeroY = py + ph / 2;
  ctx.strokeStyle = css('--grid', '#243440');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx, zeroY);
  ctx.lineTo(sx + sw, zeroY);
  ctx.stroke();
  const plotMax = maxB;
  ctx.strokeStyle = fieldColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  profile.forEach((p, i) => {
    const xNorm = (p.xM + halfWidthM) / (2 * halfWidthM || 1);
    const x = sx + xNorm * sw;
    const y = zeroY - (p.bT / plotMax) * (ph * 0.42);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  label(ctx, `B(x) - Bapp ${fmt(BappT)} T`, sx, py - 10, 'left', 15);
  label(ctx, `M ${fmt(magnetizationApm)} A/m - Bp ${fmt(fullPenetrationT)} T - Bc1 ${fmt(fields.bc1T)} T`, sx + sw, py - 10, 'right', 15);
  label(ctx, `-${fmt(halfWidthM * 1e3, 2)} mm`, sx, py + ph + 10, 'left', 16);
  label(ctx, `+${fmt(halfWidthM * 1e3, 2)} mm`, sx + sw, py + ph + 10, 'right', 16);
}

function renderVortexScene(canvas, { BavgT, fovUm, xiM, phase, orderAmplitude }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const pad = Math.max(28, Math.min(w, h) * 0.08);
  const size = Math.min(w - 2 * pad, h - 2 * pad);
  const x0 = (w - size) / 2;
  const y0 = (h - size) / 2;
  roundedRect(ctx, x0, y0, size, size, 14);
  ctx.fillStyle = css('--sample-bottom', '#0d1b24');
  ctx.fill();
  ctx.strokeStyle = css('--border-strong', '#355263');
  ctx.stroke();

  const fovM = Math.max(1e-9, fovUm * 1e-6);
  const spacingM = triangularVortexSpacing(BavgT);
  const density = vortexDensity(BavgT);
  const expected = density * fovM * fovM;
  const stateColor = css('--field', '#61d7ff');
  const signColor = BavgT >= 0 ? stateColor : css('--field-negative', '#ff9e64');

  if (phase !== 'mixed' || !Number.isFinite(spacingM) || expected < 0.03) {
    ctx.globalAlpha = 0.12 + 0.1 * orderAmplitude;
    ctx.fillStyle = css('--success', '#65e0ad');
    roundedRect(ctx, x0 + 2, y0 + 2, size - 4, size - 4, 12);
    ctx.fill();
    ctx.globalAlpha = 1;
    label(ctx, phase === 'normal' ? 'NO COHERENT VORTEX LATTICE' : 'MEISSNER / NO BULK VORTICES', w / 2, h / 2, 'center', 16, phase === 'normal' ? css('--danger', '#ff756d') : css('--success', '#65e0ad'));
  } else {
    const spacingPx = spacingM / fovM * size;
    const drawSpacing = Math.max(9, spacingPx);
    const rowStep = drawSpacing * Math.sqrt(3) / 2;
    let count = 0;
    const maxDraw = 700;
    for (let row = -1, y = y0 + rowStep * 0.6; y <= y0 + size + rowStep && count < maxDraw; row++, y += rowStep) {
      const offset = (row & 1) ? drawSpacing / 2 : 0;
      for (let x = x0 + offset; x <= x0 + size && count < maxDraw; x += drawSpacing) {
        if (x < x0 || y < y0 || x > x0 + size || y > y0 + size) continue;
        const corePhysical = Math.max(1e-10, xiM);
        const corePx = clamp(corePhysical / fovM * size * 2.2, 2.1, Math.max(3, drawSpacing * 0.28));
        const grad = ctx.createRadialGradient(x, y, 0, x, y, corePx * 2.8);
        grad.addColorStop(0, css('--danger', '#ff756d'));
        grad.addColorStop(0.28, signColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, corePx * 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = signColor;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.4, corePx * 0.38), 0, Math.PI * 2);
        ctx.fill();
        count++;
      }
    }
    ctx.globalAlpha = 0.05 + 0.08 * orderAmplitude;
    ctx.fillStyle = css('--success', '#65e0ad');
    roundedRect(ctx, x0 + 2, y0 + 2, size - 4, size - 4, 12);
    ctx.fill();
    ctx.globalAlpha = 1;
    label(ctx, `rendered <= ${count} - expected ${fmt(expected, 1)}`, x0 + 10, y0 + size - 14, 'left', 16);
  }

  label(ctx, `${fmt(fovUm, 2)} µm`, x0 + size, y0 + size + 18, 'right', 15);
  label(ctx, `a_triangle ${Number.isFinite(spacingM) ? fmt(spacingM * 1e9, 1) + ' nm' : 'N/A'} - nv ${fmt(density)} m^-2`, x0, y0 - 14, 'left', 15);
  label(ctx, `Phi0 = ${PHI0.toExponential(4)} Wb`, x0 + size, y0 - 14, 'right', 15);
}

function renderTransportScene(canvas, { Jc, nValue, ec, operatingJ, normalResistivity, normal }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:62, y:28, w:w - 88, h:h - 72 };
  drawAxes(ctx, box, 'J / Jc', 'E [V/m]');
  const xmin = -2;
  const xmax = 1.25;
  const ymin = -12;
  const ymax = 2;
  const mapX = (v) => box.x + (v - xmin) / (xmax - xmin) * box.w;
  const mapY = (v) => box.y + box.h - (v - ymin) / (ymax - ymin) * box.h;
  for (let p = -12; p <= 2; p += 2) {
    const yy = mapY(p);
    ctx.strokeStyle = css('--grid', '#243440');
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(box.x, yy);
    ctx.lineTo(box.x + box.w, yy);
    ctx.stroke();
    ctx.globalAlpha = 1;
    label(ctx, `1e${p}`, box.x - 8, yy, 'right', 14);
  }
  [-2, -1, 0, 1].forEach((p) => label(ctx, `1e${p}`, mapX(p), box.y + box.h + 10, 'center', 14));

  const accent = css('--field', '#61d7ff');
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.3;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= 260; i++) {
    const lx = xmin + (xmax - xmin) * i / 260;
    const ratio = Math.pow(10, lx);
    let E;
    if (normal || !(Jc > 0)) E = normalResistivity * Math.max(1, Jc) * ratio;
    else E = electricFieldFromJ(Jc * ratio, Jc, nValue, ec);
    const ly = Math.log10(Math.max(1e-20, Math.abs(E)));
    if (ly < ymin - 1 || ly > ymax + 1) continue;
    const px = mapX(lx);
    const py = mapY(clamp(ly, ymin, ymax));
    if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const ecLog = Math.log10(ec);
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = css('--warning', '#ffcc66');
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(box.x, mapY(ecLog));
  ctx.lineTo(box.x + box.w, mapY(ecLog));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  label(ctx, 'Ec', box.x + box.w - 4, mapY(ecLog) - 9, 'right', 14, css('--warning', '#ffcc66'));

  if (Jc > 0 && operatingJ > 0) {
    const ratio = operatingJ / Jc;
    const Eop = normal ? normalResistivity * operatingJ : electricFieldFromJ(operatingJ, Jc, nValue, ec);
    const px = mapX(clamp(Math.log10(Math.max(1e-9, ratio)), xmin, xmax));
    const py = mapY(clamp(Math.log10(Math.max(1e-20, Math.abs(Eop))), ymin, ymax));
    ctx.fillStyle = css('--danger', '#ff756d');
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    label(ctx, `op - J/Jc ${fmt(ratio, 2)}`, px + 8, py - 10, 'left', 16, css('--text', '#e8f0f6'));
  }
}

function renderThermalScene(canvas, { samples, tcK, bathK }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:58, y:28, w:w - 84, h:h - 72 };
  drawAxes(ctx, box, 't [s]', 'T [K]');
  const data = samples && samples.length ? samples : [{ t:0, temperatureK:bathK }];
  const tMin = data[0].t;
  const tMax = Math.max(tMin + 0.1, data[data.length - 1].t);
  let yMin = Math.min(bathK, ...data.map((d) => d.temperatureK));
  let yMax = Math.max(tcK, bathK + 1, ...data.map((d) => d.temperatureK));
  const span = Math.max(1, yMax - yMin);
  yMin = Math.max(0, yMin - 0.08 * span);
  yMax += 0.12 * span;
  const mapX = (v) => box.x + (v - tMin) / (tMax - tMin) * box.w;
  const mapY = (v) => box.y + box.h - (v - yMin) / (yMax - yMin) * box.h;

  const drawRef = (value, text, color) => {
    if (value < yMin || value > yMax) return;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(box.x, mapY(value));
    ctx.lineTo(box.x + box.w, mapY(value));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    label(ctx, text, box.x + box.w - 4, mapY(value) - 9, 'right', 14, color);
  };
  drawRef(tcK, 'Tc', css('--danger', '#ff756d'));
  drawRef(bathK, 'Tbath', css('--field', '#61d7ff'));

  ctx.strokeStyle = css('--warning', '#ffcc66');
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  data.forEach((d, i) => {
    const px = mapX(d.t);
    const py = mapY(d.temperatureK);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.stroke();
  label(ctx, `${fmt(tMax - tMin, 2)} s window`, box.x + box.w, box.y + box.h + 10, 'right', 14);
  label(ctx, `${fmt(yMin, 1)}-${fmt(yMax, 1)} K`, box.x, box.y - 12, 'left', 14);
}

function renderPhaseScene(canvas, { params, temperatureK, BabsT }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:62, y:30, w:w - 88, h:h - 76 };
  drawAxes(ctx, box, 'T / Tc', 'B [T]');
  const lambda0M = params.lambda0Nm * 1e-9;
  const xi0M = params.xi0Nm * 1e-9;
  const f0 = criticalFields({ lambdaM:lambda0M, xiM:xi0M, T:0, Tc:params.tcK });
  const yMax = Math.max(0.05, Math.min(120, f0.bc2T * 1.12 || f0.bcT * 1.3 || 1));
  const mapX = (t) => box.x + t / 1.08 * box.w;
  const mapY = (b) => box.y + box.h - clamp(b / yMax, 0, 1) * box.h;

  const lines = { bc1:[], bc2:[], bc:[] };
  for (let i = 0; i <= 180; i++) {
    const tr = 0.995 * i / 180;
    const T = tr * params.tcK;
    const l = lambdaAtTemperature(lambda0M, T, params.tcK);
    const x = xiAtTemperature(xi0M, T, params.tcK);
    const f = criticalFields({ lambdaM:l, xiM:x, T, Tc:params.tcK });
    lines.bc1.push([tr, f.bc1T]);
    lines.bc2.push([tr, f.bc2T]);
    lines.bc.push([tr, f.bcT]);
  }
  const draw = (arr, color, width, dash) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    arr.forEach(([tx, b], i) => {
      const px = mapX(tx);
      const py = mapY(b);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };
  if (f0.type === 'type-i' || f0.type === 'borderline') {
    draw(lines.bc, css('--warning', '#ffcc66'), 2.2);
    label(ctx, 'Bc', mapX(0.1), mapY(lines.bc[Math.floor(lines.bc.length * 0.1)][1]) - 10, 'left', 16, css('--warning', '#ffcc66'));
  } else {
    draw(lines.bc2, css('--danger', '#ff756d'), 2.2);
    draw(lines.bc1, css('--field', '#61d7ff'), 1.8, [5, 4]);
    label(ctx, 'Bc2', mapX(0.08), mapY(lines.bc2[Math.floor(lines.bc2.length * 0.08)][1]) - 10, 'left', 16, css('--danger', '#ff756d'));
    label(ctx, 'Bc1', mapX(0.2), mapY(lines.bc1[Math.floor(lines.bc1.length * 0.2)][1]) - 10, 'left', 16, css('--field', '#61d7ff'));
  }
  const tx = clamp(temperatureK / params.tcK, 0, 1.08);
  const px = mapX(tx);
  const py = mapY(BabsT);
  ctx.fillStyle = css('--text', '#e8f0f6');
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
  label(ctx, 'operating point', px + 8, py - 10, 'left', 14, css('--text', '#e8f0f6'));
  label(ctx, `B scale max ${fmt(yMax)} T`, box.x + box.w, box.y - 12, 'right', 14);
}

function renderLevitationScene(canvas, { experiment, phase, lambdaM, orderAmplitude, jc, BappT }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:58, y:28, w:w - 84, h:h - 72 };
  drawAxes(ctx, box, 'gap [mm]', 'Fz [N]');
  const maxGapMm = Math.max(8, experiment.magnetGapMm * 2.8);
  const samples = [];
  let ymax = 0;
  for (let i = 0; i <= 90; i++) {
    const gapMm = 0.2 + (maxGapMm - 0.2) * i / 90;
    const lev = levitationEstimate({
      phase,
      BappT,
      radiusM:experiment.sampleRadiusMm * 1e-3,
      thicknessM:experiment.sampleHeightMm * 1e-3,
      gapM:gapMm * 1e-3,
      magnetRadiusM:experiment.magnetRadiusMm * 1e-3,
      magnetHeightM:experiment.magnetHeightMm * 1e-3,
      lambdaM,
      orderAmplitude,
      jcAm2:jc
    });
    ymax = Math.max(ymax, lev.forceN);
    samples.push({ gapMm, forceN:lev.forceN });
  }
  ymax = Math.max(1e-6, ymax * 1.1);
  const mapX = (v) => box.x + v / maxGapMm * box.w;
  const mapY = (v) => box.y + box.h - v / ymax * box.h;

  for (let i = 0; i <= 4; i++) {
    const yy = box.y + box.h - i / 4 * box.h;
    ctx.strokeStyle = css('--grid', '#243440');
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(box.x, yy);
    ctx.lineTo(box.x + box.w, yy);
    ctx.stroke();
    ctx.globalAlpha = 1;
    label(ctx, fmt(ymax * i / 4, 3), box.x - 8, yy, 'right', 13);
  }
  ctx.strokeStyle = phase === 'normal' ? css('--danger', '#ff756d') : phase === 'mixed' ? css('--warning', '#ffcc66') : css('--success', '#65e0ad');
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  samples.forEach((d, i) => {
    const px = mapX(d.gapMm);
    const py = mapY(d.forceN);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.stroke();

  const current = levitationEstimate({
    phase,
    BappT,
    radiusM:experiment.sampleRadiusMm * 1e-3,
    thicknessM:experiment.sampleHeightMm * 1e-3,
    gapM:experiment.magnetGapMm * 1e-3,
    magnetRadiusM:experiment.magnetRadiusMm * 1e-3,
    magnetHeightM:experiment.magnetHeightMm * 1e-3,
    lambdaM,
    orderAmplitude,
    jcAm2:jc
  });
  const px = mapX(experiment.magnetGapMm);
  const py = mapY(current.forceN);
  ctx.fillStyle = css('--text', '#e8f0f6');
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
  label(ctx, `${fmt(experiment.magnetGapMm, 2)} mm / ${formatForce(current.forceN)}`, px + 8, py - 10, 'left', 14, css('--text', '#e8f0f6'));
  label(ctx, `magnetic pressure approx. p = B^2 / (2mu0) * shielding`, box.x, box.y - 12, 'left', 13, css('--muted', '#91a0ad'));
}


/* ---- js/app.js ---- */

const $ = (id) => document.getElementById(id);
const bean = new BeanSlab(161);
const quench = new QuenchRun();

const state = {
  experiment: cloneParams(DEFAULT_EXPERIMENT),
  params: cloneParams(MATERIAL_PRESETS[0].params),
  presetId: MATERIAL_PRESETS[0].id,
  activeView: 'lab3d',
  beanActivated: false,
  sweepRunning: false,
  sweepDirection: 1,
  pairing: { lambdaEpc:1.0, muStar:0.10, omegaLogK:300 },
  scene: { yawDeg:-32, pitchDeg:18, zoom:1, dragging:false, pointerId:null, lastX:0, lastY:0 },
  dirty: true,
  lastFrame: (window.performance && typeof window.performance.now === 'function') ? window.performance.now() : Date.now()
};

function preset() {
  return MATERIAL_PRESETS.find((p) => p.id === state.presetId) || MATERIAL_PRESETS[0];
}

function cloneParams(p) { return JSON.parse(JSON.stringify(p)); }

function numberOrFallback(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(v, digits = 3) {
  if (!Number.isFinite(v)) return 'N/A';
  const a = Math.abs(v);
  if ((a > 0 && a < 1e-3) || a >= 1e5) return v.toExponential(2);
  return v.toFixed(digits).replace(/\.?0+$/, '');
}

function formatField(v) {
  const a = Math.abs(v);
  if (!Number.isFinite(v)) return 'N/A';
  if (a < 1e-6) return `${formatNumber(v * 1e9, 2)} nT`;
  if (a < 1e-3) return `${formatNumber(v * 1e6, 2)} µT`;
  if (a < 1) return `${formatNumber(v * 1e3, 2)} mT`;
  return `${formatNumber(v, 3)} T`;
}

function formatLength(m) {
  if (!Number.isFinite(m)) return 'N/A';
  const a = Math.abs(m);
  if (a < 1e-6) return `${formatNumber(m * 1e9, 2)} nm`;
  if (a < 1e-3) return `${formatNumber(m * 1e6, 2)} µm`;
  return `${formatNumber(m * 1e3, 2)} mm`;
}

function formatCurrentDensity(v) {
  if (!Number.isFinite(v)) return 'N/A';
  if (Math.abs(v) >= 1e9) return `${formatNumber(v / 1e9, 3)} GA/m²`;
  if (Math.abs(v) >= 1e6) return `${formatNumber(v / 1e6, 3)} MA/m²`;
  return `${formatNumber(v, 3)} A/m²`;
}

function formatForce(v) {
  if (!Number.isFinite(v)) return 'N/A';
  const a = Math.abs(v);
  if (a >= 1) return `${formatNumber(v, 3)} N`;
  if (a >= 1e-3) return `${formatNumber(v * 1e3, 2)} mN`;
  return `${formatNumber(v * 1e6, 2)} µN`;
}

function formatStiffness(v) {
  if (!Number.isFinite(v)) return 'N/A';
  const a = Math.abs(v);
  if (a >= 1000) return `${formatNumber(v / 1000, 2)} kN/m`;
  if (a >= 1) return `${formatNumber(v, 2)} N/m`;
  return `${formatNumber(v * 1e3, 2)} mN/m`;
}

function formatPercent(v) {
  return Number.isFinite(v) ? `${formatNumber(v * 100, 1)} %` : 'N/A';
}

function setText(id, text) { const el = $(id); if (el) el.textContent = text; }

function setValue(id, value) { const el = $(id); if (el) el.value = String(value); }

function updateAllInputs() {
  setValue('materialPreset', state.presetId);
  setValue('temperatureRange', state.experiment.temperatureK);
  setValue('temperatureNumber', state.experiment.temperatureK);
  setValue('fieldRange', Math.max(-2, Math.min(2, state.experiment.appliedFieldT)));
  setValue('fieldNumber', state.experiment.appliedFieldT);
  setValue('angleRange', state.experiment.fieldAngleDeg);
  setValue('angleNumber', state.experiment.fieldAngleDeg);
  setValue('currentRange', Math.max(0, Math.min(500, state.experiment.currentA)));
  setValue('currentNumber', state.experiment.currentA);
  setValue('magneticHalfWidth', state.experiment.magneticHalfWidthMm);
  setValue('fovUm', state.experiment.fieldOfViewUm);
  setValue('widthMm', state.experiment.widthMm);
  setValue('scThicknessUm', state.experiment.scThicknessUm);
  setValue('copperThicknessUm', state.experiment.copperThicknessUm);
  setValue('lengthCm', state.experiment.lengthCm);
  setValue('bathTemperatureK', state.experiment.bathTemperatureK);
  setValue('heatTransfer', state.experiment.heatTransferWm2K);
  setValue('sampleRadiusMm', state.experiment.sampleRadiusMm);
  setValue('sampleHeightMm', state.experiment.sampleHeightMm);
  setValue('magnetRadiusMm', state.experiment.magnetRadiusMm);
  setValue('magnetHeightMm', state.experiment.magnetHeightMm);
  setValue('magnetGapMm', state.experiment.magnetGapMm);
  setValue('autoRotate3d', state.experiment.autoRotate3d ? '1' : '0');
  setValue('showFieldLines3d', state.experiment.showFieldLines3d ? '1' : '0');
  setValue('showVortices3d', state.experiment.showVortices3d ? '1' : '0');
  setValue('sweepAmplitude', state.experiment.sweepAmplitudeT);
  setValue('sweepRate', state.experiment.sweepRateTPerS);
  setValue('modelMode', state.experiment.modelMode);
  setValue('paramTc', state.params.tcK);
  setValue('paramLambda', state.params.lambda0Nm);
  setValue('paramXi', state.params.xi0Nm);
  setValue('paramJc0', state.params.jc0Am2);
  setValue('paramB0', state.params.jcB0T);
  setValue('paramN', state.params.nValue);
  setValue('paramGamma', state.params.anisotropyGamma);
  setValue('paramRhoNormal', state.params.normalResistivityOhmM);
  setValue('paramCpSc', state.params.cpScJkgK);
  setValue('pairLambda', state.pairing.lambdaEpc);
  setValue('pairMu', state.pairing.muStar);
  setValue('pairOmega', state.pairing.omegaLogK);
}

function loadPreset(id) {
  const p = MATERIAL_PRESETS.find((x) => x.id === id) || MATERIAL_PRESETS[0];
  state.presetId = p.id;
  state.params = cloneParams(p.params);
  if (p.id.includes('nb')) state.experiment.temperatureK = 4.2;
  else if (p.id.includes('mgb2')) state.experiment.temperatureK = 20;
  else state.experiment.temperatureK = Math.min(state.params.tcK * 0.84, 77);
  state.experiment.bathTemperatureK = state.experiment.temperatureK;
  state.beanActivated = false;
  bean.reset(0);
  quench.reset(state.experiment.temperatureK);
  updateAllInputs();
  state.dirty = true;
}

function geometry() {
  return {
    widthM: Math.max(1e-9, state.experiment.widthMm * 1e-3),
    scThicknessM: Math.max(1e-12, state.experiment.scThicknessUm * 1e-6),
    copperThicknessM: Math.max(0, state.experiment.copperThicknessUm * 1e-6),
    lengthM: Math.max(1e-6, state.experiment.lengthCm * 1e-2)
  };
}

function computeSnapshot() {
  const T = state.experiment.temperatureK;
  const B = state.experiment.appliedFieldT;
  const Babs = Math.abs(B);
  const lambdaM = lambdaAtTemperature(state.params.lambda0Nm * 1e-9, T, state.params.tcK);
  const xiM = xiAtTemperature(state.params.xi0Nm * 1e-9, T, state.params.tcK);
  const fields = criticalFields({ lambdaM, xiM, T, Tc:state.params.tcK });
  const equilibriumPhase = phaseState({ T, Tc:state.params.tcK, BabsT:Babs, fields });
  const jc = jcEffective(state.params, T, Babs, state.experiment.fieldAngleDeg);
  const halfWidthM = Math.max(1e-9, state.experiment.magneticHalfWidthMm * 1e-3);

  if (equilibriumPhase === 'mixed') state.beanActivated = true;
  if (equilibriumPhase === 'normal') {
    bean.reset(B);
    state.beanActivated = false;
  }

  let profile;
  let phase = equilibriumPhase;
  const mode = state.experiment.modelMode;
  const useBean = mode === 'bean' || (mode === 'hybrid' && (state.beanActivated || equilibriumPhase === 'mixed'));
  if (equilibriumPhase === 'normal') {
    profile = londonSlabProfile(B, halfWidthM, Infinity, 161);
  } else if (useBean) {
    profile = bean.update(B, jc, halfWidthM);
    if (equilibriumPhase === 'meissner' && Math.abs(bean.averageB()) > Math.max(1e-9, 0.01 * Math.abs(B || fields.bc1T || 1))) phase = 'mixed';
  } else {
    profile = londonSlabProfile(B, halfWidthM, lambdaM, 161);
    bean.reset(0);
  }

  const avgB = profile.reduce((s, p) => s + p.bT, 0) / Math.max(1, profile.length);
  const g = geometry();
  const icA = estimateIcA(jc, g.widthM, g.scThicknessM);
  const jOp = state.experiment.currentA / Math.max(1e-18, g.widthM * g.scThicknessM);
  const eOp = phase === 'normal' ? state.params.normalResistivityOhmM * jOp : (jc > 0 ? electricFieldFromJ(jOp, jc, state.params.nValue, DEFAULT_EC) : Infinity);
  const sharing = currentSharing({ currentA:state.experiment.currentA, T, BabsT:Babs, angleDeg:state.experiment.fieldAngleDeg, params:state.params, geometry:g, rrr:state.experiment.copperRrr });
  const cuT = Math.max(4, Math.min(300, T));
  const orderAmplitude = orderParameterAmplitude(T, state.params.tcK);
  const levitation = levitationEstimate({
    phase,
    BappT:B,
    radiusM:state.experiment.sampleRadiusMm * 1e-3,
    thicknessM:state.experiment.sampleHeightMm * 1e-3,
    gapM:state.experiment.magnetGapMm * 1e-3,
    magnetRadiusM:state.experiment.magnetRadiusMm * 1e-3,
    magnetHeightM:state.experiment.magnetHeightMm * 1e-3,
    lambdaM,
    orderAmplitude,
    jcAm2:jc
  });

  return {
    T, B, Babs, lambdaM, xiM, fields, equilibriumPhase, phase, jc, halfWidthM, profile, avgB,
    icA, jOp, eOp, sharing, geometry:g,
    orderAmplitude,
    vortexDensity: vortexDensity(avgB),
    vortexSpacingM: triangularVortexSpacing(avgB),
    magnetizationApm: useBean ? bean.magnetizationApm() : (avgB - B) / (4e-7 * Math.PI),
    fullPenetrationT: useBean ? bean.fullPenetrationFieldT() : 0,
    cuK: copperThermalConductivity(cuT, state.experiment.copperRrr),
    cuCp: copperSpecificHeat(cuT),
    cuRho: copperResistivityWF(cuT, state.experiment.copperRrr),
    levitation
  };
}

function phaseLabel(phase) { return t(phase); }
function typeLabel(type) { return t(type); }

function renderMetrics(s) {
  setText('metricPhase', phaseLabel(s.phase));
  setText('metricType', typeLabel(s.fields.type));
  setText('metricKappa', formatNumber(s.fields.kappa, 4));
  setText('metricLambda', formatLength(s.lambdaM));
  setText('metricXi', formatLength(s.xiM));
  setText('metricBc1', formatField(s.fields.bc1T));
  setText('metricBc', formatField(s.fields.bcT));
  setText('metricBc2', formatField(s.fields.bc2T));
  setText('metricPsi', formatNumber(s.orderAmplitude, 3));
  setText('metricJc', formatCurrentDensity(s.jc));
  setText('metricIc', `${formatNumber(s.icA, 2)} A`);
  setText('metricE', Number.isFinite(s.eOp) ? `${formatNumber(s.eOp, 3)} V/m` : '∞');
  setText('metricM', `${formatNumber(s.magnetizationApm, 2)} A/m`);
  setText('metricBp', formatField(s.fullPenetrationT));
  setText('metricVortexSpacing', formatLength(s.vortexSpacingM));
  setText('metricVortexDensity', `${formatNumber(s.vortexDensity, 3)} m⁻²`);
  setText('metricCuK', `${formatNumber(s.cuK, 3)} W/(m·K)`);
  setText('metricCuCp', `${formatNumber(s.cuCp, 3)} J/(kg·K)`);
  setText('metricCuRho', `${formatNumber(s.cuRho, 3)} Ω·m`);
  setText('metricLevForce', formatForce(s.levitation.forceN));
  setText('metricLevStiffness', formatStiffness(s.levitation.stiffnessNm));
  setText('metricShielding', formatPercent(s.levitation.shielding));
  setText('metricGapField', formatField(s.levitation.gapFieldT));
  setText('metricPinning', formatNumber(s.levitation.pinning, 2));

  const q = quench.last;
  setText('metricQuenchTime', `${formatNumber(quench.timeS, 3)} s`);
  setText('metricQuenchTemp', `${formatNumber(quench.temperatureK, 3)} K`);
  setText('metricQuenchPower', q ? `${formatNumber(q.pPerLengthWm, 3)} W/m` : '0 W/m');
  setText('metricCurrentShare', q ? `SC ${formatNumber(q.iScA, 1)} A · Cu ${formatNumber(q.iCuA, 1)} A` : 'N/A');

  const p = preset();
  const badge = $('calibrationBadge');
  badge.textContent = p.calibrationReady ? t('statusReady') : t('statusNotReady');
  badge.dataset.ready = p.calibrationReady ? 'true' : 'false';
  const prov = $('provenanceList');
  prov.innerHTML = '';
  const entries = Object.entries(state.params.provenance || {});
  entries.forEach(([key, value]) => {
    const row = document.createElement('div');
    row.className = 'prov-row';
    const k = document.createElement('span');
    k.textContent = key;
    const v = document.createElement('span');
    v.textContent = value;
    row.append(k, v);
    prov.append(row);
  });
  const missing = $('missingList');
  missing.innerHTML = '';
  (p.missing || []).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    missing.append(li);
  });
}

function renderMain(s) {
  const main = $('mainCanvas');
  const pair = $('pairingPanel');
  pair.hidden = state.activeView !== 'pairing';
  main.hidden = state.activeView === 'pairing';
  document.querySelectorAll('.view-tab').forEach((el) => el.classList.toggle('active', el.dataset.view === state.activeView));
  const hintKey = `${state.activeView}Hint`;
  setText('viewHint', t(hintKey));

  if (state.activeView === 'lab3d') {
    renderLab3DScene(main, {
      phase:s.phase,
      fields:s.fields,
      stateLabel:phaseLabel(s.phase),
      levitation:s.levitation,
      scene:state.scene,
      geometry:s.geometry,
      experiment:state.experiment,
      orderAmplitude:s.orderAmplitude,
      avgB:s.avgB,
      vortexSpacingM:s.vortexSpacingM
    });
  } else if (state.activeView === 'field') {
    renderFieldScene(main, {
      profile:s.profile,
      phase:s.phase,
      BappT:s.B,
      halfWidthM:s.halfWidthM,
      fields:s.fields,
      stateLabel:phaseLabel(s.phase),
      magnetizationApm:s.magnetizationApm,
      fullPenetrationT:s.fullPenetrationT
    });
  } else if (state.activeView === 'vortices') {
    renderVortexScene(main, { BavgT:s.avgB, fovUm:state.experiment.fieldOfViewUm, xiM:s.xiM, phase:s.phase, orderAmplitude:s.orderAmplitude });
  } else if (state.activeView === 'transport') {
    renderTransportScene(main, { Jc:s.jc, nValue:state.params.nValue, ec:DEFAULT_EC, operatingJ:Math.abs(s.jOp), normalResistivity:state.params.normalResistivityOhmM, normal:s.phase === 'normal' });
  } else if (state.activeView === 'quench') {
    renderThermalScene(main, { samples:quench.samples, tcK:state.params.tcK, bathK:state.experiment.bathTemperatureK });
  }
}

function renderPairing() {
  const tc = allenDynesTc(state.pairing.lambdaEpc, state.pairing.muStar, state.pairing.omegaLogK);
  setText('pairTcResult', Number.isFinite(tc) ? `${formatNumber(tc, 3)} K` : 'N/A');
  setText('pairGapResult', Number.isFinite(tc) ? `${formatNumber(weakCouplingGapMeV(tc), 3)} meV` : 'N/A');
}

function renderMiniCharts(s) {
  renderPhaseScene($('phaseCanvas'), { params:state.params, temperatureK:s.T, BabsT:s.Babs });
  renderTransportScene($('transportCanvas'), { Jc:s.jc, nValue:state.params.nValue, ec:DEFAULT_EC, operatingJ:Math.abs(s.jOp), normalResistivity:state.params.normalResistivityOhmM, normal:s.phase === 'normal' });
  renderThermalScene($('thermalCanvas'), { samples:quench.samples, tcK:state.params.tcK, bathK:state.experiment.bathTemperatureK });
  renderLevitationScene($('levitationCanvas'), { experiment:state.experiment, phase:s.phase, lambdaM:s.lambdaM, orderAmplitude:s.orderAmplitude, jc:s.jc, BappT:s.B });
}

function render() {
  const s = computeSnapshot();
  renderMain(s);
  renderMetrics(s);
  renderPairing();
  renderMiniCharts(s);
  setText('materialName', getLanguage() === 'ko' ? preset().nameKo : preset().nameEn);
  setText('operatingSummary', `T ${formatNumber(s.T, 2)} K · B ${formatField(s.B)} · I ${formatNumber(state.experiment.currentA, 1)} A · gap ${formatNumber(state.experiment.magnetGapMm, 2)} mm`);
  const phasePill = $('phasePill');
  phasePill.textContent = phaseLabel(s.phase);
  phasePill.dataset.phase = s.phase;
  const sweepBtn = $('sweepToggle');
  sweepBtn.textContent = state.sweepRunning ? t('sweepStop') : t('sweepStart');
  const qBtn = $('quenchToggle');
  qBtn.textContent = quench.running ? t('pauseQuench') : t('startQuench');
  state.dirty = false;
}

function bindRangeNumber(rangeId, numberId, getter, setter) {
  const r = $(rangeId);
  const n = $(numberId);
  const apply = (source) => {
    const val = numberOrFallback(source.value, getter());
    setter(val);
    if (source === r && n) n.value = String(val);
    if (source === n && r) r.value = String(Math.max(numberOrFallback(r.min, -Infinity), Math.min(numberOrFallback(r.max, Infinity), val)));
    state.dirty = true;
  };
  if (r) r.addEventListener('input', () => apply(r));
  if (n) n.addEventListener('input', () => apply(n));
}

function bindNumber(id, getter, setter) {
  const el = $(id);
  if (el) el.addEventListener('input', (e) => {
    setter(numberOrFallback(e.target.value, getter()));
    state.dirty = true;
  });
}

function resetCamera() {
  state.scene.yawDeg = -32;
  state.scene.pitchDeg = 18;
  state.scene.zoom = 1;
  state.dirty = true;
}

function bindCanvasControls() {
  const canvas = $('mainCanvas');
  if (!canvas) return;
  const endDrag = () => {
    state.scene.dragging = false;
    state.scene.pointerId = null;
  };
  canvas.addEventListener('pointerdown', (e) => {
    if (state.activeView !== 'lab3d') return;
    state.scene.dragging = true;
    state.scene.pointerId = e.pointerId;
    state.scene.lastX = e.clientX;
    state.scene.lastY = e.clientY;
    if (typeof canvas.setPointerCapture === 'function') canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!state.scene.dragging || state.activeView !== 'lab3d') return;
    const dx = e.clientX - state.scene.lastX;
    const dy = e.clientY - state.scene.lastY;
    state.scene.lastX = e.clientX;
    state.scene.lastY = e.clientY;
    state.scene.yawDeg += dx * 0.45;
    state.scene.pitchDeg = clamp(state.scene.pitchDeg + dy * 0.3, -10, 55);
    state.experiment.autoRotate3d = false;
    setValue('autoRotate3d', '0');
    state.dirty = true;
  });
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => {
    if (state.scene.dragging) endDrag();
  });
  canvas.addEventListener('wheel', (e) => {
    if (state.activeView !== 'lab3d') return;
    e.preventDefault();
    state.scene.zoom = clamp(state.scene.zoom * (e.deltaY > 0 ? 0.94 : 1.06), 0.6, 2.1);
    state.dirty = true;
  }, { passive:false });
  canvas.addEventListener('dblclick', () => {
    if (state.activeView !== 'lab3d') return;
    resetCamera();
  });
}

function bindUI() {
  $('languageToggle').addEventListener('click', toggleLanguage);
  $('materialPreset').addEventListener('change', (e) => loadPreset(e.target.value));
  $('tcOverride').addEventListener('change', (e) => {
    const row = TC_BENCHMARKS.find((x) => x.formula === e.target.value && x.status !== 'quarantined');
    if (row) {
      state.params.tcK = row.tcExp;
      state.params.provenance = { ...(state.params.provenance || {}), tcK:`repository JARVIS-2022 benchmark: ${row.formula} ${row.tcExp} K` };
      setValue('paramTc', state.params.tcK);
      state.dirty = true;
    }
  });

  bindRangeNumber('temperatureRange', 'temperatureNumber', () => state.experiment.temperatureK, (v) => state.experiment.temperatureK = Math.max(0.01, v));
  bindRangeNumber('fieldRange', 'fieldNumber', () => state.experiment.appliedFieldT, (v) => state.experiment.appliedFieldT = v);
  bindRangeNumber('angleRange', 'angleNumber', () => state.experiment.fieldAngleDeg, (v) => state.experiment.fieldAngleDeg = Math.max(0, Math.min(90, v)));
  bindRangeNumber('currentRange', 'currentNumber', () => state.experiment.currentA, (v) => state.experiment.currentA = Math.max(0, v));

  bindNumber('magneticHalfWidth', () => state.experiment.magneticHalfWidthMm, (v) => state.experiment.magneticHalfWidthMm = Math.max(0.0001, v));
  bindNumber('fovUm', () => state.experiment.fieldOfViewUm, (v) => state.experiment.fieldOfViewUm = Math.max(0.05, v));
  bindNumber('widthMm', () => state.experiment.widthMm, (v) => state.experiment.widthMm = Math.max(0.001, v));
  bindNumber('scThicknessUm', () => state.experiment.scThicknessUm, (v) => state.experiment.scThicknessUm = Math.max(0.001, v));
  bindNumber('copperThicknessUm', () => state.experiment.copperThicknessUm, (v) => state.experiment.copperThicknessUm = Math.max(0, v));
  bindNumber('lengthCm', () => state.experiment.lengthCm, (v) => state.experiment.lengthCm = Math.max(0.001, v));
  bindNumber('bathTemperatureK', () => state.experiment.bathTemperatureK, (v) => state.experiment.bathTemperatureK = Math.max(0.01, v));
  bindNumber('heatTransfer', () => state.experiment.heatTransferWm2K, (v) => state.experiment.heatTransferWm2K = Math.max(0, v));
  bindNumber('sampleRadiusMm', () => state.experiment.sampleRadiusMm, (v) => state.experiment.sampleRadiusMm = Math.max(0.5, v));
  bindNumber('sampleHeightMm', () => state.experiment.sampleHeightMm, (v) => state.experiment.sampleHeightMm = Math.max(0.2, v));
  bindNumber('magnetRadiusMm', () => state.experiment.magnetRadiusMm, (v) => state.experiment.magnetRadiusMm = Math.max(0.2, v));
  bindNumber('magnetHeightMm', () => state.experiment.magnetHeightMm, (v) => state.experiment.magnetHeightMm = Math.max(0.2, v));
  bindNumber('magnetGapMm', () => state.experiment.magnetGapMm, (v) => state.experiment.magnetGapMm = Math.max(0.1, v));

  $('autoRotate3d').addEventListener('change', (e) => { state.experiment.autoRotate3d = e.target.value === '1'; state.dirty = true; });
  $('showFieldLines3d').addEventListener('change', (e) => { state.experiment.showFieldLines3d = e.target.value === '1'; state.dirty = true; });
  $('showVortices3d').addEventListener('change', (e) => { state.experiment.showVortices3d = e.target.value === '1'; state.dirty = true; });

  bindNumber('sweepAmplitude', () => state.experiment.sweepAmplitudeT, (v) => state.experiment.sweepAmplitudeT = Math.max(0.001, Math.abs(v)));
  bindNumber('sweepRate', () => state.experiment.sweepRateTPerS, (v) => state.experiment.sweepRateTPerS = Math.max(0.0001, Math.abs(v)));

  $('modelMode').addEventListener('change', (e) => { state.experiment.modelMode = e.target.value; state.beanActivated = false; bean.reset(0); state.dirty = true; });
  $('sweepToggle').addEventListener('click', () => { state.sweepRunning = !state.sweepRunning; state.dirty = true; });
  $('resetFlux').addEventListener('click', () => { state.beanActivated = false; bean.reset(0); state.dirty = true; });

  bindNumber('paramTc', () => state.params.tcK, (v) => state.params.tcK = Math.max(0.01, v));
  bindNumber('paramLambda', () => state.params.lambda0Nm, (v) => state.params.lambda0Nm = Math.max(0.001, v));
  bindNumber('paramXi', () => state.params.xi0Nm, (v) => state.params.xi0Nm = Math.max(0.001, v));
  bindNumber('paramJc0', () => state.params.jc0Am2, (v) => state.params.jc0Am2 = Math.max(0, v));
  bindNumber('paramB0', () => state.params.jcB0T, (v) => state.params.jcB0T = Math.max(1e-9, v));
  bindNumber('paramN', () => state.params.nValue, (v) => state.params.nValue = Math.max(1, v));
  bindNumber('paramGamma', () => state.params.anisotropyGamma, (v) => state.params.anisotropyGamma = Math.max(1, v));
  bindNumber('paramRhoNormal', () => state.params.normalResistivityOhmM, (v) => state.params.normalResistivityOhmM = Math.max(1e-12, v));
  bindNumber('paramCpSc', () => state.params.cpScJkgK, (v) => state.params.cpScJkgK = Math.max(1, v));

  bindNumber('pairLambda', () => state.pairing.lambdaEpc, (v) => state.pairing.lambdaEpc = Math.max(0.001, v));
  bindNumber('pairMu', () => state.pairing.muStar, (v) => state.pairing.muStar = Math.max(0, v));
  bindNumber('pairOmega', () => state.pairing.omegaLogK, (v) => state.pairing.omegaLogK = Math.max(0.001, v));

  document.querySelectorAll('.view-tab').forEach((btn) => btn.addEventListener('click', () => { state.activeView = btn.dataset.view; state.dirty = true; }));
  $('quenchToggle').addEventListener('click', () => { quench.running = !quench.running; state.dirty = true; });
  $('quenchReset').addEventListener('click', () => { quench.reset(state.experiment.temperatureK); state.dirty = true; });
  $('dataLimitsBtn').addEventListener('click', openDataDialog);
  $('dialogClose').addEventListener('click', closeDataDialog);
  $('exportState').addEventListener('click', exportState);
  $('importState').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', importStateFile);
  window.addEventListener('languagechange', () => { populateStaticSelects(); populateDataDialog(); state.dirty = true; });
  if (typeof window.ResizeObserver === 'function') {
    const ro = new ResizeObserver(() => { state.dirty = true; });
    document.querySelectorAll('canvas').forEach((c) => ro.observe(c));
  } else {
    window.addEventListener('resize', () => { state.dirty = true; });
    window.addEventListener('orientationchange', () => { state.dirty = true; });
  }
  bindCanvasControls();
}

function populateStaticSelects() {
  const mat = $('materialPreset');
  const currentMat = state.presetId;
  mat.innerHTML = MATERIAL_PRESETS.map((p) => `<option value="${p.id}">${getLanguage() === 'ko' ? p.nameKo : p.nameEn}</option>`).join('');
  mat.value = currentMat;
  const tc = $('tcOverride');
  const currentTc = tc.value;
  tc.innerHTML = `<option value="">${t('noOverride')}</option>` + TC_BENCHMARKS.filter((r) => r.status !== 'quarantined').map((r) => `<option value="${r.formula}">${r.formula} · ${r.tcExp} K</option>`).join('');
  if (Array.prototype.some.call(tc.options, (o) => o.value === currentTc)) tc.value = currentTc;

  ['autoRotate3d', 'showFieldLines3d', 'showVortices3d'].forEach((id) => {
    const el = $(id);
    const current = el.value;
    el.innerHTML = `<option value="1">${t('yes')}</option><option value="0">${t('no')}</option>`;
    if (Array.prototype.some.call(el.options, (o) => o.value === current)) el.value = current;
  });
}

function populateDataDialog() {
  const sources = $('sourceCards');
  if (!sources) return;
  sources.innerHTML = Object.values(SOURCE_LINKS).map((s) => `
    <a class="source-card" href="${s.url}" target="_blank" rel="noopener noreferrer">
      <strong>${s.id}</strong><span>${s.title}</span><small>${getLanguage() === 'ko' ? s.noteKo : s.noteEn}</small>
    </a>`).join('');
  $('benchmarkBody').innerHTML = TC_BENCHMARKS.map((r) => `
    <tr class="${r.status === 'quarantined' ? 'quarantined' : ''}">
      <td>${r.formula}</td><td>${valueOrNA(r.sg)}</td><td>${valueOrNA(r.jarvis)}</td><td>${valueOrNA(r.tcExp)}</td><td>${valueOrNA(r.tcScdft)}</td><td>${valueOrNA(r.tcLm)}</td><td>${valueOrNA(r.tcJscr)}</td><td>${r.pressurePa ? formatNumber(r.pressurePa / 1e9, 0) + ' GPa' : 'N/A'}</td><td>${r.status}</td>
    </tr>`).join('');
  $('modelMatrixBody').innerHTML = MODEL_MATRIX.map((m) => `
    <tr><td>${m.id}</td><td>${m.priority}</td><td>${getLanguage() === 'ko' ? m.ko : m.en}</td><td>${m.model}</td></tr>`).join('');
}

function valueOrNA(value) {
  return value === null || typeof value === 'undefined' ? 'N/A' : value;
}

function closeDataDialog() {
  const d = $('dataDialog');
  if (!d) return;
  if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
}

function readFileText(file) {
  if (file && typeof file.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Unable to read file'));
    reader.readAsText(file);
  });
}

function openDataDialog() {
  populateDataDialog();
  const d = $('dataDialog');
  if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
}

function exportState() {
  const payload = {
    schema_version:'superconductor-sim-state/0.2.0',
    exported_at:new Date().toISOString(),
    source_repository:SOURCE_LINKS.researchRepo.url,
    preset_id:state.presetId,
    calibration_ready:false,
    experiment:state.experiment,
    material_parameters:state.params,
    pairing_estimator:state.pairing,
    camera_state:{ yawDeg:state.scene.yawDeg, pitchDeg:state.scene.pitchDeg, zoom:state.scene.zoom },
    warnings:[
      'This file is a simulator state, not a sample-calibrated material card.',
      'Levitation force and 3-D scene layers are heuristic and must not be relabeled as measured values.',
      'Fields marked as assumptions must not be reclassified as measurements.'
    ]
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'superconductor-sim-state.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importStateFile(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    const obj = JSON.parse(await readFileText(file));
    if (obj.preset_id && MATERIAL_PRESETS.some((p) => p.id === obj.preset_id)) state.presetId = obj.preset_id;
    if (obj.experiment && typeof obj.experiment === 'object') state.experiment = Object.assign({}, state.experiment, obj.experiment);
    if (obj.material_parameters && typeof obj.material_parameters === 'object') state.params = Object.assign({}, state.params, obj.material_parameters);
    if (obj.pairing_estimator && typeof obj.pairing_estimator === 'object') state.pairing = Object.assign({}, state.pairing, obj.pairing_estimator);
    if (obj.camera_state && typeof obj.camera_state === 'object') state.scene = Object.assign({}, state.scene, obj.camera_state);
    state.beanActivated = false;
    bean.reset(0);
    quench.reset(state.experiment.temperatureK);
    updateAllInputs();
    state.dirty = true;
  } catch (err) {
    console.error(err);
    alert('Invalid Superconductor Sim JSON');
  } finally {
    e.target.value = '';
  }
}

function animationFrame(now) {
  const realDt = Math.min(0.05, Math.max(0, (now - state.lastFrame) / 1000));
  state.lastFrame = now;
  if (state.sweepRunning) {
    const amp = Math.max(0.001, state.experiment.sweepAmplitudeT);
    let B = state.experiment.appliedFieldT + state.sweepDirection * state.experiment.sweepRateTPerS * realDt;
    if (B >= amp) { B = amp; state.sweepDirection = -1; }
    if (B <= -amp) { B = -amp; state.sweepDirection = 1; }
    state.experiment.appliedFieldT = B;
    setValue('fieldNumber', B.toFixed(6));
    setValue('fieldRange', Math.max(-2, Math.min(2, B)));
    state.dirty = true;
  }
  if (state.experiment.autoRotate3d && state.activeView === 'lab3d' && !state.scene.dragging) {
    state.scene.yawDeg += realDt * 12;
    state.dirty = true;
  }
  if (quench.running) {
    const inputs = {
      currentA:state.experiment.currentA,
      appliedFieldT:state.experiment.appliedFieldT,
      fieldAngleDeg:state.experiment.fieldAngleDeg,
      params:state.params,
      geometry:geometry(),
      copperRrr:state.experiment.copperRrr,
      bathTemperatureK:state.experiment.bathTemperatureK,
      heatTransferWm2K:state.experiment.heatTransferWm2K
    };
    for (let i = 0; i < 6; i++) quench.step(inputs, 0.003);
    if (quench.temperatureK > 500 || quench.timeS > 30) quench.running = false;
    state.dirty = true;
  }
  if (state.dirty) render();
  requestAnimationFrame(animationFrame);
}

function init() {
  initLanguage();
  state.presetId = DEFAULT_EXPERIMENT.materialId || MATERIAL_PRESETS[0].id;
  const initialPreset = MATERIAL_PRESETS.find((p) => p.id === state.presetId) || MATERIAL_PRESETS[0];
  state.params = cloneParams(initialPreset.params);
  populateStaticSelects();
  bindUI();
  updateAllInputs();
  quench.reset(state.experiment.temperatureK);
  populateDataDialog();
  render();
  requestAnimationFrame(animationFrame);
}

init();

})();
