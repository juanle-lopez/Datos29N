/* Proyección hasta el 29-N en escaños: un gráfico por partido (escala propia) y tabla, a partir de PRED (assets/prediccion-data.js). */
(function(){
  const CUT='2026-11-24';
  let hoy='';try{hoy=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid'}).format(new Date())}catch(e){hoy=new Date().toISOString().slice(0,10)}
  if(hoy>=CUT){document.getElementById('pbody').style.display='none';document.getElementById('hid').style.display='block';return}
  const K=[['PP','PP','var(--pp)'],['PSOE','PSOE','var(--psoe)'],['VOX','Vox','var(--vox)'],['SUMAR','Sumar + Podemos','var(--sumar)']];
  const dd=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)};
  const D0=dd('2026-07-01'),D1=dd('2026-11-29'),TH=dd(PRED.generado);
  const MES=[['2026-07-01','jul'],['2026-08-01','ago'],['2026-09-01','sep'],['2026-10-01','oct'],['2026-11-01','nov']];
  const hc=PRED.escHist.filter(h=>h.tipo==='cis').sort((a,b)=>a.f<b.f?-1:1);
  const hs=PRED.escHist.filter(h=>h.e.startsWith('Sigma Dos')).sort((a,b)=>a.f<b.f?-1:1);
  const dots=PRED.escPriv.concat(PRED.escHist.filter(h=>h.tipo==='privada'&&!PRED.escPriv.some(p=>p.e===h.e&&p.f===h.f)));
  const REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MESL=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const fecha=d=>{const [y,m,dn]=d.split('-').map(Number);return dn+'-'+MESL[m-1]};
  const AN=(v,d)=>`<animate attributeName="opacity" values="${v}" dur="${d}" begin="1.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".4 0 .6 1;.4 0 .6 1"/>`;
  function panel(k,name,c,W,animate){
    const H=W<420?236:262,L=30,R=W<420?86:96,T=42,B=24,pw=W-L-R,ph=H-T-B,DW=W<420?38:46;
    const E=PRED.escPrivadas,rP=E.ruta[k],rC=PRED.escCIS.ruta[k],ev=E.escanos[k],base=PRED.escBase.priv[k],hg=E.hist[k],tr=E.trayectorias[k];
    const vals=[ev.p10,ev.p90,base,hg.min,hg.min+hg.c.length-1];hc.concat(hs).forEach(h=>vals.push(h.esc[k]));dots.forEach(p=>vals.push(p.esc[k]));rC.forEach(r=>vals.push(r.esc));rP.forEach(r=>vals.push(r.lo95,r.hi95));
    const lo=Math.max(0,Math.floor((Math.min(...vals)-4)/10)*10),hi=Math.ceil((Math.max(...vals)+4)/10)*10;
    const X=t=>L+(t-D0)/(D1-D0)*pw,Y=v=>T+(1-(v-lo)/(hi-lo))*ph,step=(hi-lo)>80?20:10;
    const x0=X(TH),id=k;
    let s=`<defs><clipPath id="cp-${id}"><rect x="${x0-3}" y="0" width="${animate?0:W}" height="${H}">${animate?`<animate attributeName="width" from="0" to="${W}" dur="1.8s" begin="0s" fill="freeze" calcMode="spline" keySplines=".2 .7 .2 1" keyTimes="0;1"/>`:''}</rect></clipPath><filter id="gl-${id}" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>`;
    s+=`<text x="0" y="14" class="lab" style="fill:${c};font-size:14px">${name}</text><text x="0" y="30" style="fill:${c};font-size:11.5px;font-weight:600">29-N: ${ev.c} escaños (${ev.p10}–${ev.p90})</text>`;
    for(let v=lo;v<=hi;v+=step)s+=`<line x1="${L}" x2="${L+pw}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L-5}" y="${Y(v)+4}" text-anchor="end">${v}</text>`;
    MES.forEach(([d,l])=>{s+=`<text x="${X(dd(d))}" y="${H-7}">${l}</text>`});
    s+=`<line x1="${x0}" x2="${x0}" y1="${T}" y2="${T+ph}" stroke="var(--muted)" stroke-dasharray="2 3" opacity=".7"/><text x="${x0}" y="${T-5}" text-anchor="middle">hoy</text>`;
    s+=`<line x1="${X(D1)}" x2="${X(D1)}" y1="${T}" y2="${T+ph}" stroke="var(--fg)" opacity=".45"/><text x="${X(D1)}" y="${T-5}" text-anchor="middle">29-N</text>`;
    const poly=(a,b)=>`${rP.map(r=>X(dd(r.d))+','+Y(r[b])).join(' ')} ${[...rP].reverse().map(r=>X(dd(r.d))+','+Y(r[a])).join(' ')}`;
    const cen=rP.map(r=>X(dd(r.d))+','+Y(r.esc)).join(' ');
    // Todo lo proyectado (tubo, hilos, resplandor, línea punteada) se descubre de izquierda a derecha
    s+=`<g clip-path="url(#cp-${id})">`;
    s+=`<polygon points="${poly('lo95','hi95')}" fill="${c}" opacity=".12">${animate?AN('.08;.17;.08','7s'):''}</polygon><polygon points="${poly('lo','hi')}" fill="${c}" opacity=".2">${animate?AN('.14;.27;.14','5.5s'):''}</polygon><polygon points="${poly('lo50','hi50')}" fill="${c}" opacity=".32">${animate?AN('.24;.42;.24','4.2s'):''}</polygon>`;
    tr.slice(0,24).forEach((t,ti)=>{const sm=t.map((v,i)=>i===0||i===t.length-1?v:(t[i-1]+v+t[i+1])/3);s+=`<polyline fill="none" stroke="${c}" stroke-width="1" opacity=".2" stroke-linejoin="round" points="${sm.map((v,i)=>X(dd(rP[i].d))+','+Y(v)).join(' ')}">${animate?`<animate attributeName="opacity" values=".04;.38;.04" dur="${(4+(ti%6)*.8).toFixed(1)}s" begin="${(1.8+ti*.23).toFixed(2)}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".4 0 .6 1;.4 0 .6 1"/>`:''}</polyline>`});
    s+=`<polyline fill="none" stroke="${c}" stroke-width="7" opacity=".28" filter="url(#gl-${id})" points="${X(dd('2026-10-12'))},${Y(base)} ${cen}"/>`;
    s+=`<polyline fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 7" points="${X(dd('2026-10-12'))},${Y(base)} ${cen}">${animate?'<animate attributeName="stroke-dashoffset" from="0" to="-7.1" dur="1.4s" repeatCount="indefinite"/>':''}</polyline>`;
    // nube de densidad el 29-N: cuántas de las 4.000 simulaciones acaban en cada número de escaños
    const xe=X(D1)+5;let dp=`M${xe},${Y(hg.min)}`;hg.c.forEach((v,i)=>{dp+=` L${xe+v*DW},${Y(hg.min+i)}`});dp+=` L${xe},${Y(hg.min+hg.c.length-1)} Z`;
    s+=`<path d="${dp}" fill="${c}" opacity=".38" stroke="${c}" stroke-width="1.2">${animate?AN('.30;.46;.30','4.8s'):''}</path>`;
    s+=`</g>`;
    if(animate){s+=`<circle cx="${X(dd('2026-10-12'))}" cy="${Y(base)}" r="4.4" fill="none" stroke="${c}" stroke-width="1.5"><animate attributeName="r" values="4.4;15;15" keyTimes="0;.35;1" dur="4.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0;0" keyTimes="0;.35;1" dur="4.5s" repeatCount="indefinite"/></circle>`}
    // histórico: CIS (rombos), Sigma Dos (línea gruesa), otras encuestas (puntos) y escenario CIS
    s+=`<polyline fill="none" stroke="${c}" stroke-width="1.4" opacity=".75" points="${hc.map(h=>X(dd(h.f))+','+Y(h.esc[k])).join(' ')}"/>`;
    const lc=hc[hc.length-1];
    s+=`<polyline fill="none" stroke="${c}" stroke-width="1.6" stroke-dasharray="9 5" opacity=".9" points="${X(dd(lc.f))},${Y(lc.esc[k])} ${rC.map(r=>X(dd(r.d))+','+Y(r.esc)).join(' ')}"/>`;
    hc.forEach(h=>{s+=`<rect x="${X(dd(h.f))-3.5}" y="${Y(h.esc[k])-3.5}" width="7" height="7" transform="rotate(45 ${X(dd(h.f))} ${Y(h.esc[k])})" fill="var(--bg)" stroke="${c}" stroke-width="1.5"/>`});
    s+=`<polyline fill="none" stroke="${c}" stroke-width="2.4" points="${hs.map(h=>X(dd(h.f))+','+Y(h.esc[k])).join(' ')}"/>`;
    dots.forEach(p=>{s+=`<circle cx="${X(dd(p.f))}" cy="${Y(p.esc[k])}" r="2.4" fill="${c}" opacity=".45"/>`});
    const m12=dd('2026-10-12');
    s+=`<circle cx="${X(m12)}" cy="${Y(base)}" r="4.4" fill="${c}" stroke="var(--bg)" stroke-width="1.5"/><text x="${X(m12)}" y="${Y(base)-9}" text-anchor="middle" style="fill:${c};font-size:10.5px">${base}</text>`;
    // marcador del valor central del 29-N y rango del 80 %
    s+=`<line x1="${xe-3}" x2="${xe+DW+3}" y1="${Y(ev.c)}" y2="${Y(ev.c)}" stroke="${c}" stroke-width="2.2"/><text class="lab" x="${xe+DW+6}" y="${Y(ev.c)+4}" style="fill:${c};font-size:12.5px">${ev.c}</text>`;
    s+=`<g class="tt" style="display:none;pointer-events:none"><line class="ttl" y1="${T}" y2="${T+ph}" stroke="${c}" stroke-width="1"/><circle class="ttc" r="4.5" fill="var(--bg)" stroke="${c}" stroke-width="2"/><rect class="ttb" rx="5" height="34" fill="var(--panel)" stroke="${c}" stroke-width="1"/><text class="tt1" style="fill:var(--fg);font-size:11px;font-weight:600"></text><text class="tt2" style="font-size:10.5px"></text></g><rect class="hit" x="${x0}" y="${T}" width="${X(D1)-x0}" height="${ph}" fill="transparent"/>`;
    return `<svg class="pg" data-k="${k}" data-x0="${x0}" data-pw="${pw}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name}: ${ev.c} escaños proyectados el 29-N, rango del 80 % de ${ev.p10} a ${ev.p90}, y del 95 % de ${rP[rP.length-1].lo95} a ${rP[rP.length-1].hi95}"><title>${name}</title>${s}</svg>`;
  }
  // interacción: al pasar el cursor o tocar, valor central y rangos de esa fecha
  function wire(box,W){
    box.querySelectorAll('svg.pg').forEach(svg=>{
      const k=svg.dataset.k,rP=PRED.escPrivadas.ruta[k],hit=svg.querySelector('.hit'),g=svg.querySelector('.tt');
      const l=g.querySelector('.ttl'),ci=g.querySelector('.ttc'),bx=g.querySelector('.ttb'),t1=g.querySelector('.tt1'),t2=g.querySelector('.tt2');
      const x0=+svg.dataset.x0,pw=+svg.dataset.pw,tT=dd(rP[0].d),tE=dd(rP[rP.length-1].d);
      const mv=e=>{
        const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,px=(e.clientX-r.left)*vb.width/r.width;
        const t=tT+(px-x0)/pw*(D1-D0);let bi=0,bd=1e18;rP.forEach((q,i)=>{const dx=Math.abs(dd(q.d)-t);if(dx<bd){bd=dx;bi=i}});
        const q=rP[bi],X=x0+(dd(q.d)-tT)/(D1-D0)*pw,Yv=+hit.getAttribute('y'),h=+hit.getAttribute('height');
        const lo=Math.max(0,Math.floor((Math.min(...rP.map(a=>a.lo95),PRED.escPrivadas.hist[k].min)-4)/10)*10);
        g.style.display='';l.setAttribute('x1',X);l.setAttribute('x2',X);
        const ys=[...svg.querySelectorAll('text')].filter(a=>/^\d+$/.test(a.textContent)&&a.getAttribute('text-anchor')==='end');
        const yy=v=>{const a=ys[0],b2=ys[ys.length-1],va=+a.textContent,vb2=+b2.textContent,ya=+a.getAttribute('y')-4,yb=+b2.getAttribute('y')-4;return ya+(v-va)*(yb-ya)/(vb2-va)};
        ci.setAttribute('cx',X);ci.setAttribute('cy',yy(q.esc));
        t1.textContent=`${fecha(q.d)}: ${q.esc} escaños`;t2.textContent=`80 %: ${q.lo}–${q.hi} · 95 %: ${q.lo95}–${q.hi95}`;t2.style.fill='var(--muted)';
        const wd=Math.max(t1.getComputedTextLength(),t2.getComputedTextLength())+14,vbw=vb.width,bxx=Math.min(Math.max(X-wd/2,2),vbw-wd-2);
        bx.setAttribute('x',bxx);bx.setAttribute('width',wd);bx.setAttribute('y',Yv+4);t1.setAttribute('x',bxx+7);t1.setAttribute('y',Yv+18);t2.setAttribute('x',bxx+7);t2.setAttribute('y',Yv+31);
      };
      hit.addEventListener('pointermove',mv);hit.addEventListener('pointerdown',mv);hit.addEventListener('pointerleave',()=>{g.style.display='none'});
    });
  }
  let drawn=false;
  function draw(){
    const box=document.getElementById('pgrid'),w=box.clientWidth||720,cols=w>=600?2:1,W=Math.floor((w-(cols-1)*12)/cols);
    box.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;
    const an=!REDUCE;drawn=true;
    box.innerHTML=K.map(([k,n,c])=>`<div class="pcell">${panel(k,n,c,W,an)}</div>`).join('');
    wire(box,W);
  }
  draw();let rt=null;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(draw,150)});
  const sw=st=>`<svg viewBox="0 0 34 10" aria-hidden="true">${st}</svg>`;
  document.getElementById('leg').innerHTML=
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="2.4"/>')}Sigma Dos (misma empresa, ago → oct)</span>`+
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="1.4"/><rect x="13" y="1.5" width="7" height="7" transform="rotate(45 16.5 5)" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/>')}CIS (jul, sep, oct)</span>`+
    `<span>${sw('<circle cx="17" cy="5" r="2.6" fill="currentColor" opacity=".5"/>')}Otras encuestas</span>`+
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 7"/>')}Proyección de la media de las 10 encuestas (punto grande: la media del 12-oct)</span>`+
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="1.6" stroke-dasharray="9 5"/>')}Escenario solo CIS</span>`+
    `<span>${sw('<rect x="0" y="0" width="34" height="3" fill="currentColor" opacity=".12"/><rect x="0" y="3.5" width="34" height="3" fill="currentColor" opacity=".25"/><rect x="0" y="7" width="34" height="3" fill="currentColor" opacity=".12"/>')}Tubo: 50 %, 80 % y 95 % de las simulaciones</span>`+
    `<span>${sw('<path d="M0 8 L10 2 L22 6 L34 1" fill="none" stroke="currentColor" stroke-width=".9" opacity=".5"/>')}24 trayectorias simuladas (suavizadas)</span>`+
    `<span>${sw('<path d="M2 0 Q30 5 2 10 Z" fill="currentColor" opacity=".38" stroke="currentColor"/>')}Nube del 29-N (suavizada): en qué número de escaños acaban las simulaciones</span>`;
  document.getElementById('psrc').innerHTML=`Cada punto son los escaños que da el simulador de la portada a una encuesta (no los que publicó la empresa). Fuentes: ${PRED.n} encuestas privadas publicadas del 9 al 12-oct-2026 y CIS de oct. (campo ${PRED.cis.campo}), de <a href="${PRED.cis.url}">elecciones29noviembre.com</a>; CIS de julio y septiembre, de <a href="https://es.ara.cat/politica/psoe-cae-puntos-crisis-ceuta-pp-estanca-cis_1_5849470.html">Ara</a> (la fecha del de julio es aproximada); Sigma Dos y Demoscopia y Servicios de agosto, de <a href="https://www.moncloa.com/2026/08/31/encuesta-vox-2026-pp-psoe-ceuta-3423745/">Moncloa.com</a>. Sumar y Podemos van sumados.`;
  const row=(k,n,sc,bs)=>{const e=sc.escanos[k];return `<tr><td>${n}</td><td class="m">${bs[k]}</td><td class="m">${e.c}</td><td class="m">${e.p10}–${e.p90}</td></tr>`};
  const blk=(t,sc,bs)=>`<tr class="sc"><td colspan="4">${t}</td></tr>`+K.map(([k,n])=>row(k,n,sc,bs)).join('')+`<tr><td>PP + Vox (mayoría: 176)</td><td class="m">${bs.PP+bs.VOX}</td><td class="m">${sc.ppVox.c}</td><td class="m">${sc.ppVox.p10}–${sc.ppVox.p90}</td></tr>`;
  document.getElementById('ptab').innerHTML=`<thead><tr><th>Partido</th><th>Escaños hoy</th><th>Escaños 29-N (central)</th><th>Rango 80 % el 29-N</th></tr></thead><tbody>`+
    blk('Media de las 10 encuestas privadas (hoy: la media del 9–12 oct)',PRED.escPrivadas,PRED.escBase.priv)+blk('Solo CIS (hoy: el barómetro de octubre)',PRED.escCIS,PRED.escBase.cis)+`</tbody>`;
  const [y,m,d]=PRED.generado.split('-').map(Number);
  document.getElementById('pgen').textContent=`Calculado el ${d} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][m-1]} de ${y}.`;
  const df=(sc,bs)=>K.map(([k,n])=>{const x=sc.escanos[k].c-bs[k];return n+' '+(x>0?'+':x<0?'−':'')+Math.abs(x)}).join(', ');
  if(window.rvReady&&typeof rvScan==='function')rvScan();
})();
