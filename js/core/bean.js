import { MU0, clamp } from './constants.js';

/**
 * 1D Bean critical-state slab.
 * Internal array runs from surface (index 0) to center (last index).
 * The update rule changes the minimum amount required to obey |dB/dx| <= μ0 Jc.
 * This is an engineering critical-state approximation, not a TDGL solver.
 */
export class BeanSlab {
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
