export const SOURCE_LINKS = {
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

export const TC_BENCHMARKS = [
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

export const MODEL_MATRIX = [
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

export const MATERIAL_PRESETS = [
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

export const DEFAULT_EXPERIMENT = {
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
