import { PHI0, clamp } from '../core/constants.js';
import { criticalFields, lambdaAtTemperature, xiAtTemperature, electricFieldFromJ, vortexDensity, triangularVortexSpacing } from '../core/physics.js';

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
  ctx.fillStyle = css('--canvas-bg', '#081016');
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

export function renderFieldScene(canvas, { profile, phase, BappT, halfWidthM, fields, stateLabel, magnetizationApm, fullPenetrationT }) {
  const { ctx, w, h } = prepare(canvas); base(ctx, w, h);
  const pad = Math.max(28, w * 0.055);
  const sx = pad;
  const sy = h * 0.21;
  const sw = w - 2 * pad;
  const sh = h * 0.52;

  const outerGradient = ctx.createLinearGradient(0, 0, 0, h);
  outerGradient.addColorStop(0, css('--field-bg-top', '#0c1822'));
  outerGradient.addColorStop(1, css('--field-bg-bottom', '#081016'));
  ctx.fillStyle = outerGradient;
  ctx.fillRect(0, 0, w, h);

  // Ambient field guides.
  const fieldColor = css('--field', '#61d7ff');
  ctx.strokeStyle = fieldColor;
  ctx.globalAlpha = 0.14;
  ctx.lineWidth = 1;
  const lineStep = Math.max(18, sw / 26);
  for (let x = sx % lineStep; x < w; x += lineStep) {
    ctx.beginPath(); ctx.moveTo(x, 18); ctx.lineTo(x, h - 18); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  roundedRect(ctx, sx, sy, sw, sh, 14);
  const sampleGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
  sampleGrad.addColorStop(0, css('--sample-top', '#152733'));
  sampleGrad.addColorStop(1, css('--sample-bottom', '#0d1b24'));
  ctx.fillStyle = sampleGrad; ctx.fill();
  ctx.strokeStyle = css('--border-strong', '#355263'); ctx.lineWidth = 1.25; ctx.stroke();

  const maxB = Math.max(1e-12, Math.abs(BappT), ...profile.map(p => Math.abs(p.bT)));
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
    // Arrow head.
    const dir = p.bT >= 0 ? 1 : -1;
    const ay = sy + sh * 0.46;
    ctx.beginPath();
    ctx.moveTo(x, ay + dir * 7);
    ctx.lineTo(x - 3.5, ay);
    ctx.lineTo(x + 3.5, ay);
    ctx.closePath(); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
  }
  ctx.globalAlpha = 1;

  // State core annotation.
  const stateColor = phase === 'normal' ? css('--danger', '#ff756d') : phase === 'mixed' ? css('--warning', '#ffcc66') : css('--success', '#65e0ad');
  ctx.fillStyle = stateColor;
  ctx.globalAlpha = 0.08;
  roundedRect(ctx, sx + sw * 0.33, sy + sh * 0.34, sw * 0.34, sh * 0.32, 12); ctx.fill();
  ctx.globalAlpha = 1;
  label(ctx, stateLabel.toUpperCase(), sx + sw / 2, sy + sh / 2, 'center', Math.min(20, Math.max(15, w / 42)), stateColor);

  // Profile plot strip.
  const py = sy + sh + 36;
  const ph = Math.max(48, h - py - 28);
  const zeroY = py + ph / 2;
  ctx.strokeStyle = css('--grid', '#243440'); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(sx, zeroY); ctx.lineTo(sx + sw, zeroY); ctx.stroke();
  const plotMax = maxB;
  ctx.strokeStyle = fieldColor; ctx.lineWidth = 2;
  ctx.beginPath();
  profile.forEach((p, i) => {
    const xNorm = (p.xM + halfWidthM) / (2 * halfWidthM || 1);
    const x = sx + xNorm * sw;
    const y = zeroY - (p.bT / plotMax) * (ph * 0.42);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  label(ctx, `B(x) · Bapp ${fmt(BappT)} T`, sx, py - 10, 'left', 15);
  label(ctx, `M ${fmt(magnetizationApm)} A/m · Bp ${fmt(fullPenetrationT)} T`, sx + sw, py - 10, 'right', 15);
  label(ctx, `−${fmt(halfWidthM * 1e3, 2)} mm`, sx, py + ph + 10, 'left', 16);
  label(ctx, `+${fmt(halfWidthM * 1e3, 2)} mm`, sx + sw, py + ph + 10, 'right', 16);
}

export function renderVortexScene(canvas, { BavgT, fovUm, xiM, phase, orderAmplitude }) {
  const { ctx, w, h } = prepare(canvas); base(ctx, w, h);
  const pad = Math.max(28, Math.min(w, h) * 0.08);
  const size = Math.min(w - 2 * pad, h - 2 * pad);
  const x0 = (w - size) / 2;
  const y0 = (h - size) / 2;
  roundedRect(ctx, x0, y0, size, size, 14);
  ctx.fillStyle = css('--sample-bottom', '#0d1b24'); ctx.fill();
  ctx.strokeStyle = css('--border-strong', '#355263'); ctx.stroke();

  const fovM = Math.max(1e-9, fovUm * 1e-6);
  const spacingM = triangularVortexSpacing(BavgT);
  const density = vortexDensity(BavgT);
  const expected = density * fovM * fovM;
  const stateColor = css('--field', '#61d7ff');
  const signColor = BavgT >= 0 ? stateColor : css('--field-negative', '#ff9e64');

  if (phase !== 'mixed' || !Number.isFinite(spacingM) || expected < 0.03) {
    ctx.globalAlpha = 0.12 + 0.1 * orderAmplitude;
    ctx.fillStyle = css('--success', '#65e0ad');
    roundedRect(ctx, x0 + 2, y0 + 2, size - 4, size - 4, 12); ctx.fill();
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
        ctx.beginPath(); ctx.arc(x, y, corePx * 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = signColor;
        ctx.beginPath(); ctx.arc(x, y, Math.max(1.4, corePx * 0.38), 0, Math.PI * 2); ctx.fill();
        count++;
      }
    }
    // faint order-parameter overlay
    ctx.globalAlpha = 0.05 + 0.08 * orderAmplitude;
    ctx.fillStyle = css('--success', '#65e0ad');
    roundedRect(ctx, x0 + 2, y0 + 2, size - 4, size - 4, 12); ctx.fill();
    ctx.globalAlpha = 1;
    label(ctx, `rendered ≤ ${count} · expected ${fmt(expected, 1)}`, x0 + 10, y0 + size - 14, 'left', 16);
  }

  label(ctx, `${fmt(fovUm, 2)} µm`, x0 + size, y0 + size + 18, 'right', 15);
  label(ctx, `a△ ${Number.isFinite(spacingM) ? fmt(spacingM * 1e9, 1) + ' nm' : 'N/A'} · nᵥ ${fmt(density)} m⁻²`, x0, y0 - 14, 'left', 15);
  label(ctx, `Φ₀ = ${PHI0.toExponential(4)} Wb`, x0 + size, y0 - 14, 'right', 15);
}

function drawAxes(ctx, box, xLabel, yLabel) {
  const { x, y, w, h } = box;
  ctx.strokeStyle = css('--grid', '#243440'); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
  label(ctx, xLabel, x + w, y + h + 20, 'right', 16);
  label(ctx, yLabel, x - 4, y - 12, 'left', 16);
}

export function renderTransportScene(canvas, { Jc, nValue, ec, operatingJ, normalResistivity, normal }) {
  const { ctx, w, h } = prepare(canvas); base(ctx, w, h);
  const box = { x:62, y:28, w:w - 88, h:h - 72 };
  drawAxes(ctx, box, 'J / Jc', 'E [V/m]');
  const xmin = -2, xmax = 1.25; // log10 J/Jc
  const ymin = -12, ymax = 2;
  const mapX = v => box.x + (v - xmin) / (xmax - xmin) * box.w;
  const mapY = v => box.y + box.h - (v - ymin) / (ymax - ymin) * box.h;
  for (let p = -12; p <= 2; p += 2) {
    const yy = mapY(p); ctx.strokeStyle = css('--grid', '#243440'); ctx.globalAlpha = 0.55;
    ctx.beginPath(); ctx.moveTo(box.x, yy); ctx.lineTo(box.x + box.w, yy); ctx.stroke();
    ctx.globalAlpha = 1; label(ctx, `1e${p}`, box.x - 8, yy, 'right', 14);
  }
  [-2,-1,0,1].forEach(p => label(ctx, `1e${p}`, mapX(p), box.y + box.h + 10, 'center', 14));

  const accent = css('--field', '#61d7ff');
  ctx.strokeStyle = accent; ctx.lineWidth = 2.3; ctx.beginPath();
  let started = false;
  for (let i = 0; i <= 260; i++) {
    const lx = xmin + (xmax - xmin) * i / 260;
    const ratio = Math.pow(10, lx);
    let E;
    if (normal || !(Jc > 0)) E = normalResistivity * Math.max(1, Jc) * ratio;
    else E = electricFieldFromJ(Jc * ratio, Jc, nValue, ec);
    const ly = Math.log10(Math.max(1e-20, Math.abs(E)));
    if (ly < ymin - 1 || ly > ymax + 1) continue;
    const px = mapX(lx), py = mapY(clamp(ly, ymin, ymax));
    if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const ecLog = Math.log10(ec);
  ctx.setLineDash([5,5]); ctx.strokeStyle = css('--warning', '#ffcc66'); ctx.globalAlpha = 0.7;
  ctx.beginPath(); ctx.moveTo(box.x, mapY(ecLog)); ctx.lineTo(box.x + box.w, mapY(ecLog)); ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha = 1; label(ctx, 'Ec', box.x + box.w - 4, mapY(ecLog) - 9, 'right', 14, css('--warning', '#ffcc66'));

  if (Jc > 0 && operatingJ > 0) {
    const ratio = operatingJ / Jc;
    const Eop = normal ? normalResistivity * operatingJ : electricFieldFromJ(operatingJ, Jc, nValue, ec);
    const px = mapX(clamp(Math.log10(Math.max(1e-9, ratio)), xmin, xmax));
    const py = mapY(clamp(Math.log10(Math.max(1e-20, Math.abs(Eop))), ymin, ymax));
    ctx.fillStyle = css('--danger', '#ff756d'); ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    label(ctx, `op · J/Jc ${fmt(ratio,2)}`, px + 8, py - 10, 'left', 16, css('--text', '#e8f0f6'));
  }
}

export function renderThermalScene(canvas, { samples, tcK, bathK }) {
  const { ctx, w, h } = prepare(canvas); base(ctx, w, h);
  const box = { x:58, y:28, w:w - 84, h:h - 72 };
  drawAxes(ctx, box, 't [s]', 'T [K]');
  const data = samples && samples.length ? samples : [{ t:0, temperatureK:bathK }];
  const tMin = data[0].t;
  const tMax = Math.max(tMin + 0.1, data[data.length - 1].t);
  let yMin = Math.min(bathK, ...data.map(d => d.temperatureK));
  let yMax = Math.max(tcK, bathK + 1, ...data.map(d => d.temperatureK));
  const span = Math.max(1, yMax - yMin); yMin = Math.max(0, yMin - 0.08 * span); yMax += 0.12 * span;
  const mapX = v => box.x + (v - tMin) / (tMax - tMin) * box.w;
  const mapY = v => box.y + box.h - (v - yMin) / (yMax - yMin) * box.h;

  const drawRef = (value, text, color) => {
    if (value < yMin || value > yMax) return;
    ctx.setLineDash([5,5]); ctx.strokeStyle = color; ctx.globalAlpha = 0.65;
    ctx.beginPath(); ctx.moveTo(box.x, mapY(value)); ctx.lineTo(box.x + box.w, mapY(value)); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1; label(ctx, text, box.x + box.w - 4, mapY(value) - 9, 'right', 14, color);
  };
  drawRef(tcK, 'Tc', css('--danger', '#ff756d'));
  drawRef(bathK, 'Tbath', css('--field', '#61d7ff'));

  ctx.strokeStyle = css('--warning', '#ffcc66'); ctx.lineWidth = 2.4; ctx.beginPath();
  data.forEach((d, i) => { const px = mapX(d.t), py = mapY(d.temperatureK); if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); });
  ctx.stroke();
  label(ctx, `${fmt(tMax - tMin,2)} s window`, box.x + box.w, box.y + box.h + 10, 'right', 14);
  label(ctx, `${fmt(yMin,1)}–${fmt(yMax,1)} K`, box.x, box.y - 12, 'left', 14);
}

export function renderPhaseScene(canvas, { params, temperatureK, BabsT }) {
  const { ctx, w, h } = prepare(canvas); base(ctx, w, h);
  const box = { x:62, y:30, w:w - 88, h:h - 76 };
  drawAxes(ctx, box, 'T / Tc', 'B [T]');
  const lambda0M = params.lambda0Nm * 1e-9;
  const xi0M = params.xi0Nm * 1e-9;
  const f0 = criticalFields({ lambdaM:lambda0M, xiM:xi0M, T:0, Tc:params.tcK });
  const yMax = Math.max(0.05, Math.min(120, f0.bc2T * 1.12 || f0.bcT * 1.3 || 1));
  const mapX = t => box.x + t / 1.08 * box.w;
  const mapY = b => box.y + box.h - clamp(b / yMax, 0, 1) * box.h;

  const lines = { bc1:[], bc2:[], bc:[] };
  for (let i=0;i<=180;i++) {
    const tr = 0.995 * i / 180;
    const T = tr * params.tcK;
    const l = lambdaAtTemperature(lambda0M, T, params.tcK);
    const x = xiAtTemperature(xi0M, T, params.tcK);
    const f = criticalFields({ lambdaM:l, xiM:x, T, Tc:params.tcK });
    lines.bc1.push([tr, f.bc1T]); lines.bc2.push([tr, f.bc2T]); lines.bc.push([tr, f.bcT]);
  }
  const draw = (arr, color, width, dash=[]) => {
    ctx.strokeStyle=color; ctx.lineWidth=width; ctx.setLineDash(dash); ctx.beginPath();
    arr.forEach(([tx,b],i)=>{ const px=mapX(tx), py=mapY(b); if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py); }); ctx.stroke(); ctx.setLineDash([]);
  };
  if (f0.type === 'type-i' || f0.type === 'borderline') {
    draw(lines.bc, css('--warning', '#ffcc66'), 2.2);
    label(ctx, 'Bc', mapX(0.1), mapY(lines.bc[Math.floor(lines.bc.length*0.1)][1]) - 10, 'left', 16, css('--warning', '#ffcc66'));
  } else {
    draw(lines.bc2, css('--danger', '#ff756d'), 2.2);
    draw(lines.bc1, css('--field', '#61d7ff'), 1.8, [5,4]);
    label(ctx, 'Bc2', mapX(0.08), mapY(lines.bc2[Math.floor(lines.bc2.length*0.08)][1]) - 10, 'left', 16, css('--danger', '#ff756d'));
    label(ctx, 'Bc1', mapX(0.2), mapY(lines.bc1[Math.floor(lines.bc1.length*0.2)][1]) - 10, 'left', 16, css('--field', '#61d7ff'));
  }
  const tx = clamp(temperatureK / params.tcK, 0, 1.08);
  const px = mapX(tx), py = mapY(BabsT);
  ctx.fillStyle = css('--text', '#e8f0f6'); ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI*2); ctx.fill();
  label(ctx, 'operating point', px + 8, py - 10, 'left', 14, css('--text', '#e8f0f6'));
  label(ctx, `B scale max ${fmt(yMax)} T`, box.x + box.w, box.y - 12, 'right', 14);
}
