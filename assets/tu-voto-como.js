/* «Así se vota»: explicación animada, paso a paso, con el mismo formato que «Así se hace la previsión».
   Ejemplos inventados para entender la regla; la previsión real está en Predicción. */
(function(){
  const el=document.getElementById('vcomo');if(!el)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nf=(x,d=1)=>Number(x).toFixed(d).replace('.',',');
  const $=id=>document.getElementById(id);
  let step=0,tm=[],auto=false,seen=false,dem=1;
  const clear=()=>{tm.forEach(t=>{clearTimeout(t);clearInterval(t)});tm=[]};
  const later=(f,ms)=>{const t=setTimeout(f,ms);tm.push(t);return t};
  const every=(f,ms)=>{const t=setInterval(f,ms);tm.push(t);return t};
  const W=420,H=300;
  const svg=(inner,lab)=>`<svg class="cmsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${lab}">${inner}</svg>`;
  const T=(x,y,t,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" class="${o.c||'cmv'}" style="${o.s||''}">${t}</text>`;
  const LC=['hsl(190 55% 38%)','hsl(38 78% 46%)','hsl(265 42% 56%)','hsl(330 52% 52%)','hsl(150 40% 40%)'];
  const paper=(x,y,c,delay,lines)=>`<g class="cmd drop" style="animation-delay:${delay}s"><rect x="${x}" y="${y}" width="46" height="60" rx="4" fill="var(--panel)" stroke="var(--fg)" stroke-width="1.4"/><rect x="${x+6}" y="${y+7}" width="34" height="9" rx="2" fill="${c}"/>${lines}</g>`;
  const ln=(x,y,n)=>Array.from({length:n},(_,i)=>`<rect x="${x+6}" y="${y+22+i*10}" width="${i%2?22:34}" height="3" rx="1.5" fill="var(--line)"/>`).join('');
  const env=(x,y,c,delay,cls)=>`<g class="${cls||'fade'}" style="animation-delay:${delay}s"><rect x="${x}" y="${y}" width="70" height="46" rx="4" fill="${c}" stroke="var(--fg)" stroke-width="1.4"/><path d="M${x} ${y+2}L${x+35} ${y+26}L${x+70} ${y+2}" fill="none" stroke="var(--fg)" stroke-width="1.4"/></g>`;
  const SEP='#b8926a';

  const S=[];
  // 1. Colegio
  S.push({t:'Llegas al colegio',dur:7000,
    p:`El domingo 29 de noviembre, de <b>9:00 a 20:00</b>. En la mesa te piden <b>DNI, pasaporte o permiso de conducir</b> (con foto), comprueban que estás en la lista y dicen tu nombre en voz alta. No hace falta llevar nada más.`,
    go(){let s='';const X=h=>30+(h-9)/11*360;
      s+=`<line x1="${X(9)}" x2="${X(20)}" y1="62" y2="62" stroke="var(--line)" stroke-width="6" stroke-linecap="round"/>`;
      [9,12,15,18,20].forEach(h=>s+=`<line x1="${X(h)}" x2="${X(h)}" y1="52" y2="72" stroke="var(--line)"/>${T(X(h),92,h+':00')}`);
      s+=`<circle class="cmd slide" cx="${X(9)}" cy="62" r="9" fill="var(--mid)" style="--tx:${X(20)-X(9)}px;animation-duration:5s;animation-timing-function:linear"/>`;
      s+=T(W,18,'abierto de 9 a 20 h',{a:'end',c:'cmbig fade',s:'animation-delay:.3s'});
      s+=`<rect x="196" y="188" width="190" height="14" rx="3" fill="var(--panel)" stroke="var(--fg)" stroke-width="1.4"/>`;
      [226,291,356].forEach((x,i)=>s+=`<g class="cmd pop" style="animation-delay:${.8+i*.2}s"><circle cx="${x}" cy="158" r="12" fill="var(--fg)" opacity=".75"/><rect x="${x-10}" y="172" width="20" height="14" rx="4" fill="var(--fg)" opacity=".75"/></g>`);
      s+=T(291,222,'la mesa (3 personas)');
      s+=`<g class="cmd mv" style="--tx:120px;--ty:0px;animation-delay:1.4s"><circle cx="50" cy="168" r="11" fill="var(--pp)"/><rect x="40" y="181" width="20" height="26" rx="6" fill="var(--pp)"/></g>`;
      s+=`<g class="fade" style="animation-delay:2.9s"><rect x="60" y="238" width="62" height="40" rx="5" fill="var(--panel)" stroke="var(--fg)" stroke-width="1.4"/><circle cx="78" cy="254" r="7" fill="var(--line)"/><rect x="92" y="248" width="24" height="3" rx="1.5" fill="var(--line)"/><rect x="92" y="256" width="20" height="3" rx="1.5" fill="var(--line)"/><rect x="68" y="268" width="46" height="3" rx="1.5" fill="var(--line)"/></g>${T(160,262,'documento con foto',{a:'start',c:'cmv fade',s:'animation-delay:3.1s;fill:var(--fg)'})}`;
      return svg(s,'Horario de votación de 9:00 a 20:00 y la mesa que comprueba tu documento')}});
  // 2. Papeletas
  S.push({t:'Eliges papeleta y sobre',dur:7500,
    p:`Hay <b>dos votaciones</b> a la vez. <b>Congreso</b>: eliges una lista cerrada, sin cambiar el orden. <b>Senado</b>: en la mayoría de provincias puedes marcar <b>hasta tres nombres</b>. Cada papeleta va en su sobre, de distinto color. Las papeletas están en el colegio y también puedes llevarlas de casa.`,
    go(){let s='';
      s+=T(105,26,'Congreso',{c:'cml',s:'fill:var(--fg)'})+T(315,26,'Senado',{c:'cml',s:'fill:var(--fg)'});
      s+=T(105,44,'una lista')+T(315,44,'hasta 3 nombres');
      s+=env(70,170,'var(--panel)',.1,'')+env(280,170,SEP,.1,'');
      s+=`<g class="cmd mv" style="--tx:0px;--ty:84px;animation-delay:3.4s;animation-duration:1.1s">${paper(82,70,LC[0],.3,ln(82,70,3))}</g>`;
      s+=`<g class="cmd mv" style="--tx:0px;--ty:84px;animation-delay:3.8s;animation-duration:1.1s">${paper(262,70,LC[1],.8,ln(262,70,3))}<g class="fade" style="animation-delay:1.4s">${[0,1,2].map(i=>`<path d="M${268+i*13} 111 l3 3 6 -7" fill="none" stroke="${LC[1]}" stroke-width="2"/>`).join('')}</g></g>`;
      s+=`<g><path d="M70 189L105 214L140 189V212a4 4 0 01-4 4H74a4 4 0 01-4-4Z" fill="var(--panel)" stroke="var(--fg)" stroke-width="1.4"/><path d="M280 189L315 214L350 189V212a4 4 0 01-4 4H284a4 4 0 01-4-4Z" fill="${SEP}" stroke="var(--fg)" stroke-width="1.4"/></g>`;
      s+=T(105,236,'sobre del Congreso',{c:'cmv fade',s:'animation-delay:4.7s;fill:var(--fg)'})+T(315,236,'sobre del Senado',{c:'cmv fade',s:'animation-delay:4.7s;fill:var(--fg)'});
      s+=T(210,272,'cabina: voluntaria',{c:'cmv fade',s:'animation-delay:5.2s'});
      return svg(s,'Dos papeletas, Congreso y Senado, cada una en su sobre')}});
  // 3. Urna
  S.push({t:'Metes el sobre en la urna',dur:7000,
    p:`Cada sobre, en <b>su urna</b>. Hasta ese momento puedes cambiar de opinión; <b>después ya no</b>. A las 20:00 se cierran las urnas y el recuento se hace en el mismo colegio, a la vista de todos.`,
    go(){let s='';
      const urn=(x,c,l)=>`<g><rect x="${x}" y="164" width="110" height="100" rx="8" fill="var(--panel)" stroke="var(--fg)" stroke-width="2"/><rect x="${x+25}" y="164" width="60" height="7" rx="3" fill="var(--fg)"/><rect x="${x+8}" y="196" width="94" height="6" rx="3" fill="${c}" opacity=".5"/>${T(x+55,236,l,{c:'cmv',s:'fill:var(--fg)'})}</g>`;
      s+=`<g class="cmd mv" style="--tx:0px;--ty:128px;animation-delay:.6s;animation-duration:1.4s"><rect x="80" y="40" width="70" height="46" rx="4" fill="var(--panel)" stroke="var(--fg)" stroke-width="1.4"/><path d="M80 42L115 66L150 42" fill="none" stroke="var(--fg)" stroke-width="1.4"/></g>`;
      s+=`<g class="cmd mv" style="--tx:0px;--ty:128px;animation-delay:1.4s;animation-duration:1.4s"><rect x="270" y="40" width="70" height="46" rx="4" fill="${SEP}" stroke="var(--fg)" stroke-width="1.4"/><path d="M270 42L305 66L340 42" fill="none" stroke="var(--fg)" stroke-width="1.4"/></g>`;
      s+=urn(60,LC[0],'urna Congreso')+urn(250,SEP,'urna Senado');
      s+=T(W,18,'20:00: cierran las urnas',{a:'end',c:'cmbig fade',s:'animation-delay:3.2s'});
      s+=T(210,288,'Después de meterlo, el voto no se puede cambiar',{c:'cmv fade',s:'animation-delay:2.6s;fill:var(--fg)'});
      return svg(s,'Los dos sobres entran cada uno en su urna')}});
  // 4. Qué cuenta
  S.push({t:'Qué cuenta y qué no',dur:9000,
    p:`Ejemplo con <b>40 personas</b> del censo. Son <b>votos válidos</b> los de una lista (24) y los <b>blancos</b> (4): 28. Los <b>nulos</b> (3) no cuentan como válidos. Quien <b>no va</b> (9) no suma. El mínimo del <b>3 %</b> se calcula sobre los válidos, blancos incluidos; la participación sí incluye a quien vota nulo.`,
    go(){let s='';const B=[[14,210,'Votos válidos'],[234,70,'Nulos'],[314,92,'No votan']];
      B.forEach(([x,w,l])=>s+=`<rect x="${x}" y="150" width="${w}" height="92" rx="8" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>${T(x+w/2,262,l,{c:'cmv',s:'fill:var(--fg);font-weight:800'})}`);
      s+=T(0,18,'40 personas del censo (ejemplo)',{a:'start',c:'cmbig fade',s:'animation-delay:.2s'});
      const dots=[];for(let i=0;i<24;i++)dots.push(['l',LC[i%3]]);for(let i=0;i<4;i++)dots.push(['b']);for(let i=0;i<3;i++)dots.push(['n']);for(let i=0;i<9;i++)dots.push(['a']);
      // reparto determinista: se mezclan para que lleguen a la vez
      const order=dots.map((d,i)=>[d,(i*17)%40]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
      const pos={l:0,b:24,n:0,a:0};
      order.forEach((d,i)=>{const sx=22+(i%20)*19,sy=50+Math.floor(i/20)*22;let tx,ty;
        if(d[0]==='l'||d[0]==='b'){const k=d[0]==='l'?pos.l++:pos.b++;tx=26+(k%16)*13;ty=176+Math.floor(k/16)*14}
        else if(d[0]==='n'){const k=pos.n++;tx=252+k*17;ty=190}
        else{const k=pos.a++;tx=330+(k%5)*14;ty=176+Math.floor(k/5)*14}
        const dl=(1.2+i*.06).toFixed(2),st=`--tx:${(tx-sx).toFixed(1)}px;--ty:${(ty-sy).toFixed(1)}px;animation-delay:${dl}s`;
        let sh;
        if(d[0]==='l')sh=`<circle cx="${sx}" cy="${sy}" r="5.2" fill="${d[1]}"/>`;
        else if(d[0]==='b')sh=`<circle cx="${sx}" cy="${sy}" r="4.7" fill="var(--bg)" stroke="var(--fg)" stroke-width="1.6"/>`;
        else if(d[0]==='n')sh=`<g stroke="var(--bad)" stroke-width="2"><line x1="${sx-4.5}" y1="${sy-4.5}" x2="${sx+4.5}" y2="${sy+4.5}"/><line x1="${sx-4.5}" y1="${sy+4.5}" x2="${sx+4.5}" y2="${sy-4.5}"/></g>`;
        else sh=`<circle cx="${sx}" cy="${sy}" r="4.7" fill="none" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="2 2"/>`;
        s+=`<g class="cmd mv" style="${st};animation-duration:1.3s">${sh}</g>`});
      s+=`<g class="fade" style="animation-delay:5s">${T(119,142,'28',{c:'cmbig'})}${T(269,142,'3',{c:'cmbig'})}${T(360,142,'9',{c:'cmbig'})}</g>`;
      s+=T(210,288,'los blancos son válidos; los nulos, no',{c:'cmv fade',s:'animation-delay:6.5s'});
      return svg(s,'Cuarenta personas se reparten en votos válidos, nulos y quienes no votan')}});
  // 5. Escaños (D'Hondt con provincia inventada)
  const SH={'Lista 1':36,'Lista 2':28,'Lista 3':22,'Lista 4':11.6,'Lista 5':2.4};
  const SEL=[[2,'2 escaños'],[5,'5 escaños'],[10,'10 escaños']];
  S.push({t:'Se reparten los escaños',dur:null,
    p:`Cada provincia reparte los suyos con la regla <b>D’Hondt</b>: cada escaño va a la lista con el <b>cociente</b> más alto (sus votos entre los escaños que ya tiene más uno). Provincia inventada: cambia su tamaño y mira cómo cambia el reparto. Lista 5 no llega al 3 % y no entra.`,
    go(){return `<div class="cmdh"><div class="cmsel" role="group" aria-label="Escaños de la provincia">${SEL.map(([n,l],i)=>`<button type="button" data-d="${i}" aria-pressed="${i===dem}">${l}</button>`).join('')}</div><div id="cmdh"></div></div>`},
    after(){runDh()}});
  function runDh(){
    const box=$('cmdh');if(!box)return;const n=SEL[dem][0];
    const P=Object.keys(SH).filter(k=>SH[k]>=3),cnt={},seq=[];P.forEach(k=>cnt[k]=0);
    const st={};P.forEach(k=>st[k]=0);
    for(let i=0;i<n;i++){let b=null,bv=-1;P.forEach(k=>{const q=SH[k]/(st[k]+1);if(q>bv){bv=q;b=k}});st[b]++;seq.push({k:b,q:bv})}
    const col=k=>LC[+k.slice(-1)-1];
    box.innerHTML=`<div class="cmdt"><b>Provincia inventada</b> · ${n} escaños</div>
      <div class="cmseats" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i></i>`).join('')}</div>
      <div class="cmrows">${P.map(k=>`<div class="cmr" data-k="${k}"><span class="cmn" style="color:${col(k)}">${k}</span><span class="cmb"><i style="width:${SH[k]*2}%;background:${col(k)}"></i></span><span class="cmp">${nf(SH[k])} %</span><span class="cmq" data-q>${nf(SH[k])}</span><span class="cms2" data-s>0</span></div>`).join('')}
      <div class="cmh"><span></span><span></span><span>voto</span><span>cociente</span><span>esc.</span></div></div>
      <p class="cmmsg" id="cmmsg" aria-live="polite">Empezamos: cada lista tiene su porcentaje como primer cociente.</p>`;
    const seats=box.querySelectorAll('.cmseats i'),rows={};box.querySelectorAll('.cmr').forEach(r=>rows[r.dataset.k]=r);
    const msg=$('cmmsg');let i=0;
    const next=()=>{if(i>=seq.length){msg.innerHTML=`<b>Reparto:</b> ${P.filter(k=>cnt[k]).map(k=>`${k} ${cnt[k]}`).join(' · ')}. ${n<=2?'Con pocos escaños, solo las listas más votadas sacan alguno.':n>=10?'Con más escaños, el reparto se parece más al de los votos.':''}`;return false}
      const {k,q}=seq[i];cnt[k]++;seats[i].style.background=col(k);seats[i].classList.add('on');
      Object.values(rows).forEach(r=>r.classList.remove('win'));rows[k].classList.add('win');rows[k].querySelector('[data-s]').textContent=cnt[k];
      P.forEach(kk=>rows[kk].querySelector('[data-q]').textContent=nf(SH[kk]/(cnt[kk]+1)));
      msg.innerHTML=`Escaño <b>${i+1}</b> de ${n}: para <b style="color:${col(k)}">${k}</b>, cociente más alto (${nf(q)}). Ahora ${nf(SH[k])} ÷ ${cnt[k]+1}.`;i++;return true};
    if(reduce){while(next());return}
    const fast=Math.max(260,Math.min(800,5200/n));later(()=>{const t=every(()=>{if(!next())clearInterval(t)},fast)},400);
  }
  // 6. Presidente
  S.push({t:'Y el Congreso elige presidente',dur:11000,
    p:`Con 350 diputados, la <b>mayoría absoluta son 176</b>. En la investidura, primera votación: hacen falta 176 síes. Si no, segunda votación, 48 horas después: basta con <b>más síes que noes</b>. Si en dos meses nadie lo logra, <b>nuevas elecciones</b>. Reparto inventado, solo para ver la regla.`,
    go(){let s='';const x0=14,w=392,X=v=>x0+v/350*w,seg=(a,b,c,d)=>`<g class="grow" style="animation-delay:${d}s"><rect x="${X(a)}" y="__Y__" width="${X(b)-X(a)-1}" height="26" rx="4" fill="${c}"/></g>`;
      const row=(y,parts,d)=>parts.map(([a,b,c],i)=>seg(a,b,c,d+i*.25).replace('__Y__',y)).join('');
      s+=T(W,18,'ejemplo inventado',{a:'end',c:'cmbig fade',s:'animation-delay:.2s'});
      s+=T(x0,46,'1.ª votación',{a:'start',c:'cml',s:'fill:var(--fg)'});
      s+=row(56,[[0,165,LC[0]],[165,315,LC[1]],[315,350,'var(--reg)']],.4);
      s+=`<line x1="${X(176)}" x2="${X(176)}" y1="50" y2="92" stroke="var(--fg)" stroke-dasharray="3 3"/>${T(X(176)+4,100,'176',{a:'start',s:'fill:var(--fg);font-weight:700'})}`;
      s+=`<g class="fade" style="animation-delay:1.6s">${T(X(82),104,'165 síes',{s:'fill:var(--fg)'})}${T(X(240),104,'150 noes',{s:'fill:var(--fg)'})}${T(210,126,'165 no llega a 176: no sale',{s:'fill:var(--bad);font-weight:700'})}</g>`;
      s+=`<g class="fade" style="animation-delay:3.2s">${T(210,152,'48 horas después…',{c:'cmbig'})}</g>`;
      s+=`<g class="fade" style="animation-delay:3.6s">${T(x0,180,'2.ª votación',{a:'start',c:'cml',s:'fill:var(--fg)'})}</g>`;
      s+=row(190,[[0,165,LC[0]],[165,315,LC[1]],[315,350,'var(--reg)']],3.8);
      s+=`<g class="fade" style="animation-delay:5.2s">${T(X(82),234,'165 síes',{s:'fill:var(--fg)'})}${T(X(240),234,'150 noes',{s:'fill:var(--fg)'})}${T(X(332),234,'35 abst.',{s:'fill:var(--fg)'})}${T(210,260,'165 > 150: más síes que noes, sale',{s:'fill:var(--good);font-weight:700'})}</g>`;
      s+=`<g class="fade" style="animation-delay:6.4s">${T(210,284,'Si nadie lo logra en dos meses: nuevas elecciones',{s:'fill:var(--muted)'})}</g>`;
      return svg(s,'Primera votación de investidura que no alcanza 176 y segunda con más síes que noes')}});

  const labels=['Colegio','Papeletas','Urna','Qué cuenta','Escaños','Presidente'];
  el.innerHTML=`<div class="cmh1"><h3 class="kh">Así se vota</h3><span class="cmsub">Seis pasos, con ejemplos inventados</span></div>
    <div class="cmnav" role="tablist" aria-label="Pasos">${labels.map((l,i)=>`<button type="button" role="tab" data-s="${i}"><b>${i+1}</b><span>${l}</span></button>`).join('')}</div>
    <div class="cmprog" aria-hidden="true"><i id="cmprog"></i></div>
    <div class="cmstage" id="cmstage"></div>
    <div class="cmcap" aria-live="polite"><h4 id="cmt"></h4><p id="cmp"></p></div>
    <div class="cmctl"><button type="button" id="cmprev">‹ Anterior</button><button type="button" id="cmplay" aria-pressed="false">▶ Reproducir</button><button type="button" id="cmnext">Siguiente ›</button></div>
    <p class="cmfoot">Los números de este dibujo son inventados para que se vea la regla. Fuentes: Ley Orgánica del Régimen Electoral General y Constitución (art. 99). La previsión real está en <a href="prediccion.html">Predicción</a>.</p>`;
  function show(i){
    clear();step=Math.max(0,Math.min(S.length-1,i));const s=S[step];
    $('cmstage').innerHTML=s.go();$('cmt').textContent=`${step+1} · ${s.t}`;$('cmp').innerHTML=s.p;
    el.querySelectorAll('.cmnav button').forEach((b,j)=>{b.setAttribute('aria-selected',String(j===step));b.classList.toggle('on',j<=step)});
    $('cmprev').disabled=step===0;$('cmnext').disabled=step===S.length-1;
    const pr=$('cmprog');pr.style.transition='none';pr.style.width='0';
    if(s.after)s.after();
    if(auto&&!reduce){const dur=s.dur||(step===4?SEL[dem][0]*Math.max(260,Math.min(800,5200/SEL[dem][0]))+4500:8000);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{pr.style.transition=`width ${dur}ms linear`;pr.style.width='100%'}));
      later(()=>{if(step<S.length-1)show(step+1);else setAuto(false)},dur)}
  }
  function setAuto(v){auto=v;const b=$('cmplay');b.textContent=v?'⏸ Pausa':'▶ Reproducir';b.setAttribute('aria-pressed',String(v));if(!v){clear();const pr=$('cmprog');pr.style.transition='none';pr.style.width='0';if(step===4)runDh()}}
  el.addEventListener('click',e=>{
    const nb=e.target.closest('.cmnav button');if(nb){setAuto(false);show(+nb.dataset.s);return}
    const db=e.target.closest('[data-d]');if(db){dem=+db.dataset.d;el.querySelectorAll('[data-d]').forEach(b=>b.setAttribute('aria-pressed',String(b===db)));clear();auto=false;$('cmplay').textContent='▶ Reproducir';runDh();return}
    if(e.target.id==='cmprev'){setAuto(false);show(step-1)}
    else if(e.target.id==='cmnext'){setAuto(false);show(step+1)}
    else if(e.target.id==='cmplay'){if(auto){setAuto(false)}else{auto=true;$('cmplay').textContent='⏸ Pausa';$('cmplay').setAttribute('aria-pressed','true');show(step===S.length-1?0:step)}}
  });
  show(0);
  if('IntersectionObserver' in window&&!reduce){new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting&&!seen){seen=true;ob.disconnect();auto=true;$('cmplay').textContent='⏸ Pausa';$('cmplay').setAttribute('aria-pressed','true');show(0)}},{threshold:.5}).observe(el)}
})();
