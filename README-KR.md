# Superconductor Sim

[English](README.md) | [한국어](README-KR.md)

**Superconductor Sim**은 [JTech-CO/Superconductor-Data-Research](https://github.com/JTech-CO/Superconductor-Data-Research/)의 데이터 계약, 모델 대응표, 출처 규칙, 보조재 물성 자료를 바탕으로 만든 정적 브라우저 초전도체 시뮬레이터다.

이 패키지는 **시료 단위 보정 디지털 트윈**으로 표기하지 않는다. 문헌 기반 값과 엔지니어링 가정을 분리하고, 보정에 필요한 누락 필드를 UI에서 바로 확인할 수 있도록 구성했다.

## v0.2.0 업그레이드 요약

- 자석과 초전도체 상호작용을 보여 주는 **3D 실험실 뷰**를 추가했다.
- **자기부상 휴리스틱 지표**를 추가했다: 힘, 강성, 차폐 비율, 간격 자기장, 피닝 지수.
- REBCO, 벌크 YBCO, MgB2, Nb 기반의 **프리셋 구성을 확장**했다.
- 패널과 표의 **최소 글자 크기를 높여 가독성**을 개선했다.
- `file://` 빠른 확인과 다양한 브라우저 로딩 안정성을 위해 **classic 호환 번들**을 유지했다.
- 데스크톱, 태블릿, 모바일에서 모두 읽기 쉬운 **반응형 레이아웃**을 유지했다.

## 구현 범위

- 온도 의존 `lambda(T)`, `xi(T)`를 포함한 London / GL 응답.
- 상분류, `Bc`, `Bc1`, `Bc2` 추정.
- London 슬랩 차폐와 1차원 Bean 임계상태 히스테리시스.
- 보텍스 밀도 및 삼각 격자 간격 시각화.
- 현상론적 `Jc(T,B,theta)`와 `E = Ec (|J|/Jc)^n` 수송 응답.
- 초전도층 / 구리 안정화층 전류 분담이 포함된 집중정수 퀜치 모델.
- NIST OFHC Cu RRR100 보조 물성 피팅.
- 단순화 McMillan-Allen-Dynes 결합 보조 계산기.
- KR / EN UI, JSON 내보내기 / 가져오기, 출처 대화상자.

## 중요한 한계

현재 브라우저 빌드는 다음을 계산한다고 주장하지 않는다.

- 완전한 TDGL PDE;
- 완전한 3차원 Maxwell FEM/BEM;
- 시료 단위로 보정된 자기부상 힘 또는 토크;
- 완전한 코팅도체 self-field 해석기;
- 화학, 열처리, 변형률 열화 워크플로;
- 미시적 Eliashberg 또는 전체 DFT/EPW 파이프라인.

새로 추가된 3D 장면과 자기부상 값은 **휴리스틱 엔지니어링 시각화**다. 개념 설명과 인터랙션에는 유용하지만, 하중 인증이나 논문 수준의 정량 예측에 사용하면 안 된다.

## 폴더 구조

```text
Superconductor-Sim/
├── index.html
├── css/
├── js/
│   ├── app.js
│   ├── app.bundle.js
│   ├── compat.js
│   ├── core/
│   ├── data/
│   └── ui/
├── assets/
├── data/
├── docs/
├── tests/
├── scripts/
├── package.json
└── LICENSE
```

## 로컬 실행

빠른 확인 용도라면 `index.html`을 바로 열어도 되지만, 로컬 HTTP 서버 사용을 권장한다.

```bash
python -m http.server 8000
```

이후 `http://localhost:8000/`으로 접속한다.

## 테스트

```bash
npm test
```

## GitHub Pages 배포

1. 압축 해제 후 `index.html`이 저장소 루트에 오도록 업로드한다.
2. **Settings -> Pages**로 이동한다.
3. **Deploy from a branch**를 선택한다.
4. 브랜치와 `/ (root)`를 지정한다.
5. 저장한다.

모든 런타임 경로를 상대경로로 두었으므로 `https://<owner>.github.io/<repo>/` 형태의 Project Pages에서도 별도 수정 없이 동작한다.

## 라이선스

새로 작성한 앱 코드는 MIT 라이선스다. 외부 사실, 데이터셋, 논문, 상표의 권리는 원 조건을 따른다.
