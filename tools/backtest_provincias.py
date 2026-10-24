"""Backtest: reparto uniforme (actual) vs cambio distinto por provincia.
Transiciones: 28A-2019 -> 10N-2019 y 10N-2019 -> 23J-2023. Entrada: swing nacional REAL (oráculo) para aislar el efecto provincial.
Partidos: PP, PSOE, VOX, UP/SUMAR (Cs desaparece en 2023 y no se modela)."""
import csv, json, re, math, itertools, sys
D='datos/historico/'
def load(f,cols):
    out={}
    for r in csv.DictReader(open(D+f)):
        out[r['circunscripcion']]={k:(float(r[k+'_pct']) if r[k+'_pct'] else None) for k in cols}
        out[r['circunscripcion']]['_s']={k:int(r[k+'_esc']) for k in cols}
    return out
Ps=['PP','PSOE','VOX','UP']
a28=load('provincias-2019-28A.csv',['PSOE','PP','CS','UP','VOX'])
n10=load('provincias-2019-10N.csv',['PSOE','PP','VOX','UP','CS'])
j23=load('provincias-2023-23J.csv',['PP','PSOE','VOX','SUMAR'])
for v in j23.values(): v['UP']=v.pop('SUMAR'); v['_s']['UP']=v['_s'].pop('SUMAR')
# escaños por provincia (suma de 'a' de home.js 2023)
js=open('assets/home.js').read(); m=re.search(r'const DATA=(\[.*?\]);\n',js,re.S)
DATA=json.loads(m.group(1))
name={'Araba/Álava':'Álava','Illes Balears':'Balearic Islands','Bizkaia':'Biscay','Navarra':'Navarre','Sevilla':'Seville'}
SEATS={name.get(d['n'],d['n']):sum(d['a'].values()) for d in DATA}
assert sum(SEATS.values())==350,sum(SEATS.values())
prov=list(SEATS)
def dhondt(votes,n):
    q=sorted(((v/(i+1),k) for k,v in votes.items() for i in range(n)),reverse=True)[:n]
    r={k:0 for k in votes}
    for _,k in q:r[k]+=1
    return r
def w(p):return SEATS[p]
def natmean(T,k):
    num=den=0
    for p in prov:
        if T[p][k] is None:continue
        num+=w(p)*T[p][k];den+=w(p)
    return num/den
def predict(prev,new,mode,beta=None):
    """devuelve voto previsto por provincia/partido"""
    pred={p:{} for p in prov}
    for k in Ps:
        R={}
        # swing nacional real sobre las provincias con dato en ambas
        ps=[p for p in prov if prev[p][k] is not None and new[p][k] is not None]
        tgt=sum(w(p)*new[p][k] for p in ps)/sum(w(p) for p in ps)
        pm=sum(w(p)*prev[p][k] for p in ps)/sum(w(p) for p in ps)
        for p in prov:
            v0=prev[p][k]
            if v0 is None:pred[p][k]=None;continue
            z=math.log(v0/pm) if v0>0 else 0
            pred[p][k]=v0*(tgt/pm)*math.exp((beta[k] if beta else 0)*z) if mode=='prov' else v0*tgt/pm
        # renormaliza al objetivo nacional
        cur=sum(w(p)*pred[p][k] for p in ps)/sum(w(p) for p in ps)
        for p in ps:pred[p][k]*=tgt/cur
    return pred
def fit(prev,new):
    """pendiente beta_k de log(new/prev) frente a log(prev/media nacional)"""
    beta={}
    for k in Ps:
        xs=[];ys=[]
        ps=[p for p in prov if prev[p][k] and new[p][k]]
        pm=natmean(prev,k);nm=natmean(new,k)
        for p in ps:
            xs.append(math.log(prev[p][k]/pm));ys.append(math.log(new[p][k]/prev[p][k])-math.log(nm/pm))
        mx=sum(xs)/len(xs);my=sum(ys)/len(ys)
        beta[k]=sum((x-mx)*(y-my) for x,y in zip(xs,ys))/sum((x-mx)**2 for x in xs)
    return beta
def seats(pred,prev):
    out={}
    for p in prov:
        v={k:pred[p][k] for k in Ps if pred[p][k] and pred[p][k]>=3}
        oth=100-sum(prev[p][k] for k in Ps if prev[p][k])-(prev[p].get('CS') or 0)
        v['OTR']=max(oth,0.01)  # resto, fijo
        out[p]=dhondt(v,SEATS[p])
    return out
def metrics(pred,new,prev):
    mae=[];sm=0;tot={k:0 for k in Ps};tr={k:0 for k in Ps}
    s=seats(pred,prev)
    for p in prov:
        for k in Ps:
            if new[p][k] is not None and pred[p][k] is not None:mae.append(abs(pred[p][k]-new[p][k]))
            sm+=abs(s[p].get(k,0)-new[p]['_s'][k]);tot[k]+=s[p].get(k,0);tr[k]+=new[p]['_s'][k]
    return sum(mae)/len(mae),sm,tot,tr
T=[('28A->10N',a28,n10),('10N->23J',n10,j23)]
print('Transición   método        MAE_voto(pp)  MAE_esc(suma abs)  totales previstos vs reales')
for i,(nm,prev,new) in enumerate(T):
    u=predict(prev,new,'uni');mu=metrics(u,new,prev)
    print(nm,'uniforme   ',round(mu[0],2),mu[1],mu[2],mu[3])
    # entrenar en la otra transición
    ot=T[1-i];beta=fit(ot[1],ot[2])
    pr=predict(prev,new,'prov',beta);mp=metrics(pr,new,prev)
    print(nm,'prov(otra)  ',round(mp[0],2),mp[1],mp[2],' beta',{k:round(b,2) for k,b in beta.items()})
    # oráculo: ajustado a la misma transición (techo)
    b2=fit(prev,new);po=predict(prev,new,'prov',b2);mo=metrics(po,new,prev)
    print(nm,'prov(oráculo)',round(mo[0],2),mo[1],' beta',{k:round(b,2) for k,b in b2.items()})
