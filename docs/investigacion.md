# Investigación LDoE (v1.49.5, jul-2026) — fuente de datos para F1

> Origen: investigación web (wiki Fandom, Reddit, guías) + capturas del usuario.
> Estado por defecto: `verificado: "wiki"`. Las cifras marcadas 📱 vienen de captura in-game.

## 1. Cadenas de refinado (aristas del grafo)

```
Tronco pino → Tablón pino (Carpintería) · Tronco pino → Carbón (Fundición)
Tronco roble → Tablón roble (Carpintería)
Caliza → Ladrillo de piedra (Mesa del cantero)
Mineral hierro | Chatarra → Lingote hierro (Fundición) → Placa hierro (Banco, 20m) → 2 Clavos
5 Bauxita | 2 Cable aluminio → Lingote aluminio (Fundición) ; 2 Lingotes → Placa aluminio (1h) → 2 Pernos
Mineral cobre → Lingote cobre (Fundición)
1 Ling. hierro + 1 Ling. aluminio + 1 Ling. cobre + 2 Carbón → Lingote acero (Fundición refinada, 1h30) → Placa acero (Banco, 1h)
Mineral titanio → Lingote titanio (Extractor, isla)
Fibra → Trozo de tela → Tela gruesa (Costura) ; 2 Trozo de lana → Tela de lana (Costura, 12m)
Cuero crudo → Cuero (Curtidor, 4m) ; Piel → Piel curtida (Curtidor)
```

## 2. Reciclador (objeto → salidas)

6 categorías de habilidad (Ropa, Armas fuego, Cuerpo a cuerpo, Electrónica, Mecánica, Otros), nivel máx 50.
Subir nivel con objetos baratos ANTES de reciclar valiosos.

| Objeto | Salidas |
|---|---|
| Cofre | Tablón pino, Chatarra, Pernos |
| Cartas CAC | Plástico |
| Latas/linternas | XP; Lingote aluminio |
| Llave inglesa, Katana | Lingote acero (nivel alto) |
| Transmisión ATV | 6-7 Lingote acero + Ling. titanio + Engranaje (nivel máx) |
| Hélice | Chatarra, Placa acero, Ling. titanio |
| Fragmentos armadura titanio | Lingote titanio |
| Minigun | Piezas de torreta |
| Armas 25-33% durabilidad (nivel 35+) | Componente compuesto (mods) |
| Ropa/armadura rota | Tela, Cuerda, Cuero (+Piel curtida/Tela lana/Cobre en piel reforzada) |
| Electrónica (móvil, USB, cámara, baterías) | Circuito electrónico (nivel ~20-30+) |

## 3. Fuentes de farmeo (sources.json)

| Material | Fuente |
|---|---|
| Tronco/Tablón pino | Zonas de pino; airdrops Motel |
| Caliza + Mineral hierro | Limestone Ridge (verde), **Limestone Cliffs (amarilla, mejor hierro)**, Spires (roja) |
| Mineral cobre | Frosty Backwoods (roja fría); sótano inundado zona roja |
| Bauxita | Zonas rojas con hierro; nodos de Frosty Backwoods |
| Cable aluminio | Bunker Alfa pisos 2-3 (~7/vuelta); airdrops |
| Tronco roble | Oak Bushes/Grove/Wood (rojas, requieren ATV); sótanos |
| Titanio | Isla (Sand Quarry), Puerto; reciclar hélice/transmisión/fragmentos |
| Piezas de motor | Cajas cupones Alfa; Bunker Bravo (1); bases NPC; airdrops; granero Crooked Creek |
| Ruedas/Horquilla Chopper | Cajas cupones Alfa (amarillas/rojas) |
| Depósito Chopper | Piso 1 Alfa (raro) |
| Transmisión ATV | Gasolinera (jackpot 3 tapas), Puerto, Transport Hub, Commune Trials pesadilla |
| Carta CAC A | Zombis zonas verde/amarilla; convoy destruido; airdrop |
| Carta CAC B | Cofres amarilla/roja; airdrop (→ Bunker Bravo) |
| Piel (Fur) | Zorros, ciervos del norte, lobos rabiosos, jabalíes (frío/roble) |
| Cuero crudo | Lobos y ciervos (todo el mapa) |
| Trozo de lana | Animales del norte |
| Hélice | Alcantarillas del Puerto; reputación Genesis |
| Adhesivo/Cinta | Cofres zonas amarillas y bunkers |

## 4. Hitos de progresión

- **Muros (por muro):** L1→2: 10 Caliza + 20 Tablón · L2→3: 20 Ladrillo + 10 Tablón.
  La horda solo rompe L1; L3 indestructible para la horda. Muebles = muro de metal barato.
- **Torre Norte (nivel 15):** requiere Generador Eléctrico → abre zonas de frío
  (Oak Bushes, Frosty Backwoods, Frozen Training Ground, etc.).
- **Bunker Alfa:** 1ª entrada con Carta CAC A; después código (CB Radio), reset cada 48 h.
  4 subniveles; motor económico: piezas de motor, aluminio, cupones, equipo.
- **Estaciones clave:** Curtidor (nv14), Banco de trabajo (nv28), Fundición refinada, Reciclador,
  Mesa de costura, Mesa del cantero, Mesa médica.

## 5. Objetivos precargados (objectives.json)

### Chopper (nivel 6)
Plano: 10 Tablón pino, 5 Lingote hierro, 5 Pernos.
Ensamblaje: 20 Piezas motor, 10 Cableado, 2 Ruedas chopper, 30 Pernos, 10 Rodamientos,
20 Piezas goma, 30 Chatarra, 1 Horquilla, 1 Depósito, 4 Mochila básica.

### Bunker Alfa (acceso)
1 Carta CAC A, CB Radio construida. Recomendado/vuelta: 2 armas, 5 botiquines, 5 comida/agua.

### Set de piel básico (nivel 46, Costura)
Pantalones: 6 Piel curtida, 3 Cuero, 6 Tela gruesa, 2 Placa hierro, 2 Adhesivo.
Botas: 4 Piel curtida, 2 Cuero, 3 Tela gruesa, 1 Placa hierro, 1 Adhesivo.
(Gorro y chaqueta: cantidades por verificar in-game.)

### Pantalones de piel reforzados 📱 (verificado ingame, captura Alin)
1 Pantalones de piel + 12 Piel curtida + 9 Tela de lana + 2 Cuero + 2 Placa hierro + 5 Placa acero.
Referencia wiki (misma misión «Protection From Frost»):
Gorro reforzado: 1 gorro + 9 Piel curtida + 5 Tela lana + 1 Cuero + 1 Ling. cobre + 3 Placa hierro.
Chaqueta reforzada: 1 chaqueta + 12 Piel curtida + 9 Tela lana + 2 Cuero + 2 Ling. cobre + 5 Placa hierro.

### ATV (nivel 18)
320 Pernos, 100 Rodamientos, 1 Transmisión ATV, 1 Depósito ATV, 250 Tela gruesa,
500 Chatarra, 150 Piezas goma, 16 Ruedas ATV, 120 Cableado, 200 Piezas motor.

### Motor de lancha (nivel 64; plano de lancha: visitar el Puerto)
10 Piezas motor, 3 Hélices, 20 Plástico, 10 Llave inglesa, 10 Filtro de aire, 20 Piezas goma.

### Muro nivel 3 (por muro)
Ver hitos: (10 Caliza + 20 Tablón) + (20 Ladrillo + 10 Tablón).

## 6. Organización de cajas (boxes.json)

Principios: 1 tipo de recurso por caja; cada caja pegada a la estación que la consume.

| Categoría | Cajas | Junto a |
|---|---|---|
| Materiales de construcción (troncos, tablones, caliza, ladrillo) | 3-4 | Carpintería / Cantero |
| Metales y placas (minerales, lingotes, placas, clavos, pernos, chatarra) | 3-4 | Fundición + Banco |
| Textiles y cuero (fibra, telas, lana, piel, cuero, cuerda) | 2 | Curtidor + Costura |
| Componentes de vehículo (motor, cableado, rodamientos, goma, ruedas...) | 2-3 | Chopper/ATV |
| Comida y agua | 1-2 | Huerto/Secadero |
| Medicinas | 1 | Mesa médica |
| Ropa y armadura | 1-2 | — |
| Para reciclar (latas, relojes, cartas CAC, armas/ropa rota) | 1-2 | Reciclador |
| Valiosos/eventos (cupones, monedas, gasolina) | 1 | — |
| Consumibles de expedición | 1 | Salida de la base |

## 7. Caveats
- Kefir cambia recetas entre versiones (ej. rediseño del equipo de piel en beta 1.30.1:
  ahora usa Piel curtida + Tela de lana). Ante conflicto, gana la captura in-game.
- Guías antiguas dicen que la Transmisión ATV «no existe»: desactualizado.
- Nº de cajas por categoría es orientativo.
