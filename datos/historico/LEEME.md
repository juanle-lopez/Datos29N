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

## Pendiente de conseguir

- Resultados por provincia (52 circunscripciones) de abril de 2019, noviembre de 2019 y 2023 para PP, PSOE, Vox, Unidas Podemos/Sumar y Cs. De 2023 ya están en `assets/home.js` (`DATA[].p`). Hacen falta para probar un reparto con cambio distinto por provincia.
- Encuestas de abril de 2019 y de 2016 si se quiere más base para la corrección histórica y para el acierto por empresa.
