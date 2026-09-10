# Superconductor Sim

[English](README.md) | [한국어](README-KR.md)

**Superconductor Sim** is a static browser simulator derived from the data contracts, model matrix, provenance rules, and support-material data in [JTech-CO/Superconductor-Data-Research](https://github.com/JTech-CO/Superconductor-Data-Research/).

This package is intentionally **not** labeled as a sample-calibrated digital twin. The app distinguishes literature-derived values from engineering assumptions and exposes missing calibration fields directly in the interface.

## v0.2.1 hotfix summary

- Fixed overlapping text in the 3-D lab overlay panels.
- Improved object readability with clearer magnet, sample, and cold-stage separation.
- Integrated the 3-D objects with the floor grid using anchored staging, glow, and shadow cues.

- Added a **3-D lab** view with a qualitative magnet-superconductor levitation scene.
- Added **heuristic levitation metrics**: force, stiffness, shielding fraction, gap field, and pinning index.
- Added **new presets** for REBCO, bulk YBCO, MgB2, and Nb reference use.
- Increased the **typography floor** and improved dense-panel readability.
- Kept the **classic compatibility bundle** so the page still opens reliably across browsers and even through `file://` quick checks.
- Preserved **responsive layout** for desktop, tablet, and phone.

## What is implemented

- London / GL response with temperature-dependent `lambda(T)` and `xi(T)`.
- Type classification, `Bc`, `Bc1`, and `Bc2` estimates.
- London slab screening and 1-D Bean critical-state hysteresis.
- Vortex density and triangular-lattice spacing views.
- Phenomenological `Jc(T,B,theta)` and `E = Ec (|J|/Jc)^n` transport response.
- Lumped electrothermal quench model with SC/Cu current sharing.
- NIST OFHC Cu RRR100 support-property fits.
- Simplified McMillan-Allen-Dynes pairing helper.
- KR / EN UI, JSON export/import, and provenance dialogs.

## Important limits

This browser build does **not** claim to solve:

- full TDGL PDEs;
- full 3-D Maxwell FEM/BEM;
- sample-calibrated levitation force or torque;
- full coated-conductor self-field solvers;
- chemistry, annealing, or strain degradation workflows;
- microscopic Eliashberg or full DFT/EPW pipelines.

The new 3-D scene and levitation values are **heuristic engineering visualizations**. They are useful for interaction and concept explanation, not for load certification or publication-grade force prediction.

## Repository structure

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

## Run locally

You can open `index.html` directly for a quick check, but a local HTTP server is recommended.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Test

```bash
npm test
```

## GitHub Pages

1. Upload the extracted files so `index.html` is at the repository root.
2. Go to **Settings -> Pages**.
3. Choose **Deploy from a branch**.
4. Select the branch and `/ (root)`.
5. Save.

All runtime paths are relative, so a project URL such as `https://<owner>.github.io/<repo>/` works without base-path edits.

## License

New application code is MIT licensed. External facts, datasets, papers, and trademarks remain under their original terms.
