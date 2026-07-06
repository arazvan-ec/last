#!/usr/bin/env bash
# flywheel gate — reglas deterministas de "terminado" para este repo.
# Lo ejecuta el Stop hook (.claude/flywheel/bin/gate.sh) en cada fin de turno:
# si algo falla, el agente no puede declarar el trabajo terminado.
# Reglas: rápidas (<5s), sin red, sin navegador. cwd = raíz del repo.
set -euo pipefail

echo "gate ▸ regla 1/2: motor (node --test)"
node --test

echo "gate ▸ regla 2/2: integridad de datos (tools/validate.mjs)"
node tools/validate.mjs

echo "gate ✔ todas las reglas en verde"
