/* ================= COMPARAR LOS PARTIDOS DE UNA COALICIÓN (render) ================= */
const CMP_COLS=['PP','PSOE','VOX','SUMAR','PODEMOS','ERC','JUNTS','PNV','BILDU'];
const CP=PARTS.map(p=>({k:p[0],n:p[1],c:p[2]}));
const cpOf=k=>CP.find(p=>p.k===k);
const IDX=Object.fromEntries(CMP_COLS.map((k,i)=>[k,i]));
const TP=[...TOPICS,'Derechos y valores'];
const SYM={y:'✓',n:'✕',p:'◐',q:'–'};
const NAME={y:'propone',n:'se opone o propone lo contrario',p:'matizado',q:'sin posición concreta en las fuentes'};
const SHORT=k=>cpOf(k).n.replace(' / Frente Amplio','').replace('EH Bildu','Bildu');
/* Posibles coaliciones reales: [nombre, [partidos], [medidas en las que, aun con la misma postura, difieren en alcance o cifras (índice en comparar-data.js)]].
   Para añadir o cambiar una coalición, edita esta lista. */
const COAL=[
 ['PP + Vox',['PP','VOX'],[1,2,4,6,7,10,11,16,23,26,27]],
 ['PSOE + Sumar + Podemos',['PSOE','SUMAR','PODEMOS'],[0,3,5,6,12,15,17,21,28,29]]
];
let ci=0,open_=null;
(function(){const h=(location.hash||'').replace('#','');const i=COAL.findIndex(c=>c[1].join('.')===h);if(i>=0)ci=i})();
const sel=()=>COAL[ci][1];
function same(a,b){return a.length===b.length&&a.every(k=>b.includes(k))}
const label=s=>s.map(SHORT).join(' + ');
const head=t=>{const x=String(t).split(/;| \(/)[0].trim();return x.length>110?x.slice(0,107).replace(/\s+\S*$/,'')+'…':x};
function srcTxt(k,t,i){const o=CMPS[i]&&CMPS[i][k];
  if(o)return `<div class="o">Origen: ${esc(o[0])}</div><div class="ms">Fuentes: ${o[1].map(f=>A(f[0],f[1])).join('')}</div>`;
  const x=PROP[k]&&PROP[k][t];
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
  document.getElementById('cpick').innerHTML=
   `<div class="rowf pre"><b>Coalición</b>`+COAL.map((c,i)=>`<button type="button" data-co="${i}" aria-pressed="${ci===i}">${esc(c[0])}</button>`).join('')+`</div>`+
   `<p class="clock">Se comparan entre sí los partidos de la coalición elegida.</p>`;
  document.querySelectorAll('[data-co]').forEach(b=>b.addEventListener('click',()=>{ci=+b.dataset.co;open_=null;draw()}));
}
function draw(){
  const sel_=sel();try{history.replaceState(null,'','#'+sel_.join('.'))}catch(e){}
  pickers();const SEL=sel_,DIF=COAL[ci][2];
  const G={co:[],op:[],part:[],S:[]};let sin=0;
  CMP.forEach((m,i)=>{let g=group(SEL.map(k=>[k,m.v[IDX[k]]]));if(g==='co'&&DIF.includes(i))g='part';if(g)G[g].push(i);else sin++});
  const tot=CMP.length-sin,nm=label(SEL);
  const seg=[['co','Coinciden del todo',G.co.length,'var(--good)'],['part','Coinciden en parte',G.part.length,'var(--mid)'],['op','Se oponen',G.op.length,'var(--bad)'],['S','Solo uno tiene posición',G.S.length,'var(--reg)']];
  document.getElementById('cbar').innerHTML=
   `<div class="cbh"><span>${esc(nm)}</span></div>`+
   `<div class="cb" role="img" aria-label="${seg.map(s=>s[1]+': '+s[2]).join('; ')}">`+seg.filter(s=>s[2]).map(s=>`<span style="flex:${s[2]};background:${s[3]}"><b>${s[2]}</b></span>`).join('')+'</div>'+
   `<div class="cleg">`+seg.map(s=>`<span><i style="background:${s[3]}"></i>${esc(s[1])} <b>${s[2]}</b></span>`).join('')+'</div>'+
   `<p class="cnote">${tot} de las ${CMP.length} medidas tienen posición concreta de alguno de estos partidos; en ${sin} no hay dato. «En parte»: van en la misma dirección pero difieren en alcance o cifras, o tienen una postura matizada. <b>Cuenta medidas, no peso político</b>: no mide cercanía ideológica.</p>`;
  const groups=[['co','Coinciden del todo','var(--good)'],['op','Se oponen','var(--bad)'],['part','Coinciden en parte','var(--mid)'],['S','Solo uno tiene posición','var(--reg)']];
  const pair=same(SEL,['PP','VOX']);
  document.getElementById('crows').innerHTML=groups.filter(g=>G[g[0]].length).map(([g,t,c])=>
    `<section class="cg"><h3><i style="background:${c}"></i>${esc(t)} <span>${G[g].length}</span></h3><div class="gh" style="grid-template-columns:1fr repeat(${SEL.length},34px)"><span></span>${SEL.map(k=>`<span style="color:${cpOf(k).c}">${esc(SHORT(k).replace('Podemos','Pod.'))}</span>`).join('')}</div>`+
    G[g].map(i=>{const m=CMP[i],on=open_===i,v=k=>m.v[IDX[k]];
      const con=SEL.filter(k=>CMPD[i][k]),sinp=SEL.filter(k=>!CMPD[i][k]);
      const nt=pair&&CMPN[i]&&CMPD[i].PP&&CMPD[i].VOX?`<div class="cdif"><b>Diferencias</b> ${esc(CMPN[i])}</div>`:'';
      return `<div class="cr${on?' on':''}"><button type="button" class="crb" data-i="${i}" aria-expanded="${on}" style="grid-template-columns:1fr repeat(${SEL.length},34px)"><span class="cm"><small>${esc(TP[m.t])}</small>${esc(m.m)}</span>${SEL.map(k=>`<span class="pv ${v(k)}" title="${esc(cpOf(k).n)}: ${NAME[v(k)]}">${SYM[v(k)]}</span>`).join('')}</button>`+
       `<div class="cdt">${con.map(k=>`<div class="cl" style="--c:${cpOf(k).c}"><b>${esc(SHORT(k))}</b><span>${esc(head(CMPD[i][k]))}</span></div>`).join('')}${sinp.length?`<div class="cl none"><b></b><span>Sin posición concreta: ${esc(label(sinp))}</span></div>`:''}${nt}</div>`+
       `<button type="button" class="csrc" data-i="${i}">${on?'Ocultar':'Ver'} detalle y fuentes</button>`+
       (on?`<div class="cd">${con.map(k=>`<div style="--c:${cpOf(k).c}"><b>${esc(SHORT(k))}</b>${esc(CMPD[i][k])}${srcTxt(k,m.t,i)}</div>`).join('')}</div>`:'')+'</div>'}).join('')+'</section>').join('');
  document.querySelectorAll('.crb,.csrc').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.i;open_=open_===i?null:i;draw()}));
  document.getElementById('cmap').innerHTML='<thead><tr><th></th>'+CP.map(p=>`<th class="${SEL.includes(p.k)?'hl':''}" style="--c:${p.c}">${esc(SHORT(p.k))}</th>`).join('')+'</tr></thead><tbody>'+
   TP.map((tp,t)=>{const ms=CMP.filter(m=>m.t===t);if(!ms.length)return '';
     return `<tr class="th"><td colspan="${CP.length+1}">${esc(tp)}</td></tr>`+ms.map(m=>`<tr><td>${esc(m.m)}</td>${CP.map(p=>{const v=m.v[IDX[p.k]];return `<td class="${SEL.includes(p.k)?'hl':''}"><span class="pv s ${v}" title="${esc(p.n)}: ${NAME[v]}">${SYM[v]}</span></td>`}).join('')}</tr>`).join('')}).join('')+'</tbody>';
  const el=document.getElementById('ctl');el.hidden=!pair;
  if(pair)el.querySelector('ol').innerHTML=PPVOX.map(x=>`<li><time>${esc(x.f)}</time><p>${esc(x.t)} <a href="${x.u}">${esc(x.s)}</a></p></li>`).join('');
  if(window.rvReady)rvScan();
}
draw();
