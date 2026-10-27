// Redacta el aviso diario para el canal de WhatsApp a partir del historial de hoy. Uso: node tools/aviso.mjs
// WhatsApp no permite publicar en canales de forma automática: el mensaje sale listo para copiar y pegar.
import fs from 'fs';import path from 'path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const idx=JSON.parse(fs.readFileSync(path.join(root,'datos/historial/indice.json'),'utf8'));
const dia=idx.dias[idx.dias.length-1];
const h=JSON.parse(fs.readFileSync(path.join(root,'datos/historial',dia+'.json'),'utf8'));
const c=h.cambio||{};
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const [y,m,d]=dia.split('-').map(Number);const fecha=d+' '+MES[m-1];
const fl=n=>n>0?` 🔺+${n}`:n<0?` 🔻−${n*-1}`:'';
const NOM={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Podemos'},DOT={PP:'🔵',PSOE:'🔴',VOX:'🟢',SUMAR:'🟣'};
const lin=['PP','PSOE','VOX','SUMAR'].map(k=>`${DOT[k]} ${NOM[k]}  ▸  *${h.esc[k]}* escaños${fl((c.dEsc||{})[k]||0)}  · rango ${h.lo[k]}–${h.hi[k]} · ${h.voto[k].toFixed(1).replace('.',',')} %`).join('\n');
const bar=n=>'█'.repeat(Math.round(n/25))+'░'.repeat(14-Math.round(n/25));
const pv=h.proy.ppVox;
const nuevas=(c.entran||[]).map(e=>typeof e==='string'?e:(e.e||'')).filter(Boolean);
const NO=JSON.parse(fs.readFileSync(path.join(root,'assets/noticias.json'),'utf8'));const items=Array.isArray(NO)?NO:NO.items;
const hoyS=d+' '+MES[m-1],ayerD=new Date(Date.UTC(y,m-1,d-1)),ayerS=ayerD.getUTCDate()+' '+MES[ayerD.getUTCMonth()];
let nots=items.filter(x=>x.fecha===hoyS);if(nots.length<2)nots=items.filter(x=>x.fecha===hoyS||x.fecha===ayerS);nots=nots.slice(0,3);
const tit=t=>t.length>110?t.slice(0,107).replace(/\s+\S*$/,'')+'…':t;
const nb=nots.length?['📰 *Últimas noticias*',...nots.map(x=>`▫️ ${tit(x.titular)} (${x.medio})\n👉 https://datos29n.juanle.net/noticias.html`),'']:[];
const dE=c.dEsc||{};
const movs=['PP','PSOE','VOX','SUMAR'].filter(k=>dE[k]).map(k=>`${NOM[k]} ${dE[k]>0?'+':'−'}${Math.abs(dE[k])}`);
const resumen=['📌 *LO NUEVO DE HOY*',
 hubo0()?`• Escaños: ${movs.join(', ')}. PP + Vox ${h.esc.PV}, bloque contrario ${h.esc.IZ}.`:`• Previsión estable: PP + Vox ${h.esc.PV} escaños y PSOE + Sumar + Podemos + socios ${h.esc.IZ} (mayoría: 176).`,
 nuevas.length?`• 🆕 ${nuevas.length} encuesta${nuevas.length>1?'s':''} nueva${nuevas.length>1?'s':''}: ${nuevas.join('; ')}.`:`• Sin encuestas nuevas en la media.`,
 nots.length?`• 📰 Noticias del ${hoyS}: ${nots.length} destacada${nots.length>1?"s":""}, más abajo.`:`• Sin noticias nuevas destacadas.`,
 ``];
function hubo0(){return !!c.huboCambio&&movs.length>0}
const msg=[
 `🗳️ *DATOS 29N · ${fecha}*`,
 ``,
 ...resumen,
 `📊 *Los datos* _(escaños según la media de las encuestas de hoy)_`,
 ``,
 lin,
 ``,
 `⚖️ *Mayoría absoluta: 176*`,
 `PP + Vox  *${h.esc.PV}*${fl(c.dEsc?c.dEsc.PV||0:0)}`,
 bar(h.esc.PV),
 `PSOE + Sumar + Podemos + socios  *${h.esc.IZ}*${fl(c.dEsc?c.dEsc.IZ||0:0)}`,
 bar(h.esc.IZ),
 ``,
 `🔭 Proyección al 29-N: PP + Vox *${pv.c}* (${pv.p10}–${pv.p90})`,
 nuevas.length?`\n🆕 Nueva${nuevas.length>1?'s':''} encuesta${nuevas.length>1?'s':''}: ${nuevas.join('; ')}`:'',
 ``,
 ...nb,
 `📈 Detalle día a día y fuentes:`,
 `https://datos29n.juanle.net/prediccion.html`
].join('\n').replace(/\n{3,}/g,'\n\n');
const hubo=!!c.huboCambio;
const cab=hubo?`PUBLICAR: hay cambios respecto al día anterior.`:`OPCIONAL: sin cambios respecto al día anterior; mejor no publicar hoy.`;
fs.mkdirSync(path.join(root,'datos/avisos'),{recursive:true});
fs.writeFileSync(path.join(root,'datos/avisos',dia+'.txt'),msg+'\n');
console.log('\n===== AVISO PARA EL CANAL DE WHATSAPP ('+dia+') =====\n'+cab+'\n\n'+msg+'\n=====');
