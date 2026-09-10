import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const files = [
  'js/core/constants.js',
  'js/data/materials.js',
  'js/core/bean.js',
  'js/core/physics.js',
  'js/core/thermal.js',
  'js/ui/i18n.js',
  'js/ui/charts.js',
  'js/app.js'
];

function stripModuleSyntax(source) {
  const lines = source.split(/\r?\n/);
  const out = [];
  let skippingImport = false;
  for (const line of lines) {
    if (!skippingImport && /^\s*import\b/.test(line)) {
      skippingImport = !/;\s*$/.test(line);
      continue;
    }
    if (skippingImport) {
      if (/;\s*$/.test(line)) skippingImport = false;
      continue;
    }
    out.push(line.replace(/^(\s*)export\s+/, '$1'));
  }
  return out.join('\n');
}

const banner = `/* Superconductor Sim compatibility bundle.\n * Generated from split source modules by scripts/build-compat.mjs.\n * No external bundler or dependency is required.\n */\n(function () {\n'use strict';\n`;
const body = files.map((rel) => `\n/* ---- ${rel} ---- */\n${stripModuleSyntax(fs.readFileSync(path.join(root, rel), 'utf8'))}`).join('\n');
const footer = '\n})();\n';
fs.writeFileSync(path.join(root, 'js/app.bundle.js'), banner + body + footer, 'utf8');
console.log('Wrote js/app.bundle.js');
