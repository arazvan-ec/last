# SPEC — LDoE Progress Companion

> Especificación del proyecto (paso F0.2). Complementa a `PLAN.md` (plan/log) y
> `CLAUDE.md` (reglas operativas). Si este fichero y la realidad divergen, se actualiza este fichero.

## 1. Problema

El jugador (Alin) quiere progresar en *Last Day on Earth: Survival* sin tener que
cruzar wikis, calcular cadenas de crafteo a mano ni recordar dónde se farmea cada
material. Quiere decir «quiero X y tengo Y» y recibir un plan accionable.

## 2. Requisitos

| Req | Enunciado | Cobertura |
|-----|-----------|-----------|
| R1 | Dada una misión/objeto y el inventario actual, decir qué farmear y dónde ir | data/ + tools/resolve-deps + tools/plan-route |
| R2 | Recomendar cómo organizar los materiales en cajas de la base | data/boxes.json + prompt organiza-cajas |
| R3 | Guía visual HTML con avance por objetivo | ui/index.html |
| R4 | Grafo/timeline navegable de dependencias donde anotar qué se tiene | ui/index.html + data/inventory.json |
| R5 | Guía de obtención de lo que falta (zonas, eventos, reciclaje) | data/sources.json + plan-route |
| R6 | Arquitectura agent-native (files as interface, parity, granularity) | estructura del repo + skills/ |

## 3. Entidades

| Entidad | Fichero | Campos clave |
|---------|---------|--------------|
| Item | `data/recipes.json` (nodos) | `id`, `nombre`, `estacion`, `verificado: "wiki"\|"ingame"` |
| Receta | `data/recipes.json` (aristas) | `ingredientes: [{id, qty}]` — grafo **acíclico** |
| Fuente | `data/sources.json` | material → zonas/eventos/drops con prioridad |
| Objetivo | `data/objectives.json` | misión/objeto con cantidades requeridas |
| Inventario | `data/inventory.json` | lo que el jugador tiene ahora |
| Caja | `data/boxes.json` | categoría, estación asociada, contenido esperado |

Invariantes:
- El grafo de recetas no tiene ciclos (`validate.mjs` lo comprueba).
- Todo ingrediente hoja (sin receta) tiene entrada en `sources.json`.
- Cada material mapea a exactamente una categoría de caja.
- Ante conflicto de datos: captura in-game > wiki; la corrección se anota en `docs/LEARNINGS.md`.

## 4. Métrica de éxito única (machine-checkable)

```
node --test tools/            # todos los tests verdes, y en particular:
node tools/resolve-deps.mjs pantalones-piel-reforzados
```

debe reproducir **exactamente** la receta verificada in-game (captura del usuario):

| Ingrediente | Qty |
|-------------|-----|
| Pantalones de piel | 1 |
| Piel curtida | 12 |
| Tela de lana | 9 |
| Cuero | 2 |
| Placa de hierro | 2 |
| Placa de acero | 5 |

Este caso es el test canónico del motor. La verificación cualitativa final (F5.3,
«the ultimate test») es que el agente resuelva un outcome **no diseñado** —
p. ej. «¿cuántas vueltas a Bunker Alfa me faltan para el ATV?» — componiendo
únicamente `data/` + `tools/` existentes, sin escribir código nuevo.

## 5. No-objetivos

- No es una wiki general del juego: solo cubre los objetivos del jugador.
- No automatiza el juego ni lee su memoria: los datos entran por capturas o texto del usuario.
- La UI no contiene lógica de dominio: es una vista de `data/` (parity con el agente).
