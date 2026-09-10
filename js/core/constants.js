export const MU0 = 4e-7 * Math.PI;
export const EPS0 = 8.8541878128e-12;
export const H = 6.62607015e-34;
export const HBAR = H / (2 * Math.PI);
export const E_CHARGE = 1.602176634e-19;
export const K_B = 1.380649e-23;
export const PHI0 = H / (2 * E_CHARGE);
export const LORENZ = 2.44e-8;
export const TYPE_BOUNDARY = 1 / Math.sqrt(2);
export const DEFAULT_EC = 1e-4; // 1 µV/cm

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}
