// Genera assets/prediccion-data.js: proyección de voto y escaños hasta el 29-N.
// Uso: node tools/prediccion.mjs [AAAA-MM-DD]   (fecha de "hoy"; por defecto la del sistema)
import fs from 'fs';
const root=new URL('..',import.meta.url).pathname;
const inp=JSON.parse(fs.readFileSync(root+'tools/prediccion-input.json','utf8'));
const src=fs.readFileSync(root+'assets/home.js','utf8');
const {DATA,simulate}=new Function(src.split('\n')[0]+'\n'+src.slice(src.indexOf('const PARTIES'),src.indexOf('const SITE_URL'))+'\nreturn {DATA,simulate}')();
const K=['PP','PSOE','VOX','SUMAR'];
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const sdev=a=>{const m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))};
const round=(x,d=1)=>Math.round(x*10**d)/10**d;
const day=s=>Date.UTC(...s.split('-').map((x,i)=>i==1?x-1:+x))/864e5;
const iso=n=>new Date(n*864e5).toISOString().slice(0,10);
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rand=rng(29112026);
function gauss(){let u=0;while(!u)u=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rand())}
const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.max(0,Math.round(p*(s.length-1))))]};
const hoy=process.argv[2]||new Date().toISOString().slice(0,10);
const D0=day(hoy),DE=day('2026-11-29'),T=DE-D0;
const tau=inp.tau, damp=t=>tau*(1-Math.exp(-t/tau));   // recorrido acumulado de la tendencia, amortiguada
const volDay=inp.sdDeriva40**2/40;                       // varianza diaria de la deriva
// Tendencia por día: cambio entre las dos últimas encuestas de la MISMA empresa (se anulan los sesgos de empresa)
function tendencia(tipo){
  const por={};inp.historial.filter(h=>h.tipo===tipo&&!h.aprox).forEach(h=>{(por[h.e]=por[h.e]||[]).push(h)});
  // también cuentan las encuestas privadas de octubre (inp.privadas) de empresas con histórico
  if(tipo==='privada')inp.privadas.forEach(p=>{const n=p.e.split(' /')[0];Object.keys(por).forEach(e=>{if(e.startsWith(n)&&!por[e].some(h=>h.f===p.f))por[e].push({...p,e})})});
  const tr={},cnt={};K.forEach(k=>{tr[k]=[];});
  const usadas=[];
  Object.entries(por).forEach(([e,arr])=>{arr.sort((a,b)=>a.f<b.f?-1:1);
    K.forEach(k=>{const v=arr.filter(h=>h[k]!=null);if(v.length>=2){const a=v[v.length-2],b=v[v.length-1];tr[k].push((b[k]-a[k])/(day(b.f)-day(a.f)));usadas.push(`${e} ${k}: ${a.f}→${b.f}`)}})});
  const o={};K.forEach(k=>o[k]=tr[k].length?mean(tr[k]):0);return {tr:o,usadas};
}
const trP=tendencia('privada'),trC=tendencia('cis');
const priv=inp.privadas;
const base={priv:{},cis:{}};K.forEach(k=>{base.priv[k]=round(mean(priv.map(p=>p[k])),2);base.cis[k]=inp.cis[k]});
const s0={priv:{},cis:{}};K.forEach(k=>{s0.priv[k]=sdev(priv.map(p=>p[k]))/Math.sqrt(priv.length);s0.cis[k]=inp.sdMuestreoCIS});
function escenario(clave,trend,N=4000){
  const ruta={},fin={},sdFin={};K.forEach(k=>{ruta[k]=[]});
  const ds=[];for(let d=0;d<=T;d+=(d+2>T?T-d||1:2))ds.push(d);
  const sdAt=(k,d,final)=>Math.sqrt(s0[clave][k]**2+volDay*d+(final?inp.sdError**2:0));
  ds.forEach((d,i)=>{
    const fin_=d===T, c={},sdv={};
    K.forEach(k=>{c[k]=base[clave][k]+trend.tr[k]*damp(d);sdv[k]=sdAt(k,d,fin_)});
    const n=fin_?N:1500, dr={PP:[],PSOE:[],VOX:[],SUMAR:[],PV:[]};
    for(let j=0;j<n;j++){const v={};K.forEach(k=>v[k]=Math.max(0.5,c[k]+sdv[k]*gauss()));const t=simulate(DATA,v).tot;K.forEach(k=>dr[k].push(t[k]));dr.PV.push(t.PP+t.VOX)}
    const cs=simulate(DATA,c).tot;
    K.forEach(k=>ruta[k].push({d:iso(D0+d),esc:cs[k],lo:pct(dr[k],.1),hi:pct(dr[k],.9),lo95:pct(dr[k],.025),hi95:pct(dr[k],.975),lo50:pct(dr[k],.25),hi50:pct(dr[k],.75),pv:fin_?{c:cs.PP+cs.VOX,p10:pct(dr.PV,.1),p50:pct(dr.PV,.5),p90:pct(dr.PV,.9)}:undefined}));
    if(fin_){K.forEach(k=>{fin[k]=c[k];sdFin[k]=sdv[k]});ruta._fin={c,dr,cs}}
  });
  const f=ruta._fin;delete ruta._fin;
  const out={ruta,escanos:{}};
  // 40 trayectorias conjuntas coherentes con el abanico: error inicial de la media + deriva aleatoria + error final de las encuestas
  if(clave==='priv'){
    const NP=40;out.trayectorias={PP:[],PSOE:[],VOX:[],SUMAR:[]};
    for(let i=0;i<NP;i++){
      const z0={},W={};K.forEach(k=>{z0[k]=s0[clave][k]*gauss();W[k]=0});
      const eF={};K.forEach(k=>eF[k]=inp.sdError*gauss());
      const arr={PP:[],PSOE:[],VOX:[],SUMAR:[]};let prev=0;
      ds.forEach((d,j)=>{
        const dt=d-prev;prev=d;K.forEach(k=>{W[k]+=Math.sqrt(volDay*dt)*gauss()});
        const v={};K.forEach(k=>v[k]=Math.max(0.5,base[clave][k]+trend.tr[k]*damp(d)+z0[k]+W[k]+(d===T?eF[k]:0)));
        const t=simulate(DATA,v).tot;K.forEach(k=>arr[k].push(t[k]));
      });
      K.forEach(k=>out.trayectorias[k].push(arr[k]));
    }
    // histograma de escaños el 29-N (de las 4.000 simulaciones), normalizado a 1
    out.hist={};K.forEach(k=>{const v=f.dr[k],mn=Math.min(...v),mx=Math.max(...v),c=new Array(mx-mn+1).fill(0);v.forEach(x=>c[x-mn]++);const w=[1,2,3,4,3,2,1],sm=c.map((_,i)=>w.reduce((a,wi,j)=>{const t=i+j-3;return a+(t>=0&&t<c.length?wi*c[t]:0)},0)),m=Math.max(...sm);out.hist[k]={min:mn,c:sm.map(x=>round(x/m,3))}});
  }
  K.forEach(k=>out.escanos[k]={c:f.cs[k],p10:pct(f.dr[k],.1),p50:pct(f.dr[k],.5),p90:pct(f.dr[k],.9)});
  // Sin probabilidad de mayoría: el modelo no recoge errores comunes ni de método (ver página).
  out.ppVox={c:f.cs.PP+f.cs.VOX,p10:pct(f.dr.PV,.1),p50:pct(f.dr.PV,.5),p90:pct(f.dr.PV,.9)};
  out.votoFin=Object.fromEntries(K.map(k=>[k,round(fin[k])]));
  return out;
}
// Escaños que da el simulador a cada encuesta publicada (solo si se conocen los cuatro grupos de partidos)
const completo=h=>K.every(k=>h[k]!=null);
const seatsOf=h=>simulate(DATA,Object.fromEntries(K.map(k=>[k,h[k]]))).tot;
const escHist=inp.historial.filter(completo).map(h=>({e:h.e,tipo:h.tipo,f:h.f,aprox:!!h.aprox,esc:Object.fromEntries(K.map(k=>[k,seatsOf(h)[k]]))}));
const escPriv=inp.privadas.map(p=>({e:p.e,f:p.f,esc:Object.fromEntries(K.map(k=>[k,seatsOf(p)[k]]))}));
const escBase={priv:Object.fromEntries(K.map(k=>[k,seatsOf(base.priv)[k]])),cis:Object.fromEntries(K.map(k=>[k,seatsOf(base.cis)[k]]))};
const out={generado:hoy,sdError:inp.sdError,tau,sdDeriva40:inp.sdDeriva40,n:priv.length,privadas:priv,historial:inp.historial,cis:inp.cis,
  base,tendencia:{priv:Object.fromEntries(K.map(k=>[k,round(trP.tr[k],4)])),cis:Object.fromEntries(K.map(k=>[k,round(trC.tr[k],4)])),usadasPriv:trP.usadas,usadasCis:trC.usadas},
  escPrivadas:escenario('priv',trP),escCIS:escenario('cis',trC),escHist,escPriv,escBase};
fs.writeFileSync(root+'assets/prediccion-data.js','/* Generado por tools/prediccion.mjs; no editar a mano. */\nconst PRED='+JSON.stringify(out)+';\n');
const show=e=>({esc:Object.fromEntries(K.map(k=>[k,`${e.escanos[k].c} (${e.escanos[k].p10}-${e.escanos[k].p90})`])),ppVox:e.ppVox});
console.log(JSON.stringify({escBase,priv:show(out.escPrivadas),cis:show(out.escCIS),hist:escHist.map(h=>h.e+' '+h.f+' '+JSON.stringify(h.esc))},null,1));
