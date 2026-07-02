import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cargarDatos, resolver } from './resolve-deps.mjs';
import { planificarRuta } from './plan-route.mjs';

// Inventario fijado a vacío: el real (data/inventory.json) cambia con el juego
// y los tests deben ser deterministas.
const datos = { ...cargarDatos(), inventory: { items: {} } };
const sources = JSON.parse(
  readFileSync(fileURLToPath(new URL('../data/sources.json', import.meta.url)), 'utf8')
);

test('los 7 objetivos generan ruta y cada faltante aparece en exactamente una zona', () => {
  for (const obj of datos.objectives.objetivos) {
    const plan = planificarRuta(obj.id, datos, sources);
    assert.ok(plan, `${obj.id} sin plan`);
    const faltantes = resolver(obj.id, datos).faltantes_hoja;
    const enRuta = plan.ruta.flatMap((z) => z.items.map((i) => i.id));
    assert.deepEqual(enRuta.sort(), Object.keys(faltantes).sort(), obj.id);
    for (const zona of plan.ruta)
      for (const it of zona.items)
        assert.equal(it.qty, faltantes[it.id], `${obj.id}/${it.id}: qty distinta al resolutor`);
  }
});

test('las zonas van ordenadas por nº de items descendente', () => {
  for (const obj of datos.objectives.objetivos) {
    const plan = planificarRuta(obj.id, datos, sources);
    const conteos = plan.ruta.map((z) => z.items.length);
    assert.deepEqual(conteos, [...conteos].sort((a, b) => b - a), obj.id);
  }
});

test('cada item se asigna a su fuente de prioridad 1 y conserva las alternativas', () => {
  const plan = planificarRuta('pantalones-piel-reforzados', datos, sources);
  const hierro = plan.ruta.flatMap((z) => z.items).find((i) => i.id === 'mineral-hierro');
  const zonaHierro = plan.ruta.find((z) => z.items.includes(hierro));
  assert.equal(zonaHierro.lugar, 'Limestone Cliffs (amarilla)');
  assert.deepEqual(hierro.alternativas, ['Limestone Ridge (verde)', 'Spires (roja)']);
});

test('el inventario reduce la ruta: con el item final no queda nada que farmear', () => {
  const plan = planificarRuta(
    'pantalones-piel-reforzados',
    { ...datos, inventory: { items: { 'pantalones-piel-reforzados': 1 } } },
    sources
  );
  assert.deepEqual(plan.ruta, []);
});

test('id desconocido devuelve null', () => {
  assert.equal(planificarRuta('no-existe', datos, sources), null);
});
