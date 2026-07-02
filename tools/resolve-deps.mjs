#!/usr/bin/env node
// Expande el árbol de dependencias de un objetivo (o item) y calcula faltantes NETOS
// descontando el inventario en cascada: lo que ya tienes de un intermedio evita
// también todos sus materiales aguas arriba.
//
// Uso: node tools/resolve-deps.mjs <objetivo-id|item-id> [inventario.json] [--json]
//   objetivo-id   id de data/objectives.json (o directamente un id de recipes.json)
//   inventario    ruta a un inventario alternativo (default: data/inventory.json)
//   --json        salida JSON (la consumen plan-route.mjs y la UI)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dataPath = (f) => fileURLToPath(new URL(`../data/${f}`, import.meta.url));
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));

export function cargarDatos({ inventarioPath } = {}) {
  return {
    recipes: read(dataPath('recipes.json')),
    objectives: read(dataPath('objectives.json')),
    inventory: read(inventarioPath ?? dataPath('inventory.json')),
  };
}

// Requisitos de un objetivo (aplana partes) o, si el id es un item, ese item ×1.
export function requisitosDe(id, { objectives, recipes }) {
  const obj = objectives.objetivos.find((o) => o.id === id);
  if (obj) {
    const partes = obj.partes ?? [{ requisitos: obj.requisitos }];
    return { nombre: obj.nombre, requisitos: partes.flatMap((p) => p.requisitos) };
  }
  const item = recipes.items.find((i) => i.id === id);
  if (item) return { nombre: item.nombre, requisitos: [{ id, qty: 1 }] };
  return null;
}

// Expansión DFS con descuento en cascada. Muta `inv` (copia del llamante).
// Devuelve el nodo del árbol y acumula faltantes/crafteos/estaciones en `acc`.
function expandir(id, qty, items, inv, acc, depth = 0) {
  const disponible = inv.get(id) ?? 0;
  const usado = Math.min(disponible, qty);
  if (usado > 0) inv.set(id, disponible - usado);
  const neto = qty - usado;

  const item = items.get(id);
  const nodo = { id, nombre: item.nombre, qty, inventario: usado, neto, hijos: [] };
  if (neto === 0) return nodo;

  if (item.ingredientes.length > 0) {
    const produce = item.produce ?? 1;
    const crafteos = Math.ceil(neto / produce);
    acc.crafteos.set(id, (acc.crafteos.get(id) ?? 0) + crafteos);
    if (item.estacion) acc.estaciones.add(item.estacion);
    for (const ing of item.ingredientes)
      nodo.hijos.push(expandir(ing.id, ing.qty * crafteos, items, inv, acc, depth + 1));
  } else {
    acc.faltantes.set(id, (acc.faltantes.get(id) ?? 0) + neto);
  }
  return nodo;
}

export function resolver(objetivoId, { recipes, objectives, inventory }) {
  const objetivo = requisitosDe(objetivoId, { objectives, recipes });
  if (!objetivo) return null;
  const items = new Map(recipes.items.map((i) => [i.id, i]));
  const inv = new Map(Object.entries(inventory.items ?? {}));
  const acc = { faltantes: new Map(), crafteos: new Map(), estaciones: new Set() };
  const arbol = objetivo.requisitos.map((r) => expandir(r.id, r.qty, items, inv, acc));
  return {
    objetivo: { id: objetivoId, nombre: objetivo.nombre },
    arbol,
    faltantes_hoja: Object.fromEntries(acc.faltantes),
    crafteos: Object.fromEntries(acc.crafteos),
    estaciones: [...acc.estaciones],
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
  if (json) {
    console.log(JSON.stringify(res, null, 2));
    return;
  }
  const items = new Map(datos.recipes.items.map((i) => [i.id, i]));
  console.log(`# ${res.objetivo.nombre}\n`);
  for (const n of res.arbol) pintarNodo(n, items);
  const faltantes = Object.entries(res.faltantes_hoja);
  console.log(`\n## Materiales a conseguir (netos)\n`);
  if (faltantes.length === 0) console.log('Nada: el inventario lo cubre todo ✔');
  for (const [id, qty] of faltantes) console.log(`- ${items.get(id).nombre}: ${qty}`);
  if (res.estaciones.length) console.log(`\nEstaciones necesarias: ${res.estaciones.join(', ')}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
