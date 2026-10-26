/* ================= COMPARAR DOS PARTIDOS (render) ================= */
const CMP_COLS=['PP','PSOE','VOX','SUMAR','PODEMOS','ERC','JUNTS','PNV','BILDU'];
const CP=PARTS.map(p=>({k:p[0],n:p[1],c:p[2]}));
const cpOf=k=>CP.find(p=>p.k===k);
const IDX=Object.fromEntries(CMP_COLS.map((k,i)=>[k,i]));
const SYM={y:'✓',n:'✕',p:'◐',q:'–'};
const NAME={y:'propone',n:'se opone o propone lo contrario',p:'matizado',q:'sin posición concreta en las fuentes'};
let selA='PP',selB='VOX',open_=null;
(function(){const h=(location.hash||'').replace('#','').split('-');if(h.length===2&&IDX[h[0]]!=null&&IDX[h[1]]!=null&&h[0]!==h[1]){selA=h[0];selB=h[1]}})();
const val=(m,k)=>m.v[IDX[k]];
function rel(a,b){
  if(a==='q'&&b==='q')return null;
  if(a==='q')return 'B';if(b==='q')return 'A';
  if(a==='p'||b==='p')return 'part';
  return a===b?'co':'op';
}
function cellTxt(k,t){const x=PROP[k][t];
  if(!x)return '<span class="na">Sin posición concreta en las fuentes consultadas.</span>';
  return esc(x.t)+`<div class="o">Origen: ${esc(x.o)}</div><div class="ms">Fuentes: ${x.f.map(f=>A(S[f][0],S[f][1])).join('')}</div>`}
function pickers(){
  const row=(id,lab,sel,other)=>`<div class="rowf" id="${id}"><b>${lab}</b>`+CP.map(p=>`<button type="button" data-${id}="${p.k}" aria-pressed="${p.k===sel}" ${p.k===other?'disabled':''} style="--c:${p.c}">${esc(p.n)}</button>`).join('')+'</div>';
  document.getElementById('cpick').innerHTML=row('pa','Partido A',selA,selB)+row('pb','Partido B',selB,selA);
  document.querySelectorAll('[data-pa]').forEach(b=>b.addEventListener('click',()=>{selA=b.dataset.pa;open_=null;draw()}));
  document.querySelectorAll('[data-pb]').forEach(b=>b.addEventListener('click',()=>{selB=b.dataset.pb;open_=null;draw()}));
}
function draw(){
  try{history.replaceState(null,'','#'+selA+'-'+selB)}catch(e){}
  pickers();
  const a=cpOf(selA),b=cpOf(selB),G={co:[],op:[],part:[],A:[],B:[]};let sin=0;
  CMP.forEach((m,i)=>{const r=rel(val(m,selA),val(m,selB));if(r)G[r].push(i);else sin++});
  const tot=CMP.length-sin;
  // 1. Barra de síntesis
  const seg=[['co','Coinciden',G.co.length,'var(--good)'],['part','En parte',G.part.length,'var(--mid)'],['op','Se oponen',G.op.length,'var(--bad)'],['A','Solo '+a.n,G.A.length,a.c],['B','Solo '+b.n,G.B.length,b.c]];
  document.getElementById('cbar').innerHTML=
   `<div class="cbh"><span style="color:${a.c}">${esc(a.n)}</span><span class="cvs">frente a</span><span style="color:${b.c}">${esc(b.n)}</span></div>`+
   `<div class="cb" role="img" aria-label="${seg.map(s=>s[1]+': '+s[2]).join('; ')}">`+seg.filter(s=>s[2]).map(s=>`<span style="flex:${s[2]};background:${s[3]}"><b>${s[2]}</b></span>`).join('')+'</div>'+
   `<div class="cleg">`+seg.map(s=>`<span><i style="background:${s[3]}"></i>${esc(s[1])} <b>${s[2]}</b></span>`).join('')+'</div>'+
   `<p class="cnote">De las ${CMP.length} medidas del catálogo, ${tot} tienen posición concreta de al menos uno de los dos; en ${sin} no hay dato de ninguno. <b>Cuenta medidas, no peso político</b>: no es una medida de cercanía ideológica.</p>`;
  // 2. Filas por grupo
  const groups=[['co','Coinciden','var(--good)'],['op','Se oponen','var(--bad)'],['part','Coinciden en parte','var(--mid)'],['A','Solo '+a.n+' tiene posición','var(--muted)'],['B','Solo '+b.n+' tiene posición','var(--muted)']];
  document.getElementById('crows').innerHTML=groups.filter(g=>G[g[0]].length).map(([g,t,c])=>
    `<section class="cg"><h3><i style="background:${c}"></i>${esc(t)} <span>${G[g].length}</span></h3>`+
    G[g].map(i=>{const m=CMP[i],va=val(m,selA),vb=val(m,selB),on=open_===i;
      return `<div class="cr${on?' on':''}"><button type="button" class="crb" data-i="${i}" aria-expanded="${on}"><span class="cm"><small>${esc(TOPICS[m.t])}</small>${esc(m.m)}</span><span class="pv ${va}" title="${esc(a.n)}: ${NAME[va]}">${SYM[va]}</span><span class="pv ${vb}" title="${esc(b.n)}: ${NAME[vb]}">${SYM[vb]}</span></button>`+
       (on?`<div class="cd"><div style="--c:${a.c}"><b>${esc(a.n)}</b>${cellTxt(selA,m.t)}</div><div style="--c:${b.c}"><b>${esc(b.n)}</b>${cellTxt(selB,m.t)}</div></div>`:'')+'</div>'}).join('')+'</section>').join('');
  document.querySelectorAll('.crb').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.i;open_=open_===i?null:i;draw()}));
  // 3. Mapa completo
  document.getElementById('cmap').innerHTML='<thead><tr><th></th>'+CP.map(p=>`<th class="${p.k===selA||p.k===selB?'hl':''}" style="--c:${p.c}">${esc(p.n.replace(' / Frente Amplio','').replace('EH Bildu','Bildu'))}</th>`).join('')+'</tr></thead><tbody>'+
   TOPICS.map((tp,t)=>{const ms=CMP.filter(m=>m.t===t);if(!ms.length)return '';
     return `<tr class="th"><td colspan="${CP.length+1}">${esc(tp)}</td></tr>`+ms.map(m=>`<tr><td>${esc(m.m)}</td>${CP.map(p=>{const v=val(m,p.k);return `<td class="${p.k===selA||p.k===selB?'hl':''}"><span class="pv s ${v}" title="${esc(p.n)}: ${NAME[v]}">${SYM[v]}</span></td>`}).join('')}</tr>`).join('')}).join('')+'</tbody>';
  // 4. Votos y condiciones PP–Vox
  const pv=(selA==='PP'&&selB==='VOX')||(selA==='VOX'&&selB==='PP'),el=document.getElementById('ctl');
  el.hidden=!pv;
  if(pv)el.querySelector('ol').innerHTML=PPVOX.map(x=>`<li><time>${esc(x.f)}</time><p>${esc(x.t)} <a href="${x.u}">${esc(x.s)}</a></p></li>`).join('');
  if(window.rvReady)rvScan();
}
draw();
