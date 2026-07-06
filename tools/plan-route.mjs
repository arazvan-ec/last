#!/usr/bin/env node
// CLI de la ruta de farmeo. La lógica vive en engine.mjs (planificarRuta);
// aquí solo hay E/S: leer data/, pintar markdown o JSON.
//
// Uso: node tools/plan-route.mjs <objetivo-id|item-id> [inventario.json] [--json]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { planificarRuta } from './engine.mjs';
import { cargarDatos } from './resolve-deps.mjs';

export { planificarRuta };

const dataPath = (f) => fileURLToPath(new URL(`../data/${f}`, import.meta.url));

function pintarMarkdown(plan) {
  const lineas = [`# Ruta de farmeo — ${plan.objetivo.nombre}`, ''];
  if (plan.ruta.length === 0) {
    lineas.push('Nada que farmear: el inventario lo cubre todo ✔');
  }
  for (const [i, zona] of plan.ruta.entries()) {
    const energia = zona.energia != null ? ` (energía: ${zona.energia})` : '';
    lineas.push(`## ${i + 1}. ${zona.lugar}${energia}`, '');
    for (const it of zona.items) {
      const detalle = it.detalle ? ` — ${it.detalle}` : '';
      const alt = it.alternativas.length ? ` (también en: ${it.alternativas.join('; ')})` : '';
      lineas.push(`- ${it.nombre}: **${it.qty}**${detalle}${alt}`);
    }
    lineas.push('');
  }
  if (plan.estaciones.length)
    lineas.push(`De vuelta en base — estaciones: ${plan.estaciones.join(', ')}`);
  return lineas.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const [objetivoId, inventarioPath] = args.filter((a) => a !== '--json');
  if (!objetivoId) {
    console.error('Uso: node tools/plan-route.mjs <objetivo-id|item-id> [inventario.json] [--json]');
    process.exit(2);
  }
  const datos = cargarDatos({ inventarioPath });
  const sources = JSON.parse(readFileSync(dataPath('sources.json'), 'utf8'));
  const plan = planificarRuta(objetivoId, datos, sources);
  if (!plan) {
    console.error(`✖ "${objetivoId}" no está en objectives.json ni en recipes.json`);
    process.exit(1);
  }
  console.log(json ? JSON.stringify(plan, null, 2) : pintarMarkdown(plan));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
