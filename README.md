# Datos 29N

Web informativa, independiente y sin publicidad sobre las elecciones generales del **29 de noviembre de 2026** en España. Reúne datos con su fuente enlazada y dice también lo que no se sabe.

**Web:** https://juanle-lopez.github.io/Datos29N/

Esta web no recomienda voto y no está vinculada a ningún partido.

## Qué hay

| Apartado | Página | Contenido |
|---|---|---|
| Simulador | `index.html` | Reparto de los 350 escaños en las 52 circunscripciones a partir del voto nacional (media simple de encuestas o resultados de 2023). |
| Predicción | `prediccion.html` | Proyección experimental de escaños hasta el 29-N con margen de error, el modelo explicado y su prueba con 2019 y 2023. |
| Propuestas | `propuestas.html` | Qué propone cada partido, tema a tema. |
| Promesas | `promesas.html` | Lo que se prometió y lo que se hizo. |
| Casos | `casos.html` | Casos judiciales, con la fase en que está cada uno. |
| Gastos | `gastos.html` | Gasto público por áreas y por tipo desde 2012, sueldos del Gobierno y coste del personal político, impuestos y lo que falta. |
| Falcon | `vuelos.html` | Vuelos registrados de los aviones oficiales, con fuentes. |
| Noticias | `noticias.html` | Titulares del 29-N con enlace a la fuente. |
| Mesas | `mesas.html` | Guía de las mesas electorales: plazos, causas y calculadora. |
| Método | `metodo.html` | Cómo se hace cada cosa, avisos y fuentes consultadas. |

## Principios

- **Cada dato con su fuente.** Si no hay fuente verificable, no se publica.
- **Lo que no se sabe, se dice.** Las páginas incluyen avisos de límites en vez de cifras inventadas.
- **Mismas reglas para todos los partidos.** El orden de los partidos es el del simulador y no implica nada.
- **Sin recomendación de voto.**
- **Veda de encuestas.** La ley electoral prohíbe publicar encuestas en los cinco días previos a la votación. La sección de Predicción se oculta sola a partir del 24-11-2026; el plazo exacto debe confirmarse con la Junta Electoral Central.

## Estructura

```
index.html, prediccion.html, …   Páginas (HTML estático)
assets/
  style.css, gastos.css          Estilos
  core.js                        Menú, barra inferior y utilidades comunes
  home.js                        Simulador (D'Hondt por circunscripción)
  prediccion.js                  Gráficos de la proyección
  prediccion-data.js             Datos generados por tools/prediccion.mjs
  gastos.js, vuelos.js, …        Un script por apartado
  *.json                         Datos de noticias, vuelos y mapas
datos/gastos-politicos/          Fuentes y lista de pendientes de gastos políticos
datos/historial/                 Un archivo por día con la media de encuestas, los escaños y qué cambió (lo escribe tools/historial.mjs)
tools/
  prediccion.mjs                 Genera la proyección (assets/prediccion-data.js)
  historial.mjs                  Guarda el día en datos/historial/ y regenera assets/historial-data.js
  prediccion-input.json          Encuestas y parámetros del modelo
  sellar-fecha.sh                Actualiza la fecha de «Actualizado el…» de la portada
```

No hay dependencias ni paso de compilación: es HTML, CSS y JavaScript sin framework.

## Ejecutar en local

```sh
python3 -m http.server 8000
# abrir http://localhost:8000/
```

## Cómo se calcula

- **Simulador.** Para PP, PSOE, Vox y Sumar (con Podemos agrupado) se multiplica el voto de 2023 en cada provincia por la razón entre el voto nacional elegido y el de 2023; el resto de partidos mantiene su voto, se reescala cada provincia a 100, se aplica el mínimo del 3 % y se reparten los escaños con D'Hondt.
- **Media de encuestas.** Media simple, sin ponderar, de las encuestas privadas nacionales publicadas del 24-sep al 23-oct-2026 (la última de cada empresa). El CIS no entra en la media y se muestra aparte como segundo escenario.
- **Predicción.** Tendencia amortiguada entre las dos últimas encuestas de la misma empresa, incertidumbre que crece con los días y error histórico de las encuestas, 4.000 simulaciones y D'Hondt. Es un modelo experimental, no una previsión oficial, y no da probabilidad de mayoría a propósito. Detalle completo en la web.

Para recalcular la proyección tras actualizar `tools/prediccion-input.json`:

```sh
node tools/prediccion.mjs        # usa la fecha de hoy
node tools/prediccion.mjs 2026-10-19
node tools/historial.mjs 2026-10-19   # después: guarda el día (los anteriores se reconstruyen; un día ya registrado no se pisa)
```

Antes de cada publicación se actualiza la fecha de la portada:

```sh
sh tools/sellar-fecha.sh
```

## Fuentes principales

Resultados de 2023 (tablas por circunscripción), encuestas recopiladas en elecciones29noviembre.com, barómetro del CIS, Eurostat (gasto público por tipo y función, IPCA y PIB) y las fuentes enlazadas en cada apartado. La lista completa está en la página [Método](https://juanle-lopez.github.io/Datos29N/metodo.html).

## Contribuir

Si encuentras un error o un dato sin fuente, abre una *issue* con el enlace al documento que lo corrige.

## Autoría

Por **JuanLe**. Proyecto independiente y sin publicidad.
