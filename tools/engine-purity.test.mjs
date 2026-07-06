import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Garantía de paridad CLI↔UI: ui/index.html importa engine.mjs directamente en
// el navegador, así que el motor no puede depender de APIs de Node. Los datos
// entran siempre por parámetro (ver cabecera de engine.mjs).
const src = readFileSync(fileURLToPath(new URL('./engine.mjs', import.meta.url)), 'utf8');

test('engine.mjs es puro: sin builtins de Node ni require()', () => {
  const imports = [...src.matchAll(/^\s*import\b[^'"]*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
  const noRelativos = imports.filter((e) => !e.startsWith('./') && !e.startsWith('../'));
  assert.deepEqual(noRelativos, [], `imports no cargables en navegador: ${noRelativos.join(', ')}`);
  assert.ok(!/\brequire\s*\(/.test(src), 'engine.mjs no debe usar require()');
});

test('engine.mjs no toca fs, process ni fetch (datos solo por parámetro)', () => {
  for (const api of ['readFileSync', 'process.', 'fetch(']) {
    assert.ok(!src.includes(api), `engine.mjs no debe usar ${api}`);
  }
});
