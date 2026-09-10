# Superconductor Sim - model notes and validity boundaries

This file documents the equations actually used by the browser build. It is a model contract, not a claim that every superconducting material obeys these relations over all temperatures, fields, frequencies, geometries, and sample histories.

## 1. Temperature-dependent length scales

The app uses explicit phenomenological laws

```text
lambda(T) = lambda_ref / sqrt(1 - (T/Tc)^4)
xi(T)     = xi_ref     / sqrt(1 - (T/Tc)^2)
```

for `T < Tc`. These are convenient interpolation laws for a browser demonstrator. They should be replaced by measured tensor-valued `lambda(T)` and `xi(T)` functions for sample calibration.

## 2. GL-derived fields

```text
kappa = lambda / xi
Bc2   = Phi0 / (2*pi*xi^2)
Bc    = Phi0 / (2*sqrt(2)*pi*lambda*xi)
Bc1   ≈ Phi0/(4*pi*lambda^2) * (ln(kappa) + 0.5)
```

The `Bc1` expression is a London/GL approximation and becomes questionable near the Type-I / Type-II boundary. The UI reports a `borderline` class around `1/sqrt(2)` rather than pretending that a small change of input yields an exact universal classification.

## 3. Meissner-state slab solution

For a uniform slab with half-thickness `a` and an applied field parallel to the surface, the browser plots

```text
B(x) = Bapp * cosh(x/lambda) / cosh(a/lambda)
```

using a numerically stable ratio. This is not a universal finite-geometry demagnetization solution.

## 4. Bean critical state

The mixed-state history renderer stores a one-dimensional half-slab magnetic profile and updates it under the constraint

```text
|dB/dx| <= mu0 * Jc
```

while changing the minimum number of internal points needed when the surface field changes. This reproduces basic penetration and remanence behavior of a Bean-like critical state. It does not include flux creep, field-dependent local constitutive tensors, arbitrary geometry, or self-consistent 3-D Maxwell coupling.

Approximate magnetization is reported as

```text
M ≈ (<B> - Bapp) / mu0
```

for the slab convention used in the app.

## 5. Phenomenological critical current

The built-in law is

```text
t = T/Tc
epsilon(theta) = sqrt(cos(theta)^2 + sin(theta)^2/gamma^2)
Beff = |B| * epsilon(theta)
Jc = Jc0 * max(0, 1 - t^2)^p / (1 + (Beff/B0)^q)
```

where `p`, `q`, `B0`, and anisotropy `gamma` are user-editable. A calibrated application should replace this with measured `Jc(T,B,theta,strain,history)` data or a justified fitted surface.

## 6. E-J power law

```text
E = Ec * (|J|/Jc)^n * sign(J)
```

with default `Ec = 1e-4 V/m`, equivalent to `1 µV/cm`. The criterion is configurable in code and must be matched to the source experiment before quantitative comparison.

## 7. Vortices

The renderer calculates

```text
n_v = |<B>| / Phi0
atri = sqrt(2 / (sqrt(3) * n_v))
```

for an ideal triangular lattice. The displayed core halo is graphical. It is not an Abrikosov/TDGL order-parameter solution and does not represent a measured pinning landscape.

## 8. Electrothermal model

The browser uses a lumped per-unit-length balance

```text
C' dT/dt = E*I - h*P*(T - Tbath)
```

where `C'` sums the SC and Cu heat capacities per length, and `P` is the external perimeter per length.

Current is split between the superconducting layer and copper stabilizer by solving a parallel-current equation. Below `Tc`, the SC branch follows the power law; above `Tc`, the SC branch becomes ohmic with the user-provided normal-state resistivity.

### NIST copper

For RRR100 OFHC Cu, the app implements the published NIST thermal-conductivity rational fit and specific-heat log-polynomial fit in `4–300 K`. The repository verification value `k(77 K) ≈ 547.199698 W/(m K)` is covered by an automated test.

Copper resistivity is not taken from a NIST resistivity curve. The browser derives an approximate value using

```text
rho_Cu ≈ L0*T/k_Cu
```

with the Sommerfeld Lorenz number. This ignores magnetoresistance and deviations from the ideal Wiedemann–Franz relation.

## 9. Pairing helper

The simplified equation shown in the source research is implemented as

```text
Tc ≈ omega_log/1.2 * exp[-1.04(1+lambda_epc) /
     (lambda_epc - mu*(1 + 0.62*lambda_epc))]
```

The strong-coupling/spectral-shape correction factors of the fuller Allen–Dynes treatment are omitted. This must not be applied as a universal formula to unconventional or strongly correlated superconductors.

The optional gap reference is the weak-coupling isotropic BCS value

```text
Delta0 = 1.764 kB Tc
```

and is labeled as a reference, not a measured gap.

## 10. TDGL boundary

The app does not implement full TDGL. pyTDGL documentation is linked because it clearly states important validity conditions for the generalized 2-D thin-film approach: film thickness small compared with characteristic lengths, strict theoretical validity near `Tc`, and a dirty-superconductor regime for the underlying derivation. A future TDGL backend should expose those assumptions instead of hiding them behind the current Canvas renderer.

## 11. Chemistry

The source research proposes a separate diffusion/reaction model such as

```text
dc/dt = div(D grad c) + R(c,T,pO2)
```

for oxygen-sensitive materials. No diffusion coefficient or reaction-rate constants in the source repository are currently calibration-ready, so this browser version does not fabricate a chemistry simulator.
