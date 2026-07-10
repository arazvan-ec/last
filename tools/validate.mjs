#!/usr/bin/env node
// Valida los ficheros de data/: esquema, grafo acíclico, cobertura de fuentes,
// mapeo material→caja y la receta canónica verificada in-game.
// Los checks de ficheros aún no creados se omiten (el repo se construye por fases).
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dataPath = (f) => fileURLToPath(new URL(`../data/${f}`, import.meta.url));
const read = (f) => JSON.parse(readFileSync(dataPath(f), 'utf8'));

let fallos = 0;
const check = (ok, msg) => {
  console.log(`${ok ? '✔' : '✖'} ${msg}`);
  if (!ok) fallos++;
};

// --- recipes.json ---
const recipes = read('recipes.json');
const items = new Map(recipes.items.map((i) => [i.id, i]));

check(items.size === recipes.items.length, `recipes: ${items.size} items con id único`);
check(
  recipes.items.every((i) => i.id && i.nombre && ['wiki', 'ingame'].includes(i.verificado)),
  'recipes: todo item tiene id, nombre y verificado wiki|ingame'
);
const todasLasRefs = recipes.items.flatMap((i) => [
  ...i.ingredientes,
  ...(i.alternativas ?? []).flat(),
]);
check(
  todasLasRefs.every((r) => items.has(r.id) && Number.isInteger(r.qty) && r.qty > 0),
  'recipes: ingredientes y alternativas referencian items existentes con qty > 0'
);

// Grafo acíclico (DFS con colores; las alternativas también son aristas)
const color = new Map();
let ciclo = null;
const aristas = (id) => [
  ...(items.get(id)?.ingredientes ?? []),
  ...(items.get(id)?.alternativas ?? []).flat(),
];
function dfs(id, camino) {
  if (color.get(id) === 1) { ciclo ??= [...camino, id].join(' → '); return; }
  if (color.get(id) === 2) return;
  color.set(id, 1);
  for (const ing of aristas(id)) dfs(ing.id, [...camino, id]);
  color.set(id, 2);
}
for (const id of items.keys()) dfs(id, []);
check(!ciclo, `recipes: grafo acíclico${ciclo ? ` (ciclo: ${ciclo})` : ''}`);

// Receta canónica (métrica de docs/SPEC.md §4, verificada in-game por captura)
const CANONICA = {
  'pantalones-piel': 1, 'piel-curtida': 12, 'tela-lana': 9,
  'cuero': 2, 'placa-hierro': 2, 'placa-acero': 5,
};
const reforzados = items.get('pantalones-piel-reforzados');
const coincide =
  reforzados?.verificado === 'ingame' &&
  reforzados.ingredientes.length === Object.keys(CANONICA).length &&
  reforzados.ingredientes.every((i) => CANONICA[i.id] === i.qty);
check(coincide, 'recipes: pantalones-piel-reforzados == receta canónica (1/12/9/2/2/5, ingame)');

// --- sources.json: toda hoja tiene fuente ---
if (existsSync(dataPath('sources.json'))) {
  const sources = read('sources.json');
  const hojas = recipes.items.filter((i) => aristas(i.id).length === 0);
  const sinFuente = hojas.filter((h) => !sources.materiales[h.id]?.fuentes?.length);
  check(
    sinFuente.length === 0,
    `sources: toda hoja tiene fuente${sinFuente.length ? ` (faltan: ${sinFuente.map((h) => h.id).join(', ')})` : ` (${hojas.length} hojas)`}`
  );
  const refsFuente = Object.keys(sources.materiales).filter((id) => !items.has(id));
  check(refsFuente.length === 0, `sources: no referencia items inexistentes${refsFuente.length ? ` (${refsFuente.join(', ')})` : ''}`);
  // energia es opcional (plan-route ordena por ella cuando existe); si está, debe ser entero > 0
  const fuentes = Object.values(sources.materiales).flatMap((m) => m.fuentes ?? []);
  const energiaMala = fuentes.filter(
    (f) => 'energia' in f && !(Number.isInteger(f.energia) && f.energia > 0)
  );
  const conEnergia = fuentes.filter((f) => 'energia' in f).length;
  check(
    energiaMala.length === 0,
    `sources: energia opcional válida (${conEnergia} fuentes la definen)${energiaMala.length ? ` (inválidas: ${energiaMala.map((f) => `${f.lugar}=${f.energia}`).join(', ')})` : ''}`
  );
} else {
  console.log('· sources.json aún no existe — check omitido');
}

// --- boxes.json: cada material mapea a exactamente 1 categoría ---
if (existsSync(dataPath('boxes.json'))) {
  const boxes = read('boxes.json');
  const conteo = new Map();
  for (const cat of boxes.categorias)
    for (const id of cat.materiales) conteo.set(id, (conteo.get(id) ?? 0) + 1);
  const duplicados = [...conteo].filter(([, n]) => n > 1).map(([id]) => id);
  const sinCaja = [...items.keys()].filter((id) => !conteo.has(id));
  check(duplicados.length === 0, `boxes: sin materiales duplicados${duplicados.length ? ` (${duplicados.join(', ')})` : ''}`);
  check(sinCaja.length === 0, `boxes: todo item de recipes tiene categoría${sinCaja.length ? ` (faltan: ${sinCaja.join(', ')})` : ''}`);
} else {
  console.log('· boxes.json aún no existe — check omitido');
}

// --- objectives.json: los requisitos referencian items existentes ---
if (existsSync(dataPath('objectives.json'))) {
  const objectives = read('objectives.json');
  const reqs = objectives.objetivos.flatMap((o) =>
    (o.partes ?? [{ requisitos: o.requisitos }]).flatMap((p) => p.requisitos)
  );
  check(
    reqs.every((r) => items.has(r.id) && Number.isInteger(r.qty) && r.qty > 0),
    `objectives: ${objectives.objetivos.length} objetivos con requisitos válidos`
  );
} else {
  console.log('· objectives.json aún no existe — check omitido');
}

// --- inventory.json: cantidades válidas sobre items existentes ---
if (existsSync(dataPath('inventory.json'))) {
  const inventory = read('inventory.json');
  const entradas = Object.entries(inventory.items ?? {});
  check(
    entradas.every(([id, qty]) => items.has(id) && Number.isInteger(qty) && qty >= 0),
    `inventory: ${entradas.length} entradas válidas`
  );
} else {
  console.log('· inventory.json aún no existe — check omitido');
}

console.log(fallos ? `\n${fallos} check(s) fallidos` : '\nTodo OK');
process.exit(fallos ? 1 : 0);
