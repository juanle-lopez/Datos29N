// Día electoral: resultados oficiales (datos/resultados.json, se rellena el 29-N).
(function(){
  const $=id=>document.getElementById(id);
  const NM={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar + Podemos',POD:'Podemos',OTROS:'Otros',ERC:'ERC',JUNTS:'Junts',BILDU:'EH Bildu',PNV:'PNV',BNG:'BNG',CCa:'CC',UPN:'UPN'};
  const COL={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)'};
  const BIG=['PP','PSOE','VOX','SUMAR'],REG=['ERC','JUNTS','BILDU','PNV','BNG','CCa'];
  // momento en Madrid
  let now='';try{const f=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});now=f.format(new Date()).replace(' ','T')}catch(e){now=new Date().toISOString().slice(0,16)}
  const VEDA=now>='2026-11-24'&&now<'2026-11-29T20:00',PRE=now<'2026-11-29T20:00';
  const P=null;
  const fmt=s=>{if(!s)return'';const d=new Date(s);try{return d.toLocaleString('es-ES',{timeZone:'Europe/Madrid',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}catch(e){return s}};
  // ---- hemiciclo y tarjetas de todos los partidos (vacíos hasta el escrutinio)
  const HO=['SUMAR','POD','PSOE','ERC','BILDU','BNG','PNV','JUNTS','CCa','OTROS','PP','VOX'];
  const C={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)',POD:'#7b3f98',ERC:'#d19a2a',JUNTS:'#2a9aa0',BILDU:'#6a8f3a',PNV:'#3f7f5a',BNG:'#5aa0d8',CCa:'#c9b33a',UPN:'#4a5a9a',OTROS:'var(--reg)'};
  const S23={PP:138,PSOE:121,VOX:33,SUMAR:31,ERC:7,JUNTS:7,BILDU:6,PNV:5,BNG:1,CCa:1};
  const CARDS=['PP','PSOE','VOX','SUMAR','POD','ERC','JUNTS','BILDU','PNV','BNG','CCa','OTROS'];
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
  // ---- cronología del día
  const STEPS=[['09:00','Abren','2026-11-29T09:00'],['14:00','Participación','2026-11-29T14:00'],['18:00','Participación','2026-11-29T18:00'],['20:00','Cierran','2026-11-29T20:00'],['21:00','Resultados','2026-11-29T21:00'],['4 dic','Escrutinio final','2026-12-04T09:00']];
  function drawTL(){let cur=-1;STEPS.forEach((s,i)=>{if(now>=s[2])cur=i});
    $('ntl').innerHTML=STEPS.map((s,i)=>`<li class="${i<cur?'done':i===cur?'cur':''}"><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}
  // ---- barras de participación
  const PB=[['14:00','A las 14:00'],['18:00','A las 18:00'],['final','Final']];
  function drawPart(R){const p=R&&R.part||{},m=R&&R.mesas||{};
    let h=PB.map(([k,l])=>{const v=p[k];return `<div class="pb${v==null?' emp':''}"><span>${l}</span><div class="db"><i style="width:${v==null?0:v}%"></i></div><b>${v==null?'—':String(v).replace('.',',')+' %'}</b></div>`}).join('');
    const mp=m.constituidas!=null&&m.total?Math.round(1000*m.constituidas/m.total)/10:null;
    h+=`<div class="pb${mp==null?' emp':''}"><span>Mesas constituidas</span><div class="db"><i style="width:${mp==null?0:mp}%"></i></div><b>${mp==null?'—':String(mp).replace('.',',')+' %'}</b></div>`;
    $('npart').innerHTML=h}
  // ---- mayoría: dos barras hasta 176
  function drawMaj(R){const E=R&&R.esc||{},has=E.PP!=null;
    const a=has?(E.PP||0)+(E.VOX||0):null,b=has?(E.PSOE||0)+(E.SUMAR||0)+(E.POD||0)+(E.ERC||0)+(E.JUNTS||0)+(E.BILDU||0)+(E.PNV||0)+(E.BNG||0)+(E.CCa||0):null;
    const row=(l,v,c)=>`<div class="mj"><span>${l}</span><div class="db"><i style="width:${v==null?0:Math.min(100,v/176*100)}%;background:${c}"></i><u></u></div><b>${v==null?'—':v}</b></div>`;
    $('nmaj').innerHTML=row('PP + Vox',a,'var(--pp)')+row('PSOE + Sumar + Podemos + ERC, Junts, Bildu, PNV, BNG, CC',b,'var(--psoe)')+'<p class="note" style="margin:2px 0 0">La línea marca 176, la mayoría absoluta.</p>'}
  // ---- mapa de provincias
  let PV=null,sel='',met='win',MUN=null,msel='';
  const MET=[['win','Ganador'],['PP','PP'],['PSOE','PSOE'],['VOX','Vox'],['SUMAR','Sumar'],['part','Participación']];
  const win=p=>{if(!p||!p.pct)return null;let b=null,v=-1;['PP','PSOE','VOX','SUMAR'].forEach(k=>{if(p.pct[k]!=null&&p.pct[k]>v){v=p.pct[k];b=k}});return b};
  const mix=(c,x)=>`color-mix(in srgb,${c} ${Math.round(Math.max(12,Math.min(100,x)))}%,var(--line))`;
  const f1=v=>String(v).replace('.',',');
  function tileStyle(p){if(!p)return null;
    if(met==='win'){const w=win(p);return w?{bg:C[w],tx:'#fff',tip:NM[w]}:null}
    if(met==='part'){return p.part!=null?{bg:mix('var(--fg)',(p.part-45)*2.2),tx:p.part>62?'var(--bg)':'var(--fg)',tip:f1(p.part)+' %'}:null}
    const v=p.pct&&p.pct[met];return v!=null?{bg:mix(C[met],v*2.6),tx:v>22?'#fff':'var(--fg)',tip:f1(v)+' %'}:null}
  let svgOK=false;
  function drawMap(){const G=GEO,names=Object.keys(G.p),box=$('pmap');const sl=$('nsel');
    if(sl.options.length<2)names.slice().sort((x,y)=>x.localeCompare(y,'es')).forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n;sl.appendChild(o)});
    if(!svgOK){let h=`<svg class="gm" viewBox="0 0 ${G.w} ${G.h}" role="group" aria-label="Mapa de España por provincias">`;
      names.forEach(n=>{const q=n.replace(/"/g,'&quot;');if(n==='Ceuta'||n==='Melilla')return;h+=`<path class="gp" data-n="${q}" d="${G.p[n].d}"><title></title></path>`});
      ['Ceuta','Melilla'].forEach(n=>{const c=G.p[n].c;h+=`<circle class="gp" data-n="${n}" cx="${c[0]}" cy="${c[1]}" r="9"><title></title></circle>`});
      const f=G.inset;h+=`<rect class="ginset" x="${f[0]}" y="${f[1]}" width="${f[2]}" height="${f[3]}" rx="6"/><text class="gil" x="${f[0]+8}" y="${f[1]+16}">Canarias</text></svg>`;
      box.innerHTML=h;svgOK=true}
    $('nmet').innerHTML=MET.map(([k,l])=>`<button type="button" data-m="${k}" aria-pressed="${k===met}">${l}</button>`).join('');
    const D=PV&&PV.prov||{};let any=false;
    box.querySelectorAll('.gp').forEach(el=>{const n=el.dataset.n,s=tileStyle(D[n]);if(s)any=true;el.style.fill=s?s.bg:'';el.classList.toggle('on',n===sel);el.firstChild.textContent=n+(s?' · '+s.tip:'')});
    $('plg').innerHTML=any?(met==='win'?['PP','PSOE','VOX','SUMAR'].map(k=>`<span><i style="background:${C[k]}"></i>${k==='SUMAR'?'Sumar':NM[k]}</span>`).join(''):`<span>menos</span><i class="grad" style="background:linear-gradient(90deg,${mix(met==='part'?'var(--fg)':C[met],15)},${met==='part'?'var(--fg)':C[met]})"></i><span>más</span>`)+'<span><i style="background:var(--line)"></i>Sin datos</span>':'<span>El mapa se colorea con los primeros resultados.</span>';
    drawPanel()}
  const bars=(pc,es,p23)=>['PP','PSOE','VOX','SUMAR'].map(k=>{const v=pc&&pc[k];return `<div class="pb${v==null?' emp':''}"><span style="color:${C[k]}"><b>${k==='SUMAR'?'Sumar':NM[k]}</b></span><div class="db"><i style="width:${v==null?0:Math.min(100,v*2)}%;background:${C[k]}"></i></div><b>${v==null?'—':f1(v)+' %'}</b><small>${es&&es[k]!=null?es[k]+' esc.':p23&&p23[k]!=null?'2023: '+f1(p23[k])+' %':''}</small></div>`}).join('');
  function drawPanel(){const el=$('ppan');
    if(msel&&MUN){const m=MUN.find(x=>x.c===msel);if(m){el.innerHTML=`<h4>${m.n}</h4><small class="note">${sel}</small>${bars(m.pct,null,m.pct23)}<p class="note" style="margin:6px 0 0">${m.escrutado!=null?f1(m.escrutado)+' % escrutado':'Aún sin datos'}${m.part!=null?' · participación '+f1(m.part)+' %':''}</p>`;return}}
    if(!sel){el.innerHTML='<p class="note" style="margin:0">Toca una provincia o elígela en la lista.</p>';return}
    const p=PV&&PV.prov&&PV.prov[sel]||{};
    el.innerHTML=`<h4>${sel}</h4>${bars(p.pct,p.esc)}<p class="note" style="margin:6px 0 0">${p.escrutado!=null?f1(p.escrutado)+' % escrutado':'Aún sin datos'}${p.part!=null?' · participación '+f1(p.part)+' %':''}</p>`}
  function loadMun(){const ms=$('nmun');msel='';MUN=null;ms.innerHTML='<option value="">Elige provincia</option>';ms.disabled=true;if(!sel)return;
    ms.innerHTML='<option value="">Cargando…</option>';const code=(window.CODES||{})[sel],mine=sel;
    fetch('datos/municipios/'+code+'.json?t='+Date.now()).then(r=>r.ok?r.json():null).then(j=>{if(mine!==sel)return;
      if(!j||!j.mun||!j.mun.length){ms.innerHTML='<option value="">Disponible el 29-N</option>';return}
      MUN=j.mun;ms.innerHTML='<option value="">Elige municipio…</option>'+MUN.slice().sort((a,b)=>a.n.localeCompare(b.n,'es')).map(m=>`<option value="${m.c}">${m.n}</option>`).join('');ms.disabled=false;drawPanel()}).catch(()=>{ms.innerHTML='<option value="">Disponible el 29-N</option>'})}
  function pick(n){sel=n;msel='';$('nsel').value=n;drawMap();loadMun()}
  function draw(R){
    const has=R&&R.esc&&R.esc.PP!=null;
    drawHemi(has?R:null);drawTL();drawPart(R);drawMaj(has?R:null);
    $('nstate').innerHTML=has?`<b>Escrutinio en curso.</b> Se actualiza solo.`:PRE?`<b>Se activa el 29-N.</b> Los datos oficiales aparecerán aquí.`:`<b>Esperando datos oficiales.</b> Se actualiza solo.`;
    if(has){$('nprog').hidden=false;$('nbar').style.width=(R.escrutado||0)+'%';$('npct').textContent=`${String(R.escrutado).replace('.',',')} % escrutado`;$('nupd').textContent=R.actualizado?'· '+fmt(R.actualizado):''}
  }
  function load(){fetch('datos/resultados.json?t='+Date.now()).then(r=>r.ok?r.json():null).then(draw).catch(()=>draw(null));
    fetch('datos/provincias.json?t='+Date.now()).then(r=>r.ok?r.json():null).then(j=>{PV=j;drawMap()}).catch(()=>drawMap())}
  document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('.gp');if(t)pick(t.dataset.n);const m=e.target.closest&&e.target.closest('#nmet button');if(m){met=m.dataset.m;drawMap()}});
  $('nmun').addEventListener('change',e=>{msel=e.target.value;drawPanel()});
  $('nsel').addEventListener('change',e=>pick(e.target.value));
  draw(null);drawMap();load();
  if(!PRE)setInterval(load,60000);
})();
