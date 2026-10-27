// Entrevistas y debates: calendario y fichas homogéneas (datos en entrevistas-data.js)
(function(){
  if(typeof ENT==='undefined')return;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const src=a=>a.map(([n,u])=>`<a href="${u}" rel="noopener">${esc(n)}</a>`).join(' · ');
  const W=ENT.wild;
  const dias=Math.ceil((new Date(W.fecha+'T09:00:00+01:00')-new Date())/864e5);
  const cd=$('wcd');if(cd)cd.textContent=dias>1?`Faltan ${dias} días`:dias===1?'Es mañana':dias===0?'Es hoy':'Ya emitidas';
  $('wtit').textContent=W.titulo;
  $('wfmt').innerHTML=W.formato.map(x=>`<li>${esc(x)}</li>`).join('');
  $('wcards').innerHTML=W.cands.map(c=>`<article class="ecard"><h4>${esc(c.n)}</h4><p class="ep">${esc(c.p)}</p>
    <dl><dt>Aceptó</dt><dd>${esc(c.acepta)}</dd><dt>Emisión</dt><dd>13 nov (prevista)</dd><dt>Hora</dt><dd>Por confirmar</dd><dt>Duración</dt><dd>50–90 min (según candidato)</dd><dt>Vídeo completo</dt><dd>Pendiente de emisión</dd><dt>Temas y minutos</dt><dd>Se añaden tras la emisión</dd></dl></article>`).join('');
  $('wotras').textContent=W.otras;
  $('wsrc').innerHTML='Fuentes: '+src(W.fuentes)+'.';
  $('ecal').innerHTML=ENT.cal.map(r=>`<li class="erow"><span class="ef">${esc(r.f)}</span><div><b>${esc(r.t)}</b><dl><dt>Quién</dt><dd>${esc(r.q)}</dd><dt>Dónde</dt><dd>${esc(r.c)}</dd><dt>Estado</dt><dd>${esc(r.e)}</dd><dt>Fuente</dt><dd>${src(r.s)}</dd></dl></div></li>`).join('');
  
})();
