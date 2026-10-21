#!/usr/bin/env python3
"""Actualiza los datos de vuelos (página Falcon).

Uso:  python3 tools/vuelos_actualizar.py [Registro_de_vuelos.xlsx ...]

1. Añade a datos/vuelos/registro.csv los vuelos de las exportaciones de
   falcondespega.es que se pasen (sin duplicar: clave aeronave + hora de despegue).
2. Regenera assets/vuelos-data.json (totales por año) y assets/vuelos-dias.json
   (un registro por vuelo, para el filtro por fechas).
Las comunidades se normalizan con datos/vuelos/mapas.json; si aparece un lugar
de España nuevo sin comunidad, se avisa y cuenta como «(sin precisar)».
"""
import csv, json, sys, collections, datetime, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(R, 'datos/vuelos/registro.csv')
MAP = json.load(open(os.path.join(R, 'datos/vuelos/mapas.json'), encoding='utf-8'))
OLD = json.load(open(os.path.join(R, 'assets/vuelos-data.json'), encoding='utf-8'))
NUM = ('tiempo_vuelo_segundos', 't_co2', 'galones', 'coste', 'equivalencia_coche_segundos')

def load_csv():
    with open(CSV, encoding='utf-8') as f:
        return [dict(r) for r in csv.DictReader(f)]

def load_xlsx(p):
    import openpyxl
    ws = openpyxl.load_workbook(p, read_only=True).worksheets[0]
    rows = list(ws.iter_rows(values_only=True)); h = rows[0]
    return [{k: ('' if v is None else str(v)) for k, v in zip(h, r)} for r in rows[1:] if r[0]]

rows = load_csv()
key = lambda r: (r['aeronave'], r['hora_despegue'])
have = {key(r) for r in rows}
for p in sys.argv[1:]:
    nuevos = [r for r in load_xlsx(p) if key(r) not in have]
    for r in nuevos: have.add(key(r))
    rows += nuevos
    print(f'{p}: {len(nuevos)} vuelos nuevos')
rows.sort(key=lambda r: (r['fecha'], r['hora_despegue'][11:]))
with open(CSV, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

U, A, names = OLD['usos'], OLD['aer'], OLD['names']
n2i = {v: k for k, v in names.items()}; n2i['España'] = 'ESP'
c2i = MAP['iso2_iso3']; P = MAP['prov_ca']; X = MAP['ca_extra']
CAS = {'(sin precisar)', 'Andalucía', 'Aragón', 'Asturias', 'Canarias', 'Cantabria', 'Castilla y León', 'Castilla-La Mancha',
       'Cataluña', 'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Islas Baleares', 'La Rioja', 'Navarra', 'País Vasco',
       'Región de Murcia', 'Comunidad de Madrid', 'Ceuta', 'Melilla'}
aviso = collections.Counter()
def places(r):
    pts = []
    for s in ('despegue', 'aterrizaje'):
        iso = c2i.get(r[s + '_codigo_pais']) or n2i.get(r[s + '_pais']); ca = r[s + '_ca']
        if iso is None:
            aviso['país sin código: ' + r[s + '_pais']] += 1; continue
        if iso == 'ESP':
            n = ca if ca in CAS else P.get(ca) or X.get(ca)
            if n is None:
                if ca != 'España': aviso['lugar sin comunidad: ' + ca] += 1
                n = '(sin precisar)'
            if n == 'Comunidad de Madrid': continue
            ca = n
        elif iso not in names:
            names[iso] = r[s + '_pais']
        if (iso, ca) not in pts: pts.append((iso, ca))
    return pts

for r in rows:
    if r['uso'] not in U: U.append(r['uso'])
    if r['aeronave'] not in A: A.append(r['aeronave'])
f = lambda r, c: float(r[c] or 0)
tot = collections.defaultdict(lambda: [0, 0, 0, 0]); ac = collections.Counter(); vis = collections.Counter()
E0 = datetime.date(2021, 3, 1); PL, PI, F = [], {}, []
for r in rows:
    y, u, a = int(r['fecha'][:4]), U.index(r['uso']), A.index(r['aeronave'])
    t = tot[(y, u)]; t[0] += 1; t[1] += f(r, 'tiempo_vuelo_segundos') / 3600; t[2] += f(r, 'coste'); t[3] += f(r, 't_co2')
    ac[(y, u, a)] += 1
    ps = places(r)
    for p in ps: vis[(y, u) + p] += 1
    ix = []
    for p in ps:
        if p not in PI: PI[p] = len(PL); PL.append(list(p))
        ix.append(PI[p])
    F.append([(datetime.date.fromisoformat(r['fecha']) - E0).days, u, a, ix, round(f(r, 'tiempo_vuelo_segundos') / 3600, 2), round(f(r, 'coste')), round(f(r, 't_co2'), 2)])
out = {'usos': U, 'aer': A, 'names': names,
       'tot': sorted([[y, u, v[0], round(v[1], 2), round(v[2], 2), round(v[3], 2)] for (y, u), v in tot.items()]),
       'vis': sorted([list(k) + [v] for k, v in vis.items()], key=lambda x: (x[0], x[1], x[2], x[3])),
       'ac': sorted([list(k) + [v] for k, v in ac.items()])}
json.dump(out, open(os.path.join(R, 'assets/vuelos-data.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
json.dump({'e': '2021-03-01', 'fin': rows[-1]['fecha'], 'pl': PL, 'f': F}, open(os.path.join(R, 'assets/vuelos-dias.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(rows)} vuelos, del {rows[0]["fecha"]} al {rows[-1]["fecha"]}')
for k, v in aviso.most_common(): print('AVISO', k, v)
print('Recuerda cambiar en la web los textos «hasta el …» y el número total de vuelos.')
