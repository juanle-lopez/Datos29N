const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const A=(l,u)=>`<a href="${u}">${esc(l)}</a>`;
const go=id=>{const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
const chipBtn=(attr,val,label,on)=>`<button type="button" ${attr}="${val}" aria-pressed="${on}">${label}</button>`;

/* ===== Dinamismo: reveal, nav, progreso, hero ===== */
const REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
const RV_SEL='.sech,.exec,.banner,.dt>h2,.dt .rowf,.panel,.star,.pc,.cc,.sr2,.meth details,.foot,.bars>div,.stg,.pos,.bloc,.credit,.gcard,.gk>div';
let rvIO=null;
if('IntersectionObserver' in window&&!REDUCE){
  rvIO=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvIO.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
}
function rvScan(){
  document.querySelectorAll(RV_SEL).forEach(el=>{
    if(el.dataset.rv)return;el.dataset.rv='1';
    if(!rvIO||el.offsetHeight>innerHeight*2){el.classList.add('in');return}
    const sib=[...el.parentNode.children].filter(x=>x.matches&&x.matches(RV_SEL));
    el.style.setProperty('--d',Math.min(sib.indexOf(el),6)*110+'ms');
    el.classList.add('rv');rvIO.observe(el);
  });
}
/* barra de progreso y parallax */
(function(){
  const prog=document.getElementById('prog'),root=document.documentElement;let tick=false;
  function upd(){tick=false;const y=window.scrollY,h=root.scrollHeight-window.innerHeight;
    prog.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
    if(!REDUCE)root.style.setProperty('--sy',Math.min(y,900));}
  window.addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
})();

(function(){
  var OPEN=Date.UTC(2026,10,29,8,0,0),CLOSE=Date.UTC(2026,10,29,19,0,0); /* 9:00 y 20:00 hora peninsular (UTC+1) */
  var el=document.getElementById('cd');if(!el)return;
  var p=function(n,w){n=String(n);while(n.length<w)n='0'+n;return n};
  function tick(){
    var now=Date.now(),d=OPEN-now;
    if(d<=0){
      el.classList.add('done');
      document.getElementById('cdl').textContent=now<CLOSE?'Hoy es el día: los colegios están abiertos hasta las 20:00.':'La votación ha terminado. Los resultados oficiales los publica el Ministerio del Interior.';
      el.setAttribute('aria-label',document.getElementById('cdl').textContent);
      return;
    }
    var s=Math.floor(d/1000);
    document.getElementById('cd_d').textContent=Math.floor(s/86400);
    document.getElementById('cd_h').textContent=p(Math.floor(s%86400/3600),2);
    document.getElementById('cd_m').textContent=p(Math.floor(s%3600/60),2);
    document.getElementById('cd_s').textContent=p(s%60,2);
    setTimeout(tick,1000-(Date.now()%1000));
  }
  tick();
})();

(function(){var m=document.getElementById('mcd');if(!m)return;var d=Math.floor((Date.UTC(2026,10,29,8,0,0)-Date.now())/864e5);
 m.innerHTML=d>0?'<span class="mlong">Faltan </span><b>'+d+'</b> '+(d===1?'día':'días')+'<span class="mlong"> para votar</span><span class="mshort"> para el 29N</span>':'Hoy se vota el 29N'})();

window.addEventListener('DOMContentLoaded',function(){rvScan();window.rvReady=true});

/* ===== v18: menú «Más», volver arriba, noticias ===== */
(function(){
  var btn=document.getElementById('morebtn');if(!btn)return;
  var here=location.pathname.split('/').pop()||'index.html';
  var L=[
    ['vuelos.html','Falcon','Cada vuelo registrado de los aviones oficiales, con fuentes','<path d="M12 2.8c.9 0 1.5.8 1.5 1.8v4.6l7.5 4.4v2l-7.5-2.3v4.4l2 1.5v1.6L12 19.8l-3.5 1v-1.6l2-1.5v-4.4L3 15.6v-2l7.5-4.4V4.6c0-1 .6-1.8 1.5-1.8z"/>'],
    ['promesas.html','Promesas','Promesas cumplidas e incumplidas, con cita y fuente','<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>'],
    ['gastos.html','Gastos','Gasto público desde 2018, sueldos y vuelos oficiales','<circle cx="12" cy="12" r="9"/><path d="M15.5 8.7a4 4 0 100 6.6M7.5 11h6M7.5 13.2h6"/>'],
    ['noche.html','Día electoral','El 29-N: resultados oficiales frente a la previsión','<path d="M3 19a9 9 0 0118 0M7.5 19a4.5 4.5 0 019 0M12 19v-.01M3 19h18"/>'],
    ['entrevistas.html','Entrevistas y debates','Wild y el resto: fechas, estado y fuentes','<path d="M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3zM6 11a6 6 0 0012 0M12 17v4M9 21h6"/>'],
    ['casos.html','Casos','Casos judiciales y su estado, con presunción de inocencia y fuentes','<path d="M12 3v18M6 21h12M5 7h14M5 7l-3 7a3.5 3.5 0 007 0zM19 7l-3 7a3.5 3.5 0 007 0z"/>'],
    ['mesas.html','Mesas electorales','Si te toca: plazos, causas para no ir y calculadora','<path d="M3 11h18v9H3zM7 11V4h10v7M10 7.5h4M9 15.5h6"/>'],
    ['lideres.html','Currículums','Estudios, empleos y cargos de los líderes, con fuentes','<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/>'],
    ['guia.html','Cómo leer Datos 29N','Qué puedes concluir con cada apartado y qué no','<path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5zM12 6v13.5"/>'],
    ['metodo.html','Método y fuentes','Cómo se hace y de dónde sale cada dato','<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>']];
  var sh=document.createElement('div');sh.className='msheet';sh.id='moresheet';sh.hidden=true;
  sh.innerHTML='<div class="msbg" data-close></div><div class="msp" role="dialog" aria-modal="true" aria-label="Más apartados"><div class="msh"><b>Más en Datos 29N</b><button type="button" class="msx" data-close aria-label="Cerrar">✕</button></div>'+
    L.filter(function(l){return !(l[0]==='promesas.html'&&innerWidth<980)}).map(function(l){return '<a class="msl" href="'+l[0]+'"'+(l[0]===here?' aria-current="page"':'')+'><svg viewBox="0 0 24 24" aria-hidden="true">'+l[3]+'</svg><span><b>'+l[1]+'</b><small>'+l[2]+'</small></span></a>'}).join('')+'</div>';
  document.body.appendChild(sh);
  function set(o){sh.hidden=!o;btn.setAttribute('aria-expanded',o);document.documentElement.classList.toggle('msopen',o);if(o){var a=sh.querySelector('.msl');a&&a.focus()}else btn.focus()}
  btn.addEventListener('click',function(){set(sh.hidden)});
  sh.addEventListener('click',function(e){if(e.target.closest('[data-close]'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sh.hidden)set(false)});
})();
(function(){
  var b=document.createElement('button');b.type='button';b.className='totop';b.setAttribute('aria-label','Volver arriba');
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(b);
  b.addEventListener('click',function(){window.scrollTo({top:0,behavior:REDUCE?'auto':'smooth'})});
  var t=false;function u(){t=false;b.classList.toggle('on',window.scrollY>1400)}
  window.addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(u)}},{passive:true});u();
})();
(function(){
  var list=document.getElementById('nlist'),hl=document.getElementById('hlast');if(!list&&!hl)return;
  var MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  fetch('assets/noticias.json?v=28').then(function(r){return r.json()}).then(function(d){
    var it=d.items||[],f=d.actualizado.split('-'),fl=+f[2]+' de '+MES[+f[1]-1]+' de '+f[0];
    var card=function(n){return '<li class="nitem" data-t="'+esc(n.tema)+'"><div class="nmeta"><span class="ntag">'+esc(n.tema)+'</span>'+esc(n.medio)+' · '+esc(n.fecha)+'</div><a href="'+esc(n.url)+'" target="_blank" rel="noopener">'+esc(n.titular)+'</a></li>'};
    if(list){
      var fe=document.getElementById('nfecha');if(fe)fe.textContent=fl;
      var temas=['Todas'].concat([...new Set(it.map(function(n){return n.tema}))]),sel='Todas',nf=document.getElementById('nf');
      function draw(){list.innerHTML=it.filter(function(n){return sel==='Todas'||n.tema===sel}).map(card).join('');
        nf.innerHTML='<b>Tema</b>'+temas.map(function(t){return chipBtn('data-t',t,t,t===sel)}).join('')}
      nf.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;sel=b.dataset.t;draw()});draw();
    }
    if(hl){hl.innerHTML='<div class="hlh"><span>Lo último</span><small>'+fl+'</small></div><ol>'+it.slice(0,5).map(card).join('')+'</ol><a class="hlm" href="noticias.html">Ver todos los titulares →</a>';hl.hidden=false}
  }).catch(function(){if(list)list.innerHTML='<li class="nload">No se han podido cargar los titulares. Recarga la página.</li>'});
})();
/* compartir por WhatsApp (arriba a la derecha): cada apartado comparte su propio enlace y título */
(function(){
  var can=document.querySelector('link[rel="canonical"]'),url=(can&&can.href)||(location.origin+location.pathname);
  var og=document.querySelector('meta[property="og:title"]'),title=((og&&og.content)||document.title||'Datos 29N').trim();
  var home=/\/(index\.html)?$/.test(url.replace(/[?#].*$/,''));
  var txt=home?'Datos 29N: simulador del Congreso, propuestas, promesas, casos y gastos, con fuentes enlazadas. Elecciones del 29 de noviembre: '+url:title+'\n'+url;
  var a=document.createElement('a');a.className='wshare';a.href='https://wa.me/?text='+encodeURIComponent(txt);a.target='_blank';a.rel='noopener';
  a.setAttribute('aria-label',home?'Compartir la web por WhatsApp':'Compartir «'+title+'» por WhatsApp');
  a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.6a8 8 0 01-11.8 7L4 20l1.4-4A8 8 0 1120 11.6z"/><path d="M12 8v6M9 11l3-3 3 3"/></svg><span>Compartir</span>';
  if(navigator.share)a.addEventListener('click',function(e){e.preventDefault();navigator.share({title:title,text:home?'Datos 29N: simulador del Congreso y datos de las elecciones del 29-N':title,url:url}).catch(function(){})});
  var hero=document.querySelector('.hero .hin'),mini=document.querySelector('header.mini');
  if(hero){a.classList.add('onhero');hero.appendChild(a)}else if(mini){mini.appendChild(a)}
})();
/* ===== Barra de situación en la base del menú (PP+Vox | PSOE y socios, punto en 176) ===== */
(function(){
  var nav=document.querySelector('nav.tabs');if(!nav)return;
  var s=document.createElement('script');
  s.src='assets/barra-data.js?h='+Math.floor(Date.now()/36e5);
  s.onload=function(){var B=window.BARRA;if(!B)return;
    var T=350,w=function(n){return (n/T*100).toFixed(2)+'%'};
    var b=document.createElement('a');b.className='mbar';b.href='prediccion.html';
    b.setAttribute('aria-label','Previsión de escaños: PP y Vox '+B.pv+', PSOE y socios '+B.iz+'. Mayoría absoluta: 176.');
    b.title='Previsión: PP+Vox '+B.pv+' · PSOE y socios '+B.iz+' · mayoría 176';
    b.innerHTML='<i style="width:'+w(B.pp)+';background:var(--pp)"></i><i style="width:'+w(B.vox)+';background:var(--vox)"></i><i style="width:'+w(350-B.pv-B.iz)+';background:var(--reg)"></i><i style="width:'+w(B.iz)+';background:var(--psoe)"></i><u style="left:'+w(176)+'"></u>';
    nav.appendChild(b)};
  document.head.appendChild(s);
})();

/* Actualización automática: al volver a abrir la web (también desde el icono), si hay una versión nueva, se recarga sola */
(function(){
  var KEY='d29n_sig', last=0;
  function sig(t){var h=0,i;for(i=0;i<t.length;i++){h=(h*31+t.charCodeAt(i))|0}return String(h)}
  function check(){
    var now=Date.now(); if(now-last<30000) return; last=now;
    fetch(location.pathname+(location.search||''),{cache:'no-store'}).then(function(r){return r.text()}).then(function(t){
      var s=sig(t),prev=null;
      try{prev=sessionStorage.getItem(KEY+location.pathname)}catch(e){}
      try{sessionStorage.setItem(KEY+location.pathname,s)}catch(e){}
      if(prev&&prev!==s) location.reload();
    }).catch(function(){});
  }
  check();
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')check()});
  window.addEventListener('pageshow',function(e){if(e.persisted)check()});
})();

(function(){var b=document.getElementById('rfbtn');if(!b)return;b.addEventListener('click',function(){b.classList.add('spin');fetch(location.pathname,{cache:'no-store'}).catch(function(){}).then(function(){location.reload()})})})();

/* ===== Fecha única «Actualizado el…» (la sella tools/sellar-fecha.sh) ===== */
const ACT='27 de octubre de 2026 · 22:10 (GMT+1)';
(function(){
  const p=location.pathname.split('/').pop()||'index.html';
  if(p==='index.html'||document.querySelector('.act'))return;
  const h=document.querySelector('.sec .sech,.sec,main');
  if(!h)return;
  const e=document.createElement('p');e.className='eyebrow act';e.textContent='Actualizado el '+ACT;
  (h.classList.contains('sech')?h.parentNode:h).insertBefore(e,h.classList.contains('sech')?h:h.firstChild);
})();

/* Recuentos y fechas de las encuestas: salen de PRED, nunca escritos a mano */
(function(){
  const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],ff=f=>{const[y,m,d]=f.split('-').map(Number);return d+'-'+MES[m-1]};
  const go=()=>{if(typeof PRED==='undefined'||!PRED.privadas)return;const fs=PRED.privadas.map(p=>p.f).sort(),r=ff(fs[0])+' al '+ff(fs[fs.length-1]);window.PRED_RNG=r;
    document.querySelectorAll('.npol').forEach(e=>e.textContent=PRED.n);document.querySelectorAll('.rngp').forEach(e=>e.textContent=r)};
  document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);
})();

/* Menú inferior solo con iconos: cada botón conserva su nombre para lectores de pantalla y para el toque largo */
(function(){
  const go=()=>document.querySelectorAll('nav.tabs a:not(.mbar),nav.tabs .more').forEach(a=>{const s=a.querySelector('span');if(s&&!a.getAttribute('aria-label')){a.setAttribute('aria-label',s.textContent.trim());a.title=s.textContent.trim()}});
  document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);
})();
