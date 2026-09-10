import { DEFAULT_EC } from './core/constants.js';
import { MATERIAL_PRESETS, TC_BENCHMARKS, MODEL_MATRIX, SOURCE_LINKS, DEFAULT_EXPERIMENT } from './data/materials.js';
import { BeanSlab } from './core/bean.js';
import { QuenchRun, copperThermalConductivity, copperSpecificHeat, copperResistivityWF, currentSharing } from './core/thermal.js';
import {
  lambdaAtTemperature, xiAtTemperature, criticalFields, phaseState, jcEffective,
  londonSlabProfile, triangularVortexSpacing, vortexDensity, orderParameterAmplitude,
  estimateIcA, electricFieldFromJ, allenDynesTc, weakCouplingGapMeV
} from './core/physics.js';
import { renderFieldScene, renderVortexScene, renderTransportScene, renderThermalScene, renderPhaseScene } from './ui/charts.js';
import { t, initLanguage, toggleLanguage, getLanguage } from './ui/i18n.js';

const $ = (id) => document.getElementById(id);
const bean = new BeanSlab(161);
const quench = new QuenchRun();

const state = {
  experiment: cloneParams(DEFAULT_EXPERIMENT),
  params: cloneParams(MATERIAL_PRESETS[0].params),
  presetId: MATERIAL_PRESETS[0].id,
  activeView: 'field',
  beanActivated: false,
  sweepRunning: false,
  sweepDirection: 1,
  pairing: { lambdaEpc:1.0, muStar:0.10, omegaLogK:300 },
  dirty: true,
  lastFrame: (window.performance && typeof window.performance.now === 'function') ? window.performance.now() : Date.now()
};

function preset() {
  return MATERIAL_PRESETS.find(p => p.id === state.presetId) || MATERIAL_PRESETS[0];
}

function cloneParams(p) { return JSON.parse(JSON.stringify(p)); }

function numberOrFallback(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatNumber(v, digits = 3) {
  if (!Number.isFinite(v)) return 'N/A';
  const a = Math.abs(v);
  if ((a > 0 && a < 1e-3) || a >= 1e5) return v.toExponential(2);
  return v.toFixed(digits).replace(/\.?0+$/, '');
}

function formatField(v) {
  const a = Math.abs(v);
  if (!Number.isFinite(v)) return 'N/A';
  if (a < 1e-6) return `${formatNumber(v * 1e9, 2)} nT`;
  if (a < 1e-3) return `${formatNumber(v * 1e6, 2)} µT`;
  if (a < 1) return `${formatNumber(v * 1e3, 2)} mT`;
  return `${formatNumber(v, 3)} T`;
}

function formatLength(m) {
  if (!Number.isFinite(m)) return 'N/A';
  const a = Math.abs(m);
  if (a < 1e-6) return `${formatNumber(m * 1e9, 2)} nm`;
  if (a < 1e-3) return `${formatNumber(m * 1e6, 2)} µm`;
  return `${formatNumber(m * 1e3, 2)} mm`;
}

function formatCurrentDensity(v) {
  if (!Number.isFinite(v)) return 'N/A';
  if (Math.abs(v) >= 1e9) return `${formatNumber(v / 1e9, 3)} GA/m²`;
  if (Math.abs(v) >= 1e6) return `${formatNumber(v / 1e6, 3)} MA/m²`;
  return `${formatNumber(v, 3)} A/m²`;
}

function setText(id, text) { const el = $(id); if (el) el.textContent = text; }

function setValue(id, value) { const el = $(id); if (el) el.value = String(value); }

function updateAllInputs() {
  setValue('materialPreset', state.presetId);
  setValue('temperatureRange', state.experiment.temperatureK);
  setValue('temperatureNumber', state.experiment.temperatureK);
  setValue('fieldRange', Math.max(-2, Math.min(2, state.experiment.appliedFieldT)));
  setValue('fieldNumber', state.experiment.appliedFieldT);
  setValue('angleRange', state.experiment.fieldAngleDeg);
  setValue('angleNumber', state.experiment.fieldAngleDeg);
  setValue('currentRange', Math.max(0, Math.min(500, state.experiment.currentA)));
  setValue('currentNumber', state.experiment.currentA);
  setValue('magneticHalfWidth', state.experiment.magneticHalfWidthMm);
  setValue('fovUm', state.experiment.fieldOfViewUm);
  setValue('widthMm', state.experiment.widthMm);
  setValue('scThicknessUm', state.experiment.scThicknessUm);
  setValue('copperThicknessUm', state.experiment.copperThicknessUm);
  setValue('lengthCm', state.experiment.lengthCm);
  setValue('bathTemperatureK', state.experiment.bathTemperatureK);
  setValue('heatTransfer', state.experiment.heatTransferWm2K);
  setValue('sweepAmplitude', state.experiment.sweepAmplitudeT);
  setValue('sweepRate', state.experiment.sweepRateTPerS);
  setValue('modelMode', state.experiment.modelMode);
  setValue('paramTc', state.params.tcK);
  setValue('paramLambda', state.params.lambda0Nm);
  setValue('paramXi', state.params.xi0Nm);
  setValue('paramJc0', state.params.jc0Am2);
  setValue('paramB0', state.params.jcB0T);
  setValue('paramN', state.params.nValue);
  setValue('paramGamma', state.params.anisotropyGamma);
  setValue('paramRhoNormal', state.params.normalResistivityOhmM);
  setValue('paramCpSc', state.params.cpScJkgK);
  setValue('pairLambda', state.pairing.lambdaEpc);
  setValue('pairMu', state.pairing.muStar);
  setValue('pairOmega', state.pairing.omegaLogK);
}

function loadPreset(id) {
  const p = MATERIAL_PRESETS.find(x => x.id === id) || MATERIAL_PRESETS[0];
  state.presetId = p.id;
  state.params = cloneParams(p.params);
  state.experiment.temperatureK = Math.min(state.params.tcK * 0.84, p.id.startsWith('nb') ? 4.2 : 77);
  state.experiment.bathTemperatureK = state.experiment.temperatureK;
  state.beanActivated = false;
  bean.reset(0);
  quench.reset(state.experiment.temperatureK);
  updateAllInputs();
  state.dirty = true;
}

function geometry() {
  return {
    widthM: Math.max(1e-9, state.experiment.widthMm * 1e-3),
    scThicknessM: Math.max(1e-12, state.experiment.scThicknessUm * 1e-6),
    copperThicknessM: Math.max(0, state.experiment.copperThicknessUm * 1e-6),
    lengthM: Math.max(1e-6, state.experiment.lengthCm * 1e-2)
  };
}

function computeSnapshot() {
  const T = state.experiment.temperatureK;
  const B = state.experiment.appliedFieldT;
  const Babs = Math.abs(B);
  const lambdaM = lambdaAtTemperature(state.params.lambda0Nm * 1e-9, T, state.params.tcK);
  const xiM = xiAtTemperature(state.params.xi0Nm * 1e-9, T, state.params.tcK);
  const fields = criticalFields({ lambdaM, xiM, T, Tc:state.params.tcK });
  const equilibriumPhase = phaseState({ T, Tc:state.params.tcK, BabsT:Babs, fields });
  const jc = jcEffective(state.params, T, Babs, state.experiment.fieldAngleDeg);
  const halfWidthM = Math.max(1e-9, state.experiment.magneticHalfWidthMm * 1e-3);

  if (equilibriumPhase === 'mixed') state.beanActivated = true;
  if (equilibriumPhase === 'normal') {
    bean.reset(B);
    state.beanActivated = false;
  }

  let profile;
  let phase = equilibriumPhase;
  const mode = state.experiment.modelMode;
  const useBean = mode === 'bean' || (mode === 'hybrid' && (state.beanActivated || equilibriumPhase === 'mixed'));
  if (equilibriumPhase === 'normal') {
    profile = londonSlabProfile(B, halfWidthM, Infinity, 161);
  } else if (useBean) {
    profile = bean.update(B, jc, halfWidthM);
    if (equilibriumPhase === 'meissner' && Math.abs(bean.averageB()) > Math.max(1e-9, 0.01 * Math.abs(B || fields.bc1T || 1))) phase = 'mixed';
  } else {
    profile = londonSlabProfile(B, halfWidthM, lambdaM, 161);
    bean.reset(0);
  }

  const avgB = profile.reduce((s,p)=>s+p.bT,0) / Math.max(1, profile.length);
  const g = geometry();
  const icA = estimateIcA(jc, g.widthM, g.scThicknessM);
  const jOp = state.experiment.currentA / Math.max(1e-18, g.widthM * g.scThicknessM);
  const eOp = phase === 'normal' ? state.params.normalResistivityOhmM * jOp : (jc > 0 ? electricFieldFromJ(jOp, jc, state.params.nValue, DEFAULT_EC) : Infinity);
  const sharing = currentSharing({ currentA:state.experiment.currentA, T, BabsT:Babs, angleDeg:state.experiment.fieldAngleDeg, params:state.params, geometry:g, rrr:state.experiment.copperRrr });
  const cuT = Math.max(4, Math.min(300, T));

  return {
    T, B, Babs, lambdaM, xiM, fields, equilibriumPhase, phase, jc, halfWidthM, profile, avgB,
    icA, jOp, eOp, sharing, geometry:g,
    orderAmplitude: orderParameterAmplitude(T, state.params.tcK),
    vortexDensity: vortexDensity(avgB),
    vortexSpacingM: triangularVortexSpacing(avgB),
    magnetizationApm: useBean ? bean.magnetizationApm() : (avgB - B) / (4e-7 * Math.PI),
    fullPenetrationT: useBean ? bean.fullPenetrationFieldT() : 0,
    cuK: copperThermalConductivity(cuT, state.experiment.copperRrr),
    cuCp: copperSpecificHeat(cuT),
    cuRho: copperResistivityWF(cuT, state.experiment.copperRrr)
  };
}

function phaseLabel(phase) { return t(phase); }
function typeLabel(type) { return t(type); }

function renderMetrics(s) {
  setText('metricPhase', phaseLabel(s.phase));
  setText('metricType', typeLabel(s.fields.type));
  setText('metricKappa', formatNumber(s.fields.kappa, 4));
  setText('metricLambda', formatLength(s.lambdaM));
  setText('metricXi', formatLength(s.xiM));
  setText('metricBc1', formatField(s.fields.bc1T));
  setText('metricBc', formatField(s.fields.bcT));
  setText('metricBc2', formatField(s.fields.bc2T));
  setText('metricPsi', formatNumber(s.orderAmplitude, 3));
  setText('metricJc', formatCurrentDensity(s.jc));
  setText('metricIc', `${formatNumber(s.icA, 2)} A`);
  setText('metricE', Number.isFinite(s.eOp) ? `${formatNumber(s.eOp, 3)} V/m` : '∞');
  setText('metricM', `${formatNumber(s.magnetizationApm, 2)} A/m`);
  setText('metricBp', formatField(s.fullPenetrationT));
  setText('metricVortexSpacing', formatLength(s.vortexSpacingM));
  setText('metricVortexDensity', `${formatNumber(s.vortexDensity, 3)} m⁻²`);
  setText('metricCuK', `${formatNumber(s.cuK, 3)} W/(m·K)`);
  setText('metricCuCp', `${formatNumber(s.cuCp, 3)} J/(kg·K)`);
  setText('metricCuRho', `${formatNumber(s.cuRho, 3)} Ω·m`);

  const q = quench.last;
  setText('metricQuenchTime', `${formatNumber(quench.timeS, 3)} s`);
  setText('metricQuenchTemp', `${formatNumber(quench.temperatureK, 3)} K`);
  setText('metricQuenchPower', q ? `${formatNumber(q.pPerLengthWm, 3)} W/m` : '0 W/m');
  setText('metricCurrentShare', q ? `SC ${formatNumber(q.iScA,1)} A · Cu ${formatNumber(q.iCuA,1)} A` : 'N/A');

  const p = preset();
  const badge = $('calibrationBadge');
  badge.textContent = p.calibrationReady ? t('statusReady') : t('statusNotReady');
  badge.dataset.ready = p.calibrationReady ? 'true' : 'false';
  const prov = $('provenanceList');
  prov.innerHTML = '';
  const entries = Object.entries(state.params.provenance || {});
  entries.forEach(([key, value]) => {
    const row = document.createElement('div'); row.className = 'prov-row';
    const k = document.createElement('span'); k.textContent = key;
    const v = document.createElement('span'); v.textContent = value;
    row.append(k,v); prov.append(row);
  });
  const missing = $('missingList'); missing.innerHTML = '';
  (p.missing || []).forEach(item => { const li = document.createElement('li'); li.textContent = item; missing.append(li); });
}

function renderMain(s) {
  const main = $('mainCanvas');
  const pair = $('pairingPanel');
  pair.hidden = state.activeView !== 'pairing';
  main.hidden = state.activeView === 'pairing';
  document.querySelectorAll('.view-tab').forEach(el => el.classList.toggle('active', el.dataset.view === state.activeView));
  const hintKey = `${state.activeView}Hint`;
  setText('viewHint', t(hintKey));

  if (state.activeView === 'field') {
    renderFieldScene(main, {
      profile:s.profile, phase:s.phase, BappT:s.B, halfWidthM:s.halfWidthM, fields:s.fields,
      stateLabel:phaseLabel(s.phase), magnetizationApm:s.magnetizationApm, fullPenetrationT:s.fullPenetrationT
    });
  } else if (state.activeView === 'vortices') {
    renderVortexScene(main, { BavgT:s.avgB, fovUm:state.experiment.fieldOfViewUm, xiM:s.xiM, phase:s.phase, orderAmplitude:s.orderAmplitude });
  } else if (state.activeView === 'transport') {
    renderTransportScene(main, { Jc:s.jc, nValue:state.params.nValue, ec:DEFAULT_EC, operatingJ:Math.abs(s.jOp), normalResistivity:state.params.normalResistivityOhmM, normal:s.phase==='normal' });
  } else if (state.activeView === 'quench') {
    renderThermalScene(main, { samples:quench.samples, tcK:state.params.tcK, bathK:state.experiment.bathTemperatureK });
  }
}

function renderPairing() {
  const tc = allenDynesTc(state.pairing.lambdaEpc, state.pairing.muStar, state.pairing.omegaLogK);
  setText('pairTcResult', Number.isFinite(tc) ? `${formatNumber(tc, 3)} K` : 'N/A');
  setText('pairGapResult', Number.isFinite(tc) ? `${formatNumber(weakCouplingGapMeV(tc), 3)} meV` : 'N/A');
}

function renderMiniCharts(s) {
  renderPhaseScene($('phaseCanvas'), { params:state.params, temperatureK:s.T, BabsT:s.Babs });
  renderTransportScene($('transportCanvas'), { Jc:s.jc, nValue:state.params.nValue, ec:DEFAULT_EC, operatingJ:Math.abs(s.jOp), normalResistivity:state.params.normalResistivityOhmM, normal:s.phase==='normal' });
  renderThermalScene($('thermalCanvas'), { samples:quench.samples, tcK:state.params.tcK, bathK:state.experiment.bathTemperatureK });
}

function render() {
  const s = computeSnapshot();
  renderMain(s); renderMetrics(s); renderPairing(); renderMiniCharts(s);
  setText('materialName', getLanguage()==='ko' ? preset().nameKo : preset().nameEn);
  setText('operatingSummary', `T ${formatNumber(s.T,2)} K · B ${formatField(s.B)} · I ${formatNumber(state.experiment.currentA,1)} A`);
  const phasePill = $('phasePill'); phasePill.textContent = phaseLabel(s.phase); phasePill.dataset.phase = s.phase;
  const sweepBtn = $('sweepToggle'); sweepBtn.textContent = state.sweepRunning ? t('sweepStop') : t('sweepStart');
  const qBtn = $('quenchToggle'); qBtn.textContent = quench.running ? t('pauseQuench') : t('startQuench');
  state.dirty = false;
}

function bindRangeNumber(rangeId, numberId, getter, setter) {
  const r = $(rangeId), n = $(numberId);
  const apply = (source) => {
    const val = numberOrFallback(source.value, getter());
    setter(val);
    if (source === r && n) n.value = String(val);
    if (source === n && r) r.value = String(Math.max(numberOrFallback(r.min,-Infinity), Math.min(numberOrFallback(r.max,Infinity), val)));
    state.dirty = true;
  };
  if (r) r.addEventListener('input', () => apply(r));
  if (n) n.addEventListener('input', () => apply(n));
}

function bindNumber(id, getter, setter) {
  const el = $(id);
  if (el) el.addEventListener('input', e => { setter(numberOrFallback(e.target.value, getter())); state.dirty = true; });
}

function bindUI() {
  $('languageToggle').addEventListener('click', toggleLanguage);
  $('materialPreset').addEventListener('change', e => loadPreset(e.target.value));
  $('tcOverride').addEventListener('change', e => {
    const row = TC_BENCHMARKS.find(x => x.formula === e.target.value && x.status !== 'quarantined');
    if (row) {
      state.params.tcK = row.tcExp;
      state.params.provenance = { ...(state.params.provenance || {}), tcK:`repository JARVIS-2022 benchmark: ${row.formula} ${row.tcExp} K` };
      setValue('paramTc', state.params.tcK);
      state.dirty = true;
    }
  });

  bindRangeNumber('temperatureRange','temperatureNumber',()=>state.experiment.temperatureK,v=>state.experiment.temperatureK=Math.max(0.01,v));
  bindRangeNumber('fieldRange','fieldNumber',()=>state.experiment.appliedFieldT,v=>state.experiment.appliedFieldT=v);
  bindRangeNumber('angleRange','angleNumber',()=>state.experiment.fieldAngleDeg,v=>state.experiment.fieldAngleDeg=Math.max(0,Math.min(90,v)));
  bindRangeNumber('currentRange','currentNumber',()=>state.experiment.currentA,v=>state.experiment.currentA=Math.max(0,v));

  bindNumber('magneticHalfWidth',()=>state.experiment.magneticHalfWidthMm,v=>state.experiment.magneticHalfWidthMm=Math.max(0.0001,v));
  bindNumber('fovUm',()=>state.experiment.fieldOfViewUm,v=>state.experiment.fieldOfViewUm=Math.max(0.05,v));
  bindNumber('widthMm',()=>state.experiment.widthMm,v=>state.experiment.widthMm=Math.max(0.001,v));
  bindNumber('scThicknessUm',()=>state.experiment.scThicknessUm,v=>state.experiment.scThicknessUm=Math.max(0.001,v));
  bindNumber('copperThicknessUm',()=>state.experiment.copperThicknessUm,v=>state.experiment.copperThicknessUm=Math.max(0,v));
  bindNumber('lengthCm',()=>state.experiment.lengthCm,v=>state.experiment.lengthCm=Math.max(0.001,v));
  bindNumber('bathTemperatureK',()=>state.experiment.bathTemperatureK,v=>state.experiment.bathTemperatureK=Math.max(0.01,v));
  bindNumber('heatTransfer',()=>state.experiment.heatTransferWm2K,v=>state.experiment.heatTransferWm2K=Math.max(0,v));
  bindNumber('sweepAmplitude',()=>state.experiment.sweepAmplitudeT,v=>state.experiment.sweepAmplitudeT=Math.max(0.001,Math.abs(v)));
  bindNumber('sweepRate',()=>state.experiment.sweepRateTPerS,v=>state.experiment.sweepRateTPerS=Math.max(0.0001,Math.abs(v)));

  $('modelMode').addEventListener('change', e => { state.experiment.modelMode=e.target.value; state.beanActivated=false; bean.reset(0); state.dirty=true; });
  $('sweepToggle').addEventListener('click', () => { state.sweepRunning=!state.sweepRunning; state.dirty=true; });
  $('resetFlux').addEventListener('click', () => { state.beanActivated=false; bean.reset(0); state.dirty=true; });

  bindNumber('paramTc',()=>state.params.tcK,v=>state.params.tcK=Math.max(0.01,v));
  bindNumber('paramLambda',()=>state.params.lambda0Nm,v=>state.params.lambda0Nm=Math.max(0.001,v));
  bindNumber('paramXi',()=>state.params.xi0Nm,v=>state.params.xi0Nm=Math.max(0.001,v));
  bindNumber('paramJc0',()=>state.params.jc0Am2,v=>state.params.jc0Am2=Math.max(0,v));
  bindNumber('paramB0',()=>state.params.jcB0T,v=>state.params.jcB0T=Math.max(1e-9,v));
  bindNumber('paramN',()=>state.params.nValue,v=>state.params.nValue=Math.max(1,v));
  bindNumber('paramGamma',()=>state.params.anisotropyGamma,v=>state.params.anisotropyGamma=Math.max(1,v));
  bindNumber('paramRhoNormal',()=>state.params.normalResistivityOhmM,v=>state.params.normalResistivityOhmM=Math.max(1e-12,v));
  bindNumber('paramCpSc',()=>state.params.cpScJkgK,v=>state.params.cpScJkgK=Math.max(1,v));

  bindNumber('pairLambda',()=>state.pairing.lambdaEpc,v=>state.pairing.lambdaEpc=Math.max(0.001,v));
  bindNumber('pairMu',()=>state.pairing.muStar,v=>state.pairing.muStar=Math.max(0,v));
  bindNumber('pairOmega',()=>state.pairing.omegaLogK,v=>state.pairing.omegaLogK=Math.max(0.001,v));

  document.querySelectorAll('.view-tab').forEach(btn => btn.addEventListener('click', () => { state.activeView=btn.dataset.view; state.dirty=true; }));
  $('quenchToggle').addEventListener('click', () => { quench.running=!quench.running; state.dirty=true; });
  $('quenchReset').addEventListener('click', () => { quench.reset(state.experiment.temperatureK); state.dirty=true; });
  $('dataLimitsBtn').addEventListener('click', openDataDialog);
  $('dialogClose').addEventListener('click', closeDataDialog);
  $('exportState').addEventListener('click', exportState);
  $('importState').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', importStateFile);
  window.addEventListener('languagechange', () => { populateStaticSelects(); populateDataDialog(); state.dirty=true; });
  if (typeof window.ResizeObserver === 'function') {
    const ro = new ResizeObserver(() => { state.dirty = true; });
    document.querySelectorAll('canvas').forEach(c => ro.observe(c));
  } else {
    window.addEventListener('resize', () => { state.dirty = true; });
    window.addEventListener('orientationchange', () => { state.dirty = true; });
  }
}

function populateStaticSelects() {
  const mat = $('materialPreset');
  const currentMat = state.presetId;
  mat.innerHTML = MATERIAL_PRESETS.map(p => `<option value="${p.id}">${getLanguage()==='ko'?p.nameKo:p.nameEn}</option>`).join('');
  mat.value = currentMat;
  const tc = $('tcOverride');
  const currentTc = tc.value;
  tc.innerHTML = `<option value="">${t('noOverride')}</option>` + TC_BENCHMARKS.filter(r=>r.status!=='quarantined').map(r=>`<option value="${r.formula}">${r.formula} · ${r.tcExp} K</option>`).join('');
  if (Array.prototype.some.call(tc.options, o => o.value === currentTc)) tc.value=currentTc;
}

function populateDataDialog() {
  const sources = $('sourceCards');
  if (!sources) return;
  sources.innerHTML = Object.values(SOURCE_LINKS).map(s => `
    <a class="source-card" href="${s.url}" target="_blank" rel="noopener noreferrer">
      <strong>${s.id}</strong><span>${s.title}</span><small>${getLanguage()==='ko'?s.noteKo:s.noteEn}</small>
    </a>`).join('');
  $('benchmarkBody').innerHTML = TC_BENCHMARKS.map(r => `
    <tr class="${r.status==='quarantined'?'quarantined':''}">
      <td>${r.formula}</td><td>${valueOrNA(r.sg)}</td><td>${valueOrNA(r.jarvis)}</td><td>${valueOrNA(r.tcExp)}</td><td>${valueOrNA(r.tcScdft)}</td><td>${valueOrNA(r.tcLm)}</td><td>${valueOrNA(r.tcJscr)}</td><td>${r.pressurePa ? formatNumber(r.pressurePa/1e9,0)+' GPa' : 'N/A'}</td><td>${r.status}</td>
    </tr>`).join('');
  $('modelMatrixBody').innerHTML = MODEL_MATRIX.map(m => `
    <tr><td>${m.id}</td><td>${m.priority}</td><td>${getLanguage()==='ko'?m.ko:m.en}</td><td>${m.model}</td></tr>`).join('');
}

function valueOrNA(value) {
  return value === null || typeof value === 'undefined' ? 'N/A' : value;
}

function closeDataDialog() {
  const d = $('dataDialog');
  if (!d) return;
  if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
}

function readFileText(file) {
  if (file && typeof file.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Unable to read file'));
    reader.readAsText(file);
  });
}

function openDataDialog() {
  populateDataDialog();
  const d = $('dataDialog');
  if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open','');
}

function exportState() {
  const payload = {
    schema_version:'superconductor-sim-state/0.1.1',
    exported_at:new Date().toISOString(),
    source_repository:SOURCE_LINKS.researchRepo.url,
    preset_id:state.presetId,
    calibration_ready:false,
    experiment:state.experiment,
    material_parameters:state.params,
    pairing_estimator:state.pairing,
    warnings:[
      'This file is a simulator state, not a sample-calibrated material card.',
      'Fields marked as assumptions must not be reclassified as measurements.'
    ]
  };
  const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='superconductor-sim-state.json'; a.click(); URL.revokeObjectURL(a.href);
}

async function importStateFile(e) {
  const file = e.target.files && e.target.files[0]; if (!file) return;
  try {
    const obj = JSON.parse(await readFileText(file));
    if (obj.preset_id && MATERIAL_PRESETS.some(p=>p.id===obj.preset_id)) state.presetId=obj.preset_id;
    if (obj.experiment && typeof obj.experiment==='object') state.experiment=Object.assign({}, state.experiment, obj.experiment);
    if (obj.material_parameters && typeof obj.material_parameters==='object') state.params=Object.assign({}, state.params, obj.material_parameters);
    if (obj.pairing_estimator && typeof obj.pairing_estimator==='object') state.pairing=Object.assign({}, state.pairing, obj.pairing_estimator);
    state.beanActivated=false; bean.reset(0); quench.reset(state.experiment.temperatureK); updateAllInputs(); state.dirty=true;
  } catch (err) {
    console.error(err); alert('Invalid Superconductor Sim JSON');
  } finally { e.target.value=''; }
}

function animationFrame(now) {
  const realDt = Math.min(0.05, Math.max(0, (now - state.lastFrame) / 1000));
  state.lastFrame = now;
  if (state.sweepRunning) {
    const amp = Math.max(0.001, state.experiment.sweepAmplitudeT);
    let B = state.experiment.appliedFieldT + state.sweepDirection * state.experiment.sweepRateTPerS * realDt;
    if (B >= amp) { B=amp; state.sweepDirection=-1; }
    if (B <= -amp) { B=-amp; state.sweepDirection=1; }
    state.experiment.appliedFieldT=B;
    setValue('fieldNumber', B.toFixed(6));
    setValue('fieldRange', Math.max(-2,Math.min(2,B)));
    state.dirty=true;
  }
  if (quench.running) {
    const inputs = {
      currentA:state.experiment.currentA,
      appliedFieldT:state.experiment.appliedFieldT,
      fieldAngleDeg:state.experiment.fieldAngleDeg,
      params:state.params,
      geometry:geometry(),
      copperRrr:state.experiment.copperRrr,
      bathTemperatureK:state.experiment.bathTemperatureK,
      heatTransferWm2K:state.experiment.heatTransferWm2K
    };
    // Fixed integration step; several steps per frame for deterministic browser behavior.
    for (let i=0;i<6;i++) quench.step(inputs,0.003);
    if (quench.temperatureK > 500 || quench.timeS > 30) quench.running=false;
    state.dirty=true;
  }
  if (state.dirty) render();
  requestAnimationFrame(animationFrame);
}

function init() {
  initLanguage();
  populateStaticSelects();
  bindUI();
  updateAllInputs();
  quench.reset(state.experiment.temperatureK);
  populateDataDialog();
  render();
  requestAnimationFrame(animationFrame);
}

init();
