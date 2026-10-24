/* «Cómo se hace la previsión»: explicación animada, paso a paso, con los datos reales de la última ejecución del modelo (PRED). */
(function(){
  const el=document.getElementById('pcomo');
  if(!el||typeof PRED==='undefined')return;
  const E=PRED.escPrivadas;if(!E||!E.sims||!E.demo)return;
  const K=[['PP','PP','var(--pp)'],['PSOE','PSOE','var(--psoe)'],['VOX','Vox','var(--vox)'],['SUMAR','Sumar + Podemos','var(--sumar)']];
  const NM={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar',POD:'Podemos',ERC:'ERC',JUNTS:'Junts',BILDU:'EH Bildu',PNV:'PNV',BNG:'BNG',CCa:'CC',UPN:'UPN'};
  const COL={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)',POD:'#7b3f98'};
  const nf=(x,d=1)=>Number(x).toFixed(d).replace('.',',');
  const sg=x=>(x>0?'+':x<0?'−':'±')+nf(Math.abs(x));
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pol=Object.fromEntries(K.map(([k])=>[k,PRED.privadas.map(p=>p[k])]));
  const base=PRED.base.priv,dl=PRED.sesgo.delta,fin=E.votoFin,n=PRED.privadas.length;
  const dias=Math.max(1,Math.round((Date.UTC(2026,10,29)-Date.UTC(...PRED.generado.split('-').map((x,i)=>i==1?x-1:+x)))/864e5));
  const REF=0.161;
  const sdv=k=>{const v=pol[k],m=v.reduce((a,b)=>a+b,0)/v.length,s0=Math.sqrt(v.reduce((a,b)=>a+(b-m)**2,0)/(v.length-1))/Math.sqrt(v.length),p=fin[k]/100,f=p*(1-p)/REF;
    return Math.sqrt(s0*s0+(PRED.sdDeriva40**2*dias/40+PRED.sdError**2)*f*f)};
  let step=0,tm=[],auto=false,seen=false,dem=1;
  const clear=()=>{tm.forEach(t=>{clearTimeout(t);clearInterval(t)});tm=[]};
  const later=(f,ms)=>{const t=setTimeout(f,ms);tm.push(t);return t};
  const every=(f,ms)=>{const t=setInterval(f,ms);tm.push(t);return t};

  // ---- eje de voto común a los pasos 1-3
  const W=420,H=300,X=v=>100+v/36*304,RY=i=>56+i*62;
  const axis=()=>{let s='';[0,10,20,30].forEach(v=>{s+=`<line x1="${X(v)}" x2="${X(v)}" y1="22" y2="272" stroke="var(--line)" stroke-dasharray="2 4"/><text x="${X(v)}" y="292" text-anchor="middle">${v} %</text>`});
    K.forEach(([k,nm,c],i)=>{s+=`<text x="0" y="${RY(i)+4}" class="cml" style="fill:${c}">${nm.replace(' + ','+')}</text><line x1="${X(0)}" x2="${X(36)}" y1="${RY(i)}" y2="${RY(i)}" stroke="var(--line)"/>`});return s};
  const dotsY=(k,i)=>{const o=pol[k].map((v,j)=>[v,j]).sort((a,b)=>a[0]-b[0]),y={};o.forEach(([v,j],r)=>y[j]=RY(i)+((r%3)-1)*7.5);return y};
  const svg=(inner,lab)=>`<svg class="cmsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${lab}">${inner}</svg>`;

  const S=[];
  // 1. Encuestas
  S.push({t:'Reunimos las encuestas',p:`Cogemos la <b>última encuesta de cada empresa</b> de los últimos 30 días. Hoy son <b>${n}</b>. Cada punto del dibujo es una encuesta, y cada fila, un partido.`,
    dur:5500,go(){let s=axis();K.forEach(([k,,c],i)=>{const y=dotsY(k,i);pol[k].forEach((v,j)=>{s+=`<circle class="cmd drop" cx="${X(v)}" cy="${y[j]}" r="4.3" style="fill:${c};animation-delay:${(j*0.07+i*0.18).toFixed(2)}s"/>`})});
      s+=`<text x="${W}" y="14" text-anchor="end" class="cmbig fade" style="animation-delay:1.6s">${n} encuestas</text>`;return svg(s,`Las ${n} encuestas, un punto cada una, por partido`)}});
  // 2. Media y corrección
  S.push({t:'Hacemos la media y la corregimos',p:`Promediamos las ${n} (los puntos se juntan en el centro). Después sumamos lo que las encuestas <b>se equivocaron de media</b> en abril y noviembre de 2019 y en 2023: PSOE ${sg(dl.PSOE)}, PP ${sg(dl.PP)}, Vox ${sg(dl.VOX)}. Casi siempre se equivocaron hacia el mismo lado.`,
    dur:8000,go(){let s=axis();K.forEach(([k,,c],i)=>{const y=dotsY(k,i),m=base[k],f=fin[k];
        pol[k].forEach((v,j)=>{s+=`<circle class="cmd mv" cx="${X(v)}" cy="${y[j]}" r="4.3" style="fill:${c};--tx:${(X(m)-X(v)).toFixed(1)}px;--ty:${(RY(i)-y[j]).toFixed(1)}px"/>`});
        s+=`<g class="fade" style="animation-delay:1.5s"><rect x="${X(m)-1.5}" y="${RY(i)-17}" width="3" height="34" rx="1.5" fill="${c}" opacity=".35"/><text x="${X(m)}" y="${RY(i)-21}" text-anchor="middle" class="cmv" style="fill:var(--muted)">${nf(m)}</text></g>`;
        s+=`<g class="slide" style="--tx:${(X(f)-X(m)).toFixed(1)}px;animation-delay:3.2s"><rect x="${X(m)-2.5}" y="${RY(i)-17}" width="5" height="34" rx="2.5" fill="${c}"/><text x="${X(m)}" y="${RY(i)+34}" text-anchor="middle" class="cmv" style="fill:var(--fg);font-weight:800">${nf(f)}</text></g>`});
      s+=`<text x="${W}" y="14" text-anchor="end" class="cmbig fade" style="animation-delay:1.5s">media</text>`;return svg(s,'Los puntos se juntan en la media y esta se corrige con el error histórico')},
    tick(){}});
  // 3. Margen de error
  S.push({t:'Medimos cuánto nos podemos equivocar',p:`Las encuestas fallan, y casi siempre todas a la vez. Por eso no damos una cifra sola: dibujamos una <b>campana</b> con lo más probable en el centro y una <b>franja del 80 %</b> alrededor. Recoge el error típico de 2019 y 2023 (±${nf(PRED.sdError)} puntos) y que la opinión puede moverse hasta el 29-N.`,
    dur:6500,go(){let s=axis();const sd=K.map(([k])=>sdv(k)),mn=Math.min(...sd),hh=i=>46*mn/sd[i];
      K.forEach(([k,,c],i)=>{const m=fin[k],sg_=sd[i],h=hh(i),pts=[];for(let v=Math.max(0,m-3.6*sg_);v<=m+3.6*sg_;v+=sg_/6){pts.push([v,Math.exp(-0.5*((v-m)/sg_)**2)*h])}
        const lo=m-1.2816*sg_,hi=m+1.2816*sg_,inb=pts.filter(p=>p[0]>=lo&&p[0]<=hi);
        const path=(a,cl)=>'M'+X(a[0][0]).toFixed(1)+','+RY(i)+' L'+a.map(p=>X(p[0]).toFixed(1)+','+(RY(i)-p[1]).toFixed(1)).join(' L')+' L'+X(a[a.length-1][0]).toFixed(1)+','+RY(i)+(cl?'Z':'');
        s+=`<g class="grow" style="animation-delay:${i*0.25}s"><path d="${path(inb,1)}" fill="${c}" opacity=".30"/><path d="${path(pts,0)}" fill="none" stroke="${c}" stroke-width="2"/></g>`;
        s+=`<g class="fade" style="animation-delay:${1.4+i*0.2}s"><line x1="${X(m)}" x2="${X(m)}" y1="${RY(i)-h-3}" y2="${RY(i)+6}" stroke="${c}" stroke-width="2.5"/><text x="${X(m)}" y="${RY(i)+19}" class="cmv" text-anchor="middle" style="fill:var(--fg)">${nf(lo)}–${nf(hi)}</text></g>`});
      s+=`<text x="${W}" y="14" text-anchor="end" class="cmbig fade" style="animation-delay:1.4s">franja del 80 %</text>`;return svg(s,'Campana de incertidumbre y franja del 80 % por partido')}});
  // 4. Escaños por provincia (D'Hondt)
  S.push({t:'Convertimos votos en escaños',p:`España tiene 52 circunscripciones y en cada una los escaños se reparten con la regla <b>D’Hondt</b>: cada escaño va al partido con el <b>cociente</b> más alto, y ese cociente es sus votos entre (escaños que ya tiene + 1). Elige una provincia y míralo escaño a escaño.`,
    dur:null,go(){return `<div class="cmdh"><div class="cmsel" role="group" aria-label="Provincia">${E.demo.map((d,i)=>`<button type="button" data-d="${i}" aria-pressed="${i===dem}">${d.n}</button>`).join('')}</div><div id="cmdh"></div></div>`},
    after(){runDh()}});
  // 5. Simulaciones
  S.push({t:'Repetimos 4.000 elecciones posibles',p:`Sorteamos 4.000 resultados dentro de esas campanas y repartimos los 350 escaños de cada uno. Arriba, algunas simulaciones; abajo, cada punto es una simulación de <b>PP + Vox</b> (mostramos 300 de las 4.000). Se agrupan, pero se abren.`,
    dur:9500,go(){return `<svg class="cmsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Simulaciones de escaños de PP más Vox"><g id="cmpar"></g><g id="cmhist"></g></svg>`},
    after(){runSims()}});
  // 6. Resultado
  S.push({t:'Y esto es lo que sale',p:`Para cada partido, el <b>valor central</b> y el rango donde caen 8 de cada 10 simulaciones. PP + Vox: <b>${E.ppVox.c}</b> escaños (${E.ppVox.p10}–${E.ppVox.p90}); la mayoría absoluta está en 176. <b>No es una probabilidad:</b> es lo que dicen las encuestas de hoy con los errores de siempre.`,
    dur:7000,go(){const e=E.escanos,x=v=>100+v/150*304,x2=v=>100+(v-140)/100*304;let s='';
      K.forEach(([k,nm,c],i)=>{const r=e[k],y=44+i*40;s+=`<text x="0" y="${y+4}" class="cml" style="fill:${c}">${nm.replace(' + ','+')}</text><line x1="${x(0)}" x2="${x(150)}" y1="${y}" y2="${y}" stroke="var(--line)"/><g class="grow" style="animation-delay:${i*0.25}s"><rect x="${x(r.p10)}" y="${y-8}" width="${x(r.p90)-x(r.p10)}" height="16" rx="8" fill="${c}" opacity=".30"/></g><g class="fade" style="animation-delay:${0.5+i*0.25}s"><line x1="${x(r.c)}" x2="${x(r.c)}" y1="${y-11}" y2="${y+11}" stroke="${c}" stroke-width="3.5"/><text x="${x(r.c)}" y="${y-14}" text-anchor="middle" class="cmv" style="fill:var(--fg);font-weight:800">${r.c}</text><text x="${x(r.p90)+70>W?x(r.p10)-6:x(r.p90)+6}" y="${y+4}" text-anchor="${x(r.p90)+70>W?'end':'start'}" class="cmv">${r.p10}–${r.p90}</text></g>`});
      const y=232,pv=E.ppVox;s+=`<text x="0" y="${y+4}" class="cml" style="fill:var(--fg)">PP+Vox</text><line x1="${x2(140)}" x2="${x2(240)}" y1="${y}" y2="${y}" stroke="var(--line)"/>`;
      [150,175,200,225].forEach(v=>s+=`<text x="${x2(v)}" y="292" text-anchor="middle" class="cmv">${v}</text>`);
      s+=`<line x1="${x2(176)}" x2="${x2(176)}" y1="${y-26}" y2="${y+20}" stroke="var(--fg)" stroke-dasharray="3 3"/><text x="${x2(176)-5}" y="${y-30}" text-anchor="end" class="cmv" style="fill:var(--fg);font-weight:700">mayoría 176</text>`;
      s+=`<g class="grow" style="animation-delay:1.3s"><rect x="${x2(pv.p10)}" y="${y-9}" width="${x2(pv.p90)-x2(pv.p10)}" height="18" rx="9" fill="var(--fg)" opacity=".18"/></g><g class="fade" style="animation-delay:1.8s"><line x1="${x2(pv.c)}" x2="${x2(pv.c)}" y1="${y-12}" y2="${y+12}" stroke="var(--fg)" stroke-width="3.5"/><text x="${x2(pv.c)}" y="${y+30}" text-anchor="middle" class="cmv" style="fill:var(--fg);font-weight:800">${pv.c} (${pv.p10}–${pv.p90})</text></g>`;
      s+=`<text x="${x(0)}" y="${28-24}" class="cmv" style="opacity:0">.</text><text x="${W}" y="14" text-anchor="end" class="cmbig fade" style="animation-delay:.3s">escaños el 29‑N</text>`;
      return svg(s,'Escaños esperados por partido con su rango del 80 %')}});

  // ---- D'Hondt paso a paso
  function dhondt(d){const P=Object.keys(d.sh).filter(k=>d.sh[k]>=3),st={};P.forEach(k=>st[k]=0);const seq=[];
    for(let i=0;i<d.s;i++){let b=null,bv=-1;P.forEach(k=>{const q=d.sh[k]/(st[k]+1);if(q>bv){bv=q;b=k}});st[b]++;seq.push({k:b,q:bv})}return {P,seq}}
  function runDh(){
    const box=document.getElementById('cmdh');if(!box)return;const d=E.demo[dem],{P,seq}=dhondt(d);
    P.sort((a,b)=>d.sh[b]-d.sh[a]);
    const cnt={};P.forEach(k=>cnt[k]=0);
    box.innerHTML=`<div class="cmdt"><b>${d.n}</b> · ${d.s} escaños · proyección del 29‑N</div>
      <div class="cmseats" aria-hidden="true">${Array.from({length:d.s},(_,i)=>`<i data-i="${i}"></i>`).join('')}</div>
      <div class="cmrows">${P.map(k=>`<div class="cmr" data-k="${k}"><span class="cmn" style="color:${COL[k]||'var(--reg)'}">${NM[k]||k}</span><span class="cmb"><i style="width:${Math.min(100,d.sh[k]/0.5*1)}%;background:${COL[k]||'var(--reg)'}"></i></span><span class="cmp">${nf(d.sh[k])} %</span><span class="cmq" data-q>${nf(d.sh[k])}</span><span class="cms2" data-s>0</span></div>`).join('')}
      <div class="cmh"><span></span><span></span><span>voto</span><span>cociente</span><span>esc.</span></div></div>
      <p class="cmmsg" id="cmmsg" aria-live="polite">Empezamos: cada partido tiene su porcentaje como primer cociente.</p>`;
    const seatEls=box.querySelectorAll('.cmseats i'),rows={};box.querySelectorAll('.cmr').forEach(r=>rows[r.dataset.k]=r);
    const msg=document.getElementById('cmmsg');let i=0;
    const fast=Math.max(110,Math.min(700,5200/d.s));
    const next=()=>{if(i>=seq.length){const tot=P.filter(k=>cnt[k]).map(k=>`${NM[k]} ${cnt[k]}`).join(' · ');msg.innerHTML=`<b>Reparto de ${d.n}:</b> ${tot}.`;box.classList.add('done');return false}
      const {k,q}=seq[i];cnt[k]++;seatEls[i].style.background=COL[k]||'var(--reg)';seatEls[i].classList.add('on');
      Object.values(rows).forEach(r=>r.classList.remove('win'));rows[k].classList.add('win');
      rows[k].querySelector('[data-s]').textContent=cnt[k];
      P.forEach(kk=>rows[kk].querySelector('[data-q]').textContent=nf(d.sh[kk]/(cnt[kk]+1)));
      msg.innerHTML=`Escaño <b>${i+1}</b> de ${d.s}: para <b style="color:${COL[k]||'var(--reg)'}">${NM[k]||k}</b>, cociente más alto (${nf(q)}). Su cociente baja: ahora ${nf(d.sh[k])} ÷ ${cnt[k]+1}.`;i++;return true};
    if(reduce){while(next());return}
    later(()=>{const t=every(()=>{if(!next())clearInterval(t)},fast)},500);
  }
  // ---- simulaciones
  function runSims(){
    const par=document.getElementById('cmpar'),hist=document.getElementById('cmhist');if(!par)return;const sims=E.sims;
    const seg=[['PP','var(--pp)'],['VOX','var(--vox)'],['SUMAR','var(--sumar)'],['PSOE','var(--psoe)']];
    // orden: PP, Vox | resto | Sumar, PSOE (izquierda a derecha), la línea 176 marca la mayoría
    const bx=14,bw=W-28,bar=s=>{const v={PP:s[0],PSOE:s[1],VOX:s[2],SUMAR:s[3]},o=350-s[0]-s[1]-s[2]-s[3];let x=bx,h='';
      [['PP','var(--pp)',v.PP],['VOX','var(--vox)',v.VOX],['OTR','var(--reg)',o],['SUMAR','var(--sumar)',v.SUMAR],['PSOE','var(--psoe)',v.PSOE]].forEach(([k,c,n])=>{const w=n/350*bw;h+=`<rect x="${x.toFixed(1)}" y="34" width="${w.toFixed(1)}" height="26" fill="${c}"/>`;x+=w});
      return h+`<line x1="${bx+176/350*bw}" x2="${bx+176/350*bw}" y1="28" y2="66" stroke="var(--fg)" stroke-width="2" stroke-dasharray="3 3"/>`};
    const head=(i,pv)=>`<text x="${bx}" y="18" class="cmv" style="fill:var(--fg);font-weight:700">Simulación ${i+1} de 4.000 · PP + Vox ${pv}</text><text x="${bx+176/350*bw+4}" y="78" class="cmv" style="fill:var(--fg)">176</text><text x="${bx}" y="78" class="cmv">PP · Vox</text><text x="${W-bx}" y="78" text-anchor="end" class="cmv">Sumar · PSOE</text>`;
    const lo=150,hi=230,hx=v=>20+(v-lo)/(hi-lo)*(W-40),by=268,step=5.4,cntBin={};
    let dots='';const base_=`<line x1="20" x2="${W-20}" y1="${by+4}" y2="${by+4}" stroke="var(--line)"/>`+[150,175,200,225].map(v=>`<text x="${hx(v)}" y="290" text-anchor="middle" class="cmv">${v}</text>`).join('')+`<line x1="${hx(176)}" x2="${hx(176)}" y1="102" y2="${by+4}" stroke="var(--fg)" stroke-dasharray="3 3"/>`;
    const pvs=sims.map(s=>s[0]+s[2]);
    const draw=(i,showBar)=>{par.innerHTML=(showBar?bar(sims[i])+head(i,pvs[i]):'')};
    const addDot=i=>{const v=pvs[i],b=Math.round((v-lo)/2);cntBin[b]=(cntBin[b]||0)+1;dots+=`<circle class="cmd pop" cx="${(hx(lo+b*2)).toFixed(1)}" cy="${(by-2.8-(cntBin[b]-1)*step).toFixed(1)}" r="2.6" style="fill:var(--fg);opacity:.75"/>`;hist.innerHTML=base_+dots};
    hist.innerHTML=base_;
    const fin_=()=>{const q=PRED.escPrivadas.ppVox;par.innerHTML=`<text x="${bx}" y="18" class="cmv" style="fill:var(--fg);font-weight:700">Rango del 80 %: PP + Vox entre ${q.p10} y ${q.p90} escaños</text>`;
      hist.innerHTML=base_+dots+`<rect x="${hx(q.p10)}" y="96" width="${hx(q.p90)-hx(q.p10)}" height="${by-96}" fill="var(--fg)" opacity=".08"/><line x1="${hx(q.p10)}" x2="${hx(q.p10)}" y1="96" y2="${by+4}" stroke="var(--fg)" opacity=".5"/><line x1="${hx(q.p90)}" x2="${hx(q.p90)}" y1="96" y2="${by+4}" stroke="var(--fg)" opacity=".5"/>`};
    if(reduce){for(let i=0;i<sims.length;i++)addDot(i);fin_();return}
    let j=0;const tick=()=>{if(j>=sims.length){fin_();return}
      const slow=j<14,burst=slow?1:8;draw(Math.min(j,sims.length-1),true);
      for(let b=0;b<burst&&j<sims.length;b++){addDot(j);j++}
      later(tick,slow?230:55)};
    later(tick,300);
  }

  // ---- estructura y navegación
  const labels=['Encuestas','Media','Error','Provincias','Simulaciones','Resultado'];
  el.innerHTML=`<div class="cmh1"><h3 class="kh">Así se hace la previsión</h3><span class="cmsub">Seis pasos, con los datos de hoy</span></div>
    <div class="cmnav" role="tablist" aria-label="Pasos">${labels.map((l,i)=>`<button type="button" role="tab" data-s="${i}"><b>${i+1}</b><span>${l}</span></button>`).join('')}</div>
    <div class="cmprog" aria-hidden="true"><i id="cmprog"></i></div>
    <div class="cmstage" id="cmstage"></div>
    <div class="cmcap" aria-live="polite"><h4 id="cmt"></h4><p id="cmp"></p></div>
    <div class="cmctl"><button type="button" id="cmprev">‹ Anterior</button><button type="button" id="cmplay" aria-pressed="false">▶ Reproducir</button><button type="button" id="cmnext">Siguiente ›</button></div>
    <p class="cmfoot">Hemos probado también a dar más peso a las empresas que acertaron en 2019 y 2023 y a repartir el cambio de voto de forma distinta en cada provincia. Con los datos de esas elecciones no mejoraba el acierto, así que no se usa. <a href="metodo.html">Método completo</a></p>`;
  const $=id=>document.getElementById(id);
  function show(i,keepAuto){
    clear();step=Math.max(0,Math.min(S.length-1,i));const s=S[step];
    $('cmstage').innerHTML=s.go();$('cmt').textContent=`${step+1} · ${s.t}`;$('cmp').innerHTML=s.p;
    el.querySelectorAll('.cmnav button').forEach((b,j)=>{b.setAttribute('aria-selected',String(j===step));b.classList.toggle('on',j<=step)});
    $('cmprev').disabled=step===0;$('cmnext').disabled=step===S.length-1;
    const pr=$('cmprog');pr.style.transition='none';pr.style.width='0';
    if(s.after)s.after();
    if(auto&&!reduce){const dur=s.dur||(step===3?Math.max(5200,E.demo[dem].s*Math.max(110,Math.min(700,5200/E.demo[dem].s))+3500):7000);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{pr.style.transition=`width ${dur}ms linear`;pr.style.width='100%'}));
      later(()=>{if(step<S.length-1)show(step+1);else setAuto(false)},dur)}
  }
  function setAuto(v){auto=v;const b=$('cmplay');b.textContent=v?'⏸ Pausa':'▶ Reproducir';b.setAttribute('aria-pressed',String(v));if(!v){clear();const pr=$('cmprog');pr.style.transition='none';pr.style.width='0';if(S[step].after&&step!==3)S[step].after();else if(step===3)runDh()}}
  el.addEventListener('click',e=>{
    const nb=e.target.closest('.cmnav button');if(nb){auto=false;setAuto(false);show(+nb.dataset.s);return}
    const db=e.target.closest('[data-d]');if(db){dem=+db.dataset.d;el.querySelectorAll('[data-d]').forEach(b=>b.setAttribute('aria-pressed',String(b===db)));clear();auto=false;$('cmplay').textContent='▶ Reproducir';runDh();return}
    if(e.target.id==='cmprev'){setAuto(false);show(step-1)}
    else if(e.target.id==='cmnext'){setAuto(false);show(step+1)}
    else if(e.target.id==='cmplay'){if(auto){setAuto(false)}else{auto=true;$('cmplay').textContent='⏸ Pausa';$('cmplay').setAttribute('aria-pressed','true');show(step===S.length-1?0:step)}}
  });
  show(0);
  if('IntersectionObserver' in window&&!reduce){new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting&&!seen){seen=true;ob.disconnect();auto=true;$('cmplay').textContent='⏸ Pausa';$('cmplay').setAttribute('aria-pressed','true');show(0)}},{threshold:.5}).observe(el)}
})();
