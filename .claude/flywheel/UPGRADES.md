# flywheel upgrades applied

## 2026-07-06 — v0.8.1 → v0.14.0
- Rango (0.8.0, 0.14.0]: siete notas, **todas `requires-action: false`** → sin estrategias
  que ejecutar, solo re-vendorizado. Verificado el camino verde de los hooks nuevos.
- Novedades incorporadas: verifier/evaluator en Haiku (v0.9/v0.14), ledger tipado +
  inyección por relevancia en session-start (v0.10), hook read-prime PreToolUse (v0.11),
  disciplina de tokens en autoloop (v0.12), umbrales de delegación en work (v0.13).
- Compat: el ledger antiguo (formato prosa) sigue cargando sin error en el nuevo session-start.

## 2026-07-06 — v0.8.0
- Paso 1 ✔ manifest presente (`.claude/flywheel/.manifest`, ya desde 0.7.0).
- Paso 2: auto-update PRs semanales **rechazado por Alin** — actualización manual vía
  `/flywheel-update` cuando el banner de arranque avise. Re-ofrecer solo si lo pide.
- Paso 3 ✔ sin ficheros `*.pre-flywheel` (ninguna edición local machacada).
