# Context

## Quién soy
Compañero de progresión para Last Day on Earth. Ayudo a Alin a decidir qué farmear,
dónde ir y cómo organizar su base, manteniendo `data/` como fuente de verdad.

## Eventos activos (caducan — revisar fechas)

- **Temporada de anomalías** (captura 2026-07-02): quedan **6d 2h**. Tarea visible:
  «Ve a la anomalía climática» (timer 02:16 en pantalla, probable rotación de anomalía).
  Contador de fichas de temporada: 17.
- **Misión «Camino al barco»**: completar tareas diarias del mapa para desbloquear
  «Barco atrapado en el hielo». NO es misión de crafteo → no entra en recipes/objectives;
  se sigue aquí. Estado 2026-07-02 (captura del mapa): **0/3** tareas de hoy:
  1. «Ve a la anomalía climática» (Temporada) — pin morado al norte del Hogar, evento 10d 2h.
  2. «En busca de chapas» — seguir el rastro de flechas rojas al NE hasta el campamento
     bandido; zona calavera roja al lado con timers 23h 49m / 2d 2h (la corta caduca HOY).
  3. «Recursos para los páramos» — explorar camping Greenwood, zona de cuarentena y
     campo de entrenamiento helado (reputación; texto cortado en captura).
  Energía en captura: 198/200 (tope, regen desperdiciándose). Latas/cupones: 89.

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
  solo falta farmear (plan-route de la rama claude/repo-status-check-2neqs3 lo calcula).

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
- PLAN COMPLETO: las 6 fases / 20 pasos cerrados (F1.4 integrado desde la rama
  extract-zip el 2026-07-02). Datos: recipes (56 items), sources, objectives (7),
  boxes, inventario real de Alin y validate.mjs en verde.
- Auditoría agent-native en `docs/checklist-agent-native.md` (F5.2) y ultimate test
  superado (F5.3): vueltas a Alfa para el ATV resuelto por composición sin código nuevo.
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
- F1.4 CERRADO (decisión de Alin): nivel 82, mochila, base y 13 estaciones bastan.
  El contenido de las ~20-25 cajas etiquetadas se volcará incrementalmente cuando lleguen
  capturas sueltas; Reciclador/Cantero/Mesa médica siguen sin confirmar. Nada de esto bloquea.
- Ramas consolidadas (2026-07-02): F1.4 (rama extract-zip) fusionado sobre F2–F5 en
  claude/repo-status-check-2neqs3. Siguiente: llevar a main y pasar a modo uso diario
  (prompts de la skill) e ir rellenando huecos «por investigar» vía capturas.
