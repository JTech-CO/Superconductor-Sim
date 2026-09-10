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

export function t(key) {
  const local = dict[language] && dict[language][key];
  if (typeof local !== 'undefined') return local;
  if (typeof dict.en[key] !== 'undefined') return dict.en[key];
  return key;
}

export function getLanguage() { return language; }

export function setLanguage(lang) {
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

export function toggleLanguage() {
  setLanguage(language === 'en' ? 'ko' : 'en');
}

export function initLanguage() {
  setLanguage(language);
}
