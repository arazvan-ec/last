# CLAUDE.md — LDoE Progress Companion

Compañero agent-native para *Last Day on Earth: Survival*: el usuario (Alin) dice qué misión/objeto
quiere y qué tiene, y el agente calcula qué farmear, dónde ir y cómo organizar las cajas de la base.
Arquitectura basada en https://every.to/guides/agent-native.

## Arquitectura (resumen operativo)

- **Files as the universal interface.** `data/` es la única fuente de verdad. La UI (`ui/index.html`)
  es una *vista* de esos ficheros, nunca tiene lógica de dominio propia.
- **Granularity.** Las herramientas (`tools/*.mjs`) son deterministas y atómicas (resolver
  dependencias, agrupar por zona). El juicio (qué priorizar, qué reciclar, cómo planificar la
  sesión) vive en prompts/skill, no en código.
- **Parity.** Todo lo que se pueda hacer en la UI debe poder lograrse editando `data/` con
  primitivos. No crear tools-pasarela que bloqueen el acceso directo a los ficheros.
- **Improvement over time.** Las recetas llevan campo `verificado: "wiki" | "ingame"`. Cuando el
  usuario aporta una captura del juego, se corrigen los datos, se marca `ingame` y se anota la
  corrección en `docs/LEARNINGS.md`.

## Estructura

```
PLAN.md            plan maestro + log de progreso (6 fases, 20 pasos) — LEER SIEMPRE AL INICIAR
context.md         memoria de trabajo (estado del jugador y del proyecto)
data/              recipes.json · sources.json · objectives.json · inventory.json · boxes.json
tools/             resolve-deps.mjs · plan-route.mjs · validate.mjs (+ *.test.mjs)
skills/ldoe-companion/   SKILL.md + prompts/ (features = prompts)
ui/index.html      guía visual (grafo de progreso por objetivo)
docs/              SPEC.md · investigacion.md · LEARNINGS.md
```

## Flujo de trabajo (obligatorio)

1. Al iniciar sesión: leer `PLAN.md` y `context.md`; anunciar el primer paso `⬜/🔄` y trabajar en orden.
2. Marcar el paso `🔄` antes de empezar; `✅` **solo** tras pasar la columna Verificación de ese paso.
3. **1 paso = 1 commit atómico + push.** Formato: `feat(F1.3): cargar datos de investigación`.
   Nunca terminar una tarea con cambios sin commitear y pushear.
4. Si un paso falla: marcar `❌` con nota de causa; no avanzar sin decidir (arreglar o `⏭` justificado).
5. Al cerrar sesión: añadir línea al «Registro de sesiones» de PLAN.md y actualizar `context.md`.

## Comandos

- Validar datos: `node tools/validate.mjs`
- Resolver dependencias: `node tools/resolve-deps.mjs <objetivo-id>`
- Ruta de farmeo: `node tools/plan-route.mjs <objetivo-id>`
- Tests: `node --test` (desde la raíz; descubre `tools/*.test.mjs`)

## Datos y dominio

- Fuente inicial de datos: `docs/investigacion.md` (investigación jul-2026, juego v1.49.5).
  Kefir cambia recetas entre versiones: ante conflicto, **gana la captura del juego del usuario**.
- El grafo de recetas es acíclico. Ingredientes hoja deben tener entrada en `sources.json`.
- Caso de referencia (test canónico): «Pantalones de piel reforzados» =
  1 Pantalones de piel + 12 Piel curtida + 9 Tela de lana + 2 Cuero + 2 Placa hierro + 5 Placa acero
  (verificado ingame por captura del usuario).

## El test definitivo (F5.3)

Pedir un outcome no diseñado (ej.: «¿cuántas vueltas a Bunker Alfa me faltan para el ATV?») y que el
agente lo resuelva componiendo primitivos + tools existentes, sin escribir código nuevo.
