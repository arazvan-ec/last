# LEARNINGS — ledger de datos verificados

> Registro append-only de correcciones de datos: wiki vs. juego real, cambios entre
> versiones de LDoE (Kefir cambia recetas sin avisar). Cada entrada referencia su
> fuente. Regla: **captura in-game > wiki**; nunca degradar `ingame` → `wiki` sin
> nueva captura.

Formato de entrada:

```
## AAAA-MM-DD — <item> (<versión del juego>)
- Fuente: captura de <quién> / wiki <enlace>
- Antes: <qué decía data/ o la wiki>
- Después: <qué se escribió en data/>
- Ficheros tocados: ...
```

---

## 2026-07-02 — Pantalones de piel reforzados (v1.49.5)

- Fuente: captura in-game de Alin (misión «Protección contra el frío»).
- Antes: sin dato fiable en data/. La referencia wiki de las piezas hermanas de la
  misma misión (gorro y chaqueta reforzados) usa el patrón *lingote de cobre +
  placa de hierro* como metales.
- Después: `1 Pantalones de piel + 12 Piel curtida + 9 Tela de lana + 2 Cuero +
  2 Placa de hierro + 5 Placa de acero` — los metales reales son hierro + **acero**,
  no cobre + hierro. Cargada directa de la captura con `verificado: "ingame"`.
- Ficheros tocados: `data/recipes.json` (F1.3). Es además la receta canónica del
  proyecto: `validate.mjs` (CANONICA), `tools/resolve-deps.test.mjs` y `docs/SPEC.md` §4.
- Pendiente de la misma misión: gorro y chaqueta reforzados siguen `wiki`; el gorro
  y la chaqueta base ni siquiera tienen receta (hojas provisionales) — verificar
  con captura cuando Alin abra la Mesa de costura.
