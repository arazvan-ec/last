#!/usr/bin/env node
// Ruta de farmeo: toma los faltantes netos de resolve-deps y los agrupa por la
// mejor fuente (prioridad 1) de sources.json. Las zonas se ordenan por nº de
// items distintos que resuelven y, a igualdad, por energía si la fuente la
// declara (campo opcional `energia`; sin dato va al final del empate).
//
// Uso: node tools/plan-route.mjs <objetivo-id|item-id> [inventario.json] [--json]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cargarDatos, resolver } from './resolve-deps.mjs';

const dataPath = (f) => fileURLToPath(new URL(`../data/${f}`, import.meta.url));

export function planificarRuta(objetivoId, datos, sources) {
  const res = resolver(objetivoId, datos);
  if (!res) return null;

  const zonas = new Map(); // lugar → { lugar, energia?, items: [{id, nombre, qty, detalle?, alternativas}] }
  const items = new Map(datos.recipes.items.map((i) => [i.id, i]));

  for (const [id, qty] of Object.entries(res.faltantes_hoja)) {
    const fuentes = sources.materiales[id]?.fuentes ?? [];
    const mejor = [...fuentes].sort((a, b) => a.prioridad - b.prioridad)[0] ??
      { lugar: 'por investigar', prioridad: 99 };
    if (!zonas.has(mejor.lugar))
      zonas.set(mejor.lugar, { lugar: mejor.lugar, energia: mejor.energia ?? null, items: [] });
    zonas.get(mejor.lugar).items.push({
      id,
      nombre: items.get(id).nombre,
      qty,
      detalle: mejor.detalle ?? null,
      alternativas: fuentes.filter((f) => f !== mejor).map((f) => f.lugar),
    });
  }

  const ruta = [...zonas.values()].sort(
    (a, b) => b.items.length - a.items.length || (a.energia ?? Infinity) - (b.energia ?? Infinity)
  );
  return { objetivo: res.objetivo, ruta, crafteos: res.crafteos, estaciones: res.estaciones };
}

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
