/* «Ponla en la pantalla de tu móvil»: guía animada (iPhone y Android), mismo formato que las otras explicaciones. */
(function(){
  const el=document.getElementById('icono');if(!el)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=id=>document.getElementById(id);
  const ua=navigator.userAgent||'';
  let os=/Android/i.test(ua)?'and':(/iPhone|iPad|iPod/i.test(ua)&&!/CriOS|FxiOS|EdgiOS/i.test(ua)&&/Safari/i.test(ua))?'ios':'ioc',step=0,tm=[],auto=false,seen=false;
  const clear=()=>{tm.forEach(t=>clearTimeout(t));tm=[]};
  const later=(f,ms)=>{const t=setTimeout(f,ms);tm.push(t);return t};
  const W=420,H=300,A='var(--mid)';
  const svg=(inner,lab)=>`<svg class="cmsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${lab}">${inner}</svg>`;
  const tx=(x,y,t,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" style="font-family:system-ui,-apple-system,sans-serif;font-size:${o.z||7}px;${o.s||''}" class="${o.c||''}">${t}</text>`;
  const tap=(x,y,d)=>`<g><circle class="tapring" cx="${x}" cy="${y}" r="13" fill="none" stroke="${A}" stroke-width="2.4" style="animation-delay:${d}s"/><circle class="tapdot fade" cx="${x}" cy="${y}" r="4.5" fill="${A}" style="animation-delay:${d}s"/></g>`;
  const call=(x,y,t,a,x2,y2,d)=>`<g class="fade" style="animation-delay:${d}s"><path d="M${x2} ${y2}L${a==='end'?x+4:x-4} ${y-3}" stroke="${A}" stroke-width="1.6" fill="none"/>${tx(x,y,t,{a,z:12,c:'cml',s:'fill:var(--fg)'})}</g>`;
  // marco del móvil
  const phone=(inner,dark)=>`<rect x="135" y="8" width="150" height="284" rx="24" fill="var(--panel)" stroke="var(--fg)" stroke-width="3"/><rect x="141" y="14" width="138" height="272" rx="19" fill="${dark||'var(--bg)'}"/>${inner}`;
  const page=()=>`${tx(152,80,'Datos 29N',{a:'start',z:15,c:'cml',s:'fill:var(--fg);font-weight:800'})}<g><rect x="152" y="90" width="52" height="4" rx="2" fill="#1d6fb8"/><rect x="206" y="90" width="30" height="4" rx="2" fill="#c83a32"/><rect x="238" y="90" width="16" height="4" rx="2" fill="#58a03f"/></g>${[108,120,132,144].map((y,i)=>`<rect x="152" y="${y}" width="${i%2?88:110}" height="5" rx="2.5" fill="var(--line)"/>`).join('')}<rect x="152" y="162" width="116" height="60" rx="8" fill="var(--line)" opacity=".6"/>`;
  const appIcon=(x,y,s)=>`<g><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s*.22}" fill="#0f172a"/>${tx(x+s/2,y+s*.56,'29N',{z:s*.34,s:'fill:#fff;font-weight:800;font-family:var(--display)'})}<rect x="${x+s*.17}" y="${y+s*.72}" width="${s*.66}" height="${s*.06}" rx="${s*.03}" fill="#1d6fb8"/></g>`;
  const home=(d,ios)=>`<g class="fade" style="animation-delay:${d}s"><rect x="141" y="14" width="138" height="272" rx="19" fill="url(#wp)"/>${[0,1,2,3].map(c=>[0,1].map(r=>`<rect x="${153+c*30}" y="${52+r*46}" width="24" height="24" rx="6" fill="#fff" opacity=".28"/>`).join('')).join('')}<rect x="150" y="248" width="120" height="30" rx="12" fill="#fff" opacity=".25"/>${[0,1,2,3].map(c=>`<rect x="${158+c*28}" y="252" width="22" height="22" rx="6" fill="#fff" opacity=".35"/>`).join('')}<g class="cmd pop" style="animation-delay:${d+.5}s">${appIcon(153+3*30,52+46,24).replace('<g>','<g>')}</g><circle class="tapring" cx="${153+3*30+12}" cy="${52+46+12}" r="17" fill="none" stroke="${A}" stroke-width="2.4" style="animation-delay:${d+.8}s"/>${tx(153+3*30+12,52+46+34,'Datos 29N',{z:6.5,s:'fill:#fff'})}</g>`;
  const defs=`<defs><linearGradient id="wp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b5fa8"/><stop offset="1" stop-color="#8a4f9e"/></linearGradient></defs>`;
  const dlgIcon=(x,y)=>appIcon(x,y,34);

  const IOS=[
   {t:'Abre la web en Safari',p:`En el iPhone, <b>usa Safari</b> (la brújula azul). Entra en <b>datos29n.juanle.net</b>. Si ya estás aquí leyendo esto, ya has hecho el primer paso.`,
    go(){return svg(defs+phone(`<rect x="147" y="22" width="126" height="18" rx="9" fill="var(--line)"/>${tx(210,34,'datos29n.juanle.net',{z:7})}${page()}<g><line x1="141" x2="279" y1="252" y2="252" stroke="var(--line)"/>${tx(170,274,'‹',{z:16})}<g><rect x="204" y="263" width="12" height="10" rx="2" fill="none" stroke="var(--fg)" stroke-width="1.5"/><path d="M210 266V255M206 259l4-4 4 4" fill="none" stroke="var(--fg)" stroke-width="1.5"/></g>${tx(250,274,'▭',{z:11})}</g>`)+tx(60,130,'Safari',{z:14,c:'cml fade',s:'fill:var(--fg);animation-delay:.4s'}),'iPhone con la web abierta en Safari')}},
   {t:'Toca el botón Compartir',p:`Es el <b>cuadrado con una flecha hacia arriba</b>, abajo en el centro de la pantalla. Tócalo una vez.`,
    go(){return svg(defs+phone(`<rect x="147" y="22" width="126" height="18" rx="9" fill="var(--line)"/>${tx(210,34,'datos29n.juanle.net',{z:7})}${page()}<line x1="141" x2="279" y1="252" y2="252" stroke="var(--line)"/>${tx(170,274,'‹',{z:16})}<g><rect x="204" y="263" width="12" height="10" rx="2" fill="none" stroke="var(--fg)" stroke-width="1.5"/><path d="M210 266V255M206 259l4-4 4 4" fill="none" stroke="var(--fg)" stroke-width="1.5"/></g>${tx(250,274,'▭',{z:11})}`)+tap(210,264,.6)+call(100,268,'Compartir','end',132,266,.3),'Se toca el botón Compartir de Safari')}},
   {t:'Elige «Añadir a pantalla de inicio»',p:`Se abre una lista. Busca <b>«Añadir a pantalla de inicio»</b> (tiene un <b>+</b> dentro de un cuadrado) y tócala. Si no la ves, <b>desliza la lista hacia arriba</b>.`,
    go(){return svg(defs+phone(`<rect x="147" y="22" width="126" height="18" rx="9" fill="var(--line)"/>${page()}<rect x="141" y="14" width="138" height="272" rx="19" fill="#000" opacity=".25"/><g class="grow" style="animation-delay:.2s"><rect x="141" y="108" width="138" height="178" rx="18" fill="var(--panel)" stroke="var(--line)"/></g><g class="fade" style="animation-delay:.9s">${tx(153,134,'Copiar',{a:'start',z:8})}<line x1="150" x2="270" y1="146" y2="146" stroke="var(--line)"/>${tx(153,166,'Añadir a marcadores',{a:'start',z:8})}<line x1="150" x2="270" y1="178" y2="178" stroke="var(--line)"/><rect x="146" y="184" width="128" height="30" rx="6" fill="${A}" opacity=".22"/><rect x="153" y="192" width="14" height="14" rx="3" fill="none" stroke="var(--fg)" stroke-width="1.4"/><path d="M160 195v8M156 199h8" stroke="var(--fg)" stroke-width="1.4"/>${tx(173,203,'Añadir a pantalla de inicio',{a:'start',z:7.2,s:'font-weight:800;fill:var(--fg)'})}</g>`)+tap(210,199,1.6)+call(100,203,'Aquí','end',132,199,1.2),'La lista de Compartir con la opción Añadir a pantalla de inicio')}},
   {t:'Toca «Añadir» y listo',p:`Arriba a la derecha toca <b>«Añadir»</b>. En tu pantalla aparecerá el icono <b>Datos 29N</b>: ya puedes abrirla como una app, de un toque.`,
    go(){return svg(defs+phone(`<rect x="141" y="14" width="138" height="272" rx="19" fill="var(--bg)"/>`)+`<g class="fout" style="animation-delay:3.4s"><rect x="147" y="36" width="126" height="170" rx="12" fill="var(--panel)" stroke="var(--line)"/>${tx(155,54,'Cancelar',{a:'start',z:7.5,s:'fill:var(--muted)'})}${tx(265,54,'Añadir',{a:'end',z:8.5,s:'font-weight:800;fill:var(--fg)'})}<rect x="226" y="42" width="44" height="17" rx="8" fill="${A}" opacity=".25"/>${dlgIcon(193,76)}<rect x="157" y="124" width="106" height="20" rx="6" fill="var(--bg)" stroke="var(--line)"/>${tx(165,137,'Datos 29N',{a:'start',z:8})}${tx(210,170,'Se creará un icono en tu pantalla',{z:6.2})}${tap(248,51,1)}</g>`+home(3.9,true),'Se toca Añadir y aparece el icono en la pantalla de inicio')}}
  ];
  // iPhone con Chrome: Compartir está dentro de la barra de direcciones
  const cbar=()=>`<line x1="141" x2="279" y1="46" y2="46" stroke="var(--line)"/>${tx(150,35,'←',{z:11})}<rect x="160" y="22" width="100" height="18" rx="9" fill="var(--line)"/>${tx(200,34,'datos29n.juanle.net',{z:6.2})}<g><rect x="244" y="27" width="8" height="7" rx="1.5" fill="none" stroke="var(--fg)" stroke-width="1.1"/><path d="M248 29V23M245.6 25.4L248 23l2.4 2.4" fill="none" stroke="var(--fg)" stroke-width="1.1"/></g>${tx(269,35,'···',{z:9})}`;
  const cbot=()=>`<line x1="141" x2="279" y1="256" y2="256" stroke="var(--line)"/>${tx(172,272,'Pregunta',{z:6})}${tx(210,272,'＋ Pestaña',{z:6})}${tx(250,272,'Pestañas',{z:6})}`;
  const IOC=[
   {t:'Abre la web en Chrome',p:`Abre <b>Chrome</b> (el círculo de colores) y entra en <b>datos29n.juanle.net</b>. Si ya estás aquí leyendo esto, ya has hecho el primer paso.`,
    go(){return svg(defs+phone(cbar()+page().replace(/y="80"/,'y="84"')+cbot())+tx(60,130,'Chrome',{z:14,c:'cml fade',s:'fill:var(--fg);animation-delay:.4s'}),'iPhone con la web abierta en Chrome')}},
   {t:'Toca el botón Compartir',p:`Está <b>arriba, dentro de la barra de direcciones, a la derecha</b>: un cuadradito con una flecha hacia arriba. Tócalo una vez.`,
    go(){return svg(defs+phone(cbar()+page().replace(/y="80"/,'y="84"')+cbot())+tap(248,30,.6)+call(100,34,'Compartir','end',132,31,.3).replace('M132 31L104 31','M132 31L106 31'),'Se toca el botón Compartir de la barra de Chrome')}},
   IOS[2],IOS[3]
  ];
  const AND=[
   {t:'Abre la web en Chrome',p:`En Android, <b>usa Chrome</b> (el círculo rojo, amarillo, verde y azul). Entra en <b>datos29n.juanle.net</b>. Si ya estás aquí, ya has hecho el primer paso.`,
    go(){return svg(defs+phone(`<rect x="147" y="22" width="106" height="18" rx="9" fill="var(--line)"/>${tx(200,34,'datos29n.juanle.net',{z:6.6})}<g fill="var(--fg)"><circle cx="265" cy="26" r="1.8"/><circle cx="265" cy="31" r="1.8"/><circle cx="265" cy="36" r="1.8"/></g>${page()}`)+tx(60,130,'Chrome',{z:14,c:'cml fade',s:'fill:var(--fg);animation-delay:.4s'}),'Móvil Android con la web abierta en Chrome')}},
   {t:'Toca los tres puntos',p:`Arriba a la derecha hay <b>tres puntos en vertical</b> (⋮). Tócalos una vez para abrir el menú.`,
    go(){return svg(defs+phone(`<rect x="147" y="22" width="106" height="18" rx="9" fill="var(--line)"/>${tx(200,34,'datos29n.juanle.net',{z:6.6})}<g fill="var(--fg)"><circle cx="265" cy="26" r="1.8"/><circle cx="265" cy="31" r="1.8"/><circle cx="265" cy="36" r="1.8"/></g>${page()}`)+tap(265,31,.6)+call(310,31,'Menú','start',276,31,.3),'Se tocan los tres puntos de Chrome')}},
   {t:'Elige «Añadir a pantalla de inicio»',p:`En el menú, busca <b>«Añadir a pantalla de inicio»</b> y tócala. En algunos móviles se llama <b>«Instalar aplicación»</b>: es lo mismo.`,
    go(){return svg(defs+phone(`<rect x="147" y="22" width="106" height="18" rx="9" fill="var(--line)"/>${page()}<g class="grow" style="animation-delay:.2s"><rect x="170" y="44" width="106" height="152" rx="8" fill="var(--panel)" stroke="var(--fg)" stroke-width="1.2"/></g><g class="fade" style="animation-delay:.8s">${tx(180,64,'Nueva pestaña',{a:'start',z:7.4})}${tx(180,86,'Historial',{a:'start',z:7.4})}${tx(180,108,'Descargas',{a:'start',z:7.4})}<rect x="173" y="118" width="100" height="32" rx="5" fill="${A}" opacity=".25"/>${tx(180,131,'Añadir a pantalla',{a:'start',z:7.2,s:'font-weight:800;fill:var(--fg)'})}${tx(180,142,'de inicio',{a:'start',z:7.2,s:'font-weight:800;fill:var(--fg)'})}${tx(180,170,'Compartir…',{a:'start',z:7.4})}${tx(180,188,'Ajustes',{a:'start',z:7.4})}</g>`)+tap(224,134,1.5)+call(90,134,'Aquí','end',132,134,1.1),'El menú de Chrome con la opción Añadir a pantalla de inicio')}},
   {t:'Toca «Añadir» y listo',p:`Aparece una ventana con el nombre <b>Datos 29N</b>. Toca <b>«Añadir»</b> y, si te lo pide otra vez, vuelve a tocar «Añadir». El icono quedará en tu pantalla, listo para abrir de un toque.`,
    go(){return svg(defs+phone(`<rect x="141" y="14" width="138" height="272" rx="19" fill="var(--bg)"/>`)+`<g class="fout" style="animation-delay:3.4s"><rect x="141" y="14" width="138" height="272" rx="19" fill="#000" opacity=".3"/><rect x="151" y="96" width="118" height="104" rx="14" fill="var(--panel)" stroke="var(--line)"/>${tx(160,114,'Añadir a pantalla de inicio',{a:'start',z:7,s:'font-weight:800;fill:var(--fg)'})}${dlgIcon(160,122)}<rect x="200" y="130" width="62" height="18" rx="5" fill="var(--bg)" stroke="var(--line)"/>${tx(205,142,'Datos 29N',{a:'start',z:7.5})}${tx(206,185,'Cancelar',{a:'end',z:7.5,s:'fill:var(--muted)'})}<rect x="212" y="173" width="48" height="18" rx="9" fill="${A}" opacity=".3"/>${tx(236,185,'Añadir',{z:8,s:'font-weight:800;fill:var(--fg)'})}${tap(236,182,1)}</g>`+home(3.9,false),'Se toca Añadir y aparece el icono en la pantalla de inicio')}}
  ];
  const S=()=>os==='ioc'?IOC:os==='ios'?IOS:AND;
  const labels=['Abrir','Menú','Opción','Añadir'];
  el.classList.add('cm4');
  el.innerHTML=`<div class="cmh1"><h3 class="kh">Ponla en la pantalla de tu móvil</h3><span class="cmsub">Como una app, sin instalar nada · 4 pasos</span></div>
    <div class="cmsel" role="group" aria-label="Tu móvil" style="margin:10px 0 0"><button type="button" data-os="ioc" aria-pressed="${os==='ioc'}">iPhone · Chrome</button><button type="button" data-os="ios" aria-pressed="${os==='ios'}">iPhone · Safari</button><button type="button" data-os="and" aria-pressed="${os==='and'}">Android · Chrome</button></div>
    <div class="cmnav" role="tablist" aria-label="Pasos">${labels.map((l,i)=>`<button type="button" role="tab" data-s="${i}"><b>${i+1}</b><span>${l}</span></button>`).join('')}</div>
    <div class="cmprog" aria-hidden="true"><i id="icprog"></i></div>
    <div class="cmstage" id="icstage"></div>
    <div class="cmcap" aria-live="polite"><h4 id="ict"></h4><p id="icp"></p></div>
    <div class="cmctl"><button type="button" id="icprev">‹ Anterior</button><button type="button" id="icplay" aria-pressed="false">▶ Reproducir</button><button type="button" id="icnext">Siguiente ›</button></div>
    <p class="cmfoot">¿Te lo hace más fácil que te lo enseñemos en persona? Pide a quien te lo mostró que te lo repita con este dibujo. El icono se abre como cualquier app, pero es la propia web: no ocupa espacio ni pide permisos.</p>`;
  function show(i){
    clear();const L=S();step=Math.max(0,Math.min(L.length-1,i));const s=L[step];
    $('icstage').innerHTML=s.go();$('ict').textContent=`${step+1} · ${s.t}`;$('icp').innerHTML=s.p;
    el.querySelectorAll('.cmnav button').forEach((b,j)=>{b.setAttribute('aria-selected',String(j===step));b.classList.toggle('on',j<=step)});
    $('icprev').disabled=step===0;$('icnext').disabled=step===L.length-1;
    const pr=$('icprog');pr.style.transition='none';pr.style.width='0';
    if(auto&&!reduce){const dur=step===3?8500:6000;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{pr.style.transition=`width ${dur}ms linear`;pr.style.width='100%'}));
      later(()=>{if(step<L.length-1)show(step+1);else setAuto(false)},dur)}
  }
  function setAuto(v){auto=v;const b=$('icplay');b.textContent=v?'⏸ Pausa':'▶ Reproducir';b.setAttribute('aria-pressed',String(v));if(!v){clear();const pr=$('icprog');pr.style.transition='none';pr.style.width='0'}}
  el.addEventListener('click',e=>{
    const o=e.target.closest('[data-os]');if(o){os=o.dataset.os;el.querySelectorAll('[data-os]').forEach(b=>b.setAttribute('aria-pressed',String(b===o)));setAuto(false);show(0);return}
    const nb=e.target.closest('.cmnav button');if(nb){setAuto(false);show(+nb.dataset.s);return}
    if(e.target.id==='icprev'){setAuto(false);show(step-1)}
    else if(e.target.id==='icnext'){setAuto(false);show(step+1)}
    else if(e.target.id==='icplay'){if(auto){setAuto(false)}else{auto=true;$('icplay').textContent='⏸ Pausa';$('icplay').setAttribute('aria-pressed','true');show(step===3?0:step)}}
  });
  show(0);
  if('IntersectionObserver' in window&&!reduce){new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting&&!seen){seen=true;ob.disconnect();auto=true;$('icplay').textContent='⏸ Pausa';$('icplay').setAttribute('aria-pressed','true');show(0)}},{threshold:.5}).observe(el)}
})();
