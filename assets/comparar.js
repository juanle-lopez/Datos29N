/* ================= COMPARAR LOS PARTIDOS DE UNA COALICIÓN (render) ================= */
const CMP_COLS=['PP','PSOE','VOX','SUMAR','PODEMOS','ERC','JUNTS','PNV','BILDU'];
const CP=PARTS.map(p=>({k:p[0],n:p[1],c:p[2]}));
const cpOf=k=>CP.find(p=>p.k===k);
const IDX=Object.fromEntries(CMP_COLS.map((k,i)=>[k,i]));
const SYM={y:'✓',n:'✕',p:'◐',q:'–'};
const NAME={y:'propone',n:'se opone o propone lo contrario',p:'matizado',q:'sin posición concreta en las fuentes'};
const SHORT=k=>cpOf(k).n.replace(' / Frente Amplio','').replace('EH Bildu','Bildu');
/* Atajos: posibles coaliciones. Para añadir o cambiar una, edita esta lista: [nombre, [claves de partido]] */
const COAL=[['PP + Vox',['PP','VOX']],['PSOE + Sumar + Podemos',['PSOE','SUMAR','PODEMOS']]];
const MAXP=4;
let sel=['PP','VOX'],custom=false,open_=null;
(function(){const h=(location.hash||'').replace('#','').split('.');if(h.length>=2&&h.length<=MAXP&&h.every(k=>IDX[k]!=null)&&new Set(h).size===h.length){sel=h;custom=modeOf(sel)<0}})();
function same(a,b){return a.length===b.length&&a.every(k=>b.includes(k))}
function modeOf(s){return COAL.findIndex(c=>same(c[1],s))}
const label=s=>s.map(SHORT).join(' + ');
const head=t=>{const x=String(t).split(/;| \(/)[0].trim();return x.length>110?x.slice(0,107).replace(/\s+\S*$/,'')+'…':x};
function srcTxt(k,t){const x=PROP[k][t];
  if(!x)return '';
  return `<div class="o">Origen: ${esc(x.o)}</div><div class="ms">Fuentes: ${x.f.map(f=>A(S[f][0],S[f][1])).join('')}</div>`}
function group(vals){          // vals: [[clave, y|n|p|q]]
  const k=vals.filter(v=>v[1]!=='q');
  if(!k.length)return null;
  if(k.length===1)return 'S';
  if(k.some(v=>v[1]==='p'))return 'part';
  return k.every(v=>v[1]===k[0][1])?'co':'op';
}
function pickers(){
  const m=custom?-1:modeOf(sel),lock=m>=0;
  document.getElementById('cpick').innerHTML=
   `<div class="rowf pre"><b>Coaliciones</b>`+COAL.map((c,i)=>`<button type="button" data-co="${i}" aria-pressed="${m===i}">${esc(c[0])}</button>`).join('')+`<button type="button" data-co="-1" aria-pressed="${m<0}">Elegir partidos</button></div>`+
   `<div class="rowf"><b>Partidos</b>`+CP.map(p=>`<button type="button" data-pk="${p.k}" aria-pressed="${sel.includes(p.k)}" ${lock||(!sel.includes(p.k)&&sel.length>=MAXP)?'disabled':''} style="--c:${p.c}">${esc(SHORT(p.k))}</button>`).join('')+'</div>'+
   `<p class="clock">${lock?'Coalición fija: se comparan entre sí los partidos que la forman. Para comparar otros, elige «Elegir partidos».':`Elige de 2 a ${MAXP} partidos y compáralos entre sí.`}</p>`;
  document.querySelectorAll('[data-co]').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.co;if(i<0)custom=true;else{custom=false;sel=COAL[i][1].slice()}open_=null;draw()}));
  document.querySelectorAll('[data-pk]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.pk;
    if(sel.includes(k)){if(sel.length>2)sel=sel.filter(x=>x!==k)}else if(sel.length<MAXP)sel=[...sel,k];open_=null;draw()}));
}
function draw(){
  try{history.replaceState(null,'','#'+sel.join('.'))}catch(e){}
  pickers();
  const G={co:[],op:[],part:[],S:[]};let sin=0;
  CMP.forEach((m,i)=>{const g=group(sel.map(k=>[k,m.v[IDX[k]]]));if(g)G[g].push(i);else sin++});
  const tot=CMP.length-sin,nm=label(sel);
  const seg=[['co','Coinciden',G.co.length,'var(--good)'],['part','En parte',G.part.length,'var(--mid)'],['op','Se oponen',G.op.length,'var(--bad)'],['S','Solo uno tiene posición',G.S.length,'var(--reg)']];
  document.getElementById('cbar').innerHTML=
   `<div class="cbh"><span>${esc(nm)}</span></div>`+
   `<div class="cb" role="img" aria-label="${seg.map(s=>s[1]+': '+s[2]).join('; ')}">`+seg.filter(s=>s[2]).map(s=>`<span style="flex:${s[2]};background:${s[3]}"><b>${s[2]}</b></span>`).join('')+'</div>'+
   `<div class="cleg">`+seg.map(s=>`<span><i style="background:${s[3]}"></i>${esc(s[1])} <b>${s[2]}</b></span>`).join('')+'</div>'+
   `<p class="cnote">${tot} de las ${CMP.length} medidas tienen posición concreta de alguno de estos partidos; en ${sin} no hay dato. <b>Cuenta medidas, no peso político</b>: no mide cercanía ideológica.</p>`;
  const groups=[['co','Coinciden','var(--good)'],['op','Se oponen','var(--bad)'],['part','En parte','var(--mid)'],['S','Solo uno tiene posición','var(--reg)']];
  const pair=same(sel,['PP','VOX']);
  document.getElementById('crows').innerHTML=groups.filter(g=>G[g[0]].length).map(([g,t,c])=>
    `<section class="cg"><h3><i style="background:${c}"></i>${esc(t)} <span>${G[g].length}</span></h3><div class="gh" style="grid-template-columns:1fr repeat(${sel.length},34px)"><span></span>${sel.map(k=>`<span style="color:${cpOf(k).c}">${esc(SHORT(k).replace('Podemos','Pod.'))}</span>`).join('')}</div>`+
    G[g].map(i=>{const m=CMP[i],on=open_===i,v=k=>m.v[IDX[k]];
      const con=sel.filter(k=>CMPD[i][k]),sinp=sel.filter(k=>!CMPD[i][k]);
      const nt=pair&&CMPN[i]&&CMPD[i].PP&&CMPD[i].VOX?`<div class="cdif"><b>Diferencias</b> ${esc(CMPN[i])}</div>`:'';
      return `<div class="cr${on?' on':''}"><button type="button" class="crb" data-i="${i}" aria-expanded="${on}" style="grid-template-columns:1fr repeat(${sel.length},34px)"><span class="cm"><small>${esc(TOPICS[m.t])}</small>${esc(m.m)}</span>${sel.map(k=>`<span class="pv ${v(k)}" title="${esc(cpOf(k).n)}: ${NAME[v(k)]}">${SYM[v(k)]}</span>`).join('')}</button>`+
       `<div class="cdt">${con.map(k=>`<div class="cl" style="--c:${cpOf(k).c}"><b>${esc(SHORT(k))}</b><span>${esc(head(CMPD[i][k]))}</span></div>`).join('')}${sinp.length?`<div class="cl none"><b></b><span>Sin posición concreta: ${esc(label(sinp))}</span></div>`:''}${nt}</div>`+
       `<button type="button" class="csrc" data-i="${i}">${on?'Ocultar':'Ver'} detalle y fuentes</button>`+
       (on?`<div class="cd">${con.map(k=>`<div style="--c:${cpOf(k).c}"><b>${esc(SHORT(k))}</b>${esc(CMPD[i][k])}${srcTxt(k,m.t)}</div>`).join('')}</div>`:'')+'</div>'}).join('')+'</section>').join('');
  document.querySelectorAll('.crb,.csrc').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.i;open_=open_===i?null:i;draw()}));
  document.getElementById('cmap').innerHTML='<thead><tr><th></th>'+CP.map(p=>`<th class="${sel.includes(p.k)?'hl':''}" style="--c:${p.c}">${esc(SHORT(p.k))}</th>`).join('')+'</tr></thead><tbody>'+
   TOPICS.map((tp,t)=>{const ms=CMP.filter(m=>m.t===t);if(!ms.length)return '';
     return `<tr class="th"><td colspan="${CP.length+1}">${esc(tp)}</td></tr>`+ms.map(m=>`<tr><td>${esc(m.m)}</td>${CP.map(p=>{const v=m.v[IDX[p.k]];return `<td class="${sel.includes(p.k)?'hl':''}"><span class="pv s ${v}" title="${esc(p.n)}: ${NAME[v]}">${SYM[v]}</span></td>`}).join('')}</tr>`).join('')}).join('')+'</tbody>';
  const el=document.getElementById('ctl');el.hidden=!pair;
  if(pair)el.querySelector('ol').innerHTML=PPVOX.map(x=>`<li><time>${esc(x.f)}</time><p>${esc(x.t)} <a href="${x.u}">${esc(x.s)}</a></p></li>`).join('');
  if(window.rvReady)rvScan();
}
draw();
