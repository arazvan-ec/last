# flywheel learnings

## 2026-07-06 — instalación de flywheel + gate determinista + 2 reglas
- Decision: plugin vendorizado en `.claude/` (skills/agents/hooks) en vez de marketplace — las sesiones web NO instalan plugins de settings.json al arrancar; lo vendorizado viaja con el clon.
- Decision: gate = `node --test && node tools/validate.mjs`, nada más. Descartado git-clean (bloquearía turnos conversacionales) y Chromium (lento/frágil). Nuevos checks se añaden DENTRO de validate.mjs o como test — el gate los hereda gratis.
- Gotcha: este ledger ≠ `docs/LEARNINGS.md` (ese es de datos del juego: recetas wiki vs ingame). No mezclar.
- Gotcha: probar SIEMPRE el camino rojo de un check inyectando el dato inválido y revirtiendo con `git checkout` — dos checks nacieron "vacuamente verdes" (0 fuentes con energia).
- Reusable: pureza de engine.mjs garantizada por test estático (`engine-purity.test.mjs`): solo imports relativos, sin require/fs/process/fetch → paridad CLI↔UI por construcción.
