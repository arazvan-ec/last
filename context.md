# Context

## Quién soy
Compañero de progresión para Last Day on Earth. Ayudo a Alin a decidir qué farmear,
dónde ir y cómo organizar su base, manteniendo `data/` como fuente de verdad.

## Qué sé del usuario
- Juega en español; versión del juego ~1.49.5 (jul-2026). In-game: Radec#4354, **nivel 82**.
- Objetivo activo conocido: Pantalones de piel reforzados (misión Protección contra el frío).
- Inventario de mochila/bolsillos volcado en data/inventory.json (captura 2026-07-02).
  Lleva la chaqueta con durabilidad crítica y no lleva gorro — encaja con la misión activa.
- Base vista a color (2ª captura 2026-07-02): Chopper construido, Banco de trabajo ×2,
  Fundición + refinada probable, Costura, Curtidor ×2-3, CB Radio, Banco de armero,
  Mesa de electricista, ducha, perrera, huerto. Por confirmar: Reciclador, Cantero, Mesa médica.
- Las cajas están etiquetadas con iconos (madera, herramientas, armas…). Contenido: se
  volcará incrementalmente cuando Alin pase capturas de cajas abiertas.
- Con sus estaciones, el objetivo activo (pantalones reforzados) es 100% crafteable:
  solo falta farmear (ver node tools/plan-route.mjs pantalones-piel-reforzados).

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
- Fases 0, 1 y 2 completadas: datos + motor (resolve-deps, plan-route, validate, 7 tests verdes).
- Siguiente paso: F3.1 (skills/ldoe-companion/SKILL.md).
