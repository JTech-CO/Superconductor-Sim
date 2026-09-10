import { PHI0, clamp, MU0 } from '../core/constants.js';
import { criticalFields, lambdaAtTemperature, xiAtTemperature, electricFieldFromJ, vortexDensity, triangularVortexSpacing, levitationEstimate } from '../core/physics.js';

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
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, css('--field-bg-top', '#0c1822'));
  bg.addColorStop(1, css('--field-bg-bottom', '#081016'));
  ctx.fillStyle = bg;
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

function formatForce(v) {
  if (!Number.isFinite(v)) return 'N/A';
  const a = Math.abs(v);
  if (a >= 1) return `${fmt(v, 3)} N`;
  if (a >= 1e-3) return `${fmt(v * 1e3, 2)} mN`;
  return `${fmt(v * 1e6, 2)} µN`;
}

function drawAxes(ctx, box, xLabel, yLabel) {
  const { x, y, w, h } = box;
  ctx.strokeStyle = css('--grid', '#243440');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();
  label(ctx, xLabel, x + w, y + h + 20, 'right', 16);
  label(ctx, yLabel, x - 4, y - 12, 'left', 16);
}

function rad(deg) {
  return deg * Math.PI / 180;
}

function makeCamera(w, h, scene) {
  return {
    yaw: rad(scene.yawDeg || -32),
    pitch: rad(scene.pitchDeg || 18),
    zoom: clamp(scene.zoom || 1, 0.5, 2.2),
    cx: w * 0.5,
    cy: h * 0.62,
    perspective: Math.min(w, h) * 0.9
  };
}

function transformPoint(p, camera) {
  const cy = Math.cos(camera.yaw);
  const sy = Math.sin(camera.yaw);
  const cp = Math.cos(camera.pitch);
  const sp = Math.sin(camera.pitch);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const y2 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp;
  const depth = 34 + z2;
  const scale = camera.zoom * camera.perspective / Math.max(6, depth);
  return { x:x1, y:y2, z:z2, depth, sx:camera.cx + x1 * scale, sy:camera.cy - y2 * scale, scale };
}

function polyDepth(points, camera) {
  let s = 0;
  for (let i = 0; i < points.length; i++) s += transformPoint(points[i], camera).depth;
  return s / Math.max(1, points.length);
}

function drawPolygon3D(ctx, camera, points, fill, stroke, lineWidth) {
  if (!points || points.length < 3) return;
  ctx.beginPath();
  const first = transformPoint(points[0], camera);
  ctx.moveTo(first.sx, first.sy);
  for (let i = 1; i < points.length; i++) {
    const p = transformPoint(points[i], camera);
    ctx.lineTo(p.sx, p.sy);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();
  }
}

function drawPolyline3D(ctx, camera, points, stroke, lineWidth, alpha) {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  const first = transformPoint(points[0], camera);
  ctx.moveTo(first.sx, first.sy);
  for (let i = 1; i < points.length; i++) {
    const p = transformPoint(points[i], camera);
    ctx.lineTo(p.sx, p.sy);
  }
  ctx.globalAlpha = typeof alpha === 'number' ? alpha : 1;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth || 1;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawCylinder3D(ctx, camera, options) {
  const center = options.center;
  const radius = Math.max(0.1, options.radius);
  const height = Math.max(0.1, options.height);
  const segments = options.segments || 28;
  const sidePolys = [];
  const top = [];
  const bottom = [];
  const yTop = center.y + height / 2;
  const yBottom = center.y - height / 2;

  for (let i = 0; i < segments; i++) {
    const a = Math.PI * 2 * i / segments;
    const x = center.x + radius * Math.cos(a);
    const z = center.z + radius * Math.sin(a);
    top.push({ x, y:yTop, z });
    bottom.push({ x, y:yBottom, z });
  }
  for (let i = 0; i < segments; i++) {
    const j = (i + 1) % segments;
    const poly = [bottom[i], bottom[j], top[j], top[i]];
    sidePolys.push({ depth:polyDepth(poly, camera), poly });
  }
  sidePolys.sort((a, b) => b.depth - a.depth);
  for (let i = 0; i < sidePolys.length; i++) {
    const tone = 0.8 + 0.2 * (i / Math.max(1, sidePolys.length - 1));
    const fill = options.sideFill || css('--sample-top', '#152733');
    ctx.globalAlpha = tone;
    drawPolygon3D(ctx, camera, sidePolys[i].poly, fill, options.sideStroke || css('--border-strong', '#355263'), 0.8);
  }
  ctx.globalAlpha = 1;
  drawPolygon3D(ctx, camera, bottom, options.bottomFill || options.sideFill || css('--sample-bottom', '#0d1b24'), null, 0);
  drawPolygon3D(ctx, camera, top, options.topFill || options.sideFill || css('--sample-top', '#152733'), options.topStroke || css('--border-strong', '#355263'), 1.2);
  return { top, bottom };
}

function drawGround(ctx, camera, y, width, depth) {
  ctx.strokeStyle = css('--grid', '#243440');
  ctx.lineWidth = 1;
  const lines = [];
  for (let x = -width; x <= width; x += width / 5) lines.push([{ x, y, z:-depth }, { x, y, z:depth }]);
  for (let z = -depth; z <= depth; z += depth / 5) lines.push([{ x:-width, y, z }, { x:width, y, z }]);
  lines.sort((a, b) => polyDepth(a, camera) - polyDepth(b, camera));
  for (let i = 0; i < lines.length; i++) drawPolyline3D(ctx, camera, lines[i], css('--grid', '#243440'), 1, 0.6);
}

function arrow2D(ctx, x1, y1, x2, y2, color) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(ang - Math.PI / 6), y2 - 10 * Math.sin(ang - Math.PI / 6));
  ctx.lineTo(x2 - 10 * Math.cos(ang + Math.PI / 6), y2 - 10 * Math.sin(ang + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawCallout(ctx, x, y, title, value, color) {
  const width = Math.max(160, Math.min(240, Math.max(title.length, value.length) * 7 + 38));
  const height = 44;
  roundedRect(ctx, x, y, width, height, 10);
  ctx.fillStyle = 'rgba(8,16,22,0.88)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  label(ctx, title, x + 12, y + 14, 'left', 13, css('--muted', '#91a0ad'));
  label(ctx, value, x + 12, y + 30, 'left', 16, color);
}

function drawInfoPanel(ctx, x, y, width, title, lines, accent) {
  const body = Array.isArray(lines) ? lines : [];
  const height = 22 + body.length * 18 + 20;
  roundedRect(ctx, x, y, width, height, 12);
  ctx.fillStyle = 'rgba(8,16,22,0.9)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.stroke();
  label(ctx, title, x + 12, y + 15, 'left', 17, accent);
  for (let i = 0; i < body.length; i++) {
    label(ctx, body[i], x + 12, y + 36 + i * 18, 'left', 14, i === 0 ? css('--text', '#e8f0f6') : css('--muted', '#91a0ad'));
  }
  return { width, height };
}

function ellipsePoints3D(center, rx, rz, y, segments = 40) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const a = Math.PI * 2 * i / segments;
    pts.push({ x:center.x + rx * Math.cos(a), y, z:center.z + rz * Math.sin(a) });
  }
  return pts;
}

function drawDisc3D(ctx, camera, center, rx, rz, y, fill, stroke, alpha) {
  const pts = ellipsePoints3D(center, rx, rz, y);
  ctx.globalAlpha = typeof alpha === 'number' ? alpha : 1;
  drawPolygon3D(ctx, camera, pts, fill, stroke, 1);
  ctx.globalAlpha = 1;
}

function drawLeaderLabel(ctx, x, y, dx, dy, text, color) {
  const w = Math.max(120, Math.min(210, text.length * 7 + 24));
  const h = 26;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
  const bx = x + dx + (dx >= 0 ? 0 : -w);
  const by = y + dy - h / 2;
  roundedRect(ctx, bx, by, w, h, 8);
  ctx.fillStyle = 'rgba(8,16,22,0.88)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();
  label(ctx, text, bx + 10, by + h / 2, 'left', 13, color);
}

export function renderLab3DScene(canvas, { phase, fields, stateLabel, levitation, scene, geometry, experiment, orderAmplitude, avgB, vortexSpacingM }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);

  const camera = makeCamera(w, h, scene);
  const phaseColor = phase === 'normal' ? css('--danger', '#ff756d') : phase === 'mixed' ? css('--warning', '#ffcc66') : css('--success', '#65e0ad');
  const fieldColor = experiment.appliedFieldT >= 0 ? css('--field', '#61d7ff') : css('--field-negative', '#ff9e64');

  const sampleRadius = Math.max(3.4, experiment.sampleRadiusMm * 0.34);
  const sampleHeight = Math.max(1.4, experiment.sampleHeightMm * 0.32);
  const magnetRadius = Math.max(2.8, experiment.magnetRadiusMm * 0.34);
  const magnetHeight = Math.max(1.5, experiment.magnetHeightMm * 0.34);
  const gap = Math.max(1.2, experiment.magnetGapMm * 0.38);
  const stageHeight = Math.max(1.1, sampleHeight * 0.55);
  const stageRadius = sampleRadius * 1.16;
  const groundY = -8.8;
  const stageCenterY = groundY + stageHeight / 2;
  const sampleCenterY = groundY + stageHeight + sampleHeight / 2 + 0.12;
  const magnetCenterY = sampleCenterY + sampleHeight / 2 + gap + magnetHeight / 2;
  const origin = { x:0, y:0, z:0 };

  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  roundedRect(ctx, 14, 14, w - 28, h - 28, 16);
  ctx.fill();

  drawGround(ctx, camera, groundY, 20, 20);
  drawDisc3D(ctx, camera, origin, stageRadius * 1.45, stageRadius * 1.05, groundY + 0.02, phaseColor, null, 0.05);
  drawDisc3D(ctx, camera, origin, stageRadius * 1.12, stageRadius * 0.92, groundY + 0.015, 'rgba(0,0,0,0.65)', null, 0.22);

  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:stageCenterY, z:0 },
    radius:stageRadius,
    height:stageHeight,
    sideFill:'rgba(40,56,70,0.97)',
    bottomFill:'rgba(9,16,24,0.98)',
    topFill:'rgba(66,92,116,0.98)',
    topStroke:'rgba(151,183,205,0.45)',
    sideStroke:'rgba(255,255,255,0.05)'
  });

  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:sampleCenterY, z:0 },
    radius:sampleRadius,
    height:sampleHeight,
    sideFill:'rgba(114,132,142,0.96)',
    bottomFill:'rgba(60,76,88,0.98)',
    topFill: phase === 'normal' ? 'rgba(163,103,100,0.95)' : phase === 'mixed' ? 'rgba(198,164,86,0.95)' : 'rgba(98,174,177,0.96)',
    topStroke: phaseColor,
    sideStroke:'rgba(255,255,255,0.08)'
  });
  drawDisc3D(ctx, camera, origin, sampleRadius * 0.92, sampleRadius * 0.92, sampleCenterY + sampleHeight / 2 + 0.03, phaseColor, null, 0.11);

  const magnetUpperH = magnetHeight * 0.55;
  const magnetLowerH = magnetHeight - magnetUpperH;
  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:magnetCenterY + magnetLowerH / 2, z:0 },
    radius:magnetRadius,
    height:magnetUpperH,
    sideFill:'rgba(157,49,81,0.96)',
    bottomFill:'rgba(112,28,55,0.96)',
    topFill:'rgba(214,88,124,0.98)',
    topStroke:'rgba(255,203,216,0.96)',
    sideStroke:'rgba(255,255,255,0.06)'
  });
  drawCylinder3D(ctx, camera, {
    center:{ x:0, y:magnetCenterY - magnetUpperH / 2, z:0 },
    radius:magnetRadius,
    height:magnetLowerH,
    sideFill:'rgba(47,92,144,0.95)',
    bottomFill:'rgba(22,47,79,0.97)',
    topFill:'rgba(74,134,196,0.96)',
    topStroke:'rgba(190,220,255,0.3)',
    sideStroke:'rgba(255,255,255,0.06)'
  });

  if (experiment.showFieldLines3d) {
    const lines = [];
    const lineCount = 9;
    for (let i = 0; i < lineCount; i++) {
      const t = -1 + 2 * i / (lineCount - 1);
      const x = t * magnetRadius * 0.9;
      const sideBend = (phase === 'meissner' ? 1.3 : phase === 'mixed' ? 0.78 : 0.2) * (0.9 - Math.abs(t) * 0.38);
      const z = Math.sin(i * 0.9) * magnetRadius * 0.1;
      const entryY = sampleCenterY + sampleHeight / 2 + gap * 0.12;
      const penetrateY = sampleCenterY + sampleHeight * (phase === 'mixed' ? 0.12 : 0.42);
      const exitY = sampleCenterY - sampleHeight * (phase === 'mixed' ? 0.42 : 0.02);
      lines.push([
        { x, y:magnetCenterY + magnetHeight * 0.7, z },
        { x, y:magnetCenterY + magnetHeight * 0.18, z },
        { x: x * (1 + 0.15 * sideBend), y:entryY, z: z + sideBend * 0.55 },
        { x: x * (1 + 0.45 * sideBend), y:penetrateY, z: z + sideBend * 1.15 },
        { x: x * (1 + 0.62 * sideBend), y:exitY, z: z + sideBend * 1.6 },
        { x: x * (1 + 0.75 * sideBend), y:groundY + 0.32, z: z + sideBend * 2.0 }
      ]);
    }
    for (let i = 0; i < lines.length; i++) drawPolyline3D(ctx, camera, lines[i], fieldColor, 1.6, 0.82);
  }

  if (experiment.showVortices3d && phase === 'mixed' && Number.isFinite(vortexSpacingM)) {
    const ringCounts = [1, 6, 10];
    for (let r = 0; r < ringCounts.length; r++) {
      const rr = sampleRadius * (r === 0 ? 0 : 0.28 + 0.25 * r);
      for (let i = 0; i < ringCounts[r]; i++) {
        const ang = ringCounts[r] === 1 ? 0 : 2 * Math.PI * i / ringCounts[r];
        const x = Math.cos(ang) * rr;
        const z = Math.sin(ang) * rr;
        const p1 = { x, y:sampleCenterY + sampleHeight * 0.44, z };
        const p2 = { x, y:sampleCenterY - sampleHeight * 0.44, z };
        drawPolyline3D(ctx, camera, [p1, p2], css('--warning', '#ffcc66'), 1.2, 0.88);
      }
    }
  }

  const pSample = transformPoint({ x:sampleRadius * 0.95, y:sampleCenterY + sampleHeight * 0.12, z:sampleRadius * 0.1 }, camera);
  const pStage = transformPoint({ x:stageRadius * 0.82, y:stageCenterY, z:stageRadius * 0.12 }, camera);
  const pMagTop = transformPoint({ x:magnetRadius * 0.18, y:magnetCenterY + magnetHeight * 0.42, z:magnetRadius * 0.12 }, camera);
  const pMagFront = transformPoint({ x:magnetRadius * 0.96, y:magnetCenterY - magnetHeight * 0.18, z:magnetRadius * 0.08 }, camera);
  const pGapTop = transformPoint({ x:0, y:sampleCenterY + sampleHeight / 2, z:0 }, camera);
  const pGapMag = transformPoint({ x:0, y:magnetCenterY - magnetHeight / 2, z:0 }, camera);

  drawLeaderLabel(ctx, pMagTop.sx, pMagTop.sy, 34, -26, 'Permanent magnet (N pole)', 'rgba(255,203,216,0.95)');
  drawLeaderLabel(ctx, pSample.sx, pSample.sy, 34, 8, 'Superconductor sample', phaseColor);
  drawLeaderLabel(ctx, pStage.sx, pStage.sy, 30, 28, 'Cold stage / holder', 'rgba(156,195,225,0.92)');
  drawLeaderLabel(ctx, pMagFront.sx, pMagFront.sy, 34, 20, 'S pole', 'rgba(159,205,255,0.95)');

  arrow2D(ctx, pGapTop.sx + 80, pGapTop.sy + 36, pGapTop.sx + 80, pGapTop.sy - 54, phaseColor);
  label(ctx, 'Fz', pGapTop.sx + 92, pGapTop.sy - 58, 'left', 17, phaseColor);
  arrow2D(ctx, pGapTop.sx + 106, pGapTop.sy - 50, pGapTop.sx + 106, pGapTop.sy + 34, css('--muted', '#91a0ad'));
  label(ctx, 'g', pGapTop.sx + 118, pGapTop.sy + 38, 'left', 17, css('--muted', '#91a0ad'));

  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = css('--muted-2', '#647583');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pGapTop.sx - 56, pGapTop.sy + 3);
  ctx.lineTo(pGapMag.sx - 56, pGapMag.sy - 3);
  ctx.stroke();
  ctx.setLineDash([]);
  label(ctx, `${fmt(experiment.magnetGapMm, 2)} mm gap`, pGapMag.sx - 60, (pGapTop.sy + pGapMag.sy) / 2, 'right', 14, css('--muted', '#91a0ad'));

  const leftPanelW = Math.min(320, Math.max(220, w * 0.27));
  const rightPanelW = Math.min(230, Math.max(175, w * 0.18));
  drawInfoPanel(ctx, 20, 18, leftPanelW, stateLabel.toUpperCase(), [
    `Bgap ${fmt(levitation.gapFieldT, 3)} T | gap ${fmt(experiment.magnetGapMm, 2)} mm`,
    `shielding ${fmt(levitation.shielding * 100, 1)}% | pinning ${fmt(levitation.pinning, 2)}`,
    `GL ${fields.type.toUpperCase()} | Bc2 ${fmt(fields.bc2T, 2)} T`,
    `order amplitude ${fmt(orderAmplitude, 3)}`
  ], phaseColor);
  drawCallout(ctx, w - rightPanelW - 20, 18, 'Vortex spacing', Number.isFinite(vortexSpacingM) ? `${fmt(vortexSpacingM * 1e9, 1)} nm` : 'N/A', css('--warning', '#ffcc66'));
  drawCallout(ctx, w - rightPanelW - 20, 74, 'Mean internal field', `${fmt(avgB, 3)} T`, fieldColor);
  drawCallout(ctx, 20, h - 72, 'Heuristic levitation force', formatForce(levitation.forceN), phaseColor);

  const footer = '3-D scene is qualitative. Field lines, levitation force, and labels are interpretive engineering views.';
  label(ctx, footer, 22, h - 23, 'left', 13, css('--muted-2', '#647583'));
  label(ctx, 'Drag to orbit | wheel to zoom | double-click to reset camera', w - 20, h - 23, 'right', 13, css('--muted-2', '#647583'));
}

export function renderFieldScene(canvas, { profile, phase, BappT, halfWidthM, fields, stateLabel, magnetizationApm, fullPenetrationT }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const pad = Math.max(28, w * 0.055);
  const sx = pad;
  const sy = h * 0.18;
  const sw = w - 2 * pad;
  const sh = h * 0.48;

  const fieldColor = css('--field', '#61d7ff');
  ctx.strokeStyle = fieldColor;
  ctx.globalAlpha = 0.14;
  ctx.lineWidth = 1;
  const lineStep = Math.max(18, sw / 26);
  for (let x = sx % lineStep; x < w; x += lineStep) {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.lineTo(x, h - 18);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  roundedRect(ctx, sx, sy, sw, sh, 14);
  const sampleGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
  sampleGrad.addColorStop(0, css('--sample-top', '#152733'));
  sampleGrad.addColorStop(1, css('--sample-bottom', '#0d1b24'));
  ctx.fillStyle = sampleGrad;
  ctx.fill();
  ctx.strokeStyle = css('--border-strong', '#355263');
  ctx.lineWidth = 1.25;
  ctx.stroke();

  const layerY = sy + sh * 0.68;
  ctx.fillStyle = 'rgba(173, 217, 255, 0.10)';
  roundedRect(ctx, sx + 18, layerY, sw - 36, 16, 8);
  ctx.fill();
  label(ctx, 'sample cross-section', sx + sw - 18, layerY - 12, 'right', 13);

  const maxB = Math.max(1e-12, Math.abs(BappT), ...profile.map((p) => Math.abs(p.bT)));
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
    const dir = p.bT >= 0 ? 1 : -1;
    const ay = sy + sh * 0.46;
    ctx.beginPath();
    ctx.moveTo(x, ay + dir * 7);
    ctx.lineTo(x - 3.5, ay);
    ctx.lineTo(x + 3.5, ay);
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const stateColor = phase === 'normal' ? css('--danger', '#ff756d') : phase === 'mixed' ? css('--warning', '#ffcc66') : css('--success', '#65e0ad');
  ctx.fillStyle = stateColor;
  ctx.globalAlpha = 0.08;
  roundedRect(ctx, sx + sw * 0.33, sy + sh * 0.34, sw * 0.34, sh * 0.32, 12);
  ctx.fill();
  ctx.globalAlpha = 1;
  label(ctx, stateLabel.toUpperCase(), sx + sw / 2, sy + sh / 2, 'center', Math.min(20, Math.max(15, w / 42)), stateColor);

  const py = sy + sh + 42;
  const ph = Math.max(48, h - py - 28);
  const zeroY = py + ph / 2;
  ctx.strokeStyle = css('--grid', '#243440');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx, zeroY);
  ctx.lineTo(sx + sw, zeroY);
  ctx.stroke();
  const plotMax = maxB;
  ctx.strokeStyle = fieldColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  profile.forEach((p, i) => {
    const xNorm = (p.xM + halfWidthM) / (2 * halfWidthM || 1);
    const x = sx + xNorm * sw;
    const y = zeroY - (p.bT / plotMax) * (ph * 0.42);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  label(ctx, `B(x) - Bapp ${fmt(BappT)} T`, sx, py - 10, 'left', 15);
  label(ctx, `M ${fmt(magnetizationApm)} A/m - Bp ${fmt(fullPenetrationT)} T - Bc1 ${fmt(fields.bc1T)} T`, sx + sw, py - 10, 'right', 15);
  label(ctx, `-${fmt(halfWidthM * 1e3, 2)} mm`, sx, py + ph + 10, 'left', 16);
  label(ctx, `+${fmt(halfWidthM * 1e3, 2)} mm`, sx + sw, py + ph + 10, 'right', 16);
}

export function renderVortexScene(canvas, { BavgT, fovUm, xiM, phase, orderAmplitude }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const pad = Math.max(28, Math.min(w, h) * 0.08);
  const size = Math.min(w - 2 * pad, h - 2 * pad);
  const x0 = (w - size) / 2;
  const y0 = (h - size) / 2;
  roundedRect(ctx, x0, y0, size, size, 14);
  ctx.fillStyle = css('--sample-bottom', '#0d1b24');
  ctx.fill();
  ctx.strokeStyle = css('--border-strong', '#355263');
  ctx.stroke();

  const fovM = Math.max(1e-9, fovUm * 1e-6);
  const spacingM = triangularVortexSpacing(BavgT);
  const density = vortexDensity(BavgT);
  const expected = density * fovM * fovM;
  const stateColor = css('--field', '#61d7ff');
  const signColor = BavgT >= 0 ? stateColor : css('--field-negative', '#ff9e64');

  if (phase !== 'mixed' || !Number.isFinite(spacingM) || expected < 0.03) {
    ctx.globalAlpha = 0.12 + 0.1 * orderAmplitude;
    ctx.fillStyle = css('--success', '#65e0ad');
    roundedRect(ctx, x0 + 2, y0 + 2, size - 4, size - 4, 12);
    ctx.fill();
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
        ctx.beginPath();
        ctx.arc(x, y, corePx * 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = signColor;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.4, corePx * 0.38), 0, Math.PI * 2);
        ctx.fill();
        count++;
      }
    }
    ctx.globalAlpha = 0.05 + 0.08 * orderAmplitude;
    ctx.fillStyle = css('--success', '#65e0ad');
    roundedRect(ctx, x0 + 2, y0 + 2, size - 4, size - 4, 12);
    ctx.fill();
    ctx.globalAlpha = 1;
    label(ctx, `rendered <= ${count} - expected ${fmt(expected, 1)}`, x0 + 10, y0 + size - 14, 'left', 16);
  }

  label(ctx, `${fmt(fovUm, 2)} µm`, x0 + size, y0 + size + 18, 'right', 15);
  label(ctx, `a_triangle ${Number.isFinite(spacingM) ? fmt(spacingM * 1e9, 1) + ' nm' : 'N/A'} - nv ${fmt(density)} m^-2`, x0, y0 - 14, 'left', 15);
  label(ctx, `Phi0 = ${PHI0.toExponential(4)} Wb`, x0 + size, y0 - 14, 'right', 15);
}

export function renderTransportScene(canvas, { Jc, nValue, ec, operatingJ, normalResistivity, normal }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:62, y:28, w:w - 88, h:h - 72 };
  drawAxes(ctx, box, 'J / Jc', 'E [V/m]');
  const xmin = -2;
  const xmax = 1.25;
  const ymin = -12;
  const ymax = 2;
  const mapX = (v) => box.x + (v - xmin) / (xmax - xmin) * box.w;
  const mapY = (v) => box.y + box.h - (v - ymin) / (ymax - ymin) * box.h;
  for (let p = -12; p <= 2; p += 2) {
    const yy = mapY(p);
    ctx.strokeStyle = css('--grid', '#243440');
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(box.x, yy);
    ctx.lineTo(box.x + box.w, yy);
    ctx.stroke();
    ctx.globalAlpha = 1;
    label(ctx, `1e${p}`, box.x - 8, yy, 'right', 14);
  }
  [-2, -1, 0, 1].forEach((p) => label(ctx, `1e${p}`, mapX(p), box.y + box.h + 10, 'center', 14));

  const accent = css('--field', '#61d7ff');
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.3;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= 260; i++) {
    const lx = xmin + (xmax - xmin) * i / 260;
    const ratio = Math.pow(10, lx);
    let E;
    if (normal || !(Jc > 0)) E = normalResistivity * Math.max(1, Jc) * ratio;
    else E = electricFieldFromJ(Jc * ratio, Jc, nValue, ec);
    const ly = Math.log10(Math.max(1e-20, Math.abs(E)));
    if (ly < ymin - 1 || ly > ymax + 1) continue;
    const px = mapX(lx);
    const py = mapY(clamp(ly, ymin, ymax));
    if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const ecLog = Math.log10(ec);
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = css('--warning', '#ffcc66');
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(box.x, mapY(ecLog));
  ctx.lineTo(box.x + box.w, mapY(ecLog));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  label(ctx, 'Ec', box.x + box.w - 4, mapY(ecLog) - 9, 'right', 14, css('--warning', '#ffcc66'));

  if (Jc > 0 && operatingJ > 0) {
    const ratio = operatingJ / Jc;
    const Eop = normal ? normalResistivity * operatingJ : electricFieldFromJ(operatingJ, Jc, nValue, ec);
    const px = mapX(clamp(Math.log10(Math.max(1e-9, ratio)), xmin, xmax));
    const py = mapY(clamp(Math.log10(Math.max(1e-20, Math.abs(Eop))), ymin, ymax));
    ctx.fillStyle = css('--danger', '#ff756d');
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    label(ctx, `op - J/Jc ${fmt(ratio, 2)}`, px + 8, py - 10, 'left', 16, css('--text', '#e8f0f6'));
  }
}

export function renderThermalScene(canvas, { samples, tcK, bathK }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:58, y:28, w:w - 84, h:h - 72 };
  drawAxes(ctx, box, 't [s]', 'T [K]');
  const data = samples && samples.length ? samples : [{ t:0, temperatureK:bathK }];
  const tMin = data[0].t;
  const tMax = Math.max(tMin + 0.1, data[data.length - 1].t);
  let yMin = Math.min(bathK, ...data.map((d) => d.temperatureK));
  let yMax = Math.max(tcK, bathK + 1, ...data.map((d) => d.temperatureK));
  const span = Math.max(1, yMax - yMin);
  yMin = Math.max(0, yMin - 0.08 * span);
  yMax += 0.12 * span;
  const mapX = (v) => box.x + (v - tMin) / (tMax - tMin) * box.w;
  const mapY = (v) => box.y + box.h - (v - yMin) / (yMax - yMin) * box.h;

  const drawRef = (value, text, color) => {
    if (value < yMin || value > yMax) return;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(box.x, mapY(value));
    ctx.lineTo(box.x + box.w, mapY(value));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    label(ctx, text, box.x + box.w - 4, mapY(value) - 9, 'right', 14, color);
  };
  drawRef(tcK, 'Tc', css('--danger', '#ff756d'));
  drawRef(bathK, 'Tbath', css('--field', '#61d7ff'));

  ctx.strokeStyle = css('--warning', '#ffcc66');
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  data.forEach((d, i) => {
    const px = mapX(d.t);
    const py = mapY(d.temperatureK);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.stroke();
  label(ctx, `${fmt(tMax - tMin, 2)} s window`, box.x + box.w, box.y + box.h + 10, 'right', 14);
  label(ctx, `${fmt(yMin, 1)}-${fmt(yMax, 1)} K`, box.x, box.y - 12, 'left', 14);
}

export function renderPhaseScene(canvas, { params, temperatureK, BabsT }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:62, y:30, w:w - 88, h:h - 76 };
  drawAxes(ctx, box, 'T / Tc', 'B [T]');
  const lambda0M = params.lambda0Nm * 1e-9;
  const xi0M = params.xi0Nm * 1e-9;
  const f0 = criticalFields({ lambdaM:lambda0M, xiM:xi0M, T:0, Tc:params.tcK });
  const yMax = Math.max(0.05, Math.min(120, f0.bc2T * 1.12 || f0.bcT * 1.3 || 1));
  const mapX = (t) => box.x + t / 1.08 * box.w;
  const mapY = (b) => box.y + box.h - clamp(b / yMax, 0, 1) * box.h;

  const lines = { bc1:[], bc2:[], bc:[] };
  for (let i = 0; i <= 180; i++) {
    const tr = 0.995 * i / 180;
    const T = tr * params.tcK;
    const l = lambdaAtTemperature(lambda0M, T, params.tcK);
    const x = xiAtTemperature(xi0M, T, params.tcK);
    const f = criticalFields({ lambdaM:l, xiM:x, T, Tc:params.tcK });
    lines.bc1.push([tr, f.bc1T]);
    lines.bc2.push([tr, f.bc2T]);
    lines.bc.push([tr, f.bcT]);
  }
  const draw = (arr, color, width, dash) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    arr.forEach(([tx, b], i) => {
      const px = mapX(tx);
      const py = mapY(b);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };
  if (f0.type === 'type-i' || f0.type === 'borderline') {
    draw(lines.bc, css('--warning', '#ffcc66'), 2.2);
    label(ctx, 'Bc', mapX(0.1), mapY(lines.bc[Math.floor(lines.bc.length * 0.1)][1]) - 10, 'left', 16, css('--warning', '#ffcc66'));
  } else {
    draw(lines.bc2, css('--danger', '#ff756d'), 2.2);
    draw(lines.bc1, css('--field', '#61d7ff'), 1.8, [5, 4]);
    label(ctx, 'Bc2', mapX(0.08), mapY(lines.bc2[Math.floor(lines.bc2.length * 0.08)][1]) - 10, 'left', 16, css('--danger', '#ff756d'));
    label(ctx, 'Bc1', mapX(0.2), mapY(lines.bc1[Math.floor(lines.bc1.length * 0.2)][1]) - 10, 'left', 16, css('--field', '#61d7ff'));
  }
  const tx = clamp(temperatureK / params.tcK, 0, 1.08);
  const px = mapX(tx);
  const py = mapY(BabsT);
  ctx.fillStyle = css('--text', '#e8f0f6');
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
  label(ctx, 'operating point', px + 8, py - 10, 'left', 14, css('--text', '#e8f0f6'));
  label(ctx, `B scale max ${fmt(yMax)} T`, box.x + box.w, box.y - 12, 'right', 14);
}

export function renderLevitationScene(canvas, { experiment, phase, lambdaM, orderAmplitude, jc, BappT }) {
  const { ctx, w, h } = prepare(canvas);
  base(ctx, w, h);
  const box = { x:58, y:28, w:w - 84, h:h - 72 };
  drawAxes(ctx, box, 'gap [mm]', 'Fz [N]');
  const maxGapMm = Math.max(8, experiment.magnetGapMm * 2.8);
  const samples = [];
  let ymax = 0;
  for (let i = 0; i <= 90; i++) {
    const gapMm = 0.2 + (maxGapMm - 0.2) * i / 90;
    const lev = levitationEstimate({
      phase,
      BappT,
      radiusM:experiment.sampleRadiusMm * 1e-3,
      thicknessM:experiment.sampleHeightMm * 1e-3,
      gapM:gapMm * 1e-3,
      magnetRadiusM:experiment.magnetRadiusMm * 1e-3,
      magnetHeightM:experiment.magnetHeightMm * 1e-3,
      lambdaM,
      orderAmplitude,
      jcAm2:jc
    });
    ymax = Math.max(ymax, lev.forceN);
    samples.push({ gapMm, forceN:lev.forceN });
  }
  ymax = Math.max(1e-6, ymax * 1.1);
  const mapX = (v) => box.x + v / maxGapMm * box.w;
  const mapY = (v) => box.y + box.h - v / ymax * box.h;

  for (let i = 0; i <= 4; i++) {
    const yy = box.y + box.h - i / 4 * box.h;
    ctx.strokeStyle = css('--grid', '#243440');
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(box.x, yy);
    ctx.lineTo(box.x + box.w, yy);
    ctx.stroke();
    ctx.globalAlpha = 1;
    label(ctx, fmt(ymax * i / 4, 3), box.x - 8, yy, 'right', 13);
  }
  ctx.strokeStyle = phase === 'normal' ? css('--danger', '#ff756d') : phase === 'mixed' ? css('--warning', '#ffcc66') : css('--success', '#65e0ad');
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  samples.forEach((d, i) => {
    const px = mapX(d.gapMm);
    const py = mapY(d.forceN);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.stroke();

  const current = levitationEstimate({
    phase,
    BappT,
    radiusM:experiment.sampleRadiusMm * 1e-3,
    thicknessM:experiment.sampleHeightMm * 1e-3,
    gapM:experiment.magnetGapMm * 1e-3,
    magnetRadiusM:experiment.magnetRadiusMm * 1e-3,
    magnetHeightM:experiment.magnetHeightMm * 1e-3,
    lambdaM,
    orderAmplitude,
    jcAm2:jc
  });
  const px = mapX(experiment.magnetGapMm);
  const py = mapY(current.forceN);
  ctx.fillStyle = css('--text', '#e8f0f6');
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
  label(ctx, `${fmt(experiment.magnetGapMm, 2)} mm / ${formatForce(current.forceN)}`, px + 8, py - 10, 'left', 14, css('--text', '#e8f0f6'));
  label(ctx, `magnetic pressure approx. p = B^2 / (2mu0) * shielding`, box.x, box.y - 12, 'left', 13, css('--muted', '#91a0ad'));
}
