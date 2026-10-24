/* ================= PROPUESTAS (render) ================= */
const STAR=[
 {c:'var(--pp)',n:'PP',big:'Un millón de viviendas en cuatro años',chips:['Plan de 23 medidas de vivienda','Hucha Hogar Joven y avales del 95–100%','IVA de luz y gas al 10%','IVA 0% en alimentos básicos','Pensiones con el IPC','Visado por puntos'],cost:'Sin coste total calculado todavía.'},
 {c:'var(--psoe)',n:'PSOE',big:'Mantener los decretos de vivienda rechazados el 2-oct',chips:['IRPF del 50% desde 300.000 €','Pensiones con el IPC cuatro años más','Regularización extraordinaria'],cost:'Subida de pensiones de 2027 por decreto en diciembre.'},
 {c:'var(--vox)',n:'Vox',big:'IRPF de dos tipos: 15% y 25%',chips:['IVA 18% y 8%','Derogar la Ley de Vivienda 2023','"Remigración"','IVA 4% luz y gas'],cost:'Coste: 64.000 M€ según Vox (todo el paquete); Hacienda calcula 85.000 M€ solo el IRPF.'},
 {c:'var(--sumar)',n:'Sumar / Frente Amplio',big:'Jornada de 37,5 horas sin bajar el sueldo',chips:['Renovación automática de alquileres','Impuesto a herencias de más de 1 M€','Mantener el cierre nuclear'],cost:'El Congreso la rechazó el 10-sep-2025 (PP, Vox y Junts).'},
 {c:'var(--reg)',n:'Podemos',big:'Bajar un 40% todos los alquileres',chips:['SMI de 1.800 €','Impuesto a grandes patrimonios','Salir de la OTAN'],cost:'Exigencia de 2024 y 2025; sin texto articulado.'},
 {c:'var(--reg)',n:'ERC',big:'Financiación singular y traspaso de Rodalies',chips:['Referéndum de autodeterminación pactado','Amnistía plena'],cost:'Resumen de fuente secundaria; programa pendiente.'},
 {c:'var(--reg)',n:'Junts',big:'Amnistía plena y más competencias para la Generalitat',chips:['Bajar impuestos a autónomos y empresas','Gestión catalana de la inmigración'],cost:'Resumen de fuente secundaria; programa pendiente.'},
 {c:'var(--reg)',n:'PNV',big:'Blindar el Concierto y renovar el Cupo',chips:['Nuevo estatus para Euskadi','Traspaso de la Seguridad Social'],cost:'La ley del Cupo vence a finales de 2026.'},
 {c:'var(--reg)',n:'EH Bildu',big:'La vivienda como eje de campaña',chips:['Plurinacionalidad','Nuevo estatus político'],cost:'Sin medidas concretas publicadas todavía.'}
];
document.getElementById('starg').innerHTML=STAR.map(s=>`<article class="star" style="--c:${s.c}"><h3>${s.n}</h3><div class="big2">${esc(s.big)}</div><div class="chips">${s.chips.map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div><div class="cost">${esc(s.cost)}</div></article>`).join('');
/* ✓ a favor · ✕ en contra · ◐ matizado · ? sin posición concreta en las fuentes. Orden: PP, PSOE, Vox, Sumar, Podemos, ERC, Junts, PNV, EH Bildu */
const POSH=['PP','PSOE','Vox','Sumar','Pod.','ERC','Junts','PNV','Bildu'];
const POS=[
 ['Revalorizar las pensiones con el IPC',['y','y','q','y','q','y','q','y','q']],
 ['Bajar el IRPF',['y','n','y','n','q','q','p','q','q']],
 ['Fin de los topes de alquiler en zonas tensionadas',['y','n','y','q','n','n','q','p','q']],
 ['Mantener la regularización extraordinaria',['n','y','n','y','y','q','q','q','q']],
 ['Alargar la vida de las nucleares',['y','p','y','n','n','q','q','q','q']],
 ['Reducir la jornada legal a 37,5 horas (proyecto de 2025)',['n','y','n','y','q','q','n','q','q']],
 ['Mantener la Ley de Amnistía',['n','y','n','q','q','y','y','q','q']],
 ['Financiación singular para Cataluña',['n','y','n','q','q','y','y','q','q']]
];
const PV={y:'✓',n:'✕',p:'◐',q:'?'};
document.getElementById('pos').innerHTML='<thead><tr><th></th>'+POSH.map((h,i)=>`<th style="--c:${PARTS[i][2]}">${h}</th>`).join('')+'</tr></thead><tbody>'+
 POS.map(r=>`<tr><td>${r[0]}</td>${r[1].map(v=>`<td><span class="pv ${v}">${PV[v]}</span></td>`).join('')}</tr>`).join('')+'</tbody>';
let tsel='all',psel='all';
function cell(x){
  if(!x)return '<span class="na">Sin posición concreta en las fuentes consultadas.</span>';
  return esc(x.t)+`<div class="o">Origen: ${esc(x.o)}</div><div class="ms">Fuentes: ${x.f.map(k=>A(S[k][0],S[k][1])).join('')}</div>`;
}
function renderMx(){
  document.getElementById('ppf').innerHTML='<b>Partido</b>'+chipBtn('data-pp','all','Todos',psel==='all')+PARTS.map(p=>chipBtn('data-pp',p[0],p[1],psel===p[0])).join('');
  document.getElementById('tf').innerHTML='<b>Tema</b>'+chipBtn('data-t','all','Todos',tsel==='all')+TOPICS.map((t,i)=>chipBtn('data-t',i,t,String(tsel)===String(i))).join('');
  document.querySelectorAll('[data-pp]').forEach(b=>b.addEventListener('click',()=>{psel=b.dataset.pp;renderMx()}));
  document.querySelectorAll('[data-t]').forEach(b=>b.addEventListener('click',()=>{tsel=b.dataset.t;renderMx()}));
  const rows=TOPICS.map((t,i)=>[t,i]).filter(([t,i])=>tsel==='all'||String(i)===String(tsel));
  const cols=PARTS.filter(p=>psel==='all'||p[0]===psel);
  const m=document.getElementById('mx');
  m.style.minWidth=(cols.length>1&&!window.matchMedia('(max-width:640px)').matches)?(96+cols.length*210)+'px':'';
  m.innerHTML='<thead><tr><th></th>'+cols.map(p=>`<th style="--c:${p[2]}">${p[1]}</th>`).join('')+'</tr></thead><tbody>'+
   rows.map(([t,i])=>`<tr><td>${t}</td>${cols.map(p=>`<td data-p="${p[1]}" style="--c:${p[2]}">${cell(PROP[p[0]][i])}</td>`).join('')}</tr>`).join('')+'</tbody>';
  if(window.rvReady)rvScan();
}
renderMx();
