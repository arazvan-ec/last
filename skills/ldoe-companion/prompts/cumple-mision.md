# Cumple una misión (proceso guiado)

Alin dice «quiero hacer la misión X» (o manda una captura de su panel). Este
proceso lo lleva de la misión al objetivo cumplido en sesiones cortas, con un
checkpoint por sesión. Es un BUCLE: los pasos 3-6 se repiten hasta cerrar.

## 0. Identificar y clasificar la misión

Con la captura del panel (o el nombre):
- **De crafteo** (pide un objeto): entra en `data/objectives.json` con sus
  `requisitos` y `activo: true`. Si el objeto no está en `recipes.json`, pedir
  captura de su plano (pantalla PLANOS) y darlo de alta (flujo captura → datos).
- **De tareas de mapa** (evento, «completa X tareas»): NO entra en el grafo; se
  sigue en `context.md` (sección «Eventos activos») con timers y contador.
- **Mixta** (el evento exige un objeto, p. ej. ropa de invierno): las dos cosas.
  El objeto se vuelve requisito-llave y se prioriza.

Anotar SIEMPRE los relojes visibles (temporada, zonas que caducan): el plan se
ordena por lo que caduca antes.

**Requisitos de entrada (la puerta).** Antes de rutar a Alin a un sitio,
comprobar qué exige entrar y sobrevivir allí:
- **Frío** (norte helado, campo de entrenamiento helado): ropa de invierno —
  set de piel o reforzado. Las stats de frío van en las notas de recipes.json
  cuando hay captura (p. ej. gorro reforzado: frío 4).
- **Plaga / radiación**: equipo o consumibles específicos (por investigar al
  toparse con la primera zona de este tipo).
- **Llave / desbloqueo**: carta CAC A para Bunker Alfa, plano de lancha en el
  Puerto, etc. — están como requisitos u objetivos en objectives.json.
- **Combate duro** (zonas calavera, campamentos bandidos): armas + botiquines
  (recomendación registrada: 2 armas / 5 botiquines / 5 comida-agua).

Si Alin NO cumple la puerta, el requisito se convierte en **sub-objetivo previo**
y el bucle se aplica primero a él (así «Camino al barco» → antes, el set de
invierno). Nunca poner en el plan una parada cuya puerta no se cumple; si la
puerta es desconocida, decirlo y pedir captura de la zona.

## 1. Volcar el estado real

Pedir las capturas que falten (inventario, PLANOS del objeto, panel de tareas).
Volcar cantidades a `data/inventory.json` — las pantallas de crafteo enseñan
`tengo/necesito`: son la mejor fuente de stock. Después: `node tools/validate.mjs`.

## 2. Calcular, no estimar

- `node tools/resolve-deps.mjs <objetivo>` → % real y faltantes netos.
- `node tools/plan-route.mjs <objetivo>` → dónde cae cada faltante.
- Si la misión es de tareas de mapa: cruzar las zonas de las tareas con la ruta
  de farmeo — cada viaje debe servir a las dos cosas.

## 3. Plan de sesión (una sentada de juego)

Entregar SIEMPRE en tres bloques, ordenado por relojes:
- **Antes de salir**: colas de producción con lo que ya hay (lo más lento primero,
  p. ej. placas de acero 1h), reparar equipo, energía (si está al tope, salir ya).
- **El viaje**: 2-4 paradas máx. Primero lo que caduca hoy; farmeo oportunista
  anotado por parada. Avisar de combate/frío/plaga si la zona lo pide.
- **Al volver**: qué craftear con lo recogido, en orden de dependencias
  (ingredientes base → intermedios → objeto), y qué caja toca cada sobrante.

## 4. Checkpoint (cierra la sesión)

Pedir a Alin 1-2 capturas del resultado (panel de la misión, pantalla CREAR del
objeto). Actualizar `inventory.json` / contador del evento en `context.md`.
Si apareció una receta nueva o distinta: `recipes.json` + `docs/LEARNINGS.md`.
Commit + push: el checkpoint no existe si no está en el repo.

## 5. ¿Cerrada?

- **Sí** → `activo: false` en objectives.json (o cerrar el evento en context.md),
  anotar en el Registro de PLAN.md si tocó datos, y proponer el siguiente objetivo.
- **No** → volver al paso 2 con el estado nuevo. Cada vuelta el plan se encoge:
  si un faltante no baja entre sesiones, su fuente en `sources.json` es mala o
  está `por investigar` — resolver eso antes de mandar a Alin otra vez de viaje.

## Salida de cada iteración

Dos piezas:
1. **Plan de sesión** (bloque 3) en texto + el % del motor + qué captura se espera
   en el checkpoint. Corto: cabe en una pantalla de móvil.
2. **Organigrama de la misión en HTML** (artifact): el desglose completo como
   árbol jerárquico — misión → puertas y tareas → sub-objetivos con su % →
   materiales con cantidad y zona. Las puertas no cumplidas bloquean visualmente
   sus ramas (candado); lo cumplido se marca en verde. Los datos salen SIEMPRE
   de `resolve-deps --json` + `sources.json`, nunca a ojo. Se regenera en la
   misma página en cada checkpoint para ver el árbol encogerse.
