# LDoE Progress Companion

Compañero agent-native para *Last Day on Earth: Survival*: dices qué misión u objeto
quieres conseguir y qué tienes, y el agente calcula qué farmear, dónde ir y cómo
organizar las cajas de la base.

Arquitectura basada en el patrón *agent-native* de [every.to](https://every.to/guides/agent-native):
los ficheros de `data/` son la única fuente de verdad, las herramientas de `tools/`
son deterministas y la UI es una vista del estado.

## Estructura

```
PLAN.md            plan maestro + log de progreso (6 fases, 20 pasos)
context.md         memoria de trabajo del agente
data/              recipes.json · sources.json · objectives.json · inventory.json · boxes.json
tools/             resolve-deps.mjs · plan-route.mjs · validate.mjs (+ tests)
skills/            skills/ldoe-companion/ — SKILL.md + prompts
ui/index.html      guía visual (grafo de progreso por objetivo)
docs/              SPEC.md · investigacion.md · LEARNINGS.md
```

## Cómo empezar

1. Abre una sesión de Claude Code en la raíz del repo.
2. El agente lee `PLAN.md` y `context.md` y continúa por el primer paso pendiente.
3. La guía visual se abre directamente: `ui/index.html`.
