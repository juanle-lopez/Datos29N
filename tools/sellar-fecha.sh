#!/bin/sh
# Actualiza «Actualizado el … · HH:MM (GMT+X)» en index.html con la hora actual de Madrid.
# Ejecutar antes de cada commit: sh tools/sellar-fecha.sh
cd "$(dirname "$0")/.." || exit 1
TZ=Europe/Madrid
export TZ
D=$(date +%-d); M=$(date +%m); Y=$(date +%Y); H=$(date +%H:%M); Z=$(date +%z)
case $M in 01)N=enero;;02)N=febrero;;03)N=marzo;;04)N=abril;;05)N=mayo;;06)N=junio;;07)N=julio;;08)N=agosto;;09)N=septiembre;;10)N=octubre;;11)N=noviembre;;12)N=diciembre;;esac
O=$(echo "$Z" | cut -c2-3 | sed 's/^0//')
sed -i -E "s|Actualizado el [^<]*</p>|Actualizado el $D de $N de $Y · $H (GMT+$O)</p>|" index.html
grep -n "Actualizado el" index.html
