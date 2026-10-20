# Historial diario de la predicción

Un archivo por día (`AAAA-MM-DD.json`) con la media de encuestas, los escaños, el margen del 80 % y **qué cambió respecto al día anterior**.
Lo genera `tools/historial.mjs` (después de `tools/prediccion.mjs`). Un día registrado no se pisa; los días reconstruidos se recalculan.

## Contexto: eventos, noticias y declaraciones (campo `contexto`)

Cada día puede llevar apuntes de lo que pasó alrededor de los cambios del modelo. Se ven al pulsar ese día en el gráfico del partido.
Se añaden con:

```sh
node tools/contexto.mjs 2026-10-12 --partido PP --tipo declaración --fase antes \
  --texto "Feijóo anuncia en un acto en … que …" --url https://… --medio "Europa Press" --hecho 2026-10-11
```

Formato de cada apunte: `{p, tipo, t, medio, u, hecho}`. `p` = PP, PSOE, VOX, SUMAR o general (afecta a todos). `tipo` = evento, noticia, declaración, anuncio, propuesta (nueva propuesta o programa) o resolución. `pos` = posible relación (opcional).

### Antes y después

Cada apunte lleva `fase`: `antes` (hechos de los días previos a la encuesta, «posibles factores») o `despues` (reacciones y cobertura en los 1-3 días siguientes: cómo cuentan la encuesta los medios, declaraciones de los partidos sobre esos datos, cambios de mensaje o de campaña). Por defecto es `antes`. Los de `despues` se muestran como «reacciones y cobertura», sin afirmar que sean consecuencia del cambio. Se completan en los días siguientes, cuando la revisión diaria vuelve a mirar cada cambio de los últimos 5 días.

### Cuándo se investiga

Cualquier cambio de tendencia: un día en que la media o los escaños de un partido se mueven, o cambia la proyección al 29-N, abre una búsqueda de qué pasó esos días (eventos, declaraciones, propuestas nuevas) para los cuatro partidos y lo general, y se apunta lo que se encuentre.

### Reglas (iguales para todos los partidos)

1. **El hecho se describe sin causas; la posible relación va aparte y como hipótesis.** `--texto` dice qué pasó, cuándo y quién (sin «provocó», «se debe a», «explica la bajada»). Si hay una posible relación con el cambio, va en `--posible`, con lenguaje prudente («puede haber influido», «coincide con…») y nunca como hecho. La página lo muestra como «hipótesis, no demostrada».
2. **Cada apunte lleva fuente** (URL y medio). Preferir fuentes primarias (BOE, Congreso, Poder Judicial, Junta Electoral Central, web del partido) o, si es prensa, hechos confirmados por medios de distinta línea editorial.
3. **Mismos criterios para los cuatro partidos.** Para cada encuesta nueva que cambie la media, se revisan los 3 días anteriores a su publicación para PP, PSOE, Vox y Sumar + Podemos, y también los hechos generales (calendario electoral, debates, pactos). Si no hay nada destacable para un partido, no se inventa nada, pero tampoco se apuntan solo las malas noticias de uno.
4. **Solo hechos relevantes y comprobables:** votaciones y decisiones del Congreso, resoluciones judiciales o cambios de fase de casos ya listados en la web (con presunción de inocencia), anuncios formales de candidaturas, programas, pactos o dimisiones, comparecencias y declaraciones públicas de dirigentes de primer nivel, debates y actos de campaña. Fuera: rumores, opiniones, sondeos de redes y cuentas anónimas.
5. **Sin «sentimiento en redes»:** no se usa ni se apunta.
6. Un apunte por hecho; sin duplicados (mismo partido y misma URL).
7. Nada de contenido de propaganda ni de reflexión: desde el 28-nov no se añade nada que parezca llamada al voto.
