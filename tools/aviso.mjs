// Aviso para el canal de WhatsApp: solo lo NUEVO respecto al último aviso, con fecha y hora de actualización.
// WhatsApp no permite publicar en canales de forma automática: el mensaje sale listo para copiar y pegar.
// Uso: node tools/aviso.mjs            → vista previa (no cambia nada)
//      node tools/aviso.mjs --confirmar → además guarda este aviso como «último enviado»
import fs from 'fs';import path from 'path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const rd=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const idx=rd('datos/historial/indice.json'),dia=idx.dias[idx.dias.length-1],h=rd('datos/historial/'+dia+'.json');
const pr=path.join(root,'datos/avisos/estado.json');
const ant=fs.existsSync(pr)?JSON.parse(fs.readFileSync(pr,'utf8')):null;
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const [y,m,d]=dia.split('-').map(Number);
const hora=new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Madrid'}).format(new Date());
const NOM={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Podemos'},DOT={PP:'🔵',PSOE:'🔴',VOX:'🟢',SUMAR:'🟣'};
const K=['PP','PSOE','VOX','SUMAR'];
const f1=n=>n.toFixed(1).replace('.',','),sg=n=>(n>0?'+':'−')+Math.abs(n);
const voto=Object.fromEntries(K.map(k=>[k,Math.round(h.voto[k]*10)/10]));
const NO=rd('assets/noticias.json'),items=Array.isArray(NO)?NO:NO.items;
const tit=t=>t.length>110?t.slice(0,107).replace(/\s+\S*$/,'')+'…':t;
const L=[];
// escaños
const dEsc=K.filter(k=>ant&&h.esc[k]!==ant.esc[k]);
if(!ant){L.push(`📊 Escaños: ${K.map(k=>`${NOM[k]} ${h.esc[k]}`).join(' · ')}. PP + Vox ${h.esc.PV}; mayoría en 176.`)}
else if(dEsc.length){
  L.push('📊 *Escaños*');dEsc.forEach(k=>L.push(`${DOT[k]} ${NOM[k]}: *${h.esc[k]}* (${sg(h.esc[k]-ant.esc[k])})`));
  L.push(`⚖️ PP + Vox *${h.esc.PV}* (${sg(h.esc.PV-ant.esc.PV)}) · PSOE + Sumar + Podemos + socios *${h.esc.IZ}* (${sg(h.esc.IZ-ant.esc.IZ)}). Mayoría: 176.`);
}else L.push(`📊 Escaños: sin cambios (PP + Vox ${h.esc.PV} · PSOE + Sumar + Podemos + socios ${h.esc.IZ}; mayoría en 176).`);
// voto
const dV=K.filter(k=>ant&&Math.abs(voto[k]-ant.voto[k])>=0.1-1e-9);
if(dV.length)L.push('🗳️ Voto medio: '+dV.map(k=>`${NOM[k]} ${f1(voto[k])} % (${sg(Math.round((voto[k]-ant.voto[k])*10)/10).replace('.',',')})`).join(' · '));
// encuestas
const enc=(h.encuestas||[]).map(e=>e.e),encN=ant?enc.filter(e=>!ant.encuestas.includes(e)):[];
if(encN.length)L.push(`🆕 Encuesta${encN.length>1?'s':''} nueva${encN.length>1?'s':''} en la media: ${encN.join('; ')}`);
// noticias nuevas
const todasN=items.filter(x=>!ant||!ant.noticias.includes(x.url+'|'+x.titular)),nuevas=todasN.slice(0,4),masN=todasN.length-nuevas.length;
const bloqueN=nuevas.length?['','📰 *Noticias nuevas*',...nuevas.map(x=>`▫️ ${tit(x.titular)} (${x.medio})\n👉 https://datos29n.juanle.net/noticias.html`),...(masN>0?[`➕ ${masN} más en la web`]:[])]:[];
const hayNovedad=dEsc.length||dV.length||encN.length||nuevas.length;
const msg=[`🔔 *DATOS 29N* · Actualizado el ${d} ${MES[m-1]} a las ${hora}`,'','🆕 *LO NUEVO*',...L,...bloqueN,'','📈 Todo el detalle: https://datos29n.juanle.net/prediccion.html'].join('\n');
const cab=hayNovedad?'PUBLICAR: hay novedades desde el último aviso.':'NO PUBLICAR: no hay nada nuevo desde el último aviso.';
fs.mkdirSync(path.join(root,'datos/avisos'),{recursive:true});
console.log('\n===== AVISO PARA EL CANAL DE WHATSAPP ('+dia+' '+hora+') =====\n'+cab+'\n\n'+msg+'\n=====');
if(process.argv.includes('--confirmar')){
  fs.writeFileSync(path.join(root,'datos/avisos',dia+'-'+hora.replace(':','')+'.txt'),msg+'\n');
  fs.writeFileSync(pr,JSON.stringify({dia,hora,esc:h.esc,voto,encuestas:enc,noticias:items.map(x=>x.url+'|'+x.titular)},null,1));
  console.log('Guardado como último aviso enviado.');
}
