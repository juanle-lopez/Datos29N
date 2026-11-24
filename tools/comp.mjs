// Genera assets/comp-data.js: resultados por provincia de 28-A, 10-N (2019) y 23-J (2023) + el «Hoy» del modelo (media de encuestas, igual que el simulador).
// Fuente histórica: datos/historico/*.csv (Wikipedia, comprobados contra los totales de escaños). Uso: node tools/comp.mjs
import fs from 'fs';
const root=new URL('../',import.meta.url).pathname;
const home=fs.readFileSync(root+'assets/home.js','utf8');
const pick=(re)=>{const m=home.match(re);if(!m)throw new Error('no encuentro '+re);return m[0]};
const code=[pick(/const DATA=\[.*?\];\n/s),pick(/const PARTIES=.*?;\n/),pick(/const BASE=.*?;\n/),pick(/function simulate\(.*?\n}\n/s),pick(/const REGB=.*?;\n/),pick(/const PRESETS=.*?;\n/)].join('\n')+'\nreturn {DATA,simulate,PRESETS};';
const {DATA,simulate,PRESETS}=new Function(code)();
const ALIAS={'Álava':'Araba/Álava','Balearic Islands':'Illes Balears','Biscay':'Bizkaia','Navarre':'Navarra','Seville':'Sevilla'};
const csv=f=>{const [h,...l]=fs.readFileSync(root+'datos/historico/'+f,'utf8').trim().split('\n').map(x=>x.split(','));return l.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])))};
const num=v=>v===''||v==null?null:+v;
const S={};DATA.forEach(c=>S[c.n]=c.s);
function elec(file,map,id,label,fecha,nat){
  const prov={};const tot={};
  csv(file).forEach(r=>{const n=ALIAS[r.circunscripcion]||r.circunscripcion;if(!(n in S))throw new Error('provincia desconocida '+n);
    const o={};Object.entries(map).forEach(([k,c])=>{const p=num(r[c+'_pct']),e=num(r[c+'_esc']);o[k]=[p,e];tot[k]=(tot[k]||0)+(e||0)});prov[n]=o});
  return {id,label,fecha,prov,esc:tot,vot:nat}
}
const nat=Object.fromEntries(csv('resultados-nacionales.csv').map(r=>[r.eleccion,r]));
const E=[
 elec('provincias-2019-28A.csv',{PSOE:'PSOE',PP:'PP',CS:'CS',SUMAR:'UP',VOX:'VOX'},'28A','28-A 2019','2019-04-28',null),
 elec('provincias-2019-10N.csv',{PSOE:'PSOE',PP:'PP',CS:'CS',SUMAR:'UP',VOX:'VOX'},'10N','10-N 2019','2019-11-10',{PP:+nat['10-N 2019'].PP,PSOE:+nat['10-N 2019'].PSOE,VOX:+nat['10-N 2019'].VOX,SUMAR:+nat['10-N 2019'].UP_SUMAR,CS:+nat['10-N 2019'].Cs}),
 elec('provincias-2023-23J.csv',{PP:'PP',PSOE:'PSOE',VOX:'VOX',SUMAR:'SUMAR'},'23J','23-J 2023','2023-07-23',{PP:+nat['23-J 2023'].PP,PSOE:+nat['23-J 2023'].PSOE,VOX:+nat['23-J 2023'].VOX,SUMAR:+nat['23-J 2023'].UP_SUMAR})
];
const sim=simulate(DATA,PRESETS.poll,{podemos:0.35});
const hoy={prov:{},esc:{},vot:{PP:PRESETS.poll.PP,PSOE:PRESETS.poll.PSOE,VOX:PRESETS.poll.VOX,SUMAR:PRESETS.poll.SUMAR}};
sim.prov.forEach(c=>{hoy.prov[c.n]={};['PP','PSOE','VOX','SUMAR'].forEach(k=>hoy.prov[c.n][k]=[+c.sh[k].toFixed(1),c.seats[k]])});
['PP','PSOE','VOX','SUMAR'].forEach(k=>hoy.esc[k]=sim.tot[k]);
const out={nota:'Generado por tools/comp.mjs. Históricos: Wikipedia (tablas por circunscripción, comprobadas contra los totales de escaños); «hoy»: media de encuestas del modelo, repartida por provincias como en el simulador.',prov:DATA.map(c=>({n:c.n,s:c.s})),elec:E,hoy};
fs.writeFileSync(root+'assets/comp-data.js','/* Generado por tools/comp.mjs; no editar a mano. */\nconst COMP='+JSON.stringify(out)+';\n');
console.log('OK',E.map(e=>e.id+' '+JSON.stringify(e.esc)).join(' | '),'hoy',JSON.stringify(hoy.esc),'bytes',fs.statSync(root+'assets/comp-data.js').size);
