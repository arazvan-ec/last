# Checklist agent-native (F5.2)

> Auditoría contra los *success criteria* de la arquitectura agent-native
> (every.to/guides/agent-native). Cada línea: ✓ con evidencia, o justificación
> honesta del hueco. Fecha: 2026-07-02.

## Files as the universal interface

- ✓ `data/` es la única fuente de verdad; los 5 ficheros son JSON legibles y
  editables con primitivos (Read/Edit), sin pasar por ninguna API propia.
- ✓ La UI no tiene lógica de dominio: importa `tools/engine.mjs` y pinta
  (`ui/index.html` — F4.1). Ningún número nace en la UI.
- ✓ El estado del proyecto también son ficheros: `PLAN.md` (plan+log) y
  `context.md` (memoria de trabajo).

## Parity (todo lo de la UI, alcanzable por el agente)

- ✓ Tabla de paridad en `skills/ldoe-companion/SKILL.md`: las 6 acciones de la UI
  mapean a ediciones de `data/`.
- ✓ Sentido inverso (UI → agente): export/import JSON compatible con
  `inventory.json` (F4.3, round-trip verificado con Chromium: mismos números en
  UI y CLI).
- ✓ El % de avance es idéntico por construcción: una sola función
  (`engine.progreso`) consumida por CLI y navegador.

## Granularity (primitivos atómicos; el juicio, fuera del código)

- ✓ Tools deterministas y atómicos: `resolve-deps` (expandir+descontar),
  `plan-route` (agrupar+ordenar), `validate` (invariantes). Ninguno decide
  prioridades ni estrategia.
- ✓ El juicio vive en prompts: `prompts/planifica-sesion.md`, `que-reciclo.md`,
  `organiza-cajas.md` (features = prompts).
- ✓ No hay tools-pasarela: nada impide editar `data/` a mano; `validate.mjs` es
  guardia, no puerta.

## Composability (outcomes no diseñados sin código nuevo)

- ✓ Los tools exponen `--json` y funciones importables (`engine.mjs` puro).
- ✓ Aceptan inventarios alternativos por parámetro (hipótesis «¿y si tuviera…?»).
- ✓ Ultimate test (F5.3): «¿cuántas vueltas a Bunker Alfa para el ATV?» resuelto
  componiendo `resolve-deps atv --json` + `sources.json`, sin escribir tools
  nuevos — ver nota del paso en PLAN.md.

## CRUD completo por entidad

| Entidad | Create | Read | Update | Delete | Cómo |
|---------|:-:|:-:|:-:|:-:|------|
| Item/Receta (`recipes.json`) | ✓ | ✓ | ✓ | ✓ | edición directa; validate vigila ciclos, refs y receta canónica |
| Fuente (`sources.json`) | ✓ | ✓ | ✓ | ✓ | edición directa; validate vigila cobertura de hojas |
| Objetivo (`objectives.json`) | ✓ | ✓ | ✓ | ✓ | edición directa; validate vigila refs y cantidades |
| Inventario (`inventory.json`) | ✓ | ✓ | ✓ | ✓ | edición directa, capturas (flujo F3.2) o UI→export→agente |
| Caja (`boxes.json`) | ✓ | ✓ | ✓ | ✓ | edición directa; validate vigila mapeo 1-a-1 |

## Improvement over time

- ✓ Campo `verificado: wiki|ingame` en toda receta; regla captura > wiki.
- ✓ `docs/LEARNINGS.md`: ledger append-only con fuente por corrección (F5.1).
- ✓ Flujo captura → datos documentado en la skill (F3.2), incluida la protección
  de la receta canónica (avisar si la métrica cambia).

## Huecos conocidos (justificados, no bloqueantes)

- `data/inventory.json` sin datos reales del jugador — es un hueco de *datos*
  (F1.4 en curso en otra sesión), no de arquitectura: el esquema y los flujos
  para llenarlo existen y están verificados con fixtures.
- La UI no escribe `data/` directamente (un navegador estático no puede): el
  puente es export/import + aviso de divergencia. Aceptado como diseño (shared
  workspace), verificado end-to-end.
- `sources.json` sin coste de energía por zona: `plan-route` ya soporta el campo
  opcional `energia`; pendiente de investigación (F2.2, LEARNINGS «pendientes»).
- 7 fuentes `por investigar` y 2 recetas hoja provisionales (gorro/chaqueta):
  registrados en LEARNINGS como huecos de investigación in-game.
