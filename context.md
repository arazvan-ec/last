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
- Fases 0 y 2 completadas. Fase 1 casi completa: recipes (56 items), sources,
  objectives (7), boxes y validate.mjs en verde.
- Motor determinista operativo: `resolve-deps.mjs` (faltantes netos con descuento de
  inventario en cascada, exporta resolver()) y `plan-route.mjs` (ruta por zonas,
  salida markdown y JSON). 12 tests con `node --test` desde la raíz.
- sources.json aún no trae energía por zona: plan-route ordena por nº de items y
  soporta un campo opcional `energia` cuando se investigue.
- F1.4 en 🔄: esquema de inventory.json listo, PENDIENTE que Alin aporte nivel,
  estaciones construidas e inventario (por captura o texto).
- Siguiente paso: F3.1 (SKILL.md del compañero) — o cerrar F1.4 si llegan los datos.
- Ojo multi-sesión: el trabajo de F0–F2 vive en las ramas claude/* (main solo tiene
  el commit inicial); PLAN.md y context.md son el punto de conflicto entre sesiones.
