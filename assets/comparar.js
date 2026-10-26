/* ================= COMPARAR DOS COALICIONES (render) ================= */
const CMP_COLS=['PP','PSOE','VOX','SUMAR','PODEMOS','ERC','JUNTS','PNV','BILDU'];
const CP=PARTS.map(p=>({k:p[0],n:p[1],c:p[2]}));
const cpOf=k=>CP.find(p=>p.k===k);
const IDX=Object.fromEntries(CMP_COLS.map((k,i)=>[k,i]));
const SYM={y:'✓',n:'✕',p:'◐',q:'–'};
const NAME={y:'propone',n:'se opone o propone lo contrario',p:'matizado o con divergencias dentro de la coalición',q:'sin posición concreta en las fuentes'};
const SHORT=k=>cpOf(k).n.replace(' / Frente Amplio','').replace('EH Bildu','Bildu');
const PRE=[['PP + Vox',['PP','VOX']],['PSOE + Sumar + Podemos',['PSOE','SUMAR','PODEMOS']],['PSOE + Sumar + Podemos + ERC, Junts, Bildu y PNV (socios de 2023)',['PSOE','SUMAR','PODEMOS','ERC','JUNTS','BILDU','PNV']]];
let selA=['PP','VOX'],selB=['PSOE','SUMAR','PODEMOS'],open_=null;
(function(){const h=(location.hash||'').replace('#','').split('-');if(h.length===2){const a=h[0].split('.'),b=h[1].split('.');
  if([...a,...b].every(k=>IDX[k]!=null)&&!a.some(k=>b.includes(k))&&a.length&&b.length){selA=a;selB=b}}})();
const same=(a,b)=>a.length===b.length&&a.every(k=>b.includes(k));
const label=s=>s.map(SHORT).join(' + ');
const sideColor=(s,i)=>s.length===1?cpOf(s[0]).c:(i?'#8b95a5':'#475569');
function agg(m,s){const v=s.map(k=>m.v[IDX[k]]).filter(x=>x!=='q');if(!v.length)return 'q';return v.every(x=>x===v[0])?v[0]:'p'}
function rel(a,b){
  if(a==='q'&&b==='q')return null;
  if(a==='q')return 'B';if(b==='q')return 'A';
  if(a==='p'||b==='p')return 'part';
  return a===b?'co':'op';
}
const head=t=>{const x=String(t).split(/;| \(/)[0].trim();return x.length>110?x.slice(0,107).replace(/\s+\S*$/,'')+'…':x};
function srcTxt(k,t){const x=PROP[k][t];
  if(!x)return '<span class="na">Sin posición concreta en las fuentes consultadas.</span>';
  return `<div class="o">Origen: ${esc(x.o)}</div><div class="ms">Fuentes: ${x.f.map(f=>A(S[f][0],S[f][1])).join('')}</div>`}
const modeOf=sel=>PRE.findIndex(p=>same(p[1],sel));   // atajo activo: -1 si es una selección propia
let custom={A:false,B:false};
function pickers(){
  const mk=(id,lab,sel,other,side)=>{const m=custom[side]?-1:modeOf(sel),lock=m>=0;
    return `<div class="cside"><div class="rowf pre" id="${id}p"><b>${lab}</b>`+
      PRE.map((p,i)=>`<button type="button" data-${id}p="${i}" aria-pressed="${m===i}" ${p[1].some(k=>other.includes(k))?'disabled':''}>${esc(p[0])}</button>`).join('')+
      `<button type="button" data-${id}p="-1" aria-pressed="${m<0}">Personalizada</button></div>`+
      `<div class="rowf" id="${id}">`+CP.map(p=>`<button type="button" data-${id}="${p.k}" aria-pressed="${sel.includes(p.k)}" ${other.includes(p.k)||lock?'disabled':''} style="--c:${p.c}">${esc(SHORT(p.k))}</button>`).join('')+'</div>'+
      (lock?'<p class="clock">Coalición fija. Para cambiarla, elige «Personalizada».</p>':'')+'</div>'};
  document.getElementById('cpick').innerHTML=mk('pa','Coalición A',selA,selB,'A')+mk('pb','Coalición B',selB,selA,'B');
  const tog=(sel,k)=>sel.includes(k)?(sel.length>1?sel.filter(x=>x!==k):sel):[...sel,k];
  document.querySelectorAll('[data-pa]').forEach(b=>b.addEventListener('click',()=>{selA=tog(selA,b.dataset.pa);open_=null;draw()}));
  document.querySelectorAll('[data-pb]').forEach(b=>b.addEventListener('click',()=>{selB=tog(selB,b.dataset.pb);open_=null;draw()}));
  [['A','pap'],['B','pbp']].forEach(([side,id])=>document.querySelectorAll('[data-'+id+']').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset[id];if(i<0){custom[side]=true}else{custom[side]=false;if(side==='A')selA=PRE[i][1].slice();else selB=PRE[i][1].slice()}
    open_=null;draw()})));
}
function draw(){
  try{history.replaceState(null,'','#'+selA.join('.')+'-'+selB.join('.'))}catch(e){}
  pickers();
  const nA=label(selA),nB=label(selB),cA=sideColor(selA,0),cB=sideColor(selB,1),G={co:[],op:[],part:[],A:[],B:[]};let sin=0;
  CMP.forEach((m,i)=>{const r=rel(agg(m,selA),agg(m,selB));if(r)G[r].push(i);else sin++});
  const tot=CMP.length-sin;
  const seg=[['co','Coinciden',G.co.length,'var(--good)'],['part','En parte',G.part.length,'var(--mid)'],['op','Se oponen',G.op.length,'var(--bad)'],['A','Solo '+nA,G.A.length,cA],['B','Solo '+nB,G.B.length,cB]];
  document.getElementById('cbar').innerHTML=
   `<div class="cbh"><span>${esc(nA)}</span><span class="cvs">frente a</span><span>${esc(nB)}</span></div>`+
   `<div class="cb" role="img" aria-label="${seg.map(s=>s[1]+': '+s[2]).join('; ')}">`+seg.filter(s=>s[2]).map(s=>`<span style="flex:${s[2]};background:${s[3]}"><b>${s[2]}</b></span>`).join('')+'</div>'+
   `<div class="cleg">`+seg.map(s=>`<span><i style="background:${s[3]}"></i>${esc(s[1])} <b>${s[2]}</b></span>`).join('')+'</div>'+
   `<p class="cnote">${tot} de las ${CMP.length} medidas tienen posición concreta de alguna de las dos coaliciones; en ${sin} no hay dato. Si los partidos de una misma coalición difieren entre sí, la medida cuenta «en parte». <b>Cuenta medidas, no peso político</b>: no mide cercanía ideológica.</p>`;
  const groups=[['co','Coinciden','var(--good)'],['op','Se oponen','var(--bad)'],['part','En parte','var(--mid)'],['A','Solo '+nA+' tiene posición','var(--muted)'],['B','Solo '+nB+' tiene posición','var(--muted)']];
  const ppvox=same(selA,['PP','VOX'])||same(selB,['PP','VOX']);
  const lines=(i,s,c)=>s.filter(k=>CMPD[i][k]).map(k=>`<div class="cl" style="--c:${cpOf(k).c}"><b>${esc(SHORT(k))}</b><span>${esc(head(CMPD[i][k]))}</span></div>`).join('')||`<div class="cl none" style="--c:${c}"><b>${esc(label(s))}</b><span>Sin posición concreta en las fuentes.</span></div>`;
  document.getElementById('crows').innerHTML=groups.filter(g=>G[g[0]].length).map(([g,t,c])=>
    `<section class="cg"><h3><i style="background:${c}"></i>${esc(t)} <span>${G[g].length}</span></h3>`+
    G[g].map(i=>{const m=CMP[i],va=agg(m,selA),vb=agg(m,selB),on=open_===i;
      const nt=ppvox&&CMPN[i]&&CMPD[i].PP&&CMPD[i].VOX?`<div class="cdif"><b>PP y Vox</b> ${esc(CMPN[i])}</div>`:'';
      return `<div class="cr${on?' on':''}"><button type="button" class="crb" data-i="${i}" aria-expanded="${on}"><span class="cm"><small>${esc(TOPICS[m.t])}</small>${esc(m.m)}</span><span class="pv ${va}" title="${esc(nA)}: ${NAME[va]}">${SYM[va]}</span><span class="pv ${vb}" title="${esc(nB)}: ${NAME[vb]}">${SYM[vb]}</span></button>`+
       `<div class="cdt"><div class="cs" style="--c:${cA}"><small>${esc(nA)}</small>${lines(i,selA,cA)}</div><div class="cs" style="--c:${cB}"><small>${esc(nB)}</small>${lines(i,selB,cB)}</div>${nt}</div>`+
       `<button type="button" class="csrc" data-i="${i}">${on?'Ocultar':'Ver'} detalle y fuentes</button>`+
       (on?`<div class="cd">${[...selA,...selB].filter(k=>CMPD[i][k]).map(k=>`<div style="--c:${cpOf(k).c}"><b>${esc(SHORT(k))}</b>${esc(CMPD[i][k])}${srcTxt(k,m.t)}</div>`).join('')}</div>`:'')+'</div>'}).join('')+'</section>').join('');
  document.querySelectorAll('.crb,.csrc').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.i;open_=open_===i?null:i;draw()}));
  const inSel=k=>selA.includes(k)||selB.includes(k);
  document.getElementById('cmap').innerHTML='<thead><tr><th></th>'+CP.map(p=>`<th class="${inSel(p.k)?'hl':''}" style="--c:${p.c}">${esc(SHORT(p.k))}</th>`).join('')+'</tr></thead><tbody>'+
   TOPICS.map((tp,t)=>{const ms=CMP.filter(m=>m.t===t);if(!ms.length)return '';
     return `<tr class="th"><td colspan="${CP.length+1}">${esc(tp)}</td></tr>`+ms.map(m=>`<tr><td>${esc(m.m)}</td>${CP.map(p=>{const v=m.v[IDX[p.k]];return `<td class="${inSel(p.k)?'hl':''}"><span class="pv s ${v}" title="${esc(p.n)}: ${NAME[v]}">${SYM[v]}</span></td>`}).join('')}</tr>`).join('')}).join('')+'</tbody>';
  const el=document.getElementById('ctl');el.hidden=!ppvox;
  if(ppvox)el.querySelector('ol').innerHTML=PPVOX.map(x=>`<li><time>${esc(x.f)}</time><p>${esc(x.t)} <a href="${x.u}">${esc(x.s)}</a></p></li>`).join('');
  if(window.rvReady)rvScan();
}
draw();
