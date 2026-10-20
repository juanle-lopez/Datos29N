// Apunta un evento / noticia / declaración en el historial de un día (para el apartado «qué cambió» de la Predicción).
// Uso: node tools/contexto.mjs AAAA-MM-DD --partido PP|PSOE|VOX|SUMAR|general --tipo evento|noticia|declaración|anuncio|propuesta|resolución --texto "…" --url https://… [--fase antes|despues] [--posible "…"] [--medio "…"] [--hecho AAAA-MM-DD]
// Después regenera assets/historial-data.js. No publica nada.
import fs from 'fs';
import {execFileSync} from 'child_process';
const root=new URL('..',import.meta.url).pathname,dir=root+'datos/historial/';
const [fecha,...rest]=process.argv.slice(2);
const a={};for(let i=0;i<rest.length;i+=2)a[rest[i].replace(/^--/,'')]=rest[i+1];
const P=['PP','PSOE','VOX','SUMAR','general'],T=['evento','noticia','declaración','anuncio','propuesta','resolución'];
const fail=m=>{console.error('Error: '+m);process.exit(1)};
if(!/^\d{4}-\d\d-\d\d$/.test(fecha||''))fail('falta la fecha AAAA-MM-DD');
if(!P.includes(a.partido))fail('--partido debe ser uno de '+P.join(', '));
if(!T.includes(a.tipo))fail('--tipo debe ser uno de '+T.join(', '));
a.fase=a.fase||'antes';if(!['antes','despues'].includes(a.fase))fail('--fase debe ser antes o despues');
if(!a.texto||a.texto.length<8)fail('falta --texto');
if(!/^https?:\/\//.test(a.url||''))fail('falta --url con la fuente (cada apunte lleva fuente)');
if(/(^|[^a-záéíóúñ])(provocó|causó|provocan|causan|se debe a|debido a|explica la|explican la)(?![a-záéíóúñ])/i.test(a.texto))fail('el texto no debe afirmar causas: describe solo el hecho');
const CAUSA=/(^|[^a-záéíóúñ])(provocó|causó|provocan|causan|se debe a|debido a|explica la|explican la)(?![a-záéíóúñ])/i;
if(a.posible&&(CAUSA.test(a.posible)||!/(puede|pudo|podría|podrían|coincide|coinciden|quizá|posible)/i.test(a.posible)))fail('--posible debe ser una hipótesis prudente (puede, pudo, podría, coincide…) y sin afirmar causas');
const fp=dir+fecha+'.json';if(!fs.existsSync(fp))fail('no existe '+fp+' (¿día fuera del historial?)');
const d=JSON.parse(fs.readFileSync(fp,'utf8'));d.contexto=d.contexto||[];
if(d.contexto.some(x=>x.u===a.url&&x.p===a.partido&&(x.fase||'antes')===a.fase))fail('ya está apuntado');
d.contexto.push({p:a.partido,tipo:a.tipo,t:a.texto,fase:a.fase,pos:a.posible||'',medio:a.medio||'',u:a.url,hecho:a.hecho||fecha});
fs.writeFileSync(fp,JSON.stringify(d,null,1)+'\n');
const idx=JSON.parse(fs.readFileSync(dir+'indice.json','utf8'));
execFileSync('node',[root+'tools/historial.mjs',idx.generado],{stdio:'inherit'});
console.log('Apuntado en '+fecha+' ('+a.partido+').');
