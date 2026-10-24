/* ================= VUELOS ================= */
let RK='',RD={},BASE=null,DIAS=null;
let D,G,fy='all',fu='all',selW=null,selS=null,wz='world';
const fmt=(n,d=0)=>n.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:'always'});
const UC={'Gobierno':'var(--g9)','Casa Real':'var(--g6)','Militar':'var(--g2)','Mantenimiento':'var(--g3)','Sin registrar':'var(--reg)','Otro':'var(--g8)'};
const P2CA={'Málaga':'Andalucía','Almería':'Andalucía','Cádiz':'Andalucía','Jaén':'Andalucía','Córdoba':'Andalucía','Granada':'Andalucía','Huelva':'Andalucía','Sevilla':'Andalucía','Huesca':'Aragón','Teruel':'Aragón','Zaragoza':'Aragón','Asturias':'Asturias','Illes Balears':'Islas Baleares','Las Palmas':'Canarias','Santa Cruz de Tenerife':'Canarias','Cantabria':'Cantabria','Ávila':'Castilla y León','Burgos':'Castilla y León','León':'Castilla y León','Palencia':'Castilla y León','Salamanca':'Castilla y León','Segovia':'Castilla y León','Soria':'Castilla y León','Valladolid':'Castilla y León','Zamora':'Castilla y León','Albacete':'Castilla-La Mancha','Ciudad Real':'Castilla-La Mancha','Cuenca':'Castilla-La Mancha','Guadalajara':'Castilla-La Mancha','Toledo':'Castilla-La Mancha','Girona':'Cataluña','Barcelona':'Cataluña','Lleida':'Cataluña','Tarragona':'Cataluña','Alicante':'Comunidad Valenciana','Castellón':'Comunidad Valenciana','Valencia':'Comunidad Valenciana','Badajoz':'Extremadura','Cáceres':'Extremadura','A Coruña':'Galicia','Lugo':'Galicia','Ourense':'Galicia','Pontevedra':'Galicia','La Rioja':'La Rioja','Madrid':'Comunidad de Madrid','Murcia':'Región de Murcia','Navarra':'Navarra','Araba/Álava':'País Vasco','Gipuzkoa':'País Vasco','Bizkaia':'País Vasco','Ceuta':'Ceuta','Melilla':'Melilla'};
const rows=(arr)=>arr.filter(r=>(fy==='all'||r[0]==fy)&&(fu==='all'||D.usos[r[1]]===fu));
function agg(){
  const W={},S={};
  rows(D.vis).forEach(r=>{const [,,iso,ca,n]=r;if(iso==='ESP'){if(ca&&ca!=='(sin precisar)')S[ca]=(S[ca]||0)+n}else W[iso]=(W[iso]||0)+n});
  return {W,S};
}
let PM='';
function chips(){
  const ys=[2021,2022,2023,2024,2025,2026];
  const PL=[['all','Todos los años'],...ys.map(y=>[String(y),y===2026?'2026 (hasta 23-oct)':String(y)]),['q1','Último día'],['q7','Últimos 7 días'],['q30','Últimos 30 días'],['c','Elegir fechas…']];
  const cur=PM||String(fy);
  document.getElementById('vy').innerHTML='<b>Periodo</b><select id="vper" class="vsel" aria-label="Periodo">'+PL.map(([v,l])=>'<option value="'+v+'"'+(cur===v?' selected':'')+'>'+l+'</option>').join('')+'</select>';
  const UL={all:'Todos',Gobierno:'Gobierno',"Casa Real":'Casa Real',Militar:'Ejército (militar)',Mantenimiento:'Mantenimiento','Sin registrar':'Sin registrar'};
  const cnt=u=>D.tot.filter(r=>(fy==='all'||r[0]==fy)&&(u==='all'||D.usos[r[1]]===u)).reduce((t,r)=>t+r[2],0);
  document.getElementById('vu').innerHTML='<b>Uso</b><select id="vsel" class="vsel" aria-label="Quién usa el avión">'+Object.keys(UL).map(u=>'<option value="'+u+'"'+(fu===u?' selected':'')+'>'+UL[u]+' ('+fmt(cnt(u))+')</option>').join('')+'</select>';
  document.getElementById('vsel').addEventListener('change',e=>{fu=e.target.value;render()});
  document.getElementById('vper').addEventListener('change',e=>{const v=e.target.value;
    if(/^\d{4}$/.test(v)||v==='all'){if(RK)clearRange(true);PM='';fy=v==='all'?'all':+v;render();return}
    if(v==='c'){PM='c';if(RK){render();return}}
    loadDias().then(J=>{const fin=J.fin||'2026-10-23',hi=off(fin),q=v==='q1'?1:v==='q7'?7:30,lo=hi-q+1;PM=v;applyRange(iso(lo),fin)})});
}
const YD={2021:306,2022:365,2023:365,2024:366,2025:365,2026:294};
function kpis(){
  const dias=RK?Object.values(RD).reduce((a,b)=>a+b,0):(fy==='all'?Object.values(YD).reduce((a,b)=>a+b,0):YD[fy]);
  const t=rows(D.tot),n=t.reduce((a,r)=>a+r[2],0),h=t.reduce((a,r)=>a+r[3],0),c=t.reduce((a,r)=>a+r[4],0),co=t.reduce((a,r)=>a+r[5],0);
  const all=D.tot.filter(r=>(fy==='all'||r[0]==fy)),tn=all.reduce((a,r)=>a+r[2],0),sr=all.filter(r=>D.usos[r[1]]==='Sin registrar').reduce((a,r)=>a+r[2],0);
  document.getElementById('vk').innerHTML=[
   [fmt(n),'vuelos (tramos)'],[fmt(dias?n/dias:0,1),'vuelos al día de media ('+fmt(dias)+(dias===1?' día)':' días)')],[fmt(h,h<100?1:0),'horas de vuelo'],[c>=1e6?fmt(c/1e6,1)+' M€':fmt(c/1e3,0)+' mil €','coste estimado por falcondespega.es'],[co>=1000?fmt(co/1000,1)+' mil t':fmt(co,0)+' t','CO₂ según su cálculo (ver límites)'],[fmt(tn?sr/tn*100:0,0)+'%','de los vuelos del periodo sin uso registrado']
  ].map(x=>`<div><b>${x[0]}</b><small>${x[1]}</small></div>`).join('');
  if(window.rvReady)rvScan();
}
function heat(v,cf){return v?cf(v):LAND}
const STOPS=[[0,[190,50,190]],[.06,[150,18,60]],[.16,[200,32,36]],[.28,[236,84,28]],[.4,[248,150,36]],[.52,[250,214,60]],[.62,[176,210,72]],[.74,[66,184,96]],[.87,[58,168,196]],[1,[70,116,206]]];
const LAND='#d9e0e8',LANDHI='#a9b6c5';
const lerpC=(p)=>{let a=STOPS[0],b=STOPS[STOPS.length-1];for(let i=1;i<STOPS.length;i++)if(p<=STOPS[i][0]){a=STOPS[i-1];b=STOPS[i];break}const k=b[0]===a[0]?0:(p-a[0])/(b[0]-a[0]),e=k*k*(3-2*k);return 'rgb('+[0,1,2].map(n=>Math.round(a[1][n]+(b[1][n]-a[1][n])*e)).join(',')+')'};
// Color continuo: mezcla la posición del país en la lista y su valor (escala logarítmica); sin saltos bruscos.
function mkP(values){const vs=values.filter(x=>x>0),n=vs.length,mx=Math.max(1,...vs);return v=>{const gt=vs.filter(x=>x>v).length,pr=n>1?gt/(n-1):0,pv=1-Math.log(1+v)/Math.log(1+mx);return Math.min(1,.65*pr+.35*pv)}}
function mkSC(values){const f=mkP(values);return v=>v?lerpC(f(v)):'none'}
// Campo de calor continuo: cada punto del mapa mezcla el valor de su país con el de los vecinos cercanos (gaussiana), como un mapa del tiempo.
const HCACHE={};
function heatField(items,W,H,scale,sigma,ob){ob=ob==null?3:ob;
  const w=Math.round(W*scale),h=Math.round(H*scale),m=document.createElement('canvas');m.width=w;m.height=h;const mc=m.getContext('2d',{willReadFrequently:true});mc.scale(scale,scale);
  items.forEach((it,i)=>{mc.fillStyle=`rgb(${(i+1)&255},${(i+1)>>8},0)`;it.ds.forEach(d=>mc.fill(new Path2D(d)))});
  const md=mc.getImageData(0,0,w,h).data,out=document.createElement('canvas');out.width=w;out.height=h;const oc=out.getContext('2d'),od=oc.createImageData(w,h),o=od.data;
  const T=24,tx=Math.ceil(W/T),ty=Math.ceil(H/T),R=3*sigma+T,tiles=[];
  for(let a=0;a<ty;a++)for(let b=0;b<tx;b++){const cx=b*T+T/2,cy=a*T+T/2;tiles.push(items.map((it,i)=>[i,it]).filter(([i,it])=>Math.hypot(it.cx-cx,it.cy-cy)<=R).map(x=>x[0]))}
  const k2=1/(2*sigma*sigma);
  for(let y=0;y<h;y++){const wy=y/scale,tr=Math.floor(wy/T);for(let x=0;x<w;x++){const q=(y*w+x)*4,id=md[q]+(md[q+1]<<8);if(!id||md[q+3]<128)continue;const own=items[id-1];if(!own)continue;
    const wx=x/scale,lst=tiles[tr*tx+Math.floor(wx/T)];let dx=wx-own.cx,dy=wy-own.cy,w0=1+ob*Math.exp(-(dx*dx+dy*dy)*k2),num=w0*own.p,den=w0;
    for(let n=0;n<lst.length;n++){const it=items[lst[n]];if(it===own)continue;dx=wx-it.cx;dy=wy-it.cy;const ww=2*Math.exp(-(dx*dx+dy*dy)*k2);num+=ww*it.p;den+=ww}
    const c=lerpC(Math.min(1,num/den)).match(/\d+/g);o[q]=+c[0];o[q+1]=+c[1];o[q+2]=+c[2];o[q+3]=255}}
  oc.putImageData(od,0,0);return out.toDataURL('image/png')}
const SCGRAD='linear-gradient(90deg,'+STOPS.slice().reverse().map(x=>`rgb(${x[1].join(',')}) ${(1-x[0])*100}%`).join(',')+')';
const PLANE='M7,0L2,-1.7L-1,-6L-2.8,-6L-1.4,-1.5L-5,-1.2L-6.2,-3L-7.6,-3L-6.6,0L-7.6,3L-6.2,3L-5,1.2L-1.4,1.5L-2.8,6L-1,6L2,1.7Z';
function routes(list,mx0,my0,mx,bend,sc,dmin,dmax,dk,reduce,cf,wf){wf=wf||1;
  // Efecto 3D: sombra en el suelo (cuerda recta), trayectoria elevada (arco con volumen), avión que sube y baja con su sombra.
  let gr='',lines='',pl='';
  list.forEach(([x,y,v],ai)=>{const r=v/mx,dx=x-mx0,dy=y-my0,len=Math.hypot(dx,dy),cx=mx0+dx/2,cy=my0+dy/2-len*bend*1.5,w=Math.sqrt(r),wd=(.6+w*3)*wf,
    d=`M${mx0.toFixed(1)},${my0.toFixed(1)}Q${cx.toFixed(1)},${cy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`,dr=`M${x.toFixed(1)},${y.toFixed(1)}Q${cx.toFixed(1)},${cy.toFixed(1)} ${mx0.toFixed(1)},${my0.toFixed(1)}`,
    g=`M${mx0.toFixed(1)},${my0.toFixed(1)}L${x.toFixed(1)},${y.toFixed(1)}`,gro=`M${x.toFixed(1)},${y.toFixed(1)}L${mx0.toFixed(1)},${my0.toFixed(1)}`;
    gr+=`<path class="arc" d="${g}" style="stroke:#05090f;opacity:.28" stroke-width="${(wd*.9).toFixed(2)}" stroke-dasharray="${(2*wf).toFixed(2)} ${(1.6*wf).toFixed(2)}"/>`;
    const kk=Math.min(1,w*1.8),cc=[0,1,2].map(n=>Math.round([84,98,115][n]+([16,22,31][n]-[84,98,115][n])*kk)).join(','),lo=(.5+.5*kk).toFixed(2);
    lines+=`<path class="arc" d="${d}" style="stroke:#fff;opacity:${(.08+.24*kk).toFixed(2)}" stroke-width="${(wd+1.3*wf).toFixed(2)}"/><path class="arc" d="${d}" style="stroke:rgb(${cc});opacity:${lo}" stroke-width="${wd.toFixed(2)}"/><path class="arc" d="${d}" style="stroke:#9fb0c4;opacity:.75" stroke-width="${Math.max(.2*wf,wd*.28).toFixed(2)}" transform="translate(0 ${(-wd*.22).toFixed(2)})"/>`;
    if(reduce)return;
    // Un solo avión por ruta: va al destino y vuelve a Madrid.
    const dur=2*Math.max(dmin,Math.min(dmax,len/dk)),s=sc*wf*(.75+w*.5),D=dur.toFixed(1),bg=((ai*1.7)%dur).toFixed(1),
      full=`${d}Q${cx.toFixed(1)},${cy.toFixed(1)} ${mx0.toFixed(1)},${my0.toFixed(1)}`,gfull=`${g}L${mx0.toFixed(1)},${my0.toFixed(1)}`,
      op=`<animate attributeName="opacity" values="0;1;1;.45;1;1;0" keyTimes="0;.05;.45;.5;.55;.95;1" dur="${D}s" begin="-${bg}s" repeatCount="indefinite"/>`;
    gr+=`<g opacity="0"><animateMotion dur="${D}s" begin="-${bg}s" repeatCount="indefinite" path="${gfull}" rotate="auto"/>${op}<path d="${PLANE}" transform="scale(${(s*.7).toFixed(2)})" fill="#05090f" opacity=".32"/></g>`;
    pl+=`<g opacity="0"><animateMotion dur="${D}s" begin="-${bg}s" repeatCount="indefinite" path="${full}" rotate="auto"/>${op}<path d="${PLANE}" transform="scale(${(s*.7).toFixed(2)})" fill="#10161f" stroke="#fff" stroke-width="1.3" paint-order="stroke"><animateTransform attributeName="transform" type="scale" values="${(s*.62).toFixed(2)};${(s*1.35).toFixed(2)};${(s*.62).toFixed(2)};${(s*1.35).toFixed(2)};${(s*.62).toFixed(2)}" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1" keyTimes="0;.25;.5;.75;1" dur="${D}s" begin="-${bg}s" repeatCount="indefinite"/></path></g>`});
  return gr+lines+pl}
function tierLeg(){return `<span style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:230px;max-width:360px"><span style="display:block;height:8px;border-radius:4px;background:${SCGRAD}"></span><span style="display:flex;justify-content:space-between;font-size:11px"><span>1–2 visitas</span><span>Pocas</span><span>Frecuente</span><span>Los más visitados</span></span></span>`}
function worldMap(W){
  const mx=Math.max(1,...Object.values(W)),cf=mkSC(Object.values(W)),top=Object.entries(W).sort((a,b)=>b[1]-a[1]).slice(0,45),[mx0,my0]=G.madrid;
  const paths=Object.entries(G.world).filter(([k])=>k!=='ATA').map(([k,d])=>`<path class="c${selW===k?' sel':''}" data-i="${k}" d="${d}" fill="${k==='ESP'?LANDHI:(W[k]?'rgba(0,0,0,0)':LAND)}"/>`).join('');
  const pf=mkP(Object.values(W)),vis=Object.keys(W).filter(k=>W[k]&&k!=='ESP'&&G.world[k]&&G.cent[k]),hk='w2|'+fy+'|'+fu+'|'+RK;
  if(!HCACHE[hk])HCACHE[hk]=heatField(vis.map(k=>({ds:[G.world[k]],cx:G.cent[k][0],cy:G.cent[k][1],p:pf(W[k])})),G.w,G.h,1.6,19,2);
  const clip=vis.map(k=>`<path d="${G.world[k]}"/>`).join('');
  const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const EU=wz==='eu',inEU=([x,y])=>x>=432&&x<=604&&y>=28&&y<=154,
    lst=EU?Object.entries(W).filter(([k])=>G.cent[k]&&inEU(G.cent[k])):top.filter(([k])=>G.cent[k]),
    rest=EU?[]:Object.entries(W).filter(([k,v])=>v>0&&k!=='ESP'&&G.cent[k]&&!lst.some(t=>t[0]===k)).sort((a,b)=>b[1]-a[1]),   // el resto de países visitados también tienen ruta y avión (más finos)
    arcs=routes(lst.map(([k,v])=>[...G.cent[k],v]),mx0,my0,mx,EU?.12:.22,EU?.85:.85,EU?12:12,EU?26:30,EU?4:18,REDUCE,cf,EU?.5:1)+(rest.length?routes(rest.map(([k,v])=>[...G.cent[k],v]),mx0,my0,mx,.22,.85,12,30,18,REDUCE,cf,.6):''),planes='';
  let labels='';
  if(EU){const used=[];lst.slice().sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>{const [x,y]=G.cent[k],nm=(D.names[k]||k).replace('Estados Unidos de América','EE. UU.').replace('República Dominicana','R. Dominicana').replace('Emiratos Árabes Unidos','EAU'),t=nm+' '+v,wd=t.length*2.2,hit=b=>used.some(u=>b[0]<u[2]&&b[2]>u[0]&&b[1]<u[3]&&b[3]>u[1]);let yy=y,ok=false;for(const dy of [0,3.2,-3.2,6.4,-6.4]){const bx=[x-wd/2,y+dy-2.8,x+wd/2,y+dy+.8];if(!hit(bx)){used.push(bx);yy=y+dy;ok=true;break}}if(!ok)return;labels+=`<text x="${x}" y="${yy}" text-anchor="middle" style="font-size:3.4px;font-weight:700;fill:#fff;paint-order:stroke;stroke:rgba(15,25,40,.92);stroke-width:1px;pointer-events:none">${t}</text>`})}
  if(selW&&G.cent[selW]){const [lx,ly]=G.cent[selW],nm=selW==='ESP'?'España':(({USA:'EE. UU.'})[selW]||D.names[selW]||selW),vv=W[selW]||0,f1=EU?3.1:10,f2=EU?4:13,sw=EU?.9:2.6;
    labels+=`<text text-anchor="middle" style="font-weight:800;fill:#fff;paint-order:stroke;stroke:rgba(15,25,40,.95);stroke-width:${sw}px;pointer-events:none"><tspan x="${lx}" y="${ly-(EU?.4:1)}" style="font-size:${f1}px">${nm}</tspan><tspan x="${lx}" dy="${f2*1.05}" style="font-size:${f2}px">${selW==='ESP'?'base':fmt(vv)}</tspan></text>`}
  document.getElementById('vworld').classList.toggle('eu',EU);
  document.querySelectorAll('[data-wz]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wz===wz)));
  document.getElementById('vworld').innerHTML=`<svg viewBox="${EU?'432 28 180 126':`0 0 ${G.w} ${G.h}`}" role="img" aria-label="Mapa de calor de destinos de los vuelos"><defs><clipPath id="hclip">${clip}</clipPath></defs><image href="${HCACHE[hk]}" x="0" y="0" width="${G.w}" height="${G.h}" preserveAspectRatio="none" clip-path="url(#hclip)" style="pointer-events:none"/>${paths}${arcs}${planes}<circle cx="${mx0}" cy="${my0}" r="${EU?1.3:5}" fill="#fff" stroke="#14202e" stroke-width="${EU?.4:1.8}"/>${labels}</svg>`;
  document.querySelectorAll('#vworld .c').forEach(p=>p.addEventListener('click',()=>{const sc=document.querySelector('#vworld').parentNode.scrollLeft;selW=p.dataset.i;worldTip(W);worldMap(W);document.querySelector('#vworld').parentNode.scrollLeft=sc}));
  if(!EU&&window._vc!==1){window._vc=1;const c=document.querySelector('#vworld').parentNode,ctr=()=>{c.scrollLeft=Math.max(0,(c.scrollWidth*mx0/G.w)-c.clientWidth/2)};ctr();requestAnimationFrame(()=>{ctr();setTimeout(ctr,150)})}   // España (Madrid) en el centro al abrir o al volver a «Mundo»
  document.getElementById('vleg').innerHTML=`<span>Menos visitados</span><i style="background:${SCGRAD}"></i><span>Más visitados (hasta ${fmt(mx)} veces)</span><span style="margin-left:auto">España en gris · punto = Madrid</span>`+'<div style="flex-basis:100%;margin-top:6px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">Color del mapa: '+tierLeg()+'<span>Líneas y aviones en negro: más gruesas, más vuelos.</span></div>';
}
function worldTip(W){
  const el=document.getElementById('vtip');if(!selW){return}
  const nm=selW==='ESP'?'España':(({USA:'EE. UU.'})[selW]||D.names[selW]||selW),v=W[selW]||0;
  const t=rows(D.vis).filter(r=>r[2]===selW),byU={};t.forEach(r=>byU[D.usos[r[1]]]=(byU[D.usos[r[1]]]||0)+r[4]);
  el.innerHTML=selW==='ESP'?'<b>España</b>: ver el mapa de abajo.':`<b>${nm}</b>: ${fmt(v)} visitas${v?' — '+Object.entries(byU).sort((a,b)=>b[1]-a[1]).map(([u,n])=>`${u} ${n}`).join(' · '):' (ninguna con los filtros actuales)'}.`;
}
let SPL=[];
function placeSL(){const sv=document.querySelector('#vspain svg'),box=document.getElementById('vspain');if(!sv||!SPL.length)return;const r=sv.getBoundingClientRect(),bx=box.getBoundingClientRect(),vb=sv.viewBox.baseVal,sc=Math.min(r.width/vb.width,r.height/vb.height),ox=r.left-bx.left+(r.width-vb.width*sc)/2,oy=r.top-bx.top+(r.height-vb.height*sc)/2;SPL.forEach(([d,x,y])=>{d.style.left=(ox+x*sc)+'px';d.style.top=(oy+y*sc)+'px'})}
addEventListener('resize',placeSL);
function spainMap(S){
  const mx=Math.max(1,...Object.values(S)),cf=mkSC(Object.entries(S).filter(([k])=>k!=='Comunidad de Madrid').map(x=>x[1]));
  const ca=k=>P2CA[k];
  const paths=Object.entries(G.spain).map(([k,d])=>{const c=ca(k),v=c==='Comunidad de Madrid'?0:(S[c]||0);return `<path class="c${selS===c?' sel':''}" data-c="${c}" d="${d}" fill="${c==='Comunidad de Madrid'?LANDHI:(v?'rgba(0,0,0,0)':LAND)}" stroke-width=".5"/>`}).join('');
  document.getElementById('vspain').innerHTML=`<svg viewBox="0 0 ${G.sw} ${G.sh+70}" style="max-height:520px" role="img" aria-label="Mapa de calor de comunidades">${paths}</svg>`;
  spainHeat(S);
  spainArcs(S);
  spainCM(S,cf);
  spainLabels(S);
  {const sv=document.querySelector('#vspain svg'),box=document.getElementById('vspain');box.querySelectorAll('.slab').forEach(e=>e.remove());SPL=[];
    sv.querySelectorAll('text').forEach(t=>{const ts=t.querySelectorAll('tspan'),x=+(t.getAttribute('x')||(ts[0]&&ts[0].getAttribute('x'))),y=+t.getAttribute('y');
      const d=document.createElement('div');d.className='slab';d.innerHTML=ts.length?`<b>${ts[0].textContent}</b><i>${ts[1]?ts[1].textContent:''}</i>`:`<b>${t.textContent}</b>`;box.appendChild(d);SPL.push([d,x,y]);t.remove()});
    placeSL()}
  const l2=document.getElementById('vleg2');if(l2)l2.innerHTML='Color del mapa: '+tierLeg()+' <span style="margin-left:12px">Líneas y aviones en negro: más gruesas, más vuelos.</span>';
  document.querySelectorAll('#vspain .c').forEach(p=>p.addEventListener('click',()=>{selS=p.dataset.c;spainTip(S);spainMap(S)}));
}
function spainHeat(S){
  const svg=document.querySelector('#vspain svg');if(!svg)return;
  const pf=mkP(Object.entries(S).filter(([k])=>k!=='Comunidad de Madrid'&&S[k]>0).map(x=>x[1])),g={};
  svg.querySelectorAll('path.c').forEach(pt=>{const c=pt.dataset.c;if(!c||c==='Comunidad de Madrid'||!S[c])return;const b=pt.getBBox(),r=g[c];if(!r)g[c]={ds:[pt.getAttribute('d')],x0:b.x,y0:b.y,x1:b.x+b.width,y1:b.y+b.height};else{r.ds.push(pt.getAttribute('d'));r.x0=Math.min(r.x0,b.x);r.y0=Math.min(r.y0,b.y);r.x1=Math.max(r.x1,b.x+b.width);r.y1=Math.max(r.y1,b.y+b.height)}});
  const keys=Object.keys(g),hk='s2|'+fy+'|'+fu+'|'+RK,Hh=G.sh+70;
  if(!HCACHE[hk])HCACHE[hk]=heatField(keys.map(k=>({ds:g[k].ds,cx:(g[k].x0+g[k].x1)/2,cy:(g[k].y0+g[k].y1)/2,p:pf(S[k])})),G.sw,Hh,1.2,90,2);
  const clip=keys.map(k=>g[k].ds.map(d=>`<path d="${d}"/>`).join('')).join('');
  svg.insertAdjacentHTML('afterbegin',`<defs><clipPath id="sclip">${clip}</clipPath></defs><image href="${HCACHE[hk]}" x="0" y="0" width="${G.sw}" height="${Hh}" preserveAspectRatio="none" clip-path="url(#sclip)" style="pointer-events:none"/>`);
}
function spainLabels(S){
  const svg=document.querySelector('#vspain svg');if(!svg)return;
  const SHORT={'Comunidad Valenciana':'C. Valenciana','Castilla-La Mancha':'C.-La Mancha','Región de Murcia':'Murcia','Islas Baleares':'Baleares','Comunidad de Madrid':'Madrid'},g={};
  svg.querySelectorAll('path.c').forEach(pt=>{const c=pt.dataset.c;if(!c||c==='Ceuta'||c==='Melilla')return;const b=pt.getBBox(),r=g[c];if(!r)g[c]={x0:b.x,y0:b.y,x1:b.x+b.width,y1:b.y+b.height};else{r.x0=Math.min(r.x0,b.x);r.y0=Math.min(r.y0,b.y);r.x1=Math.max(r.x1,b.x+b.width);r.y1=Math.max(r.y1,b.y+b.height)}});
  const rc=svg.getBoundingClientRect(),sc=Math.min(rc.width/G.sw,rc.height/(G.sh+70))||1,k=Math.min(2.4,Math.max(1,7.5/(11*sc)));
  const st=`font-weight:700;fill:#fff;paint-order:stroke;stroke:rgba(15,25,40,.95);stroke-width:${3*k}px;pointer-events:none;text-anchor:middle`;
  let t='';
  const NUD={'Asturias':[-26,-4],'Cantabria':[-6,-12],'País Vasco':[16,-14],'Navarra':[34,2],'La Rioja':[6,22]};
  Object.entries(g).forEach(([c,r])=>{const nu=NUD[c]||[0,0],x=(r.x0+r.x1)/2+nu[0]*k,y=(r.y0+r.y1)/2+nu[1]*k,nm=SHORT[c]||c;
    t+=c==='Comunidad de Madrid'?`<text x="${x}" y="${y+4}" style="font-size:${11*k}px;${st}">Madrid · base</text>`:`<text x="${x}" y="${y-2}" style="${st}"><tspan x="${x}" style="font-size:${11*k}px">${nm}</tspan><tspan x="${x}" dy="${14*k}" style="font-size:${14*k}px">${fmt(S[c]||0)}</tspan></text>`});
  svg.insertAdjacentHTML('beforeend',t);
}
function spainCM(S,cf){
  const svg=document.querySelector('#vspain svg');if(!svg)return;
  let add='';const rc=svg.getBoundingClientRect(),sc0=Math.min(rc.width/G.sw,rc.height/(G.sh+70))||1,k=Math.min(2.4,Math.max(1,7.5/(11*sc0)));
  ['Ceuta','Melilla'].forEach(n=>{const pt=svg.querySelector(`path[data-c="${n}"]`);if(!pt)return;const b=pt.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2,v=S[n]||0;
    pt.setAttribute('transform',`translate(${cx} ${cy}) scale(7) translate(${-cx} ${-cy})`);pt.setAttribute('fill',v?cf(v):LANDHI);pt.setAttribute('stroke','#fff');pt.setAttribute('stroke-width','.35');
    add+=`<text x="${cx}" y="${cy+b.height*3.5+9*k}" text-anchor="middle" style="font-size:${11*k}px;font-weight:700;fill:#fff;pointer-events:none;paint-order:stroke;stroke:rgba(15,25,40,.95);stroke-width:${3*k}px"><tspan x="${cx}">${n}</tspan><tspan x="${cx}" dy="${14*k}" style="font-size:${14*k}px">${v}</tspan></text>`});
  svg.insertAdjacentHTML('beforeend',add);
}
function spainArcs(S){
  const svg=document.querySelector('#vspain svg');if(!svg)return;
  const mxv=Math.max(1,...Object.values(S)),mad=svg.querySelector('path[data-c="Comunidad de Madrid"]');if(!mad)return;
  const bb=el=>{const b=el.getBBox();return [b.x+b.width/2,b.y+b.height/2]};
  const [mx0,my0]=bb(mad),cc={};
  svg.querySelectorAll('path.c').forEach(pt=>{const c=pt.dataset.c;if(c==='Comunidad de Madrid')return;const b=pt.getBBox(),r=cc[c];if(!r)cc[c]={x0:b.x,y0:b.y,x1:b.x+b.width,y1:b.y+b.height,pts:[pt]};else{r.x0=Math.min(r.x0,b.x);r.y0=Math.min(r.y0,b.y);r.x1=Math.max(r.x1,b.x+b.width);r.y1=Math.max(r.y1,b.y+b.height)}});
  const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches,top=Object.entries(S).filter(([k])=>cc[k]).sort((a,b)=>b[1]-a[1]);
  const cfS=mkSC(top.map(x=>x[1])),g=routes(top.map(([k,v])=>{const r=cc[k];return [(r.x0+r.x1)/2,(r.y0+r.y1)/2,v]}),mx0,my0,mxv,.2,1.5,3,8,45,REDUCE,cfS),pl='';
  svg.insertAdjacentHTML('beforeend',`<g style="pointer-events:none">${g}${pl}<circle cx="${mx0.toFixed(1)}" cy="${my0.toFixed(1)}" r="5" fill="#fff" stroke="#14202e" stroke-width="1.8"/></g>`);
}
function spainTip(S){const el=document.getElementById('vtip2');if(!selS)return;el.innerHTML=selS==='Comunidad de Madrid'?'<b>Comunidad de Madrid</b>: es la base de los aviones y no se cuenta como destino.':`<b>${selS}</b>: ${fmt(S[selS]||0)} visitas con los filtros actuales.${(selS==='Ceuta'||selS==='Melilla')&&!(S[selS])?' No hay ninguna registrada con esa ubicación (las visitas «sin precisar» no se asignan a ninguna comunidad).':''}`}
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
    return {y,n,h,c,co,dia:n/((RK?RD[y]:YD[y])||1),hv:n?h/n:0,ch:h?c/h:0,big:tn?big/tn*100:0}});
  if(RK){for(let i=R.length-1;i>=0;i--)if(!RD[R[i].y])R.splice(i,1)}
  const mxN=Math.max(...R.map(r=>r.n),1);
  document.getElementById('vyt').innerHTML='<thead><tr><th>Año</th><th>Vuelos</th><th>Por día</th><th>Horas por vuelo</th><th>Coste estimado</th><th>€ por hora</th><th>CO₂ est. (t)</th><th>% en A310/A330</th></tr></thead><tbody>'+
   R.map(r=>`<tr><td>${r.y}${r.y===2026?'*':''}</td><td class="m"><span style="display:inline-block;height:8px;border-radius:4px;background:var(--hot);width:${(r.n/mxN*70).toFixed(0)}px;margin-right:6px;vertical-align:middle"></span>${fmt(r.n)}</td><td class="m">${fmt(r.dia,1)}</td><td class="m">${fmt(r.hv,1)}</td><td class="m">${fmt(r.c/1e6,1)} M€</td><td class="m">${fmt(r.ch)}</td><td class="m">${fmt(r.co/1000,1)} mil</td><td class="m">${fmt(r.big,0)} %</td></tr>`).join('')+'</tbody>';
  const p=R.reduce((a,r)=>r.n>a.n?r:a,R[0]),l=R.filter(r=>r.y<2026).slice(-1)[0];
  document.getElementById('vyn').innerHTML=`<b>Cómo leerlo.</b> El año con más vuelos del filtro actual es ${p.y} (${fmt(p.n)}). 2026* llega solo hasta el 23-oct, por eso las ratios por día son comparables y los totales no. «€ por hora» y «CO₂» son estimaciones de falcondespega.es, no cifras oficiales. Con el filtro «Fechas» de arriba puedes ver un día concreto o cualquier tramo de días.`;
}

/* ===== Filtro por fechas (un día o varios) ===== */
const E0=Date.UTC(2021,2,1),DAY=864e5,MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const iso=d=>new Date(E0+d*DAY).toISOString().slice(0,10),off=s=>Math.round((Date.parse(s+'T00:00:00Z')-E0)/DAY);
const largo=s=>{const [y,m,d]=s.split('-');return (+d)+' de '+MESES[+m-1]+' de '+y};
function loadDias(){return DIAS?Promise.resolve(DIAS):fetch('assets/vuelos-dias.json?v=59').then(r=>r.json()).then(j=>(DIAS=j))}
function applyRange(a,b){
  return loadDias().then(J=>{
    if(!BASE)BASE={tot:D.tot,vis:D.vis,ac:D.ac};
    const lo=off(a),hi=off(b),T={},V={},AC={};RD={};
    for(let d=lo;d<=hi;d++){const y=new Date(E0+d*DAY).getUTCFullYear();RD[y]=(RD[y]||0)+1}
    J.f.forEach(f=>{if(f[0]<lo||f[0]>hi)return;const y=new Date(E0+f[0]*DAY).getUTCFullYear(),u=f[1];
      const t=T[y+'|'+u]||(T[y+'|'+u]=[y,u,0,0,0,0]);t[2]++;t[3]+=f[4];t[4]+=f[5];t[5]+=f[6];
      const k=y+'|'+u+'|'+f[2];AC[k]=AC[k]||[y,u,f[2],0];AC[k][3]++;
      f[3].forEach(p=>{const pl=J.pl[p],kk=y+'|'+u+'|'+pl[0]+'|'+pl[1];V[kk]=V[kk]||[y,u,pl[0],pl[1],0];V[kk][4]++})});
    D.tot=Object.values(T);D.vis=Object.values(V);D.ac=Object.values(AC);
    RK=a+'_'+b;fy='all';selW=null;selS=null;render();
  });
}
function clearRange(silent){if(BASE){D.tot=BASE.tot;D.vis=BASE.vis;D.ac=BASE.ac}RK='';RD={};PM='';const a=document.getElementById('vda'),b=document.getElementById('vdb');if(a)a.value='';if(b)b.value='';if(!silent)render()}
function rangeUI(){
  const el=document.getElementById('vd');if(!el)return;
  if(!el.dataset.ok){el.dataset.ok='1';
    el.innerHTML='<div class="vdin" id="vdin"><label class="vdl"><span>Desde</span><input type="date" id="vda" min="2021-03-01" max="2026-10-23"></label><label class="vdl"><span>Hasta</span><input type="date" id="vdb" min="2021-03-01" max="2026-10-23"></label></div><p class="vdst" id="vdst" aria-live="polite"></p>';
    const A=document.getElementById('vda'),B=document.getElementById('vdb');
    const go=()=>{let a=A.value,b=B.value||A.value;if(!a&&b)a=b;if(!a)return;if(b<a){const t=a;a=b;b=t;A.value=a;B.value=b}PM='c';applyRange(a,b)};
    A.addEventListener('change',go);B.addEventListener('change',go);
    loadDias().then(J=>{if(J.fin){A.max=B.max=J.fin}});
  }
  const st=document.getElementById('vdst'),din=document.getElementById('vdin');
  din.hidden=PM!=='c';el.hidden=!RK&&PM!=='c';
  if(RK){const [a,b]=RK.split('_');document.getElementById('vda').value=a;document.getElementById('vdb').value=b}
  if(!RK){st.textContent='';st.classList.remove('on');st.hidden=true;return}
  st.hidden=false;
  const [a,b]=RK.split('_'),n=D.tot.reduce((s,r)=>s+((fu==='all'||D.usos[r[1]]===fu)?r[2]:0),0);
  st.innerHTML=(a===b?'Día <strong>'+largo(a)+'</strong>':'Del <strong>'+largo(a)+'</strong> al <strong>'+largo(b)+'</strong>')+': <strong>'+fmt(n)+'</strong> '+(n===1?'vuelo':'vuelos')+(fu!=='all'?' de uso «'+fu+'»':'')+(n?'':'. No hay vuelos registrados en esas fechas.');
  st.classList.add('on');
}
let playT=null;
function stopPlay(){if(playT){clearInterval(playT);playT=null}const b=document.getElementById('vplay');if(b){b.textContent='▶ Ver año a año';b.setAttribute('aria-pressed','false')}}
function startPlay(){
  const ys=[2021,2022,2023,2024,2025,2026],b=document.getElementById('vplay');let i=0;b.textContent='❚❚ Parar';b.setAttribute('aria-pressed','true');
  const step=()=>{if(RK)clearRange(true);fy=ys[i];render();document.getElementById('vplst').textContent='Año '+fy+(fy===2026?' (hasta 23-oct)':'');i++;if(i>=ys.length){clearInterval(playT);playT=null;setTimeout(()=>{if(!playT){b.textContent='▶ Ver año a año';b.setAttribute('aria-pressed','false')}},2200)}};
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
function render(){chips();rangeUI();kpis();ritmo();const {W,S}=agg();worldMap(W);window.globoSet&&globoSet(W,HCACHE['w2|'+fy+'|'+fu+'|'+RK]);worldTip(W);spainMap(S);spainTip(S);tops(W,S);bars()}
document.addEventListener('click',e=>{const zb=e.target.closest&&e.target.closest('[data-wz]');if(zb){wz=zb.dataset.wz;selW=null;window._vc=0;const {W}=agg();worldMap(W);return}
  if(e.target.id==='vplay'){playT?stopPlay():startPlay()}else if(playT&&e.target.closest&&e.target.closest('#vy,#vu')){stopPlay()}},true);
Promise.all([fetch('assets/vuelos-data.json?v=58').then(r=>r.json()),fetch('assets/vuelos-geo.json?v=16').then(r=>r.json())]).then(([d,g])=>{D=d;G=g;window.initGlobo&&initGlobo({G,D,mkSC,LAND});render();hero();waffle();juego();
 document.getElementById('vsrc').innerHTML='<b>Fuentes.</b> Registro de vuelos exportado de <a href="https://falcondespega.es" target="_blank" rel="noopener">falcondespega.es</a> (7.687 tramos del 1-mar-2021 al 23-oct-2026; método de coste y emisiones en su web). Contornos de países: <a href="https://github.com/johan/world.geo.json" target="_blank" rel="noopener">world.geo.json</a> (Natural Earth, dominio público). Contornos de provincias: CartoDB / <a href="https://github.com/codeforgermany/click_that_hood" target="_blank" rel="noopener">click_that_hood</a>. Contexto del cálculo: <a href="https://theobjective.com/espana/politica/2023-05-02/falcon-sanchez-3130-vuelos-55500-toneladas-co2-retiro-donana/" target="_blank" rel="noopener">The Objective (may-2023)</a>.';
}).catch(()=>{document.getElementById('vk').innerHTML='<p class="na">No se han podido cargar los datos.</p>'});
