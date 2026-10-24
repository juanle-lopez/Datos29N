#!/usr/bin/env python3
"""Prueba: ¿mejora la previsión ponderar las encuestas por lo que acertó cada empresa en la elección anterior?
Usa datos/historico/encuestas-2019-10N.csv y encuestas-2023-23J.csv (14 empresas presentes en ambas).
Para cada empresa: media de sus 3 últimas encuestas antes de la votación. Se predice una elección con los pesos
calculados en la otra y se compara el error medio absoluto (PP, PSOE, Vox) de la media ponderada con el de la media simple."""
import csv, collections, statistics as st, os
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'datos/historico/')
R23 = {'PP': 33.06, 'PSOE': 31.70, 'VOX': 12.39}; R19 = {'PP': 20.82, 'PSOE': 28.00, 'VOX': 15.09}; K = list(R23)
def comp(f):
    d = collections.defaultdict(list)
    for r in csv.DictReader(open(D + f)): d[r['empresa']].append(r)
    return {e: {k: st.mean(float(r[k]) for r in sorted(rs, key=lambda r: r['trabajo_campo_fin'])[-3:]) for k in K} for e, rs in d.items()}
P23, P19 = comp('encuestas-2023-23J.csv'), comp('encuestas-2019-10N.csv')
S = [e for e in P23 if e in P19 and e != 'CIS']
mae = lambda x: st.mean(abs(v) for v in x.values())
def err(P, R, S, w):
    tw = sum(w[e] for e in S); return {k: sum(w[e] * P[e][k] for e in S) / tw - R[k] for k in K}
H = lambda P, R: {e: mae({k: P[e][k] - R[k] for k in K}) for e in P}
for nom, Pt, Rt, Pp, Rp in (('23-J con acierto de 10-N', P23, R23, P19, R19), ('10-N con acierto de 23-J', P19, R19, P23, R23)):
    h = H(Pp, Rp); base = mae(err(Pt, Rt, S, {e: 1 for e in S}))
    for pw in (1, 2):
        w = {e: 1 / h[e] ** pw for e in S}; print(f'{nom}: peso 1/MAE^{pw}: {mae(err(Pt, Rt, S, w)):.3f} frente a media simple {base:.3f}')
