#!/bin/sh
# Actualización COMPLETA de la web (todo lo que ve la gente). Ejecutar en cada repaso diario:
#   sh tools/actualizar.sh [AAAA-MM-DD]      (por defecto, hoy en Madrid)
# Antes: meter en tools/prediccion-input.json las encuestas nuevas y en assets/noticias.json los titulares.
# Después: git add -A && git commit && git push.
cd "$(dirname "$0")/.." || exit 1
HOY=${1:-$(TZ=Europe/Madrid date +%F)}
V=$(echo "$HOY" | tr -d -)
set -e
node tools/prediccion.mjs "$HOY" >/dev/null      # proyección + datos/encuestas.csv + barra
node tools/historial.mjs "$HOY"                  # historial diario hasta hoy (rellena días que falten)
sed -i -E "s/(prediccion-data|barra-data|historial-data)\.js\?v=[0-9]+/\1.js?v=$V/g" *.html
sh tools/sellar-fecha.sh >/dev/null
# Comprobaciones: nada puede quedarse atrasado
G=$(grep -o '"generado":"[0-9-]*"' assets/prediccion-data.js | head -1 | grep -o '[0-9]\{4\}-[0-9-]*')
L=$(ls datos/historial/20*.json | tail -1 | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}')
N=$(python3 -c "import json;d=json.load(open('assets/noticias.json'));d=d if isinstance(d,list) else d['items'];print(d[0]['fecha'])")
echo "previsión: $G · historial: $L · última noticia: $N · hoy: $HOY"
[ "$G" = "$HOY" ] || { echo "ERROR: la previsión no es de hoy"; exit 1; }
[ "$L" = "$HOY" ] || { echo "ERROR: el historial no llega a hoy"; exit 1; }
echo "OK. Falta: revisar noticias/encuestas nuevas, commit y push."
