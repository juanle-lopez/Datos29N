// Genera assets/prediccion-data.js: proyección de voto y escaños hasta el 29-N.
// Uso: node tools/prediccion.mjs [AAAA-MM-DD]   (fecha de "hoy"; por defecto la del sistema)
import fs from 'fs';
const root=new URL('..',import.meta.url).pathname;
const inp=JSON.parse(fs.readFileSync(root+'tools/prediccion-input.json','utf8'));
const src=fs.readFileSync(root+'assets/home.js','utf8');
const {DATA,simulate:sim0}=new Function(src.split('\n')[0]+'\n'+src.slice(src.indexOf('const PARTIES'),src.indexOf('const SITE_URL'))+'\nreturn {DATA,simulate}')();
const OPT={podemos:inp.podemosFrac||0},simulate=(d,v)=>sim0(d,v,OPT);   // Podemos en lista propia (ver tools/prediccion-input.json)
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
// Errores en escala logit y como composición (método 3, 20-oct): el error en puntos es proporcional a p(1-p), así que un partido
// grande tiene más margen en puntos que uno pequeño; y PP, PSOE, Vox, Sumar+Podemos y «resto» se renormalizan para sumar 100,
// lo que hace que si uno sube otro baje. REF = media cuadrática de p(1-p) en los 8 resultados con los que se midió sdError (1,9).
const REF=Math.sqrt([20.82,28.00,15.08,6.79,33.05,31.68,12.38,12.31].map(x=>(x/100*(1-x/100))**2).reduce((a,b)=>a+b)/8);
const lg=p=>Math.log(p/(1-p)),ex=x=>1/(1+Math.exp(-x));
function compon(c,e){const p={},keys=[...K,'O'];let o=100;K.forEach(k=>{p[k]=c[k]/100;o-=c[k]});p.O=Math.max(0.01,o/100);
  const q={};let S=0;keys.forEach(k=>{q[k]=ex(lg(p[k])+(e[k]||0));S+=q[k]});const v={};K.forEach(k=>v[k]=Math.max(0.5,100*q[k]/S));return v}
const sdl=(clave,k,c,varPuntosComun)=>{const p=k==='O'?null:c[k]/100,a=k==='O'?0:(s0[clave][k]/(100*p*(1-p)))**2;return Math.sqrt(a+varPuntosComun/(100*REF)**2)};
// Bloque PSOE + Sumar + Podemos + socios de la investidura de 2023 (ERC, Junts, EH Bildu, PNV, BNG, CCa)
const IZ=t=>t.PSOE+t.SUMAR+t.ERC+t.JUNTS+t.BILDU+t.PNV+t.BNG+t.CCa;
// Error de las encuestas repartido poco a poco hasta el 29-N (errorGradual) en vez de sumarse de golpe el último día
const PG=inp.errorPotencia||1;   // 1: varianza lineal en los días; 2: más concentrada al final
const eFt=(e,d)=>inp.errorGradual?e*Math.pow(d/T,PG/2):(d===T?e:0);
function escenario(clave,trend,N=4000){
  const trd=inp.usarTendencia?trend.tr:Object.fromEntries(K.map(k=>[k,0]));   // sin tendencia: la previsión central es la media de hoy
  const ruta={},fin={},sdFin={};[...K,'PV','IZ'].forEach(k=>{ruta[k]=[]});
  const ds=[];for(let d=0;d<=T;d+=(d+2>T?T-d||1:2))ds.push(d);
  const sdAt=(k,d,final)=>Math.sqrt(s0[clave][k]**2+volDay*d+(final?inp.sdError**2:0));
  ds.forEach((d,i)=>{
    const fin_=d===T, c={},sdv={};
    K.forEach(k=>{c[k]=base[clave][k]+trd[k]*damp(d);sdv[k]=sdAt(k,d,fin_)});
    const n=fin_?N:1500, dr={PP:[],PSOE:[],VOX:[],SUMAR:[],PV:[],IZ:[]};
    const vc=volDay*d+(inp.errorGradual?inp.sdError**2*Math.pow(d/T,PG):(fin_?inp.sdError**2:0)),sl={};[...K,'O'].forEach(k=>sl[k]=sdl(clave,k,c,vc));
    for(let j=0;j<n;j++){let v;if(inp.errorLogit){const e={};[...K,'O'].forEach(k=>e[k]=sl[k]*gauss());if(fin_&&inp.sdBloque){const b=inp.sdBloque/(100*REF)*gauss();e.PP+=b;e.VOX+=b;e.PSOE-=b;e.SUMAR-=b}v=compon(c,e)}else{v={};K.forEach(k=>v[k]=Math.max(0.5,c[k]+sdv[k]*gauss()))}const t=simulate(DATA,v).tot;K.forEach(k=>dr[k].push(t[k]));dr.PV.push(t.PP+t.VOX);dr.IZ.push(IZ(t))}
    const cs=simulate(DATA,c).tot;
    K.forEach(k=>ruta[k].push({d:iso(D0+d),esc:cs[k],lo:pct(dr[k],.1),hi:pct(dr[k],.9),lo95:pct(dr[k],.025),hi95:pct(dr[k],.975),lo50:pct(dr[k],.25),hi50:pct(dr[k],.75),pv:fin_?{c:cs.PP+cs.VOX,p10:pct(dr.PV,.1),p50:pct(dr.PV,.5),p90:pct(dr.PV,.9)}:undefined}));
    [['PV',cs.PP+cs.VOX],['IZ',IZ(cs)]].forEach(([b,cv])=>ruta[b].push({d:iso(D0+d),esc:cv,lo:pct(dr[b],.1),hi:pct(dr[b],.9),lo95:pct(dr[b],.025),hi95:pct(dr[b],.975),lo50:pct(dr[b],.25),hi50:pct(dr[b],.75)}));
    if(fin_){K.forEach(k=>{fin[k]=c[k];sdFin[k]=sdv[k]});ruta._fin={c,dr,cs}}
  });
  const f=ruta._fin;delete ruta._fin;
  const out={ruta,escanos:{}};
  // 40 trayectorias conjuntas coherentes con el abanico: error inicial de la media + deriva aleatoria + error final de las encuestas
  if(clave==='priv'){
    const NP=40;out.trayectorias={PP:[],PSOE:[],VOX:[],SUMAR:[]};
    for(let i=0;i<NP;i++){
      const L=inp.errorLogit,cb={};K.forEach(k=>cb[k]=base[clave][k]);const z0={},W={O:0};K.forEach(k=>{z0[k]=(L?s0[clave][k]/(100*cb[k]/100*(1-cb[k]/100)):s0[clave][k])*gauss();W[k]=0});
      const eF={};[...K,'O'].forEach(k=>eF[k]=(L?inp.sdError/(100*REF):inp.sdError)*gauss());
      const arr={PP:[],PSOE:[],VOX:[],SUMAR:[]};let prev=0;
      ds.forEach((d,j)=>{
        const dt=d-prev;prev=d;[...K,'O'].forEach(k=>{W[k]+=Math.sqrt(volDay*dt)/(L?100*REF:1)*gauss()});
        let v;if(L){const cc={},e={O:W.O+eFt(eF.O,d)};K.forEach(k=>{cc[k]=base[clave][k]+trd[k]*damp(d);e[k]=z0[k]+W[k]+eFt(eF[k],d)});v=compon(cc,e)}else{v={};K.forEach(k=>v[k]=Math.max(0.5,base[clave][k]+trd[k]*damp(d)+z0[k]+W[k]+eFt(eF[k],d)))}
        const t=simulate(DATA,v).tot;K.forEach(k=>arr[k].push(t[k]));
      });
      K.forEach(k=>out.trayectorias[k].push(arr[k]));
    }
    // histograma de escaños el 29-N (de las 4.000 simulaciones), normalizado a 1
    out.hist={};K.forEach(k=>{const v=f.dr[k].filter((x,_,A)=>true),mn=pct(f.dr[k],.025),mx=pct(f.dr[k],.975),c=new Array(mx-mn+1).fill(0);v.forEach(x=>{if(x>=mn&&x<=mx)c[x-mn]++});const w=[1,2,3,4,3,2,1],sm=c.map((_,i)=>w.reduce((a,wi,j)=>{const t=i+j-3;return a+(t>=0&&t<c.length?wi*c[t]:0)},0)),m=Math.max(...sm);out.hist[k]={min:mn,c:sm.map(x=>round(x/m,3))}});
  }
  K.forEach(k=>out.escanos[k]={c:f.cs[k],p10:pct(f.dr[k],.1),p50:pct(f.dr[k],.5),p90:pct(f.dr[k],.9)});
  // Sin probabilidad de mayoría: el modelo no recoge errores comunes ni de método (ver página).
  out.izq={c:IZ(f.cs),p10:pct(f.dr.IZ,.1),p50:pct(f.dr.IZ,.5),p90:pct(f.dr.IZ,.9)};
  out.ppVox={c:f.cs.PP+f.cs.VOX,p10:pct(f.dr.PV,.1),p50:pct(f.dr.PV,.5),p90:pct(f.dr.PV,.9)};
  out.votoFin=Object.fromEntries(K.map(k=>[k,round(fin[k])]));
  return out;
}
// Escaños que da el simulador a cada encuesta publicada (solo si se conocen los cuatro grupos de partidos)
const completo=h=>K.every(k=>h[k]!=null);
const seatsOf=h=>simulate(DATA,Object.fromEntries(K.map(k=>[k,h[k]]))).tot;
const escHist=inp.historial.filter(completo).map(h=>({e:h.e,tipo:h.tipo,f:h.f,aprox:!!h.aprox,esc:Object.fromEntries(K.map(k=>[k,seatsOf(h)[k]]))}));
const escPriv=inp.privadas.map(p=>({e:p.e,f:p.f,esc:Object.fromEntries(K.map(k=>[k,seatsOf(p)[k]]))}));
const escBaseBloq={priv:(t=>({PV:t.PP+t.VOX,IZ:IZ(t)}))(seatsOf(base.priv)),cis:(t=>({PV:t.PP+t.VOX,IZ:IZ(t)}))(seatsOf(base.cis))};
const escBase={priv:Object.fromEntries(K.map(k=>[k,seatsOf(base.priv)[k]])),cis:Object.fromEntries(K.map(k=>[k,seatsOf(base.cis)[k]]))};
const out={generado:hoy,sdError:inp.sdError,tau,sdDeriva40:inp.sdDeriva40,n:priv.length,privadas:priv,historial:inp.historial,cis:inp.cis,
  base,tendencia:{priv:Object.fromEntries(K.map(k=>[k,round(trP.tr[k],4)])),cis:Object.fromEntries(K.map(k=>[k,round(trC.tr[k],4)])),usadasPriv:trP.usadas,usadasCis:trC.usadas},
  escPrivadas:escenario('priv',trP),escCIS:escenario('cis',trC),escHist,escPriv,escBase,escBaseBloq};
fs.writeFileSync(root+'assets/prediccion-data.js','/* Generado por tools/prediccion.mjs; no editar a mano. */\nconst PRED='+JSON.stringify(out)+';\n');
const show=e=>({esc:Object.fromEntries(K.map(k=>[k,`${e.escanos[k].c} (${e.escanos[k].p10}-${e.escanos[k].p90})`])),ppVox:e.ppVox});
console.log(JSON.stringify({escBase,priv:show(out.escPrivadas),cis:show(out.escCIS),hist:escHist.map(h=>h.e+' '+h.f+' '+JSON.stringify(h.esc))},null,1));
