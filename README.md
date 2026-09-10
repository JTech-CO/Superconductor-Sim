# Superconductor Sim

[English](README.md) · [한국어](README-KR.md)

**Superconductor Sim** is a static, browser-based superconductivity simulator derived from the data contracts, model matrix, provenance rules, and collected support-material data in [JTech-CO/Superconductor-Data-Research](https://github.com/JTech-CO/Superconductor-Data-Research/).

It is intentionally **not** presented as a sample-calibrated digital twin. The source research repository explicitly states that complete sample-specific material cards, raw `Jc/Ic` surfaces, calibrated levitation curves, and full TDGL parameter sets are not yet available. This app therefore separates literature-derived values from demonstration assumptions and exposes the missing calibration fields in the UI.

## What is implemented

- **London / GL response**
  - Temperature-dependent penetration depth and coherence length using explicit phenomenological temperature laws.
  - GL parameter `κ`, Type-I / Type-II boundary, thermodynamic critical field, and Type-II `Bc1/Bc2` estimates.
  - Finite-slab London field profile in the Meissner regime.
- **1-D Bean critical-state model**
  - History-dependent flux penetration during field sweeps.
  - Remanent flux, approximate magnetization, and full-penetration field.
  - This is an engineering critical-state approximation, not TDGL.
- **Vortex view**
  - Vortex areal density `n_v = |B| / Φ0` from average internal field.
  - Triangular-lattice spacing and a field-of-view renderer.
- **Transport model**
  - `E = Ec (|J|/Jc)^n` with `Ec = 1e-4 V/m` by default.
  - Phenomenological `Jc(T, B, θ)` with configurable temperature, field, and anisotropy terms.
- **Electrothermal / quench model**
  - Lumped per-unit-length thermal balance with SC/Cu current sharing.
  - NIST OFHC Cu RRR100 thermal-conductivity and specific-heat fits in the published 4–300 K domain.
  - Cu resistivity shown by the app is explicitly a Wiedemann–Franz engineering approximation, not a NIST resistivity fit.
- **Conventional pairing helper**
  - Simplified McMillan–Allen–Dynes `Tc` estimator.
  - Weak-coupling BCS gap reference `Δ0 = 1.764 kB Tc`.
- **Data provenance UI**
  - Repository Tc benchmark table, source cards, model matrix, quarantine status, and missing calibration fields.
- **KR / EN UI** and responsive desktop/tablet/mobile layouts.
- **State export/import** as JSON.

## What is deliberately not implemented

The current browser build does **not** claim to solve:

- full time-dependent Ginzburg–Landau PDEs;
- 3-D Maxwell FEM/BEM with realistic demagnetization and arbitrary geometry;
- sample-calibrated levitation force or torque;
- full self-field `H` / `T-A` formulations for coated conductors;
- measured AC loss / flux-creep curves;
- microscopic Eliashberg equations or full DFT/EPW workflows;
- chemistry, oxygen diffusion, annealing, phase-transition kinetics;
- strain-dependent degradation from measured sample datasets;
- Josephson-junction circuits.

See [MODEL-NOTES.md](docs/MODEL-NOTES.md) for equations, assumptions, and validity boundaries.

## Data provenance

Bundled research-derived files are in `data/`:

- `tc_benchmark_table1.csv` - copied from the source research repository. The 250 GPa YH10 and LaH10 rows remain `quarantined` and are not offered as normal Tc overrides.
- `model_data_matrix.csv` - model priorities and missing-data coverage from the research repository.
- `research-material-card.schema.json` - the source repository's future material-card contract.
- `nist-copper-rrr100.json` - the RRR100 subset used by this app, including the repository verification point `k(77 K) ≈ 547.199698 W/(m K)`.
- `sources.json` - direct references used in the app.

### Built-in material presets

1. **Generic Type-II demonstration card** - intentionally assumed parameters for interactive behavior. It is never labeled as calibrated.
2. **Niobium hybrid literature reference** - `Tc = 9.3 K` from the research repository's JARVIS-2022 benchmark row, plus the 2026 reported Nb intrinsic length scales `λL = 29.1(10) nm` and `ξ0 = 39.9(25) nm`. `Jc0`, `n`, geometry, cooling, and other fields remain assumptions; the card is therefore still not calibration-ready.

Do not interpret parameters from different samples or methods as a single experimentally validated material card.

## Repository structure

```text
Superconductor-Sim/
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js              # split ES-module source
│   ├── app.bundle.js       # deployed classic compatibility bundle
│   ├── compat.js           # lightweight browser fallbacks
│   ├── core/
│   │   ├── constants.js
│   │   ├── physics.js
│   │   ├── bean.js
│   │   └── thermal.js
│   ├── data/
│   │   └── materials.js
│   └── ui/
│       ├── charts.js
│       └── i18n.js
├── assets/
│   ├── logo.svg
│   ├── favicon.svg
│   └── og-image.svg
├── data/
├── docs/
├── tests/
├── scripts/
│   └── build-compat.mjs
├── package.json
├── .nojekyll
└── LICENSE
```

## Run locally

The deployed runtime is a classic compatibility bundle, so `index.html` can be opened directly through `file://` for a quick check. Running a local HTTP server is still recommended because it matches GitHub Pages behavior more closely.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

No package installation is needed for the app itself.

## Test

Node.js 20+ is recommended.

```bash
npm test
```

The test set checks the NIST RRR100 copper fit, London screening, Bean remanence, critical fields, the phenomenological `Jc` model, the pairing estimator, and electrothermal numerical finiteness.

## GitHub Pages

This project is designed to be served directly from a repository root.

1. Push the extracted files so `index.html` is at the repository root.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select the branch (normally `main`) and `/ (root)`.
5. Save.

All runtime paths are relative (`./css`, `./js`, `./assets`), so a project Pages URL such as `https://<owner>.github.io/<repo>/` works without changing a base path.

## Scientific use

This application is best used for:

- understanding coupling between macroscopic superconducting models;
- checking parameter sensitivity;
- visualizing field-history and current-sharing behavior;
- prototyping the UI/data contract before introducing FEM/TDGL/HPC solvers;
- identifying which sample-specific measurements are still required.

It is **not** suitable on its own for magnet design sign-off, quench-protection certification, levitation load prediction, or publication-quality sample fitting.

## References

Primary references are linked inside the app and listed in `data/sources.json`, including NIST OFHC copper cryogenic fits, pyTDGL model-validity documentation, JARVIS superconductivity work, the UCI superconductivity dataset, and the 2026 Nb length-scale measurement.

## License

New application code is MIT licensed. External facts, coefficients, datasets, papers, and trademarks remain subject to their original terms. This repository does not relicense third-party data.

## Browser compatibility and responsive layout

The deployed page loads `js/app.bundle.js` as a classic script while keeping the original split ES-module sources under `js/`. This avoids module MIME/CORS problems when the package is opened through `file://` and reduces browser-specific initialization failures. `js/compat.js` supplies small fallbacks for `Number.isFinite`, `Math.log10`, `CustomEvent`, `requestAnimationFrame`, `Object.values`, and `Object.entries`. `ResizeObserver` and `File.text()` are optional; the app falls back to window resize events and `FileReader`.

The interface is responsive at desktop, tablet, and phone widths. At narrow widths the three-column laboratory layout becomes a single reading column, controls receive at least 44 px touch targets, tables/tabs remain horizontally scrollable, and metric cards collapse to one column on small phones. The typography floor is now 14 px, replacing the previous 9 px microtext.

When editing split source files, rebuild the compatibility bundle with `npm run build:compat`. No npm package installation is required.
