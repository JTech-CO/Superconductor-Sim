# Superconductor Sim

[English](README.md) · [한국어](README-KR.md)

**Superconductor Sim**은 [JTech-CO/Superconductor-Data-Research](https://github.com/JTech-CO/Superconductor-Data-Research/)의 데이터 계약, 모델 대응표, 출처 추적 규칙, 수집된 보조재 물성을 바탕으로 만든 **정적 브라우저 초전도체 시뮬레이터**다.

원 연구 저장소가 완성된 시료별 재료 카드, 원시 `Jc/Ic` 곡면, 보정된 자기부상 힘 곡선, 완전한 TDGL 파라미터 세트를 아직 포함하지 않는다고 명시하므로, 이 앱 역시 **시료 단위로 검증된 디지털 트윈이라고 표기하지 않는다.** 문헌값과 시연용 가정을 UI에서 구분하고, 보정에 필요한 미확보 필드도 표시한다.

## 구현 범위

- **London / GL 응답**
  - 명시적인 현상론적 온도 의존식으로 침투 깊이와 결맞음 길이를 계산한다.
  - `κ`, 제1종/제2종 경계, 열역학적 임계장, 제2종 `Bc1/Bc2` 근사치를 계산한다.
  - 마이스너 영역에서는 유한 슬랩의 London 자기장 분포를 계산한다.
- **1차원 Bean 임계상태 모델**
  - 자기장 스윕 이력에 따라 자속 침투를 갱신한다.
  - 잔류 자속, 근사 자화, 완전 침투장을 계산한다.
  - TDGL이 아니라 공학적 임계상태 근사다.
- **보텍스 보기**
  - 평균 내부 자기장으로 `n_v = |B| / Φ0`를 계산한다.
  - 삼각 격자 간격과 지정 FOV 내부의 보텍스를 렌더링한다.
- **수송 모델**
  - 기본 `Ec = 1e-4 V/m`에서 `E = Ec (|J|/Jc)^n`을 사용한다.
  - 온도, 자기장, 각도, 이방성을 포함하는 현상론적 `Jc(T,B,θ)`를 사용한다.
- **전기열 / 퀜치 모델**
  - 초전도층과 구리 안정화층의 전류 분담을 포함한 단위길이 기준 집중정수 열수지다.
  - NIST OFHC Cu RRR100 열전도율·비열 피팅을 공개 범위 4–300 K 안에서 평가한다.
  - 앱의 Cu 저항률은 Wiedemann–Franz 역산 근사이며 NIST 저항률 피팅으로 표시하지 않는다.
- **전통적 결합 보조 계산기**
  - 단순화 McMillan–Allen–Dynes `Tc` 추정식.
  - 약결합 BCS 기준 `Δ0 = 1.764 kB Tc`.
- **출처·한계 패널**
  - 원 저장소 Tc 비교표, 모델 대응표, 출처 링크, 고압 격리 상태, 보정 미확보 항목을 확인할 수 있다.
- **한국어/영어 전환**, 데스크톱·태블릿·모바일 반응형 UI.
- **JSON 상태 내보내기/가져오기**.

## 의도적으로 구현하지 않은 범위

현재 브라우저 빌드는 다음을 계산한다고 주장하지 않는다.

- 완전한 time-dependent Ginzburg–Landau PDE;
- 임의 3차원 형상의 Maxwell FEM/BEM 및 정밀 반자장 보정;
- 시료 단위로 보정된 자기부상 힘·토크;
- 코팅도체의 완전한 self-field `H` / `T-A` 해석;
- 측정 기반 AC 손실·자속 크리프 곡선;
- 완전한 Eliashberg, DFT, EPW 계산;
- 산소 확산, 열처리, 상변화 등의 화학 반응속도론;
- 실측 변형률-임계전류 열화;
- Josephson 접합 회로.

수식과 적용 범위는 [MODEL-NOTES-KR.md](docs/MODEL-NOTES-KR.md)에 정리했다.

## 데이터 출처

`data/`에는 시뮬레이터가 직접 사용하는 연구 파생 자료를 둔다.

- `tc_benchmark_table1.csv`: 원 연구 저장소의 Tc 비교표. 250 GPa의 YH10·LaH10 행은 `quarantined` 상태를 유지하며 일반 Tc 덮어쓰기 목록에 넣지 않았다.
- `model_data_matrix.csv`: 원 연구의 모델 우선순위와 데이터 미확보 범위.
- `research-material-card.schema.json`: 원 저장소의 향후 시료별 재료 카드 계약.
- `nist-copper-rrr100.json`: 앱이 실제 계산하는 RRR100 피팅 subset. 원 연구에서 검증한 `k(77 K) ≈ 547.199698 W/(m K)`를 포함한다.
- `sources.json`: 앱이 직접 참조한 주요 출처.

### 기본 프리셋

1. **일반 제2종 시연용 카드**: 인터랙션을 위해 가정한 입력값이다. 보정 완료로 표시하지 않는다.
2. **Nb 문헌 혼합 참조**: 원 연구 저장소의 JARVIS-2022 Tc 비교값 `9.3 K`와 2026년 보고된 `λL = 29.1(10) nm`, `ξ0 = 39.9(25) nm`를 사용한다. 다만 `Jc0`, `n`, 형상, 냉각 조건 등은 여전히 가정이므로 보정 완료 카드가 아니다.

서로 다른 시료·방법에서 얻은 값을 하나의 실험 검증 재료 카드라고 해석해서는 안 된다.

## 폴더 구조

```text
Superconductor-Sim/
├── index.html
├── css/                    # 기본, 레이아웃, 컴포넌트, 반응형 CSS
├── js/
│   ├── app.js              # 분할 ES module 원본
│   ├── app.bundle.js       # 실제 배포용 classic 호환 번들
│   ├── compat.js           # 소규모 브라우저 폴백
│   ├── core/               # 물리·Bean·전기열 엔진
│   ├── data/               # 브라우저용 데이터 정의
│   └── ui/                 # Canvas 렌더링·i18n
├── assets/                 # 로고, favicon, OG SVG
├── data/                   # 출처 기반 CSV/JSON/스키마
├── docs/                   # 모델 설명 영문/한국어
├── tests/                  # Node 단위시험
├── scripts/
│   └── build-compat.mjs
├── package.json
├── .nojekyll
└── LICENSE
```


## 브라우저 호환성과 반응형 구성

배포 페이지는 원본 ES module 소스를 `js/` 아래에 분할해서 유지하되, 실제 실행에는 classic script인 `js/app.bundle.js`를 사용한다. 이에 따라 `file://` 직접 실행에서 발생할 수 있는 module MIME/CORS 문제를 피하고 브라우저별 초기화 실패 가능성을 줄였다. `js/compat.js`에는 `Number.isFinite`, `Math.log10`, `CustomEvent`, `requestAnimationFrame`, `Object.values`, `Object.entries`의 소규모 폴백이 있으며, `ResizeObserver`와 `File.text()`가 없을 때는 각각 window resize 이벤트와 `FileReader`로 대체한다.

화면은 데스크톱, 태블릿, 모바일 폭에 따라 재배치된다. 좁은 화면에서는 3열 실험실 레이아웃이 1열 읽기 구조로 바뀌고, 조작 요소는 최소 44px 수준의 터치 영역을 사용한다. 표와 탭은 가로 스크롤을 유지하며, 작은 휴대폰에서는 지표 카드가 1열로 줄어든다. 기존 9px 수준이던 가장 작은 UI 글자는 14px로 높였다.

분할 JS 소스를 수정한 뒤에는 `npm run build:compat`으로 호환 번들을 다시 만들면 된다. 별도 npm 패키지 설치는 필요 없다.

## 로컬 실행

실제 배포 런타임은 classic 호환 번들을 사용하므로 빠른 확인 용도라면 `index.html`을 `file://`로 직접 열 수 있다. 다만 GitHub Pages와 동일한 조건을 재현하려면 로컬 HTTP 서버 사용을 권장한다.

```bash
python -m http.server 8000
```

이후 `http://localhost:8000/`으로 접속한다. 웹앱 실행 자체에는 패키지 설치가 필요 없다.

## 시험

Node.js 20 이상 권장.

```bash
npm test
```

NIST RRR100 구리 피팅, London 차폐, Bean 잔류 자속, 임계장, 현상론적 `Jc`, Allen–Dynes 추정기, 전기열 계산의 수치 안정성을 검사한다.

## GitHub Pages 배포

1. ZIP을 풀어 `index.html`이 저장소 루트에 오도록 푸시한다.
2. **Settings → Pages**로 이동한다.
3. **Deploy from a branch**를 선택한다.
4. 일반적으로 `main` 브랜치와 `/ (root)`를 선택한다.
5. 저장한다.

모든 경로를 `./css`, `./js`, `./assets`처럼 상대경로로 구성했으므로 `https://<owner>.github.io/<repo>/` 형태의 Project Pages에서도 별도 base path 수정 없이 동작하도록 구성했다.

## 적합한 사용 목적

- 초전도 거시 모델 간 결합 관계 이해;
- 파라미터 민감도 확인;
- 자기장 이력·잔류 자속·전류 분담 시각화;
- FEM/TDGL/HPC 해석기를 붙이기 전 UI·데이터 계약 프로토타이핑;
- 실제 보정을 위해 어떤 측정 데이터가 더 필요한지 식별.

이 앱만으로 자석 설계 승인, 퀜치 보호 인증, 정량적 자기부상 하중 예측, 논문용 시료 피팅 결과를 도출해서는 안 된다.

## 라이선스

새로 작성한 앱 코드는 MIT 라이선스다. 외부 수치·논문·데이터셋·상표의 권리는 원 출처 조건을 따른다. 이 저장소의 MIT 라이선스가 제3자 데이터를 재라이선스하지 않는다.
