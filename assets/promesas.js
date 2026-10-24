/* ================= PROMESAS (render) ================= */
const ICON={g:'✓',m:'◐',b:'✕'},SNAME={g:'Cumplida',m:'Parcial',b:'Incumplida o contraria'};
let pf='all',sf='all',tf='all';
function counts(k){return ['g','m','b'].map(s=>PROM.filter(x=>x.k===k&&x.s===s).length)}
function renderSem(){
  const rows=[['pp','PP','Gobierno 2011–2018','Rajoy'],['psoe','PSOE','Gobierno 2018–2026','Sánchez'],['sumar','Sumar','Coalición 2023–2026','Muestra pequeña'],['podemos','Podemos','Coalición 2020–2023','Muestra pequeña']];
  document.getElementById('sem').innerHTML=rows.map(([k,n,sub])=>{
    const c=counts(k),tot=c[0]+c[1]+c[2];
    return `<div class="sr2"><div class="nm" style="color:${PCOL[k][1]}">${n}<small>${sub}</small></div><div class="sbar" role="group" aria-label="${n}: ${c[0]} cumplidas, ${c[1]} parciales, ${c[2]} incumplidas">${['g','m','b'].map((s,i)=>c[i]?`<button type="button" class="${s}" style="--w:${c[i]/tot*100}%" data-go="${k}|${s}" title="${SNAME[s]}: ${c[i]}">${c[i]}</button>`:'').join('')}</div><div class="sn">${tot} promesas documentadas</div></div>`;
  }).join('')+`<div class="sr2"><div class="nm">Vox<small>Sin Gobierno nacional</small></div><div class="sbar none">Nada que medir en el Gobierno de España</div><div class="sn">También ERC, Junts, EH Bildu, PNV y el resto.</div></div>`;
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{const [k,s]=b.dataset.go.split('|');pf=k;sf=s;tf='all';renderPF();renderCards();go('d_cum')}));
}
function renderPF(){
  document.getElementById('pf').innerHTML='<b>Partido</b>'+chipBtn('data-pf','all','Todos',pf==='all')+Object.keys(PCOL).map(k=>chipBtn('data-pf',k,PCOL[k][0],pf===k)).join('');
  document.getElementById('sf').innerHTML='<b>Estado</b>'+chipBtn('data-sf','all','Todos',sf==='all')+['g','m','b'].map(s=>chipBtn('data-sf',s,`${ICON[s]} ${SNAME[s]}`,sf===s)).join('');
  document.getElementById('tf').innerHTML='<b>Tema</b>'+chipBtn('data-tf','all','Todos',tf==='all')+TEMAS.map(t=>chipBtn('data-tf',t,t,tf===t)).join('');
  document.querySelectorAll('[data-tf]').forEach(b=>b.addEventListener('click',()=>{tf=b.dataset.tf;renderPF();renderCards()}));
  document.querySelectorAll('[data-pf]').forEach(b=>b.addEventListener('click',()=>{pf=b.dataset.pf;renderPF();renderCards()}));
  document.querySelectorAll('[data-sf]').forEach(b=>b.addEventListener('click',()=>{sf=b.dataset.sf;renderPF();renderCards()}));
}
function renderCards(){
  const arr=PROM.filter(x=>(pf==='all'||x.k===pf)&&(sf==='all'||x.s===sf)&&(tf==='all'||x.tm===tf));
  document.getElementById('cg').innerHTML=arr.length?arr.map(x=>`<article class="pc"><span class="st ${x.s}" aria-hidden="true">${ICON[x.s]}</span><div><span class="pt" style="background:${PCOL[x.k][1]}">${PCOL[x.k][0]}</span> <span class="pt" style="background:var(--muted)">${esc(x.tm)}</span><h3>${esc(x.t)} <span style="position:absolute;left:-9999px">(${SNAME[x.s]})</span></h3></div><p><span class="lab">Prometió</span><br>${esc(x.p)}</p><p><span class="lab">Hizo</span><br>${esc(x.h)}</p><p class="srcs">Fuentes: ${x.f.map(f=>A(f[0],f[1])).join('')}</p></article>`).join(''):'<p class="note">Ninguna con ese filtro.</p>';
  if(window.rvReady)rvScan();
}
renderSem();renderPF();renderCards();

