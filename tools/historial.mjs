// Historial diario de la predicción: un archivo por día en datos/historial/ + assets/historial-data.js (lo que lee la página).
// Uso: node tools/historial.mjs [AAAA-MM-DD]   (día de "hoy"; por defecto el del sistema). Ejecutar DESPUÉS de tools/prediccion.mjs.
// Los días anteriores a empezar a guardar se reconstruyen con las encuestas que ya se conocían ese día (t:"reconstruido");
// el día de hoy se guarda tal cual lo calcula el modelo (t:"registrado"), con la proyección al 29-N. Un día registrado nunca se pisa.
import fs from 'fs';
const root=new URL('..',import.meta.url).pathname,dir=root+'datos/historial/';
const inp=JSON.parse(fs.readFileSync(root+'tools/prediccion-input.json','utf8'));
const src=fs.readFileSync(root+'assets/home.js','utf8');
const {DATA,simulate:sim0}=new Function(src.split('\n')[0]+'\n'+src.slice(src.indexOf('const PARTIES'),src.indexOf('const SITE_URL'))+'\nreturn {DATA,simulate}')();
const OPT={podemos:inp.podemosFrac||0},simulate=(d,v)=>sim0(d,v,OPT);   // Podemos en lista propia (ver tools/prediccion-input.json)
const K=['PP','PSOE','VOX','SUMAR'];
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const sdev=a=>a.length<2?0:Math.sqrt(a.reduce((s,x)=>s+(x-mean(a))**2,0)/(a.length-1));
const r2=x=>Math.round(x*100)/100;
const day=s=>Date.UTC(...s.split('-').map((x,i)=>i==1?x-1:+x))/864e5;
const iso=n=>new Date(n*864e5).toISOString().slice(0,10);
const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.max(0,Math.round(p*(s.length-1))))]};
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hoy=process.argv[2]||new Date().toISOString().slice(0,10);
const METODO=3;   // 2 (20-oct-2026): sin tendencia y con Podemos en lista propia; 3: añade los bloques PV (PP+Vox) e IZ (PSOE+Sumar+Podemos+socios 2023). Los días de un método anterior se recalculan (quedan como reconstruidos).
const START='2026-10-04';   // primer día con 7 empresas distintas (antes hay muy pocas para una media fiable)
const stem=e=>e.split(' /')[0].trim();
const completo=p=>K.every(k=>p[k]!=null);
const polls=[];[...inp.historial.filter(h=>h.tipo==='privada'&&!h.aprox&&completo(h)),...inp.privadas].forEach(p=>{if(!polls.some(q=>q.e===p.e&&q.f===p.f))polls.push(p)});
polls.sort((a,b)=>a.f<b.f?-1:1);
// Lo que se conocía el día D: la última encuesta de cada empresa publicada hasta D
const VENTANA=30;   // como en el modelo: solo cuentan las encuestas de los últimos 30 días (la última de cada empresa)
function conocidas(D){const m={};polls.forEach(p=>{if(p.f<=D&&day(D)-day(p.f)<=VENTANA)m[stem(p.e)]=p});return m}
function estimar(D){
  const m=conocidas(D),L=Object.values(m),n=L.length,voto={};K.forEach(k=>voto[k]=r2(mean(L.map(p=>p[k]))));
  const IZ=t=>t.PSOE+t.SUMAR+t.ERC+t.JUNTS+t.BILDU+t.PNV+t.BNG+t.CCa,KB=[...K,'PV','IZ'],bl=t=>({...t,PV:t.PP+t.VOX,IZ:IZ(t)});
  const esc=bl(simulate(DATA,voto).tot),rand=rng(+D.replace(/-/g,'')),g=()=>{let u=0;while(!u)u=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rand())};
  const s0=Object.fromEntries(K.map(k=>[k,sdev(L.map(p=>p[k]))/Math.sqrt(n)])),dr={PP:[],PSOE:[],VOX:[],SUMAR:[],PV:[],IZ:[]};
  for(let j=0;j<1500;j++){const v={};K.forEach(k=>v[k]=Math.max(.5,voto[k]+s0[k]*g()));const t=bl(simulate(DATA,v).tot);KB.forEach(k=>dr[k].push(t[k]))}
  return {n,voto,esc:Object.fromEntries(KB.map(k=>[k,esc[k]])),lo:Object.fromEntries(KB.map(k=>[k,pct(dr[k],.1)])),hi:Object.fromEntries(KB.map(k=>[k,pct(dr[k],.9)])),
    enc:Object.entries(m).map(([h,p])=>({h,e:p.e,f:p.f,voto:Object.fromEntries(K.map(k=>[k,p[k]]))})).sort((a,b)=>a.f<b.f?1:-1)};
}
fs.mkdirSync(dir,{recursive:true});
const rd=f=>{try{return JSON.parse(fs.readFileSync(dir+f+'.json','utf8'))}catch(e){return null}};
let proy=null;try{const t=fs.readFileSync(root+'assets/prediccion-data.js','utf8'),P=new Function(t.replace('const PRED=','return ').replace(/;\s*$/,''))();
  if(P.generado===hoy){const f=sc=>Object.fromEntries(K.map(k=>[k,{c:sc.escanos[k].c,p10:sc.escanos[k].p10,p90:sc.escanos[k].p90}]));proy={privadas:f(P.escPrivadas),cis:f(P.escCIS),ppVox:P.escPrivadas.ppVox}}}catch(e){}
const dias=[];let prev=null;
for(let d=day(START);d<=day(hoy);d++){
  const D=iso(d),viejo=rd(D);let s;
  if(viejo&&viejo.t==='registrado'&&D!==hoy&&viejo.metodo===METODO)s=viejo;
  else{const e=estimar(D);s={fecha:D,metodo:METODO,t:D===hoy?'registrado':'reconstruido',n:e.n,voto:e.voto,esc:e.esc,lo:e.lo,hi:e.hi,encuestas:e.enc.map(x=>({e:x.e,f:x.f})),encDetalle:e.enc,proy:D===hoy?proy:null,contexto:viejo?viejo.contexto||[]:[]};
    // Qué cambió respecto al día anterior: encuestas que entran (y la de la misma empresa a la que sustituyen) y variación de la media y de los escaños
    if(prev){const pm=Object.fromEntries(prev.encDetalle.map(x=>[x.h,x])),entran=e.enc.filter(x=>!pm[x.h]||pm[x.h].f!==x.f).map(x=>({e:x.e,f:x.f,voto:x.voto,antes:pm[x.h]?{e:pm[x.h].e,f:pm[x.h].f,voto:pm[x.h].voto}:null}));
      const hs=new Set(e.enc.map(x=>x.h)),salen=prev.encDetalle.filter(x=>!hs.has(x.h)).map(x=>({e:x.e,f:x.f,voto:x.voto}));
      const dV=Object.fromEntries(K.map(k=>[k,r2(e.voto[k]-prev.voto[k])])),dE=Object.fromEntries([...K,'PV','IZ'].map(k=>[k,e.esc[k]-prev.esc[k]]));
      s.cambio={entran,salen,dVoto:dV,dEsc:dE,huboCambio:entran.length>0||salen.length>0||K.some(k=>dE[k]!==0)}}
    else s.cambio={entran:[],salen:[],dVoto:null,dEsc:null,huboCambio:false,inicio:true};
    fs.writeFileSync(dir+D+'.json',JSON.stringify(s,null,1)+'\n')}
  dias.push(s);prev=s;
}
fs.writeFileSync(dir+'indice.json',JSON.stringify({generado:hoy,inicio:START,dias:dias.map(s=>s.fecha)},null,1)+'\n');
fs.writeFileSync(root+'assets/historial-data.js','/* Generado por tools/historial.mjs a partir de datos/historial/*.json; no editar a mano. */\nconst HIST='+JSON.stringify({generado:hoy,dias:dias.map(s=>({f:s.fecha,t:s.t==='registrado'?'r':'x',n:s.n,voto:s.voto,esc:s.esc,lo:s.lo,hi:s.hi,cambio:s.cambio,enc:s.encuestas,ctx:s.contexto}))})+';\n');
const u=dias[dias.length-1];console.log('días',dias.length,'hoy',u.fecha,JSON.stringify(u.esc),'n',u.n);
console.log('cambios:',dias.filter(s=>s.cambio&&s.cambio.huboCambio).map(s=>s.fecha).join(' '));
