# ¿Qué reciclo?

Alin tiene el almacén lleno o quiere chatarra/materiales y pregunta qué puede
reciclar sin arrepentirse.

## Pasos (solo primitivos + tools)

1. Lo protegido primero: para cada objetivo con `activo: true` en
   `data/objectives.json`, sacar su árbol completo con
   `node tools/resolve-deps.mjs <id> --json`. Todo item que aparezca en ese árbol
   (intermedios incluidos) **no se recicla**, aunque hoy sobre.
2. Candidatos: `data/inventory.json` menos el conjunto protegido. La categoría
   «Para reciclar» de `data/boxes.json` (latas, relojes, cartas CAC usadas, equipo
   roto) es reciclable por defecto.
3. Valor de reciclaje: mirar en `data/recipes.json` las `alternativas` (p. ej.
   chatarra sustituye a mineral en el lingote de hierro) y en `data/sources.json`
   las fuentes tipo «Reciclador» (cofres → chatarra, cartas CAC → plástico,
   hélice/transmisión → titanio). Eso dice qué material sale de cada cosa.
4. Ojo con las cartas CAC A: son acceso a Bunker Alfa (`objectives.json`); solo
   reciclar si el objetivo de bunker no está activo y sobran.

## Salida

Dos listas y una advertencia:
- **Recicla ya**: item → material que produce → para qué faltante sirve.
- **Guarda aunque estorbe**: item → qué objetivo activo lo necesita (del paso 1).
- **Dudoso**: cosas de valor de evento/temporada — preguntar antes.
