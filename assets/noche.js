// Día electoral: previsión congelada frente al escrutinio oficial (datos/resultados.json, se rellena el 29-N).
(function(){
  const $=id=>document.getElementById(id);
  const NM={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Podemos',POD:'Podemos',OTROS:'Otros',ERC:'ERC',JUNTS:'Junts',BILDU:'EH Bildu',PNV:'PNV',BNG:'BNG',CCa:'CC',UPN:'UPN'};
  const COL={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)'};
  const BIG=['PP','PSOE','VOX','SUMAR'],REG=['ERC','JUNTS','BILDU','PNV','BNG','CCa','UPN'];
  // momento en Madrid
  let now='';try{const f=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});now=f.format(new Date()).replace(' ','T')}catch(e){now=new Date().toISOString().slice(0,16)}
  const VEDA=now>='2026-11-24'&&now<'2026-11-29T20:00',PRE=now<'2026-11-29T20:00';
  const P=typeof PRED!=='undefined'?PRED.escPrivadas:null;
  const fmt=s=>{if(!s)return'';const d=new Date(s);try{return d.toLocaleString('es-ES',{timeZone:'Europe/Madrid',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}catch(e){return s}};
  // ---- hemiciclo y tarjetas de todos los partidos (vacíos hasta el escrutinio)
  const HO=['SUMAR','POD','PSOE','ERC','BILDU','BNG','PNV','JUNTS','CCa','OTROS','UPN','PP','VOX'];
  const C={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)',POD:'#7b3f98',ERC:'#d19a2a',JUNTS:'#2a9aa0',BILDU:'#6a8f3a',PNV:'#3f7f5a',BNG:'#5aa0d8',CCa:'#c9b33a',UPN:'#4a5a9a',OTROS:'var(--reg)'};
  const S23={PP:137,PSOE:121,VOX:33,SUMAR:31,ERC:7,JUNTS:7,BILDU:6,PNV:5,BNG:1,CCa:1,UPN:1};
  const CARDS=['PP','PSOE','VOX','SUMAR','POD','ERC','JUNTS','BILDU','PNV','BNG','CCa','UPN','OTROS'];
  const SEATS=(function(){const n=350,rows=11,r0=.42,Rr=190,cx=200,cy=200,radii=[];for(let i=0;i<rows;i++)radii.push(r0+(1-r0)*i/(rows-1));
    const sr=radii.reduce((a,b)=>a+b,0);const counts=radii.map(r=>Math.round(n*r/sr));counts[rows-1]+=n-counts.reduce((a,b)=>a+b,0);
    const seats=[];radii.forEach((r,i)=>{for(let k=0;k<counts[i];k++){const th=Math.PI*(1-k/(counts[i]-1));seats.push({x:cx+Rr*r*Math.cos(th),y:cy-Rr*r*Math.sin(th),th,r})}});
    seats.sort((a,b)=>b.th-a.th||a.r-b.r);return seats})();
  let hc=null;
  function drawHemi(R){
    const box=$('nhemi');if(!box)return;
    if(!hc){let h='<svg viewBox="0 -16 400 228" class="hemi" role="img" aria-label=""><line x1="200" y1="0" x2="200" y2="200" class="hmaj"/><text x="200" y="-5" text-anchor="middle" class="hmajt">176 = mayoría</text>';
      SEATS.forEach((s,i)=>{h+=`<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="4.3" style="--i:${i}" fill="var(--line)"/>`});box.innerHTML=h+'</svg>';hc=[...box.querySelectorAll('circle')]}
    const E=R&&R.esc||{},arr=[];HO.forEach(p=>{for(let i=0;i<(E[p]||0);i++)arr.push(p)});
    hc.forEach((c,i)=>c.style.fill=arr[i]?C[arr[i]]:'var(--line)');
    const tot=arr.length;
    box.querySelector('svg').setAttribute('aria-label','Hemiciclo de 350 escaños, '+tot+' asignados'+(tot?': '+HO.filter(p=>E[p]).map(p=>NM[p]+' '+E[p]).join(', '):''));
    $('nasig').textContent=tot?`${tot} de 350 escaños asignados en el escrutinio provisional.`:'0 de 350 escaños asignados: se rellenará con los primeros resultados oficiales.';
    $('ncards').innerHTML=CARDS.map(k=>{const v=E[k],has=v!=null,b=S23[k];
      const sub=has?(b!=null?`${v-b>0?'+':v-b<0?'−':'±'}${Math.abs(v-b)} vs 2023`:'sin dato de 2023'):(b!=null?`2023: ${b}`:k==='POD'?'2023: dentro de Sumar':'2023: —');
      return `<div class="hs${has?'':' emp'}" style="--c:${C[k]}"><span>${NM[k]==='Sumar + Podemos'?'Sumar':NM[k]}</span><b>${has?v:'—'}</b><small>${sub}</small></div>`}).join('');
  }
  function draw(R){
    const has=R&&R.esc&&R.esc.PP!=null;
    drawHemi(has?R:null);
    $('nstate').innerHTML=has?`<b>Escrutinio en curso.</b> Datos oficiales provisionales; la página se actualiza cada pocos minutos.`:
      VEDA?`<b>Previsión congelada.</b> Desde el 24-nov no se publican encuestas nuevas ni cálculos nuevos; aquí se mantiene el último cálculo publicado (23-nov), sin actualizar, junto al escrutinio cuando empiece.`:
      PRE?`<b>Esta página se activa el día de las elecciones, el 29 de noviembre.</b> Hasta entonces muestra la previsión de hoy; los resultados oficiales aparecerán al lado en cuanto el Ministerio del Interior empiece a publicar el escrutinio.`:
      `<b>Esperando los primeros datos oficiales.</b> Esta página se actualiza sola.`;
    if(has){$('nprog').hidden=false;$('nbar').style.width=(R.escrutado||0)+'%';$('npct').textContent=`${String(R.escrutado).replace('.',',')} % escrutado`;$('nupd').textContent=R.actualizado?'· '+fmt(R.actualizado):''}
    const showP=!!P,cell=k=>{if(!showP||!P.escanos[k])return'<td class="m">—</td>';const e=P.escanos[k];return `<td class="m"><b>${e.c}</b><small>${e.p10}–${e.p90}</small></td>`};
    const res=k=>{if(!has)return null;if(k==='SUMAR')return R.esc.SUMAR==null?null:R.esc.SUMAR+(R.esc.POD||0);return R.esc[k]!=null?R.esc[k]:null};
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
