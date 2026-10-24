// Noche electoral: previsión congelada frente al escrutinio oficial (datos/resultados.json, se rellena la noche del 29-N).
(function(){
  const $=id=>document.getElementById(id);
  const NM={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Podemos',ERC:'ERC',JUNTS:'Junts',BILDU:'EH Bildu',PNV:'PNV',BNG:'BNG',CCa:'CC',UPN:'UPN'};
  const COL={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)'};
  const BIG=['PP','PSOE','VOX','SUMAR'],REG=['ERC','JUNTS','BILDU','PNV','BNG','CCa','UPN'];
  // momento en Madrid
  let now='';try{const f=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});now=f.format(new Date()).replace(' ','T')}catch(e){now=new Date().toISOString().slice(0,16)}
  const VEDA=now>='2026-11-24'&&now<'2026-11-29T20:00',PRE=now<'2026-11-29T20:00';
  const P=typeof PRED!=='undefined'?PRED.escPrivadas:null;
  const fmt=s=>{if(!s)return'';const d=new Date(s);try{return d.toLocaleString('es-ES',{timeZone:'Europe/Madrid',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}catch(e){return s}};
  function draw(R){
    const has=R&&R.esc&&R.esc.PP!=null;
    $('nstate').innerHTML=has?`<b>Escrutinio en curso.</b> Datos oficiales provisionales; la página se actualiza cada pocos minutos.`:
      VEDA?`<b>Veda electoral.</b> Desde el 24-nov la ley no permite publicar encuestas ni proyecciones basadas en ellas; nuestra previsión vuelve a aparecer aquí a las 20:00 del 29-N, junto a los primeros resultados.`:
      PRE?`<b>Esta página se activa la noche del 29 de noviembre.</b> Hasta entonces muestra la previsión de hoy; los resultados oficiales aparecerán al lado en cuanto el Ministerio del Interior empiece a publicar el escrutinio.`:
      `<b>Esperando los primeros datos oficiales.</b> Esta página se actualiza sola.`;
    if(has){$('nprog').hidden=false;$('nbar').style.width=(R.escrutado||0)+'%';$('npct').textContent=`${String(R.escrutado).replace('.',',')} % escrutado`;$('nupd').textContent=R.actualizado?'· '+fmt(R.actualizado):''}
    const showP=P&&!VEDA,cell=k=>{if(!showP||!P.escanos[k])return'<td class="m">—</td>';const e=P.escanos[k];return `<td class="m"><b>${e.c}</b><small>${e.p10}–${e.p90}</small></td>`};
    const res=k=>has&&R.esc[k]!=null?R.esc[k]:null;
    const dif=k=>{const r=res(k);if(r==null||!showP||!P.escanos[k])return'<td class="m">—</td>';const e=P.escanos[k],d=r-e.c,inR=r>=e.p10&&r<=e.p90;return `<td class="m"><span class="${inR?'ok':'ko'}">${d>0?'+':d<0?'−':'±'}${Math.abs(d)}</span><small>${inR?'en rango':'fuera'}</small></td>`};
    let rows=BIG.map(k=>`<tr><td><b style="color:${COL[k]}">${NM[k]}</b></td>${cell(k)}<td class="m"><b>${res(k)??'—'}</b></td>${dif(k)}</tr>`).join('');
    if(has)rows+=REG.filter(k=>R.esc[k]).map(k=>`<tr><td>${NM[k]}</td><td class="m">—</td><td class="m"><b>${R.esc[k]}</b></td><td class="m">—</td></tr>`).join('');
    const pvP=showP?`<b>${P.ppVox.c}</b>`:'—',pvR=has?R.esc.PP+R.esc.VOX:null;
    rows+=`<tr class="avg"><td>PP + Vox<small>mayoría: 176</small></td><td class="m">${pvP}${showP?'<small>'+P.ppVox.p10+'–'+P.ppVox.p90+'</small>':''}</td><td class="m"><b>${pvR??'—'}</b></td><td class="m">${pvR!=null?(pvR>=176?'<span class="ok">mayoría</span>':'<span class="ko">sin mayoría</span>'):'—'}</td></tr>`;
    $('ntab').innerHTML=`<thead><tr><th>Partido</th><th>Previsión<small>rango 80 %</small></th><th>Resultado</th><th>Diferencia</th></tr></thead><tbody>${rows}</tbody>`;
  }
  function load(){fetch('datos/resultados.json?t='+Date.now()).then(r=>r.ok?r.json():null).then(draw).catch(()=>draw(null))}
  draw(null);load();
  if(!PRE)setInterval(load,120000);
})();
