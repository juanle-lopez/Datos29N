# Datos históricos para calibrar el modelo de previsión

Se guardan aquí para no tener que volver a buscarlos cada vez que se rehaga o se pruebe el método.

| Archivo | Qué es | Fuente |
|---|---|---|
| `encuestas-2023-23J.csv` | 94 encuestas con trabajo de campo que acaba entre el 9 y el 22-jul-2023 (PP, PSOE, Vox, Sumar, % de voto) | Wikipedia, *Opinion polling for the 2023 Spanish general election* |
| `encuestas-2019-10N.csv` | Encuestas con trabajo de campo que acaba en las dos últimas semanas antes del 10-nov-2019 (PSOE, PP, Vox, Cs). **Falta Unidas Podemos**: esa tabla no lo incluye | Wikipedia, *Opinion polling for the November 2019 Spanish general election* |
| `resultados-nacionales.csv` | Resultado nacional real de ambas elecciones | Ver la columna `nota` |

## Cautelas

- Las tablas se extrajeron de Wikipedia con una lectura automática de la página, no con una descarga del archivo original. **Hay que contrastar una muestra de filas con la página antes de basar una conclusión en ellas.**
- La fila de «resultado» de la tabla de 2019 daba 12,9 % para Vox, que no es el resultado real (15,09 %). Se usa 15,09 %, de la tabla nacional de orain.eus. Eso indica que conviene revisar también otros valores extraídos.
- Las encuestas con solo proyección de escaños (sin porcentaje) y las internas de partidos se han dejado fuera.
- Los porcentajes son sobre voto válido; los de Wikipedia pueden estar redondeados a un decimal.

## Resultados por provincia (añadidos)

| Archivo | Qué es |
|---|---|
| `provincias-2019-28A.csv` | % y escaños de PSOE, PP, Cs, UP, Vox en las 52 circunscripciones, abril 2019 |
| `provincias-2019-10N.csv` | Ídem, noviembre 2019 |
| `provincias-2023-23J.csv` | PP, PSOE, Vox, Sumar, 2023 (Vox en Santa Cruz de Tenerife = 7,56 %) |

Fuente: Wikipedia, *Results breakdown of the … Spanish general election (Congress)*. Comprobación: los escaños suman exactamente los totales oficiales de cada partido, y Madrid y Albacete 2023 coinciden con `assets/home.js`. Navarra: PP y Cs van en coalición en 2019 y quedan en blanco.

## Pruebas hechas con estos datos (24-oct-2026)

- **Pesos por acierto de cada encuestadora** (`tools/backtest_empresas.py`): no mejora de forma consistente. Error medio 23-J con pesos de 10-N: 1,77 (1/MAE) frente a 1,80 de media simple; 10-N con pesos de 23-J: 1,25 frente a 1,19 (peor). Se descarta.
- **Cambio distinto por provincia** (`tools/backtest_provincias.py`), con el cambio nacional real como entrada y la pendiente entrenada en la otra transición: no mejora. Error de voto por provincia 28A→10N: 1,67 pp frente a 1,12 del reparto uniforme; 10N→23J: 2,69 frente a 2,70. Diferencia de escaños: 38 frente a 32, y 51 frente a 49. Las pendientes cambian de signo entre transiciones (PSOE −0,69 y +0,14), señal de sobreajuste con solo dos casos. Se mantiene el reparto uniforme.

- **Error compartido entre encuestas** (rango del 80 %): el error de la media frente al resultado real es de 0,2 a 3,3 pp (raíz cuadrática media 1,7 pp en 7 casos), muy por encima de la dispersión esperada por azar (0,2–0,4 pp). Es decir, las encuestas fallan juntas. El modelo ya lo recoge con `sdError` = 1,9, así que no hace falta ensanchar nada.
- **Efecto de cada empresa** (14 empresas en ambas elecciones): corregir con el efecto medido en la otra elección mueve la media entre 0,02 y 0,24 pp, a veces a mejor y a veces a peor (PP 1,07→1,15; Vox −2,47→−2,23). Sin mejora clara; se descarta.

## Pendiente de conseguir

- Encuestas de abril de 2019 y de 2016 si se quiere más base para la corrección histórica y para el acierto por empresa.
