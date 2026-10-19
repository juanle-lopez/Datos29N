/* ================= VUELOS ================= */
let D,G,fy='all',fu='all',selW=null,selS=null;
const fmt=(n,d=0)=>n.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:'always'});
const UC={'Gobierno':'var(--g9)','Casa Real':'var(--g6)','Militar':'var(--g2)','Mantenimiento':'var(--g3)','Sin registrar':'var(--reg)','Otro':'var(--g8)'};
const P2CA={'Málaga':'Andalucía','Almería':'Andalucía','Cádiz':'Andalucía','Jaén':'Andalucía','Córdoba':'Andalucía','Granada':'Andalucía','Huelva':'Andalucía','Sevilla':'Andalucía','Huesca':'Aragón','Teruel':'Aragón','Zaragoza':'Aragón','Asturias':'Asturias','Illes Balears':'Islas Baleares','Las Palmas':'Canarias','Santa Cruz de Tenerife':'Canarias','Cantabria':'Cantabria','Ávila':'Castilla y León','Burgos':'Castilla y León','León':'Castilla y León','Palencia':'Castilla y León','Salamanca':'Castilla y León','Segovia':'Castilla y León','Soria':'Castilla y León','Valladolid':'Castilla y León','Zamora':'Castilla y León','Albacete':'Castilla-La Mancha','Ciudad Real':'Castilla-La Mancha','Cuenca':'Castilla-La Mancha','Guadalajara':'Castilla-La Mancha','Toledo':'Castilla-La Mancha','Girona':'Cataluña','Barcelona':'Cataluña','Lleida':'Cataluña','Tarragona':'Cataluña','Alicante':'Comunidad Valenciana','Castellón':'Comunidad Valenciana','Valencia':'Comunidad Valenciana','Badajoz':'Extremadura','Cáceres':'Extremadura','A Coruña':'Galicia','Lugo':'Galicia','Ourense':'Galicia','Pontevedra':'Galicia','La Rioja':'La Rioja','Madrid':'Comunidad de Madrid','Murcia':'Región de Murcia','Navarra':'Navarra','Araba/Álava':'País Vasco','Gipuzkoa':'País Vasco','Bizkaia':'País Vasco','Ceuta':'Ceuta','Melilla':'Melilla'};
const rows=(arr)=>arr.filter(r=>(fy==='all'||r[0]==fy)&&(fu==='all'||D.usos[r[1]]===fu));
function agg(){
  const W={},S={};
  rows(D.vis).forEach(r=>{const [,,iso,ca,n]=r;if(iso==='ESP'){if(ca&&ca!=='(sin precisar)')S[ca]=(S[ca]||0)+n}else W[iso]=(W[iso]||0)+n});
  return {W,S};
}
function chips(){
  const ys=['all',2021,2022,2023,2024,2025,2026];
  document.getElementById('vy').innerHTML='<b>Año</b>'+ys.map(y=>chipBtn('data-y',y,y==='all'?'Todos':y+(y===2026?' (hasta 16-oct)':''),fy==y)).join('');
  document.getElementById('vu').innerHTML='<b>Uso</b>'+['all','Gobierno','Casa Real','Militar','Mantenimiento','Sin registrar'].map(u=>chipBtn('data-u',u,u==='all'?'Todos':u,fu===u)).join('');
  document.querySelectorAll('[data-y]').forEach(b=>b.addEventListener('click',()=>{fy=b.dataset.y==='all'?'all':+b.dataset.y;render()}));
  document.querySelectorAll('[data-u]').forEach(b=>b.addEventListener('click',()=>{fu=b.dataset.u;render()}));
}
const YD={2021:306,2022:365,2023:365,2024:366,2025:365,2026:289};
function kpis(){
  const dias=(fy==='all'?Object.values(YD).reduce((a,b)=>a+b,0):YD[fy]);
  const t=rows(D.tot),n=t.reduce((a,r)=>a+r[2],0),h=t.reduce((a,r)=>a+r[3],0),c=t.reduce((a,r)=>a+r[4],0),co=t.reduce((a,r)=>a+r[5],0);
  const all=D.tot.filter(r=>(fy==='all'||r[0]==fy)),tn=all.reduce((a,r)=>a+r[2],0),sr=all.filter(r=>D.usos[r[1]]==='Sin registrar').reduce((a,r)=>a+r[2],0);
  document.getElementById('vk').innerHTML=[
   [fmt(n),'vuelos (tramos)'],[fmt(dias?n/dias:0,1),'vuelos al día de media ('+fmt(dias)+' días)'],[fmt(h),'horas de vuelo'],[fmt(c/1e6,1)+' M€','coste estimado por falcondespega.es'],[fmt(co/1000,1)+' mil t','CO₂ según su cálculo (ver límites)'],[fmt(tn?sr/tn*100:0,0)+'%','de los vuelos del periodo sin uso registrado']
  ].map(x=>`<div><b>${x[0]}</b><small>${x[1]}</small></div>`).join('');
  if(window.rvReady)rvScan();
}
function heat(v,mx){return v?SC(v,mx):'color-mix(in srgb,var(--line) 55%,transparent)'}
const STOPS=[[0,[154,164,174]],[.22,[191,227,200]],[.45,[79,174,114]],[.68,[240,160,48]],[.84,[232,100,28]],[1,[192,40,28]]];
function SC(v,mx){const t=Math.max(0,Math.min(1,Math.log(1+v)/Math.log(1+mx)));let a=STOPS[0],b=STOPS[STOPS.length-1];for(let i=1;i<STOPS.length;i++)if(t<=STOPS[i][0]){a=STOPS[i-1];b=STOPS[i];break}const k=b[0]===a[0]?0:(t-a[0])/(b[0]-a[0]);return 'rgb('+[0,1,2].map(n=>Math.round(a[1][n]+(b[1][n]-a[1][n])*k)).join(',')+')'}
const SCGRAD='linear-gradient(90deg,'+STOPS.map(x=>`rgb(${x[1].join(',')}) ${x[0]*100}%`).join(',')+')';
const PLANE='M7,0L2,-1.7L-1,-6L-2.8,-6L-1.4,-1.5L-5,-1.2L-6.2,-3L-7.6,-3L-6.6,0L-7.6,3L-6.2,3L-5,1.2L-1.4,1.5L-2.8,6L-1,6L2,1.7Z';
function routes(list,mx0,my0,mx,bend,sc,dmin,dmax,dk,reduce){
  let lines='',pl='';
  list.forEach(([x,y,v],ai)=>{const r=v/mx,col=SC(v,mx),dx=x-mx0,dy=y-my0,len=Math.hypot(dx,dy),cx=mx0+dx/2,cy=my0+dy/2-len*bend,w=Math.sqrt(r),
    d=`M${mx0.toFixed(1)},${my0.toFixed(1)}Q${cx.toFixed(1)},${cy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`,dr=`M${x.toFixed(1)},${y.toFixed(1)}Q${cx.toFixed(1)},${cy.toFixed(1)} ${mx0.toFixed(1)},${my0.toFixed(1)}`;
    lines+=`<path class="arc" d="${d}" style="stroke:${col};opacity:.95" stroke-width="${(.6+w*3).toFixed(2)}"/>`;
    if(reduce)return;
    const np=Math.min(4,1+Math.floor(w*4)),dur=Math.max(dmin,Math.min(dmax,len/dk)),s=(sc*(.75+w*.5)).toFixed(2);
    for(let j=0;j<np;j++){const bg=((ai*1.7+j*dur/np)%dur).toFixed(1),path=j%2?dr:d;
      pl+=`<g opacity="0"><animateMotion dur="${dur.toFixed(1)}s" begin="-${bg}s" repeatCount="indefinite" path="${path}" rotate="auto"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.88;1" dur="${dur.toFixed(1)}s" begin="-${bg}s" repeatCount="indefinite"/><path d="${PLANE}" transform="scale(${s})" fill="${col}" stroke="#fff" stroke-width="1.1" paint-order="stroke"/></g>`}});
  return lines+pl}
function tierLeg(){return `<span style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:230px;max-width:360px"><span style="display:block;height:8px;border-radius:4px;background:${SCGRAD}"></span><span style="display:flex;justify-content:space-between;font-size:11px"><span>Muy puntual</span><span>Poco frecuente</span><span>Frecuente</span><span>Muy frecuente</span></span></span>`}
function worldMap(W){
  const mx=Math.max(1,...Object.values(W)),top=Object.entries(W).sort((a,b)=>b[1]-a[1]).slice(0,45),[mx0,my0]=G.madrid;
  const paths=Object.entries(G.world).filter(([k])=>k!=='ATA').map(([k,d])=>`<path class="c${selW===k?' sel':''}" data-i="${k}" d="${d}" fill="${k==='ESP'?'color-mix(in srgb,var(--fg) 22%,var(--panel))':heat(W[k]||0,mx)}"/>`).join('');
  const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const arcs=routes(top.filter(([k])=>G.cent[k]).map(([k,v])=>[...G.cent[k],v]),mx0,my0,mx,.22,.85,12,30,18,REDUCE),planes='';
  document.getElementById('vworld').innerHTML=`<svg viewBox="0 0 ${G.w} ${G.h}" role="img" aria-label="Mapa de calor de destinos de los vuelos">${paths}${arcs}${planes}<circle cx="${mx0}" cy="${my0}" r="5" fill="var(--fg)" stroke="var(--panel)" stroke-width="1.5"/></svg>`;
  document.querySelectorAll('#vworld .c').forEach(p=>p.addEventListener('click',()=>{const sc=document.querySelector('#vworld').parentNode.scrollLeft;selW=p.dataset.i;worldTip(W);worldMap(W);document.querySelector('#vworld').parentNode.scrollLeft=sc}));
  if(!window._vc){window._vc=1;const c=document.querySelector('#vworld').parentNode;setTimeout(()=>{c.scrollLeft=Math.max(0,(c.scrollWidth*mx0/G.w)-c.clientWidth/2)},120)}
  document.getElementById('vleg').innerHTML=`<span>1 visita</span><i style="background:${SCGRAD}"></i><span>${fmt(mx)} visitas</span><span style="margin-left:auto">España en gris · punto = Madrid</span>`+'<div style="flex-basis:100%;margin-top:6px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">Líneas y aviones, mismos colores: '+tierLeg()+'</div>';
}
function worldTip(W){
  const el=document.getElementById('vtip');if(!selW){return}
  const nm=selW==='ESP'?'España':(D.names[selW]||selW),v=W[selW]||0;
  const t=rows(D.vis).filter(r=>r[2]===selW),byU={};t.forEach(r=>byU[D.usos[r[1]]]=(byU[D.usos[r[1]]]||0)+r[4]);
  el.innerHTML=selW==='ESP'?'<b>España</b>: ver el mapa de abajo.':`<b>${nm}</b>: ${fmt(v)} visitas${v?' — '+Object.entries(byU).sort((a,b)=>b[1]-a[1]).map(([u,n])=>`${u} ${n}`).join(' · '):' (ninguna con los filtros actuales)'}.`;
}
function spainMap(S){
  const mx=Math.max(1,...Object.values(S));
  const ca=k=>P2CA[k];
  const paths=Object.entries(G.spain).map(([k,d])=>{const c=ca(k),v=c==='Comunidad de Madrid'?0:(S[c]||0);return `<path class="c${selS===c?' sel':''}" data-c="${c}" d="${d}" fill="${c==='Comunidad de Madrid'?'color-mix(in srgb,var(--fg) 22%,var(--panel))':heat(v,mx)}" stroke-width=".5"/>`}).join('');
  document.getElementById('vspain').innerHTML=`<svg viewBox="0 0 ${G.sw} ${G.sh+70}" style="max-height:520px" role="img" aria-label="Mapa de calor de comunidades">${paths}</svg>`;
  spainArcs(S);
  const l2=document.getElementById('vleg2');if(l2)l2.innerHTML='Líneas y aviones: '+tierLeg();
  document.querySelectorAll('#vspain .c').forEach(p=>p.addEventListener('click',()=>{selS=p.dataset.c;spainTip(S);spainMap(S)}));
}
function spainArcs(S){
  const svg=document.querySelector('#vspain svg');if(!svg)return;
  const mxv=Math.max(1,...Object.values(S)),mad=svg.querySelector('path[data-c="Comunidad de Madrid"]');if(!mad)return;
  const bb=el=>{const b=el.getBBox();return [b.x+b.width/2,b.y+b.height/2]};
  const [mx0,my0]=bb(mad),cc={};
  svg.querySelectorAll('path.c').forEach(pt=>{const c=pt.dataset.c;if(c==='Comunidad de Madrid')return;const b=pt.getBBox(),r=cc[c];if(!r)cc[c]={x0:b.x,y0:b.y,x1:b.x+b.width,y1:b.y+b.height,pts:[pt]};else{r.x0=Math.min(r.x0,b.x);r.y0=Math.min(r.y0,b.y);r.x1=Math.max(r.x1,b.x+b.width);r.y1=Math.max(r.y1,b.y+b.height)}});
  const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches,top=Object.entries(S).filter(([k])=>cc[k]).sort((a,b)=>b[1]-a[1]);
  const g=routes(top.map(([k,v])=>{const r=cc[k];return [(r.x0+r.x1)/2,(r.y0+r.y1)/2,v]}),mx0,my0,mxv,.2,1.5,3,8,45,REDUCE),pl='';
  svg.insertAdjacentHTML('beforeend',`<g style="pointer-events:none">${g}${pl}<circle cx="${mx0.toFixed(1)}" cy="${my0.toFixed(1)}" r="5" fill="var(--fg)" stroke="var(--panel)" stroke-width="1.5"/></g>`);
}
function spainTip(S){const el=document.getElementById('vtip2');if(!selS)return;el.innerHTML=selS==='Comunidad de Madrid'?'<b>Comunidad de Madrid</b>: es la base de los aviones y no se cuenta como destino.':`<b>${selS}</b>: ${fmt(S[selS]||0)} visitas con los filtros actuales.`}
function tops(W,S){
  const bar=(o,lab)=>{const e=Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,12),mx=e.length?e[0][1]:1;return e.length?e.map(([k,v])=>`<div class="vb"><span>${lab(k)}</span><div class="tr"><div class="f" data-w="${v/mx*100}"></div></div><span class="v">${fmt(v)}</span></div>`).join(''):'<p class="na">Sin vuelos con estos filtros.</p>'};
  document.getElementById('vtopw').innerHTML=bar(W,k=>D.names[k]||k);
  document.getElementById('vtops').innerHTML=bar(S,k=>k);
  requestAnimationFrame(()=>document.querySelectorAll('.vb .f').forEach(f=>f.style.width=f.dataset.w+'%'));
}
function bars(){
  const ys=[2021,2022,2023,2024,2025,2026],W=(document.getElementById('vbars')||{}).clientWidth<560?470:760,H=280,L=46,B=26,T=10,R=10,bw=(W-L-R)/ys.length;
  const tot=ys.map(y=>D.tot.filter(r=>r[0]===y&&(fu==='all'||D.usos[r[1]]===fu)).reduce((a,r)=>a+r[2],0)),mx=Math.max(...tot,1)*1.1;
  const yy=v=>H-B-v/mx*(H-B-T);let g='';
  for(let k=0;k<=4;k++){const v=mx*k/4;g+=`<line class="ax" x1="${L}" x2="${W-R}" y1="${yy(v)}" y2="${yy(v)}"/><text x="${L-6}" y="${yy(v)+4}" text-anchor="end">${fmt(v)}</text>`}
  ys.forEach((y,i)=>{let acc=0;const x=L+i*bw+bw*.15,w=bw*.7;D.usos.forEach((u,ui)=>{if(fu!=='all'&&u!==fu)return;const n=D.tot.filter(r=>r[0]===y&&r[1]===ui).reduce((a,r)=>a+r[2],0);if(!n)return;const h=n/mx*(H-B-T);g+=`<rect x="${x}" y="${yy(acc+n)}" width="${w}" height="${h}" fill="${UC[u]}" stroke="var(--panel)" stroke-width=".6"><title>${y} · ${u}: ${n} vuelos</title></rect>`;acc+=n});
    g+=`<text x="${x+w/2}" y="${yy(acc)-5}" text-anchor="middle" style="fill:var(--fg)">${fmt(acc)}</text><text x="${x+w/2}" y="${H-8}" text-anchor="middle">${y}${y===2026?'*':''}</text>`});
  document.getElementById('vbars').innerHTML=`<svg class="gsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Vuelos por año y uso">${g}</svg>`;
  document.getElementById('vbl').innerHTML=D.usos.filter(u=>u!=='Otro').map(u=>`<span style="display:flex;gap:6px;align-items:center"><i style="width:10px;height:10px;border-radius:3px;background:${UC[u]}"></i>${u}</span>`).join('');
}
function ritmo(){
  const ys=[2021,2022,2023,2024,2025,2026],FAM=a=>a<5?'Falcon 900':a<7?'A310':'A330';
  const R=ys.map(y=>{const t=D.tot.filter(r=>r[0]===y&&(fu==='all'||D.usos[r[1]]===fu)),n=t.reduce((a,r)=>a+r[2],0),h=t.reduce((a,r)=>a+r[3],0),c=t.reduce((a,r)=>a+r[4],0),co=t.reduce((a,r)=>a+r[5],0);
    const ac=D.ac.filter(r=>r[0]===y&&(fu==='all'||D.usos[r[1]]===fu));let big=0,tn=0;ac.forEach(r=>{tn+=r[3];if(FAM(r[2])!=='Falcon 900')big+=r[3]});
    return {y,n,h,c,co,dia:n/YD[y],hv:n?h/n:0,ch:h?c/h:0,big:tn?big/tn*100:0}});
  const mxN=Math.max(...R.map(r=>r.n),1);
  document.getElementById('vyt').innerHTML='<thead><tr><th>Año</th><th>Vuelos</th><th>Por día</th><th>Horas por vuelo</th><th>Coste estimado</th><th>€ por hora</th><th>CO₂ est. (t)</th><th>% en A310/A330</th></tr></thead><tbody>'+
   R.map(r=>`<tr><td>${r.y}${r.y===2026?'*':''}</td><td class="m"><span style="display:inline-block;height:8px;border-radius:4px;background:var(--hot);width:${(r.n/mxN*70).toFixed(0)}px;margin-right:6px;vertical-align:middle"></span>${fmt(r.n)}</td><td class="m">${fmt(r.dia,1)}</td><td class="m">${fmt(r.hv,1)}</td><td class="m">${fmt(r.c/1e6,1)} M€</td><td class="m">${fmt(r.ch)}</td><td class="m">${fmt(r.co/1000,1)} mil</td><td class="m">${fmt(r.big,0)} %</td></tr>`).join('')+'</tbody>';
  const p=R.reduce((a,r)=>r.n>a.n?r:a,R[0]),l=R.filter(r=>r.y<2026).slice(-1)[0];
  document.getElementById('vyn').innerHTML=`<b>Cómo leerlo.</b> El año con más vuelos del filtro actual es ${p.y} (${fmt(p.n)}). 2026* llega solo hasta el 16-oct, por eso las ratios por día son comparables y los totales no. «€ por hora» y «CO₂» son estimaciones de falcondespega.es, no cifras oficiales. Los datos de esta página son totales por año, sin fecha de cada vuelo: no se pueden ver meses ni relacionar vuelos con acontecimientos concretos.`;
}
let playT=null;
function stopPlay(){if(playT){clearInterval(playT);playT=null}const b=document.getElementById('vplay');if(b){b.textContent='▶ Ver año a año';b.setAttribute('aria-pressed','false')}}
function startPlay(){
  const ys=[2021,2022,2023,2024,2025,2026],b=document.getElementById('vplay');let i=0;b.textContent='❚❚ Parar';b.setAttribute('aria-pressed','true');
  const step=()=>{fy=ys[i];render();document.getElementById('vplst').textContent='Año '+fy+(fy===2026?' (hasta 16-oct)':'');i++;if(i>=ys.length){clearInterval(playT);playT=null;setTimeout(()=>{if(!playT){b.textContent='▶ Ver año a año';b.setAttribute('aria-pressed','false')}},2200)}};
  step();playT=setInterval(step,2400);
}
function countUp(el,to,dec){const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;if(REDUCE){el.textContent=fmt(to,dec);return}const t0=performance.now(),dur=1600;(function s(now){const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=fmt(to*e,dec);if(k<1)requestAnimationFrame(s)})(t0)}
function hero(){
  const T=D.tot,n=T.reduce((a,r)=>a+r[2],0),h=T.reduce((a,r)=>a+r[3],0),c=T.reduce((a,r)=>a+r[4],0),days=Object.values(YD).reduce((a,b)=>a+b,0),
    sr=T.filter(r=>D.usos[r[1]]==='Sin registrar').reduce((a,r)=>a+r[2],0),W={};D.vis.forEach(r=>{if(r[2]!=='ESP')W[r[2]]=(W[r[2]]||0)+r[4]});
  const top=Object.entries(W).sort((a,b)=>b[1]-a[1])[0],np=Object.keys(W).length;
  document.getElementById('v_hero').innerHTML=`<p class="vh1"><em data-n="${n}">0</em> vuelos en 5 años y 7 meses</p><p class="vsub">Es lo que registran los 9 aviones oficiales del Grupo 45 desde marzo de 2021 (según falcondespega.es). Así se ve de un vistazo:</p>
   <div class="vcards"><div><b>1 cada <span data-n="${days*24/n}" data-d="1">0</span> h</b><small>Algo más de 6 horas entre un vuelo y el siguiente, de media, durante todo el periodo.</small></div>
   <div><b><span data-n="${h/24}" data-d="0">0</span> días</b><small>Suma de horas de vuelo de los 9 aviones (${fmt(h)} h): casi 2 años seguidos en el aire.</small></div>
   <div><b><span data-n="${c/1e6}" data-d="0">0</span> M€</b><small>Coste estimado por falcondespega.es (no es una cifra oficial).</small></div>
   <div><b><span data-n="${np}" data-d="0">0</span> países</b><small>distintos aparecen como origen o destino. El más repetido: ${D.names[top[0]]||top[0]} (${fmt(top[1])} visitas).</small></div>
   <div><b><span data-n="${sr/n*100}" data-d="0">0</span> %</b><small>de los vuelos figura «sin uso registrado»: no se sabe para qué se hicieron.</small></div></div>`;
  const els=document.querySelectorAll('#v_hero [data-n]');
  const go=()=>els.forEach(e=>countUp(e,+e.dataset.n,+(e.dataset.d||0)));
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){io.disconnect();go()}},{threshold:.3});io.observe(document.getElementById('v_hero'))}else go();
}
function waffle(){
  const ys=[2021,2022,2023,2024,2025,2026],el=document.getElementById('vwaf');let k=0,html='';
  ys.forEach(y=>{let dots='';D.usos.forEach((u,ui)=>{const n=D.tot.filter(r=>r[0]===y&&r[1]===ui).reduce((a,r)=>a+r[2],0),q=Math.round(n/10);for(let i=0;i<q;i++){dots+=`<i style="background:${UC[u]};animation-delay:${Math.min(2600,k*4)}ms" title="${y} · ${u}"></i>`;k++}});
    const tn=D.tot.filter(r=>r[0]===y).reduce((a,r)=>a+r[2],0);html+=`<div class="wr"><span class="wy">${y}${y===2026?'*':''}<br><small style="font-weight:400">${fmt(tn)}</small></span><div class="wd">${dots}</div></div>`});
  el.innerHTML=html;
  document.getElementById('vwl').innerHTML=D.usos.filter(u=>u!=='Otro').map(u=>`<span style="display:flex;gap:6px;align-items:center"><i style="width:10px;height:10px;border-radius:50%;background:${UC[u]};display:inline-block"></i>${u}</span>`).join('');
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){io.disconnect();el.classList.add('on')}},{threshold:.15});io.observe(el)}else el.classList.add('on');
}
function juego(){
  const ca={},pa={};D.vis.forEach(r=>{const [,,iso,c,n]=r;if(iso==='ESP'){if(c&&c!=='(sin precisar)'&&c!=='Comunidad de Madrid')ca[c]=(ca[c]||0)+n}else pa[iso]=(pa[iso]||0)+n});
  // ca: nombres de comunidad tal cual vienen; pa: ISO
  const lst=[...Object.keys(ca).sort((a,b)=>a.localeCompare(b,'es')).map(k=>['c|'+k,k]),...Object.keys(pa).sort((a,b)=>(D.names[a]||a).localeCompare(D.names[b]||b,'es')).map(k=>['p|'+k,D.names[k]||k])];
  const sel=document.getElementById('vgsel');
  sel.innerHTML='<optgroup label="Comunidades de España">'+lst.filter(x=>x[0][0]==='c').map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')+'</optgroup><optgroup label="Países">'+lst.filter(x=>x[0][0]==='p').map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')+'</optgroup>';
  const B=[['Menos de 10',0,9],['De 10 a 49',10,49],['De 50 a 199',50,199],['200 o más',200,1e9]];
  const opt=document.getElementById('vgopt'),res=document.getElementById('vgres');
  const val=()=>{const [t,k]=sel.value.split('|');return t==='c'?[ca[k]||0,k,Object.values(ca),'comunidades']:[pa[k]||0,D.names[k]||k,Object.values(pa),'países']};
  const draw=()=>{res.innerHTML='';opt.innerHTML=B.map((b,i)=>`<button type="button" class="chip" data-g="${i}">${b[0]}</button>`).join('');
    opt.querySelectorAll('[data-g]').forEach(bt=>bt.addEventListener('click',()=>{const g=+bt.dataset.g,[v,nm,all,gr]=val(),ok=v>=B[g][1]&&v<=B[g][2],rank=all.filter(x=>x>v).length+1,mx=Math.max(...all);
      const txt=`${nm}: ${fmt(v)} ${v===1?'vez':'veces'} como origen o destino en los vuelos de los aviones oficiales (mar-2021 a oct-2026, según falcondespega.es). Es el nº ${rank} de ${all.length} ${gr}.`;
      res.innerHTML=`<div class="big1"><span id="vgn">0</span> veces</div><p style="margin:4px 0">${ok?'Has acertado.':'No era ese tramo.'} ${nm} es la ${gr==='países'?'posición':'posición'} nº <b>${rank}</b> de ${all.length} ${gr}.</p><div class="vbar"><i></i></div><p class="note" style="margin:0 0 10px">La barra se mide contra el lugar más visitado (${fmt(mx)} veces). Cuenta apariciones como origen o destino, no viajes de ida y vuelta.</p><button type="button" class="chip" id="vgsh">Compartir este dato</button> <button type="button" class="chip" id="vgre">Probar otro</button>`;
      countUp(document.getElementById('vgn'),v,0);requestAnimationFrame(()=>requestAnimationFrame(()=>{res.querySelector('.vbar i').style.width=(v/mx*100)+'%'}));
      document.getElementById('vgre').addEventListener('click',draw);
      document.getElementById('vgsh').addEventListener('click',async e=>{const full=txt+' '+location.href.split('#')[0];try{if(navigator.share){await navigator.share({text:txt,url:location.href.split('#')[0]})}else{await navigator.clipboard.writeText(full);e.target.textContent='Copiado'}}catch(_){e.target.textContent='No se pudo copiar'}})}))};
  sel.addEventListener('change',draw);draw();
}
function render(){chips();kpis();ritmo();const {W,S}=agg();worldMap(W);worldTip(W);spainMap(S);spainTip(S);tops(W,S);bars()}
document.addEventListener('click',e=>{if(e.target.id==='vplay'){playT?stopPlay():startPlay()}else if(playT&&e.target.closest&&e.target.closest('#vy,#vu')){stopPlay()}},true);
Promise.all([fetch('assets/vuelos-data.json?v=16').then(r=>r.json()),fetch('assets/vuelos-geo.json?v=16').then(r=>r.json())]).then(([d,g])=>{D=d;G=g;render();hero();waffle();juego();
 document.getElementById('vsrc').innerHTML='<b>Fuentes.</b> Registro de vuelos exportado de <a href="https://falcondespega.es" target="_blank" rel="noopener">falcondespega.es</a> (7.666 tramos del 1-mar-2021 al 16-oct-2026; método de coste y emisiones en su web). Contornos de países: <a href="https://github.com/johan/world.geo.json" target="_blank" rel="noopener">world.geo.json</a> (Natural Earth, dominio público). Contornos de provincias: CartoDB / <a href="https://github.com/codeforgermany/click_that_hood" target="_blank" rel="noopener">click_that_hood</a>. Contexto del cálculo: <a href="https://theobjective.com/espana/politica/2023-05-02/falcon-sanchez-3130-vuelos-55500-toneladas-co2-retiro-donana/" target="_blank" rel="noopener">The Objective (may-2023)</a>.';
}).catch(()=>{document.getElementById('vk').innerHTML='<p class="na">No se han podido cargar los datos.</p>'});
