/* Proyección hasta el 29-N en escaños: un gráfico por partido (escala propia) y tabla, a partir de PRED (assets/prediccion-data.js). */
(function(){
  const CUT='2026-11-24';
  let hoy='';try{hoy=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid'}).format(new Date())}catch(e){hoy=new Date().toISOString().slice(0,10)}
  if(hoy>=CUT){document.getElementById('pbody').style.display='none';document.getElementById('hid').style.display='block';return}
  const K=[['PP','PP','var(--pp)'],['PSOE','PSOE','var(--psoe)'],['VOX','Vox','var(--vox)'],['SUMAR','Sumar + Podemos','var(--sumar)']];
  const dd=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)};
  const DI='2026-10-01',D0=dd(DI),D1=dd('2026-11-29'),TH=dd(PRED.generado);
  const MES=[['2026-10-01','oct'],['2026-11-01','nov']];
  const hc=PRED.escHist.filter(h=>h.tipo==='cis'&&h.f>=DI).sort((a,b)=>a.f<b.f?-1:1);
  const hs=PRED.escHist.filter(h=>h.e.startsWith('Sigma Dos')&&h.f>=DI).sort((a,b)=>a.f<b.f?-1:1);
  const dots=PRED.escPriv.concat(PRED.escHist.filter(h=>h.tipo==='privada'&&!PRED.escPriv.some(p=>p.e===h.e&&p.f===h.f))).filter(h=>h.f>=DI);
  const REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MESL=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const fecha=d=>{const [y,m,dn]=d.split('-').map(Number);return dn+'-'+MESL[m-1]};
  const fs_=PRED.privadas.map(q=>q.f).sort(),RNG=fecha(fs_[0])+' al '+fecha(fs_[fs_.length-1]);
  const AN=(v,d)=>`<animate attributeName="opacity" values="${v}" dur="${d}" begin="1.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".4 0 .6 1;.4 0 .6 1"/>`;
  const WA=(a,v)=>{const q=v.split(";");return `<animate attributeName="${a}" from="${q[0]}" to="${q[1]}" dur="14s" begin="0s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".3 .3 .55 .9"/>`};
  function panel(k,name,c,W,animate){
    const H=W<420?236:262,L=30,R=W<420?86:96,T=42,B=24,pw=W-L-R,ph=H-T-B,DW=W<420?38:46;
    const E=PRED.escPrivadas,rP=E.ruta[k],rC=PRED.escCIS.ruta[k],ev=E.escanos[k],base=PRED.escBase.priv[k],hg=E.hist[k],tr=E.trayectorias[k];
    const vals=[ev.p10,ev.p90,base,hg.min,hg.min+hg.c.length-1];hc.concat(hs).forEach(h=>vals.push(h.esc[k]));dots.forEach(p=>vals.push(p.esc[k]));rC.forEach(r=>vals.push(r.esc));rP.forEach(r=>vals.push(r.lo95,r.hi95));
    const lo=Math.max(0,Math.floor((Math.min(...vals)-4)/10)*10),hi=Math.ceil((Math.max(...vals)+4)/10)*10;
    const X=t=>L+(t-D0)/(D1-D0)*pw,Y=v=>T+(1-(v-lo)/(hi-lo))*ph,step=(hi-lo)>80?20:10;
    const x0=X(TH),id=k;
    let s=`<defs>${animate?`<linearGradient id="lg-${id}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="cp-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect x="${x0-3-80}" y="0" width="0" height="${H}" fill="#fff">${WA('width',`0;${W-x0+3+80};${W-x0+3+80}`)}</rect><rect x="${x0-3-80}" y="0" width="80" height="${H}" fill="url(#lg-${id})">${WA('x',`${x0-3-80};${W};${W}`)}</rect></mask>`:`<clipPath id="cp-${id}"><rect x="${x0-3}" y="0" width="${W}" height="${H}"/></clipPath>`}<filter id="gl-${id}" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>`;
    s+=`<text x="0" y="14" class="lab" style="fill:${c};font-size:14px">${name}</text><text x="0" y="30" style="fill:${c};font-size:11.5px;font-weight:600">29-N: ${ev.c} escaños (${ev.p10}–${ev.p90})</text>`;
    for(let v=lo;v<=hi;v+=step)s+=`<line x1="${L}" x2="${L+pw}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L-5}" y="${Y(v)+4}" text-anchor="end">${v}</text>`;
    MES.forEach(([d,l])=>{s+=`<text x="${X(dd(d))}" y="${H-7}">${l}</text>`});
    s+=`<line x1="${x0}" x2="${x0}" y1="${T}" y2="${T+ph}" stroke="var(--muted)" stroke-dasharray="2 3" opacity=".7"/><text x="${x0}" y="${T-5}" text-anchor="middle">hoy</text>`;
    s+=`<line x1="${X(D1)}" x2="${X(D1)}" y1="${T}" y2="${T+ph}" stroke="var(--fg)" opacity=".45"/><text x="${X(D1)}" y="${T-5}" text-anchor="middle">29-N</text>`;
    const poly=(a,b)=>`${rP.map(r=>X(dd(r.d))+','+Y(r[b])).join(' ')} ${[...rP].reverse().map(r=>X(dd(r.d))+','+Y(r[a])).join(' ')}`;
    const cen=rP.map(r=>X(dd(r.d))+','+Y(r.esc)).join(' ');
    // Todo lo proyectado (tubo, hilos, resplandor, línea punteada) se descubre de izquierda a derecha
    s+=`<g ${animate?`mask="url(#cp-${id})"`:`clip-path="url(#cp-${id})"`}>`;
    const polyW=(a,b,ph,am)=>{const n=rP.length,w=(arr,key,sg)=>arr.map((r,i)=>X(dd(r.d))+','+(Y(r[key])+sg*am*Math.sin(i*.28+ph)*Math.min(1,i/12))).join(' ');return `${w(rP,a,1)} ${w([...rP].reverse(),b,-1)}`.replace(/^/,'')};
    const band=(a,b,fill,o0,o1,d,ph,am)=>{const p0=poly(a,b),p1=(()=>{const n=rP.length;const up=rP.map((r,i)=>X(dd(r.d))+','+(Y(r[b])+am*Math.sin(i*.28+ph)*Math.min(1,i/12)));const dn=[...rP].reverse().map((r,ii)=>{const i=n-1-ii;return X(dd(r.d))+','+(Y(r[a])-am*Math.sin(i*.28+ph+1.3)*Math.min(1,i/12))});return up.join(' ')+' '+dn.join(' ')})(),p2=(()=>{const n=rP.length;const up=rP.map((r,i)=>X(dd(r.d))+','+(Y(r[b])-am*Math.sin(i*.28+ph+2)*Math.min(1,i/12)));const dn=[...rP].reverse().map((r,ii)=>{const i=n-1-ii;return X(dd(r.d))+','+(Y(r[a])+am*Math.sin(i*.28+ph+3.1)*Math.min(1,i/12))});return up.join(' ')+' '+dn.join(' ')})();return `<polygon points="${p0}" fill="${fill}" opacity="${o0}">${animate?`<animate attributeName="points" values="${p0};${p1};${p0};${p2};${p0}" dur="${d}s" begin="1.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.25;.5;.75;1" keySplines="${Array(4).fill('.45 0 .55 1').join(';')}"/><animate attributeName="opacity" values="${o0};${o1};${o0}" dur="${(d*.7).toFixed(1)}s" begin="1.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".4 0 .6 1;.4 0 .6 1"/>`:''}</polygon>`};
    s+=band('lo95','hi95',c,.12,.2,19,0,Math.max(3,ph*.075))+band('lo','hi',c,.2,.32,15,1.7,Math.max(2.5,ph*.065))+band('lo50','hi50',c,.32,.46,12,3.1,Math.max(2,ph*.05));
    const smo=t=>t.map((v,i)=>i===0||i===t.length-1?v:(t[i-1]+v+t[i+1])/3),pts=sm=>sm.map((v,i)=>X(dd(rP[i].d))+','+Y(v)).join(' ');
    tr.slice(0,30).forEach((t,ti)=>{const a=smo(t),b=smo(tr[(ti+13)%tr.length]),du=(9+(ti%7)*1.8).toFixed(1),bg=(1.8-ti*.7).toFixed(2);
      const mv=`<animate attributeName="points" values="${pts(a)};${pts(b)};${pts(a)}" dur="${du}s" begin="${bg}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/>`;
      s+=`<polyline fill="none" stroke="${c}" stroke-width="1.3" opacity=".34" stroke-linejoin="round" points="${pts(a)}">${animate?`${mv}<animate attributeName="opacity" values=".16;.62;.16" dur="${(du*.6).toFixed(1)}s" begin="${bg}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".4 0 .6 1;.4 0 .6 1"/>`:''}</polyline>`;
      if(animate&&ti<14){const xe0=X(D1)+5,ex=sm=>{const v=Math.round(sm[sm.length-1]),i=v-hg.min,d=i>=0&&i<hg.c.length?hg.c[i]:0;return (xe0+Math.max(2,d*DW*.8))+','+Y(sm[sm.length-1])},pe=sm=>pts(sm)+' '+(X(D1)+2)+','+Y(sm[sm.length-1])+' '+ex(sm);
        s+=`<polyline fill="none" stroke="${c}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" opacity=".95" stroke-dasharray="0.01 77.99" points="${pe(a)}"><animate attributeName="points" values="${pe(a)};${pe(b)};${pe(a)}" dur="${du}s" begin="${bg}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/><animate attributeName="stroke-dashoffset" from="0" to="-78" dur="${(4.2+(ti%5)*.7).toFixed(1)}s" repeatCount="indefinite"/></polyline>`}});
    s+=`<polyline fill="none" stroke="${c}" stroke-width="7" opacity=".28" filter="url(#gl-${id})" points="${X(TH)},${Y(base)} ${cen}"/>`;
    s+=`<polyline fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 7" points="${X(TH)},${Y(base)} ${cen}">${animate?'<animate attributeName="stroke-dashoffset" from="0" to="-7.1" dur="5s" repeatCount="indefinite"/>':''}</polyline>`;
    // nube de densidad el 29-N: cuántas de las 4.000 simulaciones acaban en cada número de escaños
    const xe=X(D1)+5;let dp=`M${xe},${Y(hg.min)}`;hg.c.forEach((v,i)=>{dp+=` L${xe+v*DW},${Y(hg.min+i)}`});dp+=` L${xe},${Y(hg.min+hg.c.length-1)} Z`;
    s+=`<path d="${dp}" fill="${c}" opacity=".38" stroke="${c}" stroke-width="1.2">${animate?AN('.32;.44;.32','15s'):''}</path>`;
    s+=`</g>`;
    if(animate){s+=`<circle cx="${X(TH)}" cy="${Y(base)}" r="4.4" fill="none" stroke="${c}" stroke-width="1.5"><animate attributeName="r" values="4.4;16;16" keyTimes="0;.5;1" dur="9s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0;0" keyTimes="0;.5;1" dur="9s" repeatCount="indefinite"/></circle>`}
    // histórico: CIS (rombos), Sigma Dos (línea gruesa), otras encuestas (puntos) y escenario CIS
    s+=`<polyline fill="none" stroke="${c}" stroke-width="1.4" opacity=".75" points="${hc.map(h=>X(dd(h.f))+','+Y(h.esc[k])).join(' ')}"/>`;
    const lc=hc[hc.length-1];
    s+=`<polyline fill="none" stroke="${c}" stroke-width="1.6" stroke-dasharray="9 5" opacity=".9" points="${X(dd(lc.f))},${Y(lc.esc[k])} ${rC.map(r=>X(dd(r.d))+','+Y(r.esc)).join(' ')}"/>`;
    hc.forEach(h=>{s+=`<rect x="${X(dd(h.f))-3.5}" y="${Y(h.esc[k])-3.5}" width="7" height="7" transform="rotate(45 ${X(dd(h.f))} ${Y(h.esc[k])})" fill="var(--bg)" stroke="${c}" stroke-width="1.5"/>`});
    s+=`<polyline fill="none" stroke="${c}" stroke-width="2.4" points="${hs.map(h=>X(dd(h.f))+','+Y(h.esc[k])).join(' ')}"/>`;
    dots.forEach(p=>{s+=`<circle cx="${X(dd(p.f))}" cy="${Y(p.esc[k])}" r="2.4" fill="${c}" opacity=".45"/>`});
    s+=histG(k,c,X,Y,T,ph);
    const m12=TH;
    s+=`<circle cx="${X(m12)}" cy="${Y(base)}" r="4.4" fill="${c}" stroke="var(--bg)" stroke-width="1.5"/><text x="${X(m12)}" y="${Y(base)-9}" text-anchor="middle" style="fill:${c};font-size:10.5px">${base}</text>`;
    // marcador del valor central del 29-N y rango del 80 %
    s+=`<line x1="${xe-3}" x2="${xe+DW+3}" y1="${Y(ev.c)}" y2="${Y(ev.c)}" stroke="${c}" stroke-width="2.2"/><text class="lab" x="${xe+DW+6}" y="${Y(ev.c)+4}" style="fill:${c};font-size:12.5px">${ev.c}</text>`;
    s+=`<g class="tt" style="display:none;pointer-events:none"><line class="ttl" y1="${T}" y2="${T+ph}" stroke="${c}" stroke-width="1"/><circle class="ttc" r="4.5" fill="var(--bg)" stroke="${c}" stroke-width="2"/><rect class="ttb" rx="5" height="34" fill="var(--panel)" stroke="${c}" stroke-width="1"/><text class="tt1" style="fill:var(--fg);font-size:11px;font-weight:600"></text><text class="tt2" style="font-size:10.5px"></text></g><rect class="hit" x="${x0}" y="${T}" width="${X(D1)-x0}" height="${ph}" fill="transparent"/>`;
    return `<svg class="pg" data-k="${k}" data-x0="${x0}" data-pw="${pw}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name}: ${ev.c} escaños proyectados el 29-N, rango del 80 % de ${ev.p10} a ${ev.p90}, y del 95 % de ${rP[rP.length-1].lo95} a ${rP[rP.length-1].hi95}"><title>${name}</title>${s}</svg>`;
  }

  // Historial diario: un punto por día (con su margen del 80 %) que se queda donde estaba; los días con cambio se pueden pulsar.
  const HD=(typeof HIST!=='undefined'&&HIST.dias)?HIST.dias:[];
  const nf=(x,d)=>(x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(d).replace('.',',');
  const pc=x=>x.toFixed(2).replace('.',',')+' %';
  function histG(k,c,X,Y,T,ph){
    if(!HD.length)return '';
    const pts=HD.map(h=>X(dd(h.f))+','+Y(h.esc[k])).join(' ');
    let g=`<g class="hist"><polyline fill="none" stroke="${c}" stroke-width="1.2" opacity=".55" stroke-linejoin="round" points="${pts}"/>`;
    HD.forEach(h=>{const x=X(dd(h.f)),y=Y(h.esc[k]),ch=h.cambio&&h.cambio.dEsc&&h.cambio.dEsc[k]!==0;
      g+=`<line x1="${x}" x2="${x}" y1="${Y(h.hi[k])}" y2="${Y(h.lo[k])}" stroke="${c}" stroke-width="2" opacity=".32" stroke-linecap="round"/>`;
      g+=ch?`<circle cx="${x}" cy="${y}" r="3.6" fill="var(--bg)" stroke="${c}" stroke-width="1.6"/>`:`<circle cx="${x}" cy="${y}" r="1.8" fill="${c}" opacity=".9"/>`;
      });
    const xa=X(dd(HD[0].f))-8,xb=X(TH)+8;
    return g+`<rect class="hzone" data-k="${k}" x="${xa}" y="0" width="${xb-xa}" height="${T+ph}" fill="transparent" style="cursor:pointer"/></g>`;
  }
  function hdetail(k,name,f){
    const i=HD.findIndex(h=>h.f===f),h=HD[i],a=HD[i-1];if(!h||!a)return '';
    const ch=h.cambio,dE=ch.dEsc[k],ents=ch.entran.map(e=>`<li><b>${e.e}</b> (${fecha(e.f)}): ${name} ${pc(e.voto[k])}${e.antes?`; su encuesta anterior (${fecha(e.antes.f)}) daba ${pc(e.antes.voto[k])}`:'; primera encuesta de esa empresa en la media'}.</li>`).join(''),
      sal=(ch.salen||[]).map(e=>`<li><b>${e.e}</b> (${fecha(e.f)}, ${name} ${pc(e.voto[k])}) sale de la media por tener más de 30 días.</li>`).join('');
    return `<button type="button" class="hx" aria-label="Cerrar">×</button><p class="ht"><b>${name} · ${fecha(f)}</b>: ${a.esc[k]} → ${h.esc[k]} escaños${dE?` (${nf(dE,0)})`:' (sin cambio)'}</p>`+
      `<p>Media de voto: ${pc(a.voto[k])} → ${pc(h.voto[k])} (${nf(ch.dVoto[k],2)} puntos). Margen del 80 % ese día: ${h.lo[k]}–${h.hi[k]} escaños, con ${h.n} encuestas.</p>`+
      (ents?`<p style="margin-bottom:2px">Entra:</p><ul>${ents}</ul>`:'')+(sal?`<p style="margin-bottom:2px">Sale:</p><ul>${sal}</ul>`:'')+
      (()=>{const all=(h.ctx||[]).filter(x=>!x.p||x.p===k||x.p==='general'),li=x=>`<li>${x.p==='general'?'<i>General</i> · ':''}${x.tipo?x.tipo.charAt(0).toUpperCase()+x.tipo.slice(1)+': ':''}${x.t}${x.hecho&&x.hecho!==f?` (${fecha(x.hecho)})`:''}${x.u?` <a href="${x.u}" rel="noopener">${x.medio||'fuente'}</a>`:''}${x.pos?`<br><span style="color:var(--muted)">Posible relación (hipótesis, no demostrada): ${x.pos}</span>`:''}</li>`,
      ant=all.filter(x=>(x.fase||'antes')==='antes'),des=all.filter(x=>x.fase==='despues');
      return (ant.length?`<p style="margin-bottom:2px">Posibles factores de los días previos (contexto, no demuestra causa):</p><ul>${ant.map(li).join('')}</ul>`:'')+(des.length?`<p style="margin-bottom:2px">Después del cambio: reacciones y cobertura (no demuestra que sea consecuencia):</p><ul>${des.map(li).join('')}</ul>`:'')})()+
      `<p class="hn">La media es la de la última encuesta de cada empresa de los últimos 30 días, así que solo se mueve cuando entra o sale una encuesta.${h.t==='x'?' Día reconstruido con las encuestas conocidas entonces.':''}</p>`;
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
    box.innerHTML=K.map(([k,n,c])=>`<div class="pcell">${panel(k,n,c,W,an)}<div class="hdet" hidden></div></div>`).join('');
    wire(box,W);
    const cambios=HD.filter(h=>h.cambio&&h.cambio.huboCambio&&!h.cambio.inicio).map(h=>h.f);
    const abrir=(cell,k,f)=>{const d=cell.querySelector('.hdet'),nm=(K.find(q=>q[0]===k)||[])[1],i=cambios.indexOf(f);d.innerHTML=hdetail(k,nm,f)+`<div class="hnav"><button type="button" class="hp"${i<1?' disabled':''}>‹ Cambio anterior</button><button type="button" class="hs"${i>=cambios.length-1?' disabled':''}>Cambio siguiente ›</button></div>`;d.hidden=false;
      d.querySelector('.hx').addEventListener('click',()=>{d.hidden=true});d.querySelector('.hp').addEventListener('click',()=>abrir(cell,k,cambios[i-1]));d.querySelector('.hs').addEventListener('click',()=>abrir(cell,k,cambios[i+1]))};
    box.querySelectorAll('.hzone').forEach(el=>el.addEventListener('click',e=>{if(!cambios.length)return;const svg=el.ownerSVGElement,r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,px=(e.clientX-r.left)*vb.width/r.width,t=TH+(px-(+svg.dataset.x0))/(+svg.dataset.pw)*(D1-D0);
      let bf=cambios[0],bd=1e18;cambios.forEach(f=>{const dx=Math.abs(dd(f)-t);if(dx<bd){bd=dx;bf=f}});abrir(el.closest('.pcell'),el.dataset.k,bf)}));
  }
  draw();let rt=null;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(draw,150)});
  const sw=st=>`<svg viewBox="0 0 34 10" aria-hidden="true">${st}</svg>`;
  document.getElementById('leg').innerHTML=
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="2.4"/>')}Sigma Dos (misma empresa, desde el 1-oct)</span>`+
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="1.4"/><rect x="13" y="1.5" width="7" height="7" transform="rotate(45 16.5 5)" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/>')}CIS (barómetro de octubre)</span>`+
    `<span>${sw('<circle cx="17" cy="5" r="2.6" fill="currentColor" opacity=".5"/>')}Otras encuestas</span>`+
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 7"/>')}Proyección de la media de las 14 encuestas (punto grande: hoy, ${fecha(PRED.generado)}; encuestas del ${RNG})</span>`+
    `<span>${sw('<line x1="0" x2="34" y1="5" y2="5" stroke="currentColor" stroke-width="1.6" stroke-dasharray="9 5"/>')}Escenario solo CIS</span>`+
    (HD.length?`<span>${sw('<line x1="17" x2="17" y1="0" y2="10" stroke="currentColor" stroke-width="2" opacity=".32"/><circle cx="17" cy="5" r="3.2" fill="var(--bg)" stroke="currentColor" stroke-width="1.6"/>')}Historial diario de la media (con su margen del 80 %): toca esa zona para ver qué cambió cada día</span>`:'')+
    `<span>${sw('<rect x="0" y="0" width="34" height="3" fill="currentColor" opacity=".12"/><rect x="0" y="3.5" width="34" height="3" fill="currentColor" opacity=".25"/><rect x="0" y="7" width="34" height="3" fill="currentColor" opacity=".12"/>')}Tubo: 50 %, 80 % y 95 % de las simulaciones</span>`+
    `<span>${sw('<path d="M0 8 L10 2 L22 6 L34 1" fill="none" stroke="currentColor" stroke-width=".9" opacity=".5"/>')}24 trayectorias simuladas (suavizadas)</span>`+
    `<span>${sw('<path d="M2 0 Q30 5 2 10 Z" fill="currentColor" opacity=".38" stroke="currentColor"/>')}Nube del 29-N (suavizada): el 95 % central de las simulaciones, igual que el final del tubo</span>`;
  document.getElementById('psrc').innerHTML=`<b>El gráfico empieza el 1-oct</b>, justo antes de la convocatoria de las elecciones. Las encuestas anteriores (el CIS de julio y septiembre, Sigma Dos de agosto, etc.) no se dibujan, pero el modelo las sigue usando cuando hacen falta para calcular la tendencia. Cada punto son los escaños que da el simulador de la portada a una encuesta (no los que publicó la empresa). Fuentes: ${PRED.n} encuestas privadas publicadas del ${RNG}-2026 (la última de cada empresa) y CIS de oct. (campo ${PRED.cis.campo}), de <a href="${PRED.cis.url}">elecciones29noviembre.com</a>; CIS de julio y septiembre, de <a href="https://es.ara.cat/politica/psoe-cae-puntos-crisis-ceuta-pp-estanca-cis_1_5849470.html">Ara</a> (la fecha del de julio es aproximada); Sigma Dos y Demoscopia y Servicios de agosto, de <a href="https://www.moncloa.com/2026/08/31/encuesta-vox-2026-pp-psoe-ceuta-3423745/">Moncloa.com</a>. Sumar y Podemos van sumados.`;
  const row=(k,n,sc,bs)=>{const e=sc.escanos[k];return `<tr><td>${n}</td><td class="m">${bs[k]}</td><td class="m">${e.c}</td><td class="m">${e.p10}–${e.p90}</td></tr>`};
  const blk=(t,sc,bs)=>`<tr class="sc"><td colspan="4">${t}</td></tr>`+K.map(([k,n])=>row(k,n,sc,bs)).join('')+`<tr><td>PP + Vox (mayoría: 176)</td><td class="m">${bs.PP+bs.VOX}</td><td class="m">${sc.ppVox.c}</td><td class="m">${sc.ppVox.p10}–${sc.ppVox.p90}</td></tr>`;
  document.getElementById('ptab').innerHTML=`<thead><tr><th>Partido</th><th>Escaños hoy</th><th>Escaños 29-N (central)</th><th>Rango 80 % el 29-N</th></tr></thead><tbody>`+
    blk('Media de las 14 encuestas privadas (hoy, '+fecha(PRED.generado)+': encuestas del '+RNG+')',PRED.escPrivadas,PRED.escBase.priv)+blk('Solo CIS (hoy: el barómetro de octubre)',PRED.escCIS,PRED.escBase.cis)+`</tbody>`;
  const [y,m,d]=PRED.generado.split('-').map(Number);
  document.getElementById('pgen').textContent=`Calculado el ${d} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][m-1]} de ${y}.`;
  const ua=document.getElementById('pupd');if(ua)ua.textContent=`Actualizado: ${d} ${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][m-1]} ${y}`;
  const r2=document.getElementById('rng2');if(r2)r2.textContent=RNG.replace(' al ',' a ');
  const df=(sc,bs)=>K.map(([k,n])=>{const x=sc.escanos[k].c-bs[k];return n+' '+(x>0?'+':x<0?'−':'')+Math.abs(x)}).join(', ');
  if(window.rvReady&&typeof rvScan==='function')rvScan();
})();
