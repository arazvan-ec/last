# Context

## Quién soy
Compañero de progresión para Last Day on Earth. Ayudo a Alin a decidir qué farmear,
dónde ir y cómo organizar su base, manteniendo `data/` como fuente de verdad.

## Qué sé del usuario
- Juega en español; versión del juego ~1.49.5 (jul-2026).
- Objetivo activo conocido: Pantalones de piel reforzados (misión Protección contra el frío).
- Nivel, estaciones construidas e inventario: PENDIENTE de volcar en data/inventory.json (paso F1.4).

## Qué existe
- PLAN.md con 6 fases / 20 pasos — F0.1 completado.
- Estructura del repo creada: data/ tools/ skills/ldoe-companion/ ui/ docs/ + README.
- docs/investigacion.md con las cadenas de crafteo, fuentes y 7 objetivos precargados.
- ui/index.html v1 (tracker por objetivo, versión de chat; en F4 pasará a leer data/).

## Actividad reciente
- Bootstrap del proyecto creado desde el chat de claude.ai (investigación + plan + UI v1).
- 2026-07-02: F0.1 — bootstrap reconciliado con el repo (ficheros a la raíz, estructura + README).

## Mis pautas
- Ante conflicto de datos: captura del juego > wiki. Anotar correcciones en docs/LEARNINGS.md.
- No marcar pasos ✅ sin pasar su verificación. 1 paso = 1 commit + push.

## Estado actual
- Fases 0, 2, 3 y 4 completadas. Fase 1 casi completa: recipes (56 items), sources,
  objectives (7), boxes y validate.mjs en verde.
- Motor determinista en `tools/engine.mjs` (PURO, sin node:fs): requisitosDe, resolver,
  progreso (definición canónica del % de avance) y planificarRuta. `resolve-deps.mjs` y
  `plan-route.mjs` son CLIs finos sobre él. 12 tests con `node --test` desde la raíz.
- UI operativa: `ui/index.html` lee data/ por fetch e importa engine.mjs → mismo % que
  el CLI por construcción. Árbol navegable con cascada, steppers que editan inventario
  local (localStorage), export/import JSON compatible con inventory.json. Servir con
  `python3 -m http.server` desde la raíz y abrir /ui/. Verificado con Chromium headless.
- Capa agente operativa: `skills/ldoe-companion/SKILL.md` (tabla de paridad UI↔data,
  flujo captura→datos) + prompts `planifica-sesion` / `que-reciclo` / `organiza-cajas`.
  `docs/LEARNINGS.md` creado con la corrección de los pantalones como 1ª entrada.
- sources.json aún no trae energía por zona: plan-route ordena por nº de items y
  soporta un campo opcional `energia` cuando se investigue.
- F1.4 en 🔄 EN OTRA SESIÓN (Alin volcando nivel/estaciones/inventario) — esta rama
  no toca data/inventory.json para no pisarla.
- Siguiente paso: F5 (LEARNINGS ya adelantado en F3.2 → revisar F5.1, checklist F5.2,
  ultimate test F5.3). Al fusionar ramas: PLAN.md y context.md son el punto de
  conflicto; el trabajo F0–F4 vive en ramas claude/* (main solo tiene el commit inicial).
