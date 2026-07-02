// Motor puro del compañero: sin dependencias de Node (ni fs, ni url), para que
// lo importen por igual los CLIs de tools/ y ui/index.html (parity: un solo
// cálculo de dominio, dos vistas). Los datos entran siempre por parámetro.

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
function expandir(id, qty, items, inv, acc) {
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
      nodo.hijos.push(expandir(ing.id, ing.qty * crafteos, items, inv, acc));
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

// Avance de un objetivo: fracción de materiales hoja ya cubierta por el
// inventario (en cascada). pct = 1 − Σfaltantes_netos / Σfaltantes_brutos.
// Es LA definición canónica de «% de avance»: CLI y UI deben usar esta función.
export function progreso(objetivoId, datos) {
  const neto = resolver(objetivoId, datos);
  if (!neto) return null;
  const bruto = resolver(objetivoId, { ...datos, inventory: { items: {} } });
  const suma = (r) => Object.values(r.faltantes_hoja).reduce((a, b) => a + b, 0);
  const totalBruto = suma(bruto);
  const totalNeto = suma(neto);
  const pct = totalBruto === 0 ? 100 : Math.round((1 - totalNeto / totalBruto) * 100);
  return { bruto: totalBruto, neto: totalNeto, pct };
}

// Ruta de farmeo: agrupa faltantes netos por su mejor fuente (prioridad 1).
// Zonas ordenadas por nº de items y, a igualdad, por energía si está declarada.
export function planificarRuta(objetivoId, datos, sources) {
  const res = resolver(objetivoId, datos);
  if (!res) return null;

  const items = new Map(datos.recipes.items.map((i) => [i.id, i]));
  const zonas = new Map();
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
