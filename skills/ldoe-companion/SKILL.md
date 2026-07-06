---
name: ldoe-companion
description: >
  Compañero de progresión para Last Day on Earth. Usar cuando Alin pregunte qué
  farmear, dónde ir, cómo va un objetivo, qué reciclar o cómo organizar las cajas
  de la base; también cuando aporte una captura del juego o datos de inventario.
---

# LDoE Progress Companion

`data/` es la única fuente de verdad. Este documento dice qué fichero leer o
escribir para cada necesidad, cuándo delegar en `tools/` y qué queda a tu juicio.
Regla general: **los tools calculan, tú decides**.

## Los ficheros (files as the universal interface)

| Necesidad | Fichero | Operación |
|-----------|---------|-----------|
| ¿Qué recetas/ingredientes tiene un item? | `data/recipes.json` | leer; escribir solo al verificar recetas (ver flujo de capturas) |
| ¿Dónde se farmea un material? | `data/sources.json` | leer; añadir fuentes cuando se investiguen (las `prioridad: 99` son huecos) |
| ¿Qué objetivos hay / cuál está activo? | `data/objectives.json` | leer; `activo: true/false` al cambiar de misión; añadir objetivos nuevos |
| ¿Qué tiene Alin ahora? | `data/inventory.json` | leer; escribir tras cada captura o mensaje («tengo 3 placas») |
| ¿En qué caja va cada cosa? | `data/boxes.json` | leer; ajustar si Alin reorganiza la base |
| Estado del jugador (nivel, estaciones) | `data/inventory.json` (`jugador`) + `context.md` | leer/escribir |

Después de **cualquier** escritura en `data/`: ejecutar `node tools/validate.mjs`.
Si falla, arreglar antes de continuar — nunca dejar `data/` en rojo.

## Cuándo invocar tools (determinista) vs. juicio (prompts)

| Pregunta de Alin | Qué hacer |
|------------------|-----------|
| «¿Qué me falta para X?» | `node tools/resolve-deps.mjs <id>` — faltantes netos con su inventario |
| «¿Dónde farmeo lo que falta?» | `node tools/plan-route.mjs <id>` (añadir `--json` si lo consume otra cosa) |
| «Quiero hacer la misión X» / captura de un panel de misión | prompt `prompts/cumple-mision.md` — bucle guiado con checkpoint por sesión |
| «¿Qué hago hoy? / planifícame la sesión» | prompt `prompts/planifica-sesion.md` (usa los tools y prioriza tú) |
| «¿Qué puedo reciclar?» | prompt `prompts/que-reciclo.md` |
| «¿Cómo organizo las cajas?» | prompt `prompts/organiza-cajas.md` |
| Aporta captura del juego | flujo «captura → datos» (abajo) |

Ambos tools aceptan un inventario alternativo como segundo argumento
(`node tools/resolve-deps.mjs <id> ruta/inv.json`) para hipótesis tipo
«¿y si ya tuviera 2 lingotes?» sin tocar el inventario real. Como librería:
`import { cargarDatos, resolver } from './tools/resolve-deps.mjs'` y
`import { planificarRuta } from './tools/plan-route.mjs'`.

Los tools son atómicos a propósito. No escribas código nuevo para outcomes no
diseñados: compónlos (p. ej. «vueltas a Bunker Alfa para el ATV» = faltantes de
`resolve-deps atv --json` ÷ rendimiento por vuelta de `sources.json`).

## Paridad con la UI

`ui/index.html` es una vista de `data/`; no tiene lógica de dominio propia. Toda
acción de la UI debe poder lograrse editando `data/` con primitivos:

| Acción en la UI | Equivalente en data/ |
|-----------------|----------------------|
| Elegir objetivo activo | `objectives.json`: `activo: true` (y `false` al anterior) |
| Stepper +/− de un material | `inventory.json`: `items[id] ± 1` |
| Marcar material completo ✓ | `inventory.json`: `items[id] = qty` requerida |
| Reiniciar objetivo | `inventory.json`: poner a 0 / quitar los items de ese objetivo |
| Añadir material custom (nombre, qty, fuente) | `recipes.json` (item hoja) + `objectives.json` (requisito) + `sources.json` (fuente) |
| Eliminar material custom | quitar esas mismas tres entradas |
| % de avance por objetivo | no se edita: lo calcula `resolve-deps` (la UI debe mostrar el mismo número) |

Si aparece una acción de UI sin equivalente en esta tabla, es un bug de
arquitectura: falta un primitivo, no un tool-pasarela.

## Flujo captura → datos

Cuando Alin aporta una captura del juego (o dicta datos por texto):

1. **Clasificar** qué muestra: pantalla de receta, inventario/cajas, o estado del
   jugador (nivel, estaciones).
2. **Receta** — comparar ingrediente a ingrediente con `recipes.json`:
   - Si coincide y estaba `verificado: "wiki"` → subir a `"ingame"` y anotar en notas la fecha.
   - Si difiere → **gana la captura**: corregir `ingredientes`, marcar `verificado: "ingame"`
     y añadir entrada en `docs/LEARNINGS.md` (fecha, item, antes → después, fuente).
   - Item que no existe en `recipes.json` → crear el nodo; si es hoja, darle fuente en
     `sources.json` y categoría en `boxes.json` (invariantes de validate).
3. **Inventario** — volcar cantidades en `inventory.json.items` (ids de recipes.json)
   y poner `actualizado` a la fecha de la captura. Nivel/estaciones van en `jugador`.
4. **Validar** — `node tools/validate.mjs` y `node --test`. Si la corrección toca la
   receta canónica (pantalones reforzados), actualizar también `CANONICA` en
   `validate.mjs`, el test y `docs/SPEC.md` §4 — es la métrica del proyecto, avisar a Alin.
5. Nunca degradar `"ingame"` → `"wiki"`: una receta verificada solo cambia con otra captura
   (nueva versión del juego). Ese cambio también va a LEARNINGS.md.

## Reglas de datos

- Conflicto de datos: **captura del juego > wiki**. Kefir cambia recetas entre versiones.
- Toda corrección se anota en `docs/LEARNINGS.md` con fecha, fuente y qué cambió.
- El grafo de recetas es acíclico; todo ingrediente hoja necesita fuente en `sources.json`.
- Receta canónica de regresión: pantalones de piel reforzados = 1/12/9/2/2/5 (ingame).
- Al cerrar sesión de trabajo: actualizar `PLAN.md` (registro) y `context.md`.
