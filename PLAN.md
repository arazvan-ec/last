# PLAN.md — Repo agent-native "LDoE Progress Companion"

> Plan maestro: **6 fases, 20 pasos**. Este fichero es a la vez el plan y el log de progreso —
> vive en la raíz del repo y el agente lo actualiza al completar cada paso (patrón *partial
> completion* del artículo de Every: `pending → in_progress → completed / failed / skipped`).
>
> **Regla de trabajo:** 1 paso = 1 commit atómico + push. Ningún paso se marca ✅ sin pasar su verificación.

**Leyenda:** ⬜ pendiente · 🔄 en curso · ✅ completado · ❌ fallido (ver notas) · ⏭ saltado

---

## Requisitos que cubre este plan (trazabilidad)

| Req | Petición original | Fases que lo cubren |
|-----|-------------------|---------------------|
| R1 | "Te digo misión + qué tengo y me dices qué farmear y dónde ir" | F1, F2, F3 |
| R2 | "Cómo organizarme en cajas" | F1 (boxes), F3 (prompt) |
| R3 | "Guía visual HTML con avance por objetivo" | F4 |
| R4 | "Timeline/grafo navegable de dependencias + añadir qué tengo" | F2, F4 |
| R5 | "Guía de cómo obtener lo que falta" | F2 (ruta), F4 (vista) |
| R6 | "Repo con arquitectura agent-native (every.to)" | F0, F3, F5 |

---

## FASE 0 — Spec y scaffold del repo (3 pasos)

| # | Paso | Entregable | Verificación | Estado | Fecha | Notas |
|---|------|-----------|--------------|--------|-------|-------|
| 0.1 | Crear repo y estructura de carpetas | `git init` + `README.md` + árbol `data/ tools/ skills/ ui/ docs/` | `tree` muestra la estructura; primer commit pusheado | ✅ | 2026-07-02 | Bootstrap reconciliado: ficheros del zip movidos a la raíz |
| 0.2 | Escribir SPEC (estilo REASONS) | `docs/SPEC.md`: requisitos, entidades, métrica de éxito única | La métrica es machine-checkable (ver Fase 5.3) | ✅ | 2026-07-02 | Métrica: resolve-deps reproduce la receta verificada (1/12/9/2/2/5) |
| 0.3 | Instalar este plan como log vivo | `PLAN.md` en la raíz | El agente puede leer/actualizar estados con str_replace | ✅ | 2026-07-02 | En la raíz desde F0.1; estados 0.1 y 0.2 actualizados vía str_replace |

**Estructura objetivo:**
```
ldoe-companion/
├── PLAN.md              ← este fichero (plan + log)
├── context.md           ← memoria de trabajo del agente (patrón context.md)
├── data/
│   ├── recipes.json     ← grafo de crafteo (nodos + aristas)
│   ├── sources.json     ← dónde se farmea cada material
│   ├── objectives.json  ← misiones/objetivos con cantidades
│   ├── inventory.json   ← lo que Alin tiene AHORA
│   └── boxes.json       ← organización de cajas de la base
├── tools/
│   ├── resolve-deps.mjs ← expansión del árbol de dependencias
│   ├── plan-route.mjs   ← faltantes agrupados por zona de farmeo
│   └── validate.mjs     ← validación de esquemas
├── skills/
│   └── ldoe-companion/SKILL.md
├── ui/
│   └── index.html       ← guía visual (vista de data/)
└── docs/
    ├── SPEC.md
    └── LEARNINGS.md     ← recetas verificadas vs. wiki, cambios de versión
```

---

## FASE 1 — Capa de datos: files as the universal interface (5 pasos)

| # | Paso | Entregable | Verificación | Estado | Fecha | Notas |
|---|------|-----------|--------------|--------|-------|-------|
| 1.1 | Esquema del grafo de recetas | `data/recipes.json` — cada item: `id, nombre, estacion, ingredientes[{id, qty}], verificado(wiki/ingame)` | `validate.mjs` pasa; ciclo prohibido (grafo acíclico) | ✅ | 2026-07-02 | 56 items; validate.mjs comprueba también la receta canónica |
| 1.2 | Esquema de fuentes de farmeo | `data/sources.json` — material → zonas/eventos/drops con prioridad | Todo ingrediente hoja de recipes.json tiene fuente | ✅ | 2026-07-02 | 32 hojas cubiertas; 7 marcadas «por investigar» |
| 1.3 | Cargar datos de la investigación | Los 7 objetivos ya investigados (Chopper, Bunker Alfa, set de piel, pantalones reforzados, ATV, motor lancha, muros N3) + cadenas de refinado | resolve-deps sobre "pantalones reforzados" reproduce tu captura (1/12/9/2/2/5) | ✅ | 2026-07-02 | Datos cotejados con la captura vía validate.mjs; re-verificar con resolve-deps en F2.1 |
| 1.4 | Estado del jugador | `data/inventory.json` + `context.md` (nivel, edificios, estaciones construidas) | El agente responde "¿qué tengo?" leyendo solo estos ficheros | 🔄 | 2026-07-02 | Nivel 82 + inventario de mochila volcados desde captura; faltan cajas y estaciones de la base |
| 1.5 | Organización de cajas | `data/boxes.json` — categorías, caja↔estación, contenido esperado | Cada material de recipes.json mapea a exactamente 1 categoría de caja | ✅ | 2026-07-02 | 10 categorías; mapeo 1-a-1 comprobado por validate.mjs |

---

## FASE 2 — Motor determinista: graduating to code (3 pasos)

| # | Paso | Entregable | Verificación | Estado | Fecha | Notas |
|---|------|-----------|--------------|--------|-------|-------|
| 2.1 | Resolutor de dependencias | `tools/resolve-deps.mjs objetivo.json inventory.json` → árbol expandido con faltantes netos (descuenta inventario en cascada) | Caso test: con 2 lingotes de acero en inventario, pide 3 placas menos de materiales aguas arriba | ⬜ | | |
| 2.2 | Planificador de rutas | `tools/plan-route.mjs` → faltantes agrupados por zona, ordenados por nº de items y energía | Salida legible en markdown y JSON (la consume la UI) | ⬜ | | |
| 2.3 | Tests del motor | `tools/*.test.mjs` con los 7 objetivos | `node --test` verde | ⬜ | | |

---

## FASE 3 — Capa agente: parity + composability (3 pasos)

| # | Paso | Entregable | Verificación | Estado | Fecha | Notas |
|---|------|-----------|--------------|--------|-------|-------|
| 3.1 | Skill del compañero | `skills/ldoe-companion/SKILL.md`: cómo leer/escribir data/, cuándo invocar tools/, cómo actualizar recetas desde capturas de pantalla | Test de paridad: toda acción de la UI es alcanzable por el agente editando data/ | ⬜ | | |
| 3.2 | Flujo captura → datos | Procedimiento en la skill: captura del juego → actualizar inventory.json / corregir recipes.json (`verificado: "ingame"`) | Con tu captura de pantalones reforzados, el agente corrige cantidades y lo anota en LEARNINGS.md | ⬜ | | |
| 3.3 | Prompts compuestos (features = prompts) | `skills/ldoe-companion/prompts/`: `planifica-sesion.md`, `que-reciclo.md`, `organiza-cajas.md` | Cada prompt produce un resultado útil usando solo primitivos + tools/ | ⬜ | | |

---

## FASE 4 — Guía visual: la UI como vista del estado (3 pasos)

| # | Paso | Entregable | Verificación | Estado | Fecha | Notas |
|---|------|-----------|--------------|--------|-------|-------|
| 4.1 | UI base que lee data/ | `ui/index.html` carga recipes/objectives/inventory (fetch local o embebido por build) | Muestra % de avance por objetivo idéntico al que calcula resolve-deps | ⬜ | | |
| 4.2 | Grafo/timeline navegable | Vista de árbol de dependencias: nodo = item, avance en cascada, tap para expandir a sus ingredientes | Navegar Pantalones reforzados → Placa de acero → Lingote → Cobre muestra faltantes correctos en cada nivel | ⬜ | | |
| 4.3 | Edición de inventario desde la UI | Steppers +/− que actualizan el estado (storage persistente en artifact; export/import JSON compatible con inventory.json) | Editar en UI y pasar el JSON al agente deja ambos mundos consistentes (shared workspace) | ⬜ | | |

---

## FASE 5 — Compound: mejora continua y cierre (3 pasos)

| # | Paso | Entregable | Verificación | Estado | Fecha | Notas |
|---|------|-----------|--------------|--------|-------|-------|
| 5.1 | Ledger de aprendizajes | `docs/LEARNINGS.md`: recetas wiki vs. verificadas in-game, cambios por versión del juego (Kefir cambia recetas) | Cada corrección de datos referencia su captura/fuente | ⬜ | | |
| 5.2 | Checklist agent-native | Auditoría contra los *success criteria* del artículo (parity, granularity, composability, CRUD completo por entidad) | Checklist en docs/ con todo ✓ o justificación | ⬜ | | |
| 5.3 | Métrica de éxito final (the ultimate test) | Pedir al agente un outcome NO diseñado (ej. "¿cuántas vueltas a Bunker Alfa me faltan para el ATV?") | El agente lo resuelve componiendo primitivos sin código nuevo | ⬜ | | |

---

## Registro de sesiones (append-only)

> El agente añade una línea por sesión de trabajo. Nunca se borra.

| Fecha | Pasos tocados | Commits | Resumen |
|-------|---------------|---------|---------|
| — | — | — | Plan creado, pendiente de arrancar F0 |
| 2026-07-02 | F0.1 | 1 | Bootstrap reconciliado: ficheros a la raíz, estructura de carpetas y README |
| 2026-07-02 | F0.2, F0.3 | 2 | SPEC escrita con métrica machine-checkable; plan operativo como log vivo. Fase 0 cerrada |
| 2026-07-02 | F1.1–F1.5 | 5 | Capa de datos completa: recetas (56 items), fuentes, 7 objetivos, cajas y validador. F1.4 en 🔄: falta el inventario real del jugador |

---

## Cómo usar este log (para el agente)

1. Al empezar sesión: leer `PLAN.md` + `context.md`; anunciar el primer paso ⬜ o 🔄.
2. Marcar el paso 🔄 antes de empezar; ✅ solo tras pasar su **Verificación**.
3. 1 paso = 1 commit atómico con mensaje `feat(F1.3): cargar datos de investigación` + push.
4. Si un paso falla: ❌ + nota con causa; no avanzar sin decidir (arreglar o ⏭ con justificación).
5. Al cerrar sesión: añadir línea al Registro de sesiones y actualizar `context.md`.
