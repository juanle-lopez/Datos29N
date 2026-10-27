/* Portada: «Hoy en diez segundos» (lee PRED, HIST y noticias.json; no tiene datos propios) */
(function(){
  const box=document.getElementById('hoyh');if(!box||typeof HIST==='undefined')return;
  const D=HIST.dias,h=D[D.length-1],MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const fch=f=>{const[y,m,d]=f.split('-').map(Number);return d+' '+MES[m-1]};
  const row=(nom,v,cols)=>`<div class="hr"><span class="hn">${nom}</span><span class="hb"><i style="width:${Math.min(100,v/240*100)}%;background:linear-gradient(90deg,${cols[0]},${cols[1]})"></i><u style="left:${176/240*100}%"></u></span><b class="hv">${v}</b></div>`;
  const dE=h.cambio&&h.cambio.dEsc||{},mv=['PP','PSOE','VOX','SUMAR'].filter(k=>dE[k]).map(k=>({PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Podemos'}[k]+' '+(dE[k]>0?'+':'−')+Math.abs(dE[k])));
  let ult=null;for(let i=D.length-1;i>=0;i--)if(D[i].cambio&&D[i].cambio.huboCambio){ult=D[i];break}
  const ch=h.cambio&&h.cambio.huboCambio?`Hoy cambia la media: ${mv.length?mv.join(', ')+' escaños':'sin cambios en escaños'}.`:`La media no se ha movido hoy${ult?`; el último cambio fue el ${fch(ult.f)}`:''}.`;
  box.innerHTML=`<p class="hk">Hoy · ${fch(h.f)}</p><p class="ht">Con las encuestas de hoy, <b>PP + Vox suman ${h.esc.PV}</b> escaños y <b>PSOE + Sumar + Podemos + socios de 2023, ${h.esc.IZ}</b>. La mayoría absoluta está en <b>176</b>.</p>`+
    `<div class="hrs">${row('PP + Vox',h.esc.PV,['var(--pp)','var(--vox)'])}${row('PSOE + Sumar + Podemos + socios',h.esc.IZ,['var(--psoe)','var(--muted)'])}<div class="hax"><span style="left:${176/240*100}%">176 · mayoría</span></div></div>`;
  box.insertAdjacentHTML('beforeend',`<p class="hc"><b>Qué ha cambiado.</b> ${ch} Es una suma aritmética, sin presuponer pactos.</p><a class="hl" href="prediccion.html">Ver la previsión completa →</a>`);
  fetch('assets/noticias.json?v=27').then(r=>r.json()).then(j=>{const n=(j.items||[])[0];if(!n)return;
    box.querySelector('.hc').insertAdjacentHTML('afterend',`<p class="hnw"><b>Última noticia</b> (${n.fecha} · ${n.medio}): <a href="${n.url}" target="_blank" rel="noopener">${n.titular.replace(/</g,'&lt;')}</a></p>`)}).catch(()=>{});
})();
