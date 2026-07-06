import test from 'node:test';
import assert from 'node:assert/strict';
import { cargarDatos, resolver, requisitosDe } from './resolve-deps.mjs';

const datos = cargarDatos();
const items = new Map(datos.recipes.items.map((i) => [i.id, i]));
const esHoja = (id) =>
  items.get(id).ingredientes.length === 0 && !(items.get(id).alternativas?.length);
const conInventario = (inv) => ({ ...datos, inventory: { items: inv } });

test('los 7 objetivos resuelven y sus faltantes son hojas con qty > 0', () => {
  assert.equal(datos.objectives.objetivos.length, 7);
  for (const obj of datos.objectives.objetivos) {
    const res = resolver(obj.id, conInventario({})); // inventario fijado: el real cambia con el juego
    assert.ok(res, `${obj.id} no resuelve`);
    assert.ok(Object.keys(res.faltantes_hoja).length > 0, `${obj.id} sin faltantes con inventario vacío`);
    for (const [id, qty] of Object.entries(res.faltantes_hoja)) {
      assert.ok(items.get(id).ingredientes.length === 0, `${id} no es hoja`);
      assert.ok(Number.isInteger(qty) && qty > 0, `${id} qty inválida: ${qty}`);
    }
  }
});

test('receta canónica: totales brutos de pantalones-piel-reforzados', () => {
  const res = resolver('pantalones-piel-reforzados', conInventario({}));
  assert.deepEqual(res.faltantes_hoja, {
    piel: 18, 'cuero-crudo': 5, fibra: 6, 'mineral-hierro': 9, adhesivo: 2,
    'trozo-lana': 18, bauxita: 25, 'mineral-cobre': 5, 'tronco-pino': 10,
  });
});

test('descuento en cascada: 2 lingotes de acero reducen los crafteos de 5 a 3', () => {
  const res = resolver('pantalones-piel-reforzados', conInventario({ 'lingote-acero': 2 }));
  assert.equal(res.crafteos['lingote-acero'], 3);
  assert.equal(res.faltantes_hoja['bauxita'], 15); // 3×5 en vez de 5×5
  assert.equal(res.faltantes_hoja['mineral-cobre'], 3);
  assert.equal(res.faltantes_hoja['tronco-pino'], 6); // carbón 2 por lingote
  assert.equal(res.faltantes_hoja['mineral-hierro'], 7); // 4 placas hierro + 3 acero
});

test('el item final en inventario cubre todo el árbol', () => {
  const res = resolver('pantalones-piel-reforzados', conInventario({ 'pantalones-piel-reforzados': 1 }));
  assert.deepEqual(res.faltantes_hoja, {});
  assert.deepEqual(res.crafteos, {});
});

test('produce > 1 redondea hacia arriba: pernos del chopper (5 y 30, produce 2)', () => {
  const res = resolver('chopper', conInventario({}));
  // pernos ×5 → ceil(5/2)=3 crafteos; pernos ×30 → 15 crafteos
  assert.equal(res.crafteos['pernos'], 18);
  assert.equal(res.crafteos['placa-aluminio'], 18);
  // 18 placas → 36 lingotes de aluminio → 180 bauxita
  assert.equal(res.faltantes_hoja['bauxita'], 180);
});

test('requisitosDe aplana las partes de objetivos multiparte (chopper, muro-nivel-3)', () => {
  const chopper = requisitosDe('chopper', datos);
  assert.equal(chopper.requisitos.length, 13); // 3 del plano + 10 del ensamblaje
  const muro = requisitosDe('muro-nivel-3', datos);
  assert.deepEqual(
    muro.requisitos.map((r) => r.id),
    ['caliza', 'tablon-pino', 'ladrillo-piedra', 'tablon-pino']
  );
});

test('id desconocido devuelve null', () => {
  assert.equal(resolver('no-existe', datos), null);
});
