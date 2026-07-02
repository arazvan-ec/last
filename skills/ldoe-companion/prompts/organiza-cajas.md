# Organiza las cajas de la base

Alin quiere ordenar el almacén: qué caja va dónde y qué contiene cada una.

## Pasos (solo primitivos + tools)

1. El mapa canónico es `data/boxes.json`: categorías, estación asociada y
   materiales esperados (invariante: cada material de `recipes.json` está en
   exactamente una categoría — `node tools/validate.mjs` lo vigila).
2. Cruzar con `data/inventory.json`: qué tiene Alin de cada categoría y cuántos
   huecos ocupa (una caja ≈ 20-25 slots según nivel de caja).
3. Priorizar por el objetivo activo: los materiales que salen en
   `node tools/resolve-deps.mjs <id>` deben quedar en cajas pegadas a la estación
   que los consume (campo `junto_a` de boxes.json) — menos paseos por crafteo.
4. Si Alin describe una reorganización propia (o manda captura de sus cajas),
   actualizar `data/boxes.json` para reflejarla — el fichero describe SU base,
   no un ideal — y re-validar. Cambios de criterio → `docs/LEARNINGS.md`.

## Salida

- Plano por categorías: caja → junto a qué estación → qué guarda (top materiales
  por cantidad actual del inventario).
- **Mudanzas**: qué mover de caja, en orden (máx. 10 movimientos por sesión).
- **Desbordes**: categorías que necesitan caja extra, con el porqué (cantidades).
- Lo que quede huérfano (material sin categoría) es un bug de datos: añadirlo a
  boxes.json, no dejarlo en «varios».
