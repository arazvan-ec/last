# Planifica la sesión de juego

Alin va a jugar un rato y quiere saber qué hacer para avanzar al máximo.
Entrada opcional: cuánto tiempo/energía tiene y si hay eventos activos (airdrop,
convoy, temporada).

## Pasos (solo primitivos + tools)

1. Objetivo activo: `data/objectives.json` → el que tenga `activo: true`
   (si hay varios o ninguno, preguntar cuál toca hoy).
2. Faltantes reales: `node tools/resolve-deps.mjs <objetivo-id>` — ya descuenta
   `data/inventory.json` en cascada.
3. Ruta: `node tools/plan-route.mjs <objetivo-id>` — zonas ordenadas por nº de
   items que resuelven.
4. Cruzar con lo que diga Alin de energía/eventos: las zonas rojas y el norte
   cuestan más; los eventos (airdrop, convoy) pueden adelantar materiales de
   prioridad 2 sin gastar apenas energía.
5. Antes de salir de base: dejar colas de producción cargadas con lo ya farmeado
   (fundición, curtidor, costura — estaciones y tiempos en `data/recipes.json`).
   El crafteo corre mientras se farmea.

## Salida

Checklist ordenado y corto:
- **Antes de salir**: qué encolar en cada estación (item × cantidad).
- **Ruta**: 2-4 paradas máximo, cada una con qué recoger y cuánto (del paso 3);
  si el tiempo no da, cortar por el final, nunca la parada 1.
- **Al volver**: qué craftear con lo recogido y qué caja toca (`data/boxes.json`).
- Si una parada depende de una fuente `por investigar`, decirlo y proponer
  alternativa de prioridad 2.
