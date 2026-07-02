#!/usr/bin/env node
// CLI del resolutor de dependencias. La lógica de dominio vive en engine.mjs
// (compartida con la UI); aquí solo hay E/S: leer data/, pintar árbol y resumen.
//
// Uso: node tools/resolve-deps.mjs <objetivo-id|item-id> [inventario.json] [--json]
//   objetivo-id   id de data/objectives.json (o directamente un id de recipes.json)
//   inventario    ruta a un inventario alternativo (default: data/inventory.json)
//   --json        salida JSON (la consumen plan-route.mjs y la UI)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { requisitosDe, resolver, progreso } from './engine.mjs';

export { requisitosDe, resolver, progreso };

const dataPath = (f) => fileURLToPath(new URL(`../data/${f}`, import.meta.url));
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));

export function cargarDatos({ inventarioPath } = {}) {
  return {
    recipes: read(dataPath('recipes.json')),
    objectives: read(dataPath('objectives.json')),
    inventory: read(inventarioPath ?? dataPath('inventory.json')),
  };
}

function pintarNodo(n, items, prefijo = '') {
  const inv = n.inventario > 0 ? ` (inventario cubre ${n.inventario})` : '';
  const estado = n.neto === 0 ? ' ✔' : '';
  const alt = (items.get(n.id).alternativas ?? [])
    .map((a) => a.map((i) => `${i.qty} ${items.get(i.id).nombre}`).join(' + '))
    .join(' | ');
  const altTxt = n.neto > 0 && alt ? ` [alt: ${alt}]` : '';
  console.log(`${prefijo}${n.nombre} ×${n.qty}${inv}${estado}${altTxt}`);
  for (const h of n.hijos) pintarNodo(h, items, prefijo + '  ');
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const [objetivoId, inventarioPath] = args.filter((a) => a !== '--json');
  if (!objetivoId) {
    console.error('Uso: node tools/resolve-deps.mjs <objetivo-id|item-id> [inventario.json] [--json]');
    process.exit(2);
  }
  const datos = cargarDatos({ inventarioPath });
  const res = resolver(objetivoId, datos);
  if (!res) {
    console.error(`✖ "${objetivoId}" no está en objectives.json ni en recipes.json`);
    process.exit(1);
  }
  const avance = progreso(objetivoId, datos);
  if (json) {
    console.log(JSON.stringify({ ...res, avance }, null, 2));
    return;
  }
  const items = new Map(datos.recipes.items.map((i) => [i.id, i]));
  console.log(`# ${res.objetivo.nombre} — avance ${avance.pct}% (${avance.bruto - avance.neto}/${avance.bruto} materiales hoja)\n`);
  for (const n of res.arbol) pintarNodo(n, items);
  const faltantes = Object.entries(res.faltantes_hoja);
  console.log(`\n## Materiales a conseguir (netos)\n`);
  if (faltantes.length === 0) console.log('Nada: el inventario lo cubre todo ✔');
  for (const [id, qty] of faltantes) console.log(`- ${items.get(id).nombre}: ${qty}`);
  if (res.estaciones.length) console.log(`\nEstaciones necesarias: ${res.estaciones.join(', ')}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
