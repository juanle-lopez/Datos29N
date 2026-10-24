/* ================= TU VOTO: piezas interactivas para primer voto y dudas ================= */
/* Sin recomendaciones, sin test de afinidad, sin ranking. Datos de partidos: assets/propuestas-data.js */
(function(){
const $=id=>document.getElementById(id);
const chips=(box,items,cur,fn)=>{box.innerHTML=items.map(([k,l])=>`<button type="button" data-k="${k}" aria-pressed="${String(k)===String(cur)}">${l}</button>`).join('');
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>fn(b.dataset.k)))};

/* ---------- 1. ¿Con qué duda llegas? ---------- */
const Q={
 primero:['Voy a votar por primera vez','Si has cumplido 18 años y estás en el censo, puedes votar. Es lo único que hace falta, más un documento con foto el día de la votación. Te lo contamos en tres paradas.',[['#dia','Cómo es el día de voto'],['#cuenta','Qué cuenta cada opción'],['#temas','Qué propone cada partido']]],
 ir:['No sé si ir a votar','Votar no es obligatorio en España. Antes de decidir, mira qué efecto tiene cada opción (votar a una lista, en blanco, nulo o no ir) y qué decide un voto en tu provincia.',[['#cuenta','Qué cuenta cada opción'],['#reparto','Qué decide un voto']]],
 que:['No sé qué votar','Aquí no te lo decimos ni te hacemos un test. Te enseñamos qué ha propuesto cada partido, tema a tema, con la fuente, y qué ocurrió con promesas anteriores.',[['#temas','Propuestas por tema'],['promesas.html','Promesas: qué se cumplió'],['propuestas.html','Tabla completa']]],
 como:['No entiendo cómo funciona','Se vota a una lista de tu provincia, los escaños se reparten con una regla y luego el Congreso elige presidente. Lo vemos con un ejemplo que puedes mover.',[['#que-se-elige','Qué se elige'],['#reparto','Reparto de escaños'],['#faq','Preguntas frecuentes']]]
};
let qk='primero';
function drawQ(){
  chips($('tvq'),Object.entries(Q).map(([k,v])=>[k,v[0]]),qk,k=>{qk=k;drawQ()});
  const q=Q[qk];
  $('tva').innerHTML=`<p>${q[1]}</p><div class="tvgo">${q[2].map(l=>`<a href="${l[0]}">${l[1]} <span aria-hidden="true">→</span></a>`).join('')}</div>`;
}
drawQ();

/* ---------- 2. Qué se elige ---------- */
const FLOW=[
 ['Tú votas','Una lista de partido en tu provincia para el Congreso. No eliges al presidente del Gobierno directamente.'],
 ['Tu provincia reparte','Cada provincia tiene un número de escaños (por ejemplo, 2 en Soria y 38 en Madrid) y los reparte entre las listas según los votos.'],
 ['350 diputados','Suman todas las provincias. La mayoría absoluta son 176.'],
 ['El Congreso elige presidente','En la investidura, el candidato necesita mayoría absoluta (176) en la primera votación o más síes que noes en una segunda, 48 horas después. Si en dos meses nadie lo consigue, se convocan elecciones.']
];
let fi=0;
function drawFlow(){
  const b=$('tvflow');
  b.innerHTML=`<ol class="tvsteps">${FLOW.map((f,i)=>`<li class="${i===fi?'on':i<fi?'done':''}"><button type="button" data-i="${i}"><span class="n">${i+1}</span><b>${f[0]}</b></button></li>`).join('')}</ol><div class="tvbox"><p>${FLOW[fi][1]}</p></div>
  <div class="tvnav"><button type="button" id="fp" ${fi===0?'disabled':''}>← Anterior</button><button type="button" id="fn" ${fi===FLOW.length-1?'disabled':''}>Siguiente →</button></div>
  <p class="sources" style="margin:10px 0 0">Además del Congreso, se vota al Senado en otra papeleta: en la mayoría de provincias puedes marcar hasta tres nombres. Fuente: LOREG y Constitución (arts. 66, 68, 99).</p>`;
  b.querySelectorAll('[data-i]').forEach(x=>x.addEventListener('click',()=>{fi=+x.dataset.i;drawFlow()}));
  $('fp').addEventListener('click',()=>{fi--;drawFlow()});$('fn').addEventListener('click',()=>{fi++;drawFlow()});
}
drawFlow();

/* ---------- 3. Reparto D'Hondt interactivo ---------- */
const LC=['hsl(190 55% 38%)','hsl(38 78% 46%)','hsl(265 42% 56%)','hsl(330 52% 52%)'];
const LN=['Lista 1','Lista 2','Lista 3','Lista 4'];
const PRE={mixto:[34,28,22,12,4],grande:[55,20,12,8,5],igual:[24,24,24,24,4],pequena:[40,35,19,2,4]};
const sim={v:PRE.mixto.slice(),n:5,umb:true};
function dhondt(v,n){ // v: votos por lista (ya sin excluidas). Devuelve escaños, orden de asignación y primer cociente perdido
  const q=[];v.forEach((x,i)=>{for(let d=1;d<=n+1;d++)q.push({i,d,q:x/d})});
  q.sort((a,b)=>b.q-a.q||a.i-b.i);q.splice(0,q.length,...q.filter(e=>e.q>0));
  const seats=v.map(()=>0);q.slice(0,n).forEach(e=>seats[e.i]++);
  return {seats,win:q.slice(0,n),next:q[n],all:q};
}
function drawSim(){
  const b=$('tvsim'),tot=sim.v.reduce((a,x)=>a+x,0)||1,bl=sim.v[4];
  const sh=sim.v.map(x=>x/tot*100);
  const elig=sim.v.slice(0,4).map((x,i)=>(!sim.umb||sh[i]>=3)?x:0);
  const r=dhondt(elig,sim.n);
  const sel=[[2,'2 escaños'],[3,'3'],[5,'5'],[8,'8'],[38,'38']];
  const rows=sim.n<=8;
  let tbl='';
  if(rows){
    const win=new Set(r.win.map(e=>e.i+'-'+e.d));
    tbl=`<div class="tvtw"><table class="tvdh"><thead><tr><th></th>${Array.from({length:sim.n},(_,d)=>`<th>÷${d+1}</th>`).join('')}</tr></thead><tbody>${elig.map((x,i)=>`<tr><th style="--c:${LC[i]}">${LN[i]}</th>${Array.from({length:sim.n},(_,d)=>`<td class="${win.has(i+'-'+(d+1))?'w':''}">${x?Math.round(x/(d+1)*10)/10:'–'}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="sources" style="margin:6px 0 0">Cada lista se divide entre 1, 2, 3… y los ${sim.n} cocientes más altos se llevan un escaño cada uno (casillas marcadas).</p>`;
  }
  const last=r.win[r.win.length-1],nx=r.next;
  let msg=last?`<b>El último escaño</b> (el ${r.win.length}º) se lo lleva ${LN[last.i]} con un cociente de ${Math.round(last.q*10)/10}.`:'Sin votos válidos no hay reparto.';
  if(nx&&nx.q>0)msg+=` Se queda fuera por poco ${LN[nx.i]} (${Math.round(nx.q*10)/10}).`;
  const out=sh.slice(0,4).map((s,i)=>(sim.umb&&s>0&&s<3)?`${LN[i]} (${s.toFixed(1)} %)`:null).filter(Boolean);
  if(out.length)msg+=` <b>Bajo el 3 %</b>: ${out.join(', ')} no entra${out.length>1?'n':''} en el reparto, aunque tuviese${out.length>1?'n':''} votos.`;
  b.innerHTML=`<div class="tvctl"><div class="tvrow"><b>Escaños que elige la provincia</b>${chips2('n',sel,sim.n)}</div>
  <div class="tvrow"><b>Ejemplos</b>${chips2('p',[['mixto','Reparto medio'],['grande','Una lista grande'],['igual','Cuatro igualadas'],['pequena','Una muy pequeña']],'')}</div></div>
  <div class="tvsl">${sim.v.map((x,i)=>`<label style="--c:${i<4?LC[i]:'var(--reg)'}"><span><i></i>${i<4?LN[i]:'Votos en blanco'}</span><input type="range" min="0" max="60" value="${x}" data-i="${i}" aria-label="Votos ${i<4?LN[i]:'en blanco'}"><em>${sh[i].toFixed(1)} %</em></label>`).join('')}</div>
  <label class="tvck"><input type="checkbox" id="umb" ${sim.umb?'checked':''}> Aplicar el mínimo del 3 % de los votos válidos (los blancos cuentan como válidos)</label>
  <div class="tvseats" aria-live="polite"><h3 class="tvh3">Escaños: ${sim.n}</h3><div class="tvsq">${r.seats.map((s,i)=>Array.from({length:s},()=>`<span style="background:${LC[i]}" title="${LN[i]}"></span>`).join('')).join('')}</div>
  <div class="tvleg">${r.seats.map((s,i)=>`<span style="--c:${LC[i]}"><i></i>${LN[i]}: <b>${s}</b></span>`).join('')}</div></div>
  ${tbl}<p class="tvmsg">${msg}</p>
  <p class="tvlearn">${learn(sh,r)}</p>`;
  b.querySelectorAll('input[type=range]').forEach(x=>x.addEventListener('input',()=>{sim.v[+x.dataset.i]=+x.value;drawSim(false);}));
  b.querySelectorAll('[data-n]').forEach(x=>x.addEventListener('click',()=>{sim.n=+x.dataset.n;drawSim()}));
  b.querySelectorAll('[data-p]').forEach(x=>x.addEventListener('click',()=>{sim.v=PRE[x.dataset.p].slice();drawSim()}));
  $('umb').addEventListener('change',e=>{sim.umb=e.target.checked;drawSim()});
}
function chips2(a,items,cur){return `<span class="tvchips">${items.map(([k,l])=>`<button type="button" data-${a}="${k}" aria-pressed="${String(k)===String(cur)}">${l}</button>`).join('')}</span>`}
function learn(sh,r){
  const t=[];
  if(sim.n<=3)t.push('Con pocos escaños, una lista necesita muchos votos para sacar uno: las pequeñas lo tienen difícil.');
  else if(sim.n>=38)t.push('Con muchos escaños, las listas medianas y hasta algunas pequeñas llegan a sacar representación.');
  const g=r.seats.map((s,i)=>[s,sh[i]]);
  const mx=Math.max(...g.map(x=>x[1]));if(!mx)return t.join(' ');
  const best=g.findIndex(x=>x[1]===mx);
  const pct=r.seats[best]/sim.n*100;
  if(mx>0)t.push(`La lista con más votos (${mx.toFixed(1)} %) obtiene ${r.seats[best]} de ${sim.n} escaños (${pct.toFixed(0)} %): el reparto no es exactamente proporcional, favorece a las más votadas.`);
  return t.join(' ');
}
drawSim();

/* ---------- 4. Qué cuenta ---------- */
const C=[
 ['lista','Votar a una lista','Metes en el sobre la papeleta de la lista que eliges.',[1,1,1,1]],
 ['blanco','Voto en blanco','Sobre vacío (sin papeleta) o con papeleta en blanco: es una forma de participar sin apoyar a ninguna lista. Sí cuenta como voto válido, así que hace más difícil que las listas pequeñas lleguen al 3 %.',[1,1,0,1]],
 ['nulo','Voto nulo','Papeleta rota, con tachaduras o cambios, o un sobre con papeletas de listas distintas. Se anota como nulo y no cuenta como válido.',[0,0,0,1]],
 ['no','No ir a votar','Abstención. No se suma a nada, aunque el porcentaje de participación del día lo refleja (más abstención, menos participación).',[0,0,0,0]]
];
const CQ=['¿Es voto válido?','¿Cuenta para el 3 %?','¿Da escaños a alguna lista?','¿Cuenta en la participación?'];
let ck='lista';
function drawC(){
  chips($('tvc'),C.map(c=>[c[0],c[1]]),ck,k=>{ck=k;drawC()});
  const c=C.find(x=>x[0]===ck);
  const yes=['Sí','Sí','Sí, a la que votas','Sí'],no=['No','No','No','No'];
  const val=[c[3][0],c[3][1],ck==='lista'?1:0,c[3][3]];
  $('tvcp').innerHTML=`<p>${c[2]}</p><ul class="tvyn">${CQ.map((q,i)=>`<li class="${val[i]?'y':'n'}"><span>${q}</span><b>${val[i]?(i===2?yes[2]:'Sí'):'No'}</b></li>`).join('')}</ul>
  <p class="sources" style="margin:8px 0 0">El mínimo es el 3 % de los votos válidos de la circunscripción, incluidos los blancos (LOREG, arts. 96 y 163). Participar con blanco o nulo es una decisión tuya; esta web no te dice qué hacer.</p>`;
}
drawC();

/* ---------- 5. Día de voto (compacto) ---------- */
const D=[
 ['Elige tu momento','El domingo 29 de noviembre, de 9:00 a 20:00.'],
 ['Ve a tu colegio','Vota quien lo tiene asignado por su domicilio. Suele llegarte una tarjeta con el dato y se puede consultar en la sede electrónica del INE.'],
 ['Enseña tu documento','DNI, pasaporte o permiso de conducir (con foto). En la mesa lo comprueban y dicen tu nombre en voz alta.'],
 ['Elige papeleta y sobre','Un sobre para el Congreso y otro, de distinto color, para el Senado. Las papeletas están en el colegio o puedes llevarlas de casa. La cabina es voluntaria.'],
 ['Deposita en la urna','Cada sobre en su urna. Hasta ese momento puedes cambiar de opinión.'],
 ['Recuento','A las 20:00 se cierran las urnas y se cuenta en el mismo colegio. Esa noche sale el resultado: <a href="noche.html">noche electoral</a>.']
];
$('tvstep').innerHTML='<ol class="tvdia">'+D.map((d,i)=>`<li><span class="n">${i+1}</span><div><b>${d[0]}</b> <span>${d[1]}</span></div></li>`).join('')+'</ol>';
const CK=['Documento con foto','Sé cuál es mi colegio','Sé a qué hora voy','Sé qué hago con mi voto (a una lista, en blanco… o no ir): es solo mío'];
$('tvchk').innerHTML=CK.map((t,i)=>`<li><label><input type="checkbox" data-c="${i}"><span>${t}</span></label></li>`).join('')+'<li class="tvok" id="tvok" hidden>Listo. Con eso basta.</li>';
$('tvchk').addEventListener('change',()=>{const n=document.querySelectorAll('#tvchk input:checked').length;$('tvok').hidden=n<CK.length});

/* ---------- 6. Propuestas por tema (compacto; el balance de promesas está en Promesas) ---------- */
let tk=0,pf='all';
$('tvts').innerHTML=TOPICS.map((t,i)=>`<option value="${i}">${t}</option>`).join('');
$('tvps').innerHTML='<option value="all">Todos</option>'+PARTS.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('');
$('tvts').addEventListener('change',e=>{tk=+e.target.value;drawT()});
$('tvps').addEventListener('change',e=>{pf=e.target.value;drawT()});
function drawT(){
  $('tvp').innerHTML=PARTS.filter(p=>pf==='all'||p[0]===pf).map(p=>{
    const x=PROP[p[0]][tk];
    if(!x)return `<div class="tvpt" style="--c:${p[2]}"><div class="tvpn"><b>${p[1]}</b><span class="na">Sin posición concreta en las fuentes consultadas.</span></div></div>`;
    const m=x.t.slice(40).search(/[.;] /);let first=m>=0&&m+41<=150?x.t.slice(0,m+41):x.t;
    first=first.replace(/[;:,.]\s*$/,'');
    if(first.length>150){first=first.slice(0,150);first=first.slice(0,first.lastIndexOf(' '))+'…'}
    return `<details class="tvpt tvdet" style="--c:${p[2]}"><summary class="tvpn"><b>${p[1]}</b><span>${esc(first)}</span></summary><div class="tvpb">${esc(x.t)}<div class="o">Origen: ${esc(x.o)}</div><div class="ms">Fuentes: ${x.f.map(k=>A(S[k][0],S[k][1])).join('')}</div></div></details>`;
  }).join('');
}
drawT();

/* ---------- 7. Preguntas ---------- */
const F=[
 ['¿Voto al presidente del Gobierno?','No. Votas una lista de tu provincia para el Congreso de los Diputados. Después, los diputados elegidos votan al presidente en la investidura (Constitución, art. 99).'],
 ['Si la lista que voto no gana, ¿mi voto se pierde?','No. Los escaños se reparten entre varias listas según los votos, no solo para la primera. Tu voto cuenta en el reparto de tu provincia. Otra cosa es que una lista muy pequeña no llegue al 3 % o se quede sin cociente suficiente: pruébalo en el reparto de arriba.'],
 ['¿Por qué un partido con menos votos en total puede tener más escaños?','Porque los escaños se reparten provincia a provincia. Dónde se consiguen los votos pesa tanto como cuántos son en total.'],
 ['¿Puedo votar a un partido de otra provincia?','Votas las listas que se presentan en tu circunscripción. Un partido puede presentarse solo en algunas provincias: entonces no tienes su papeleta.'],
 ['¿Para qué sirve el Senado?','Es la otra cámara de las Cortes. Se vota en una papeleta distinta y, en la mayoría de provincias, puedes marcar hasta tres candidatos. Tiene un papel distinto al del Congreso: no es el que elige al presidente.'],
 ['¿Qué pasa si nadie llega a 176?','Los partidos pactan. En la investidura se necesita mayoría absoluta en la primera votación o más síes que noes en la segunda. Si en dos meses nadie logra la confianza del Congreso, se disuelven las Cortes y hay nuevas elecciones.'],
 ['¿Es obligatorio votar?','No. En España el voto es un derecho, no una obligación.'],
 ['¿Cuándo sé el resultado?','El mismo domingo por la noche, tras cerrar los colegios a las 20:00. En la <a href="noche.html">página de la noche electoral</a> lo seguimos escaño a escaño.']
];
$('tvfaq').innerHTML=F.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
})();
