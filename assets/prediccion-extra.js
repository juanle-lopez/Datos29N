// Predicción: bloques adicionales (encuestas una a una, esta semana, provincias en disputa, tabla día a día y compartir gráficos como imagen).
(function(){
  if(typeof PRED==='undefined')return;
  const $=id=>document.getElementById(id);
  const P=[['PP','PP','var(--pp)'],['PSOE','PSOE','var(--psoe)'],['VOX','Vox','var(--vox)'],['SUMAR','Sumar + Podemos','var(--sumar)']];
  const NM={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Podemos',ERC:'ERC',JUNTS:'Junts',BILDU:'EH Bildu',PNV:'PNV',BNG:'BNG',CCa:'CC',UPN:'UPN'};
  const COL={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)'};
  const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const fecha=s=>{const [y,m,d]=s.split('-').map(Number);return d+' '+MES[m-1]};
  const n1=x=>x.toFixed(1).replace('.',',');
  const sg=(x,d=1)=>(x>0?'+':x<0?'−':'±')+Math.abs(x).toFixed(d).replace('.',',');
  const HD=(typeof HIST!=='undefined'&&HIST.dias)?HIST.dias:[];
  const MAJ=176;

  // Portada: escaños hoy y proyectados al 29-N
  {const el=$('phoy');if(el){const E=PRED.escPrivadas,B=PRED.escBase.priv,pv=E.ppVox;
    el.innerHTML=P.map(([k,nm,c])=>`<div class="hoyc" style="--c:${c}"><div class="hn">${nm}</div><div class="hv"><b>${B[k]}</b><span>→ ${E.escanos[k].c}</span></div><small>hoy → 29‑N (${E.escanos[k].p10}–${E.escanos[k].p90})</small><small>Voto medio: <b>${PRED.base.priv[k].toFixed(1).replace('.',',')} %</b></small></div>`).join('')+
      `<div class="hoym">PP + Vox: <b>${PRED.escBaseBloq.priv.PV}</b> hoy → <b>${pv.c}</b> el 29‑N (${pv.p10}–${pv.p90}) · mayoría absoluta: <b>176</b></div>`;}}

  // 1. Encuestas una a una: cuántas dan mayoría a PP + Vox (escaños con nuestro D'Hondt) y franja de puntos
  {const el=$('pkey'),E=PRED.escPriv;if(el&&E&&E.length&&E[0].PV!=null){
    const n=E.length,si=E.filter(p=>p.PV>=MAJ).length,iz=E.filter(p=>p.IZ>=MAJ).length;
    const all=[...E.map(p=>p.PV),...E.map(p=>p.IZ)],lo=Math.max(0,Math.min(100,Math.floor((Math.min(...all)-6)/10)*10)),hi=Math.max(220,Math.ceil((Math.max(...all)+6)/10)*10);
    const W=Math.max(300,Math.min(700,(el.clientWidth||innerWidth-60)-28)),H=142,Lm=14,Rm=14,X=v=>Lm+(v-lo)/(hi-lo)*(W-Lm-Rm),yb=102;
    const PAL=['#2f6fb5','#d9534f','#2e9e5b','#e08a1e','#8a5bc4','#17a2b8','#c2487f','#7a8b2c','#b5651d','#4a5fc1','#d4a017','#1f8a8a','#a04040','#6b7280'];
    const order=[...E].map((p,i)=>i).sort((i,j)=>E[i].e.localeCompare(E[j].e,'es')),col={};order.forEach((i,k)=>col[i]=PAL[k%PAL.length]);
    const R0=6;
    const strip=(key,nm)=>{const vs=E.map(p=>p[key]);
      let svg=`<svg class="kstrip" viewBox="0 0 ${W} ${H}" role="img" aria-label="Escaños de ${nm} en cada una de las ${n} encuestas: entre ${Math.min(...vs)} y ${Math.max(...vs)}; mayoría absoluta en 176">`;
      svg+=`<rect x="${X(lo)}" y="${yb-1}" width="${X(MAJ)-X(lo)}" height="2" fill="var(--line)"/><rect x="${X(MAJ)}" y="${yb-1}" width="${X(hi)-X(MAJ)}" height="2" fill="var(--fg)" opacity=".35"/>`;
      for(let v=Math.ceil(lo/20)*20;v<=hi;v+=20)svg+=`<text x="${X(v)}" y="${H-6}" text-anchor="middle">${v}</text>`;
      svg+=`<line x1="${X(MAJ)}" x2="${X(MAJ)}" y1="8" y2="${yb+12}" stroke="var(--fg)" stroke-dasharray="3 3"/><text x="${X(MAJ)-5}" y="16" text-anchor="end" style="font-weight:700;fill:var(--fg)">mayoría 176</text>`;
      svg+=`<text x="${X(MAJ)-6}" y="${yb+19}" text-anchor="end" style="fill:var(--muted,#667);font-size:10px">← sin mayoría</text><text x="${X(MAJ)+6}" y="${yb+19}" style="fill:var(--muted,#667);font-size:10px">con mayoría →</text>`;
      const placed=[],items=E.map((p,i)=>({p,i})).sort((a,b)=>a.p[key]-b.p[key]||a.i-b.i);
      items.forEach(it=>{const x=X(it.p[key]);let lvl=0;while(placed.some(q=>q.l===lvl&&Math.abs(q.x-x)<2*R0+1))lvl++;placed.push({x,l:lvl});it.x=x;it.y=yb-9-lvl*(2*R0+1)});
      items.forEach(it=>{const{p,i}=it;svg+=`<circle class="kd" data-i="${i}" cx="${it.x}" cy="${it.y}" r="${R0}" fill="${col[i]}" stroke="var(--panel)" stroke-width="1.8"><title>${p.e} (${fecha(p.f)}): ${nm} ${p[key]}</title></circle>`});
      return svg+`</svg>`};
    const NA='PP + Vox',NB='PSOE + Sumar + Podemos + ERC, Junts, EH Bildu, PNV, BNG y CC',NBs='PSOE + Sumar + Podemos y socios de 2023';
    const leg=[...E.keys()].sort((i,j)=>E[i].e.localeCompare(E[j].e,'es')).map(i=>`<button type="button" class="kc" data-i="${i}"><i style="background:${col[i]}"></i>${E[i].e.split(' / ')[0]}<b>${E[i].PV} · ${E[i].IZ}</b></button>`).join('');
    el.innerHTML=`<p class="kh"><b>¿Qué sumas llegan a 176 escaños?</b> Encuesta a encuesta</p>`+
      `<p class="note" style="margin:2px 0 6px">Cada punto es una encuesta (la última de cada empresa), con sus escaños calculados con nuestro D’Hondt provincial. Se muestran dos sumas de partidos con las mismas reglas y sin presuponer pactos: <b>${si} de ${n}</b> encuestas dan 176 o más a ${NA}; <b>${iz} de ${n}</b> a ${NBs}. Es un recuento de encuestas, no una probabilidad.</p>`+
      `<p class="note" style="margin:8px 0 0"><b>Suma de ${NA}</b>: entre <b>${Math.min(...E.map(p=>p.PV))}</b> y <b>${Math.max(...E.map(p=>p.PV))}</b> escaños.</p><div class="tw">${strip('PV',NA)}</div>`+
      `<p class="note" style="margin:8px 0 0"><b>Suma de ${NBs}</b> <span style="font-weight:400">(${NB.replace('PSOE + Sumar + Podemos + ','')})</span>: entre <b>${Math.min(...E.map(p=>p.IZ))}</b> y <b>${Math.max(...E.map(p=>p.IZ))}</b> escaños.</p><div class="tw">${strip('IZ',NB)}</div>`+
      `<p class="note" style="margin:8px 0 2px">Cada botón muestra los escaños de la primera suma · la segunda en esa encuesta.</p><div class="kleg">${leg}</div>`;
    const sel=i=>{el.querySelectorAll('.kd').forEach(d=>{d.style.opacity=i==null||d.dataset.i===i?1:.18;d.setAttribute('r',d.dataset.i===i?R0+2:R0)});el.querySelectorAll('.kc').forEach(c=>c.classList.toggle('on',i!=null&&c.dataset.i===i))};
    // Los puntos se mecen muy suavemente, cada uno a su ritmo
    el.querySelectorAll('.kd').forEach((d,k)=>{const r=(k*7919%97)/97,q=(k*104729%89)/89;d.style.setProperty('--fx',(1.2+r*1.6).toFixed(2)+'px');d.style.setProperty('--fy',(1.2+q*1.6).toFixed(2)+'px');d.style.animationDuration=(5+r*4).toFixed(2)+'s';d.style.animationDelay=(-q*8).toFixed(2)+'s'});
    let cur=null;el.querySelectorAll('.kc').forEach(c=>c.addEventListener('click',()=>{cur=cur===c.dataset.i?null:c.dataset.i;sel(cur)}));
    el.querySelectorAll('.kd').forEach(d=>d.addEventListener('click',()=>{cur=cur===d.dataset.i?null:d.dataset.i;sel(cur)}));}}

  // 4. Qué ha cambiado esta semana
  {const el=$('psemana');if(el&&HD.length>1){
    const h=HD[HD.length-1],a=HD.find(x=>x.f>=(()=>{const d=new Date(h.f+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-7);return d.toISOString().slice(0,10)})())||HD[0];
    const ent=[];HD.filter(x=>x.f>a.f&&x.cambio).forEach(x=>(x.cambio.entran||[]).forEach(e=>ent.push(e)));
    const ch=P.map(([k,nm,c])=>{const d=h.esc[k]-a.esc[k];return `<span class="sw"><b style="color:${c}">${nm}</b> <span class="m">${a.esc[k]} → ${h.esc[k]}</span> <small class="${d>0?'up':d<0?'dn':''}">${d?sg(d,0):'='}</small></span>`}).join('');
    el.innerHTML=`<div class="kt">Esta semana <small>del ${fecha(a.f)} al ${fecha(h.f)}</small></div><div class="swr">${ch}</div>`+
      (ent.length?`<p class="note" style="margin:6px 0 0">Entra${ent.length>1?'n':''} ${ent.map(e=>`<b>${e.e}</b> (${fecha(e.f)}: PP ${n1(e.voto.PP)} · PSOE ${n1(e.voto.PSOE)} · Vox ${n1(e.voto.VOX)}${e.antes?`; antes ${n1(e.antes.voto.PP)} · ${n1(e.antes.voto.PSOE)} · ${n1(e.antes.voto.VOX)}`:''})`).join('; ')}. Toca ese día en los gráficos para ver el detalle.</p>`:`<p class="note" style="margin:6px 0 0">No ha entrado ninguna encuesta nueva esta semana.</p>`);}}

  // 3. Las encuestas, una a una: ventaja y diferencia con la media
  {const el=$('penc');if(el){
    const b=PRED.base.priv,E=PRED.escPriv,rows=PRED.privadas.map((p,i)=>({p,e:E[i]})).sort((x,y)=>y.p.f.localeCompare(x.p.f)||x.p.e.localeCompare(y.p.e));
    const td=(p,k)=>{const d=p[k]-b[k];return `<td class="m">${n1(p[k])}<small class="${Math.abs(d)>=1.5?'big':''}">${sg(d)}</small></td>`};
    el.innerHTML=`<div class="tw"><table class="etab"><thead><tr><th>Encuesta</th><th>Fecha</th>${P.map(([k,nm])=>`<th>${nm}</th>`).join('')}<th>Ventaja PP</th><th>PP + Vox (esc.)</th></tr></thead><tbody>`+
      rows.map(({p,e})=>`<tr><td>${p.e}</td><td class="m">${fecha(p.f)}</td>${P.map(([k])=>td(p,k)).join('')}<td class="m">${sg(p.PP-p.PSOE)}</td><td class="m"><b style="color:${e.PV>=MAJ?'var(--pp)':'var(--psoe)'}">${e.PV}</b></td></tr>`).join('')+
      `<tr class="avg"><td>Media de las ${rows.length}</td><td></td>${P.map(([k])=>`<td class="m">${n1(b[k])}</td>`).join('')}<td class="m">${sg(b.PP-b.PSOE)}</td><td class="m"><b>${PRED.escBaseBloq.priv.PV}</b></td></tr></tbody></table></div>`+
      `<p class="note" style="margin:6px 0 0">Debajo de cada porcentaje, la diferencia con la media (en negrita si es de 1,5 puntos o más). Una empresa que se separa de la media no se equivoca necesariamente: no sabemos cuál acertará. Ordenadas por fecha, no por calidad. <a href="datos/encuestas.csv" download>Descargar en CSV</a>.</p>`;}}

  // 2. Provincias en disputa
  {const el=$('pdisp'),D=PRED.escPrivadas.disputa;if(el&&D&&D.length){
    const top=D.slice(0,10);
    el.innerHTML=`<ol class="dlist">`+top.map(x=>`<li><div class="dh"><b>${x.n}</b> <small>${x.s} escaños</small><span class="dp m">${x.p} %</span></div>`+
      `<div class="db"><i style="width:${x.p}%"></i></div>`+
      `<div class="dd">${x.gana&&x.pierde?`Lo más probable si cambia: <b style="color:${COL[x.gana]||'var(--fg)'}">${NM[x.gana]}</b> gana uno a <b style="color:${COL[x.pierde]||'var(--fg)'}">${NM[x.pierde]}</b>`:''} · hoy ${Object.entries(x.esc).map(([k,v])=>NM[k]+' '+v).join(', ')}</div></li>`).join('')+`</ol>`+
      `<p class="note" style="margin:6px 0 0">Porcentaje de las 4.000 simulaciones del 29-N en que el reparto de esa provincia cambia en al menos un escaño respecto al central. Las provincias grandes cambian más a menudo porque tienen más escaños en juego.</p>`;}}

  // 9. Tabla día a día (la versión en tabla de los gráficos)
  {const el=$('pdias');if(el&&HD.length){
    el.innerHTML=`<div class="tw"><table class="etab"><thead><tr><th>Día</th>${P.map(([k,nm])=>`<th>${nm}</th>`).join('')}<th>PP + Vox</th><th>Bloque 2023</th><th>Encuestas</th><th>Qué cambió</th></tr></thead><tbody>`+
      [...HD].reverse().map(h=>{const c=h.cambio,ent=c&&c.entran?c.entran.map(e=>'entra '+e.e).concat((c.salen||[]).map(e=>'sale '+e.e)).join('; '):'';
        return `<tr><td class="m">${fecha(h.f)}</td>${P.map(([k])=>`<td class="m">${h.esc[k]}${c&&c.dEsc&&c.dEsc[k]?`<small class="${c.dEsc[k]>0?'up':'dn'}">${sg(c.dEsc[k],0)}</small>`:''}</td>`).join('')}<td class="m"><b>${h.esc.PV}</b></td><td class="m">${h.esc.IZ}</td><td class="m">${h.n}</td><td>${ent||'—'}</td></tr>`}).join('')+`</tbody></table></div>`;}}

  // 7. Compartir cada gráfico como imagen
  const PROPS=['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','stroke-linejoin','opacity','fill-opacity','stroke-opacity','font-size','font-family','font-weight','text-anchor','paint-order','display','visibility'];
  async function png(svg,title){
    const vb=svg.viewBox.baseVal,cl=svg.cloneNode(true),src=[svg,...svg.querySelectorAll('*')],dst=[cl,...cl.querySelectorAll('*')];
    src.forEach((s,i)=>{if(!(s instanceof SVGElement))return;const cs=getComputedStyle(s),d=dst[i];PROPS.forEach(p=>{const v=cs.getPropertyValue(p);if(v)d.style.setProperty(p,v)})});
    cl.querySelectorAll('animate').forEach(a=>{const t=a.parentNode,at=a.getAttribute('attributeName'),vs=a.getAttribute('values'),to=a.getAttribute('to');const v=vs?vs.split(';').pop().trim():to;if(v!=null&&at){if(at==='opacity')t.style.opacity=v;else t.setAttribute(at,v)}a.remove()});
    cl.querySelectorAll('.hint,.tt,.hzone').forEach(e=>e.remove());cl.querySelectorAll('polyline.trj').forEach(e=>{if((e.getAttribute('stroke-dasharray')||'').startsWith('0.01'))e.remove()});
    const cs=getComputedStyle(document.body),bg=cs.getPropertyValue('--panel').trim()||'#fff',fg=cs.getPropertyValue('--fg').trim()||'#000',mu=cs.getPropertyValue('--muted').trim()||'#666';
    const pad=24,top=title?40:16,foot=34,Wd=vb.width+2*pad,Ht=vb.height+top+foot;
    cl.setAttribute('width',vb.width);cl.setAttribute('height',vb.height);cl.setAttribute('xmlns','http://www.w3.org/2000/svg');
    const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(cl)],{type:'image/svg+xml'}));
    const img=new Image();await new Promise((ok,ko)=>{img.onload=ok;img.onerror=ko;img.src=url});
    const s=2,cv=document.createElement('canvas');cv.width=Wd*s;cv.height=Ht*s;const g=cv.getContext('2d');g.scale(s,s);
    g.fillStyle=bg;g.fillRect(0,0,Wd,Ht);
    if(title){g.fillStyle=fg;g.font='700 17px "Public Sans",system-ui,sans-serif';g.fillText(title,pad,28)}
    g.drawImage(img,pad,top,vb.width,vb.height);URL.revokeObjectURL(url);
    g.fillStyle=mu;g.font='11px "IBM Plex Mono",ui-monospace,monospace';g.fillText('Datos 29N · juanle-lopez.github.io/Datos29N',pad,Ht-12);if(title){g.textAlign='right';g.fillText(fecha(PRED.generado)+' 2026',Wd-pad,28);g.textAlign='left'}
    return await new Promise(r=>cv.toBlob(r,'image/png'));
  }
  async function share(svg,title,name){
    try{const b=await png(svg,title),f=new File([b],name+'.png',{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:title,text:title+' — Datos 29N'});return}
      const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
    catch(e){if(e&&e.name!=='AbortError')console.warn(e)}
  }
  const ICO='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/></svg>';
  function addBtns(){
    document.querySelectorAll('#pgrid .pcell').forEach(c=>{if(c.querySelector('.shimg'))return;const sv=c.querySelector('svg.pg,svg');if(!sv)return;
      const k=sv.dataset.k,nm=k?(NM[k]||k):'Mayoría absoluta',t=k?`${nm}: escaños hacia el 29-N`:'¿Mayoría absoluta el 29-N?';
      const b=document.createElement('button');b.type='button';b.className='shimg';b.innerHTML=ICO+'<span>Imagen</span>';b.setAttribute('aria-label','Compartir el gráfico de '+nm+' como imagen');
      b.addEventListener('click',()=>share(sv,t,'datos29n-'+(k||'mayoria').toLowerCase()));c.appendChild(b)});
  }
  const g=$('pgrid');if(g){addBtns();new MutationObserver(addBtns).observe(g,{childList:true})}
})();

/* Si las encuestas fallan: la media de hoy con el error de 28-A 2019, 10-N 2019 y 23-J 2023 (calculado en tools/prediccion.mjs) */
(function(){
  const box=document.getElementById('perr');if(!box||typeof PRED==='undefined'||!PRED.errSc)return;
  const nm={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Pod.'},f1=x=>(x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(1).replace('.',',');
  const hoy={e:'Media de hoy',esc:PRED.escBase.priv,PV:PRED.escBaseBloq.priv.PV,IZ:PRED.escBaseBloq.priv.IZ};
  const col={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)'};
  box.className='perr';
  box.innerHTML=[hoy,...PRED.errSc].map(r=>`<div class="pe${r.e==='Media de hoy'?' hoy':''}"><p class="pet">${r.e==='Media de hoy'?'Media de hoy':'Con el error de '+r.e}</p><div class="pseats">${['PP','PSOE','VOX','SUMAR'].map(k=>`<span class="pchip"><i style="background:${col[k]}"></i>${nm[k]}<b>${r.esc[k]}</b></span>`).join('')}</div><p class="pes"><span>PP + Vox <b>${r.PV}</b></span><span>PSOE + Sumar + Pod. + socios <b>${r.IZ}</b></span></p></div>`).join('');
  const n=document.getElementById('perrn');
  if(n)n.innerHTML='Mayoría absoluta: 176. Errores aplicados (puntos de voto): '+PRED.errSc.map(r=>`<b>${r.e}</b>: `+['PP','PSOE','VOX','SUMAR'].filter(k=>r.err[k]!==null).map(k=>nm[k]+' '+f1(r.err[k])).join(', ')).join(' · ')+'. Sumar + Podemos solo tiene el error de 2023, porque antes iban por separado.';
})();
