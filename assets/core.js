const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const A=(l,u)=>`<a href="${u}">${esc(l)}</a>`;
const go=id=>{const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
const chipBtn=(attr,val,label,on)=>`<button type="button" ${attr}="${val}" aria-pressed="${on}">${label}</button>`;

/* ===== Dinamismo: reveal, nav, progreso, hero ===== */
const REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
const RV_SEL='.sech,.exec,.banner,.dt>h2,.dt .rowf,.panel,.star,.pc,.cc,.sr2,.meth details,.foot,.bars>div,.stg,.pos,.bloc,.credit';
let rvIO=null;
if('IntersectionObserver' in window&&!REDUCE){
  rvIO=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvIO.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
}
function rvScan(){
  document.querySelectorAll(RV_SEL).forEach(el=>{
    if(el.dataset.rv)return;el.dataset.rv='1';
    if(!rvIO){el.classList.add('in');return}
    const sib=[...el.parentNode.children].filter(x=>x.matches&&x.matches(RV_SEL));
    el.style.setProperty('--d',Math.min(sib.indexOf(el),6)*70+'ms');
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
 m.innerHTML=d>0?'Faltan <b>'+d+'</b> '+(d===1?'día':'días')+' para votar':'Hoy se vota el 29N'})();

window.addEventListener('DOMContentLoaded',function(){rvScan();window.rvReady=true});
