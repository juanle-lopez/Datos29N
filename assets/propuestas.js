/* ================= PROPUESTAS ================= */
const PARTS=[['PP','PP','var(--pp)'],['PSOE','PSOE','var(--psoe)'],['VOX','Vox','var(--vox)'],['SUMAR','Sumar','var(--sumar)']];
const TOPICS=['Vivienda','Impuestos','Inmigración','Energía','Sanidad','Pensiones'];
const PROP={
PP:['Un millón de viviendas en cuatro años; silencio positivo a los 90 días; avales públicos del 95–100% para jóvenes; IVA del 4% en obra nueva; fin de los topes en zonas tensionadas.',
 'IVA 0% en alimentos básicos; IVA de luz y gas del 21% al 10%; deflactar el IRPF; suprimir el impuesto a la generación eléctrica. Sin coste calculado todavía.',
 'Visado por puntos y cupos por país ligados a cooperación en devoluciones; fin de regularizaciones masivas; expulsión tras delitos graves.',
 'Derogar el calendario de cierre nuclear; suprimir el impuesto a la generación; desbloquear el acceso a la red.',
 'Plantillas un 15% mayores; más plazas MIR; 10.000 profesionales de salud mental. Polémica: que las mutuas puedan dar altas.',
 'Revalorización anual con el IPC, también sin presupuestos. Sin detalle de financiación.'],
PSOE:['Mantener los decretos tumbados el 2-oct: suspender desahucios de familias vulnerables hasta 2030, tope del 2% a la subida de alquileres vigentes hasta finales de 2027, IVA del 10% a pisos turísticos.',
 'Tipo del 50% en el IRPF para rentas de más de 300.000 € (Congreso federal 2024); mantener el impuesto a la banca y el mínimo del 15% a multinacionales.',
 'Mantener la regularización extraordinaria (1.174.978 solicitudes); vías legales con control de fronteras; reparto de menores no acompañados.',
 'Cumplir el PNIEC 2023–2030 (81% de electricidad renovable en 2030). Almaraz podrá operar hasta junio de 2030.',
 'Defender la sanidad pública y limitar la privada; "cero recortes". La ley de gestión pública decae con la disolución de las Cortes.',
 'Cuatro años más de revalorización con el IPC; Fondo de Reserva hasta 20.000 M€; subida de 2027 por decreto en diciembre.'],
VOX:['Vivienda social "masiva" con "prioridad nacional"; IVA 0% en la primera vivienda; derogar la Ley de Vivienda de 2023; desalojo de okupas en 24 horas.',
 'IRPF: 22.000 € exentos, 15% hasta 70.000 € y 25% por encima; IVA 18% y 8%; Sociedades 15%. Vox calcula 64.000 M€ de coste; Hacienda eleva solo el del IRPF a 85.000 M€.',
 '"Remigración"; deportación inmediata por delitos; prioridad nacional en ayudas y vivienda pública.',
 'IVA del 4% en luz y gas; alargar las nucleares (Almaraz); derogar la Ley de Cambio Climático de 2021.',
 'Limitar la atención a inmigrantes irregulares a urgencias; tarjeta sanitaria única y recentralización; más conciertos con la privada.',
 'Se pagarán "al precio que sea y como sea"; sin detalle de financiación. Propuesta de un sistema mixto con capitalización (2025).'],
SUMAR:['Renovación automática de contratos y bloqueo de desahucios; prohibir compras de vivienda por empresas y fondos. (2023: dos millones de alquileres asequibles en diez años.)',
 'Impuesto estatal a herencias y donaciones de más de 1 M€ (proposición de mayo de 2026). (2023: tributo a grandes fortunas.)',
 'Respalda la regularización extraordinaria (RD 316/2026). (2023: cerrar los CIE.)',
 'Mantener el cierre nuclear (2035); oponerse a Almaraz; moratoria a nuevos proyectos nucleares.',
 'Gestión pública como norma (ley decaída). (2023: +0,5 puntos de PIB al año en gasto sanitario.)',
 'Revalorización por ley con el IPC (programa de 2023); respaldó la subida del 2,7% de 2026.']
};
const STAR=[
 {c:'var(--pp)',n:'PP',big:'Un millón de viviendas en cuatro años',chips:['IVA de luz y gas al 10%','IVA 0% en alimentos básicos','Pensiones con el IPC','Visado por puntos'],cost:'Sin coste total calculado todavía.'},
 {c:'var(--psoe)',n:'PSOE',big:'Mantener los decretos de vivienda tumbados el 2-oct',chips:['IRPF del 50% desde 300.000 €','Pensiones con el IPC cuatro años más','Regularización extraordinaria'],cost:'Subida de pensiones de 2027 por decreto en diciembre.'},
 {c:'var(--vox)',n:'Vox',big:'IRPF de dos tipos: 15% y 25%',chips:['IVA 18% y 8%','Derogar la Ley de Vivienda 2023','"Remigración"','IVA 4% luz y gas'],cost:'Coste: 64.000 M€ según Vox; Hacienda eleva solo el del IRPF a 85.000 M€.'},
 {c:'var(--sumar)',n:'Sumar',big:'Jornada de 37,5 horas sin bajar el sueldo',chips:['Renovación automática de alquileres','Impuesto a herencias de más de 1 M€','Mantener el cierre nuclear'],cost:'El Congreso la rechazó el 10-sep-2025 (PP, Vox y Junts).'}
];
document.getElementById('starg').innerHTML=STAR.map(s=>`<article class="star" style="--c:${s.c}"><h3>${s.n}</h3><div class="big2">${esc(s.big)}</div><div class="chips">${s.chips.map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div><div class="cost">${esc(s.cost)}</div></article>`).join('');
const POS=[
 ['Revalorizar las pensiones con el IPC',['y','y','q','y']],
 ['Bajar el IRPF',['y','n','y','n']],
 ['Fin de los topes de alquiler en zonas tensionadas',['y','n','y','q']],
 ['Mantener la regularización extraordinaria',['n','y','n','y']],
 ['Alargar la vida de las nucleares',['y','p','y','n']]
];
const PV={y:'✓',n:'✕',p:'◐',q:'?'};
document.getElementById('pos').innerHTML='<thead><tr><th></th>'+PARTS.map(p=>`<th style="--c:${p[2]}">${p[1]}</th>`).join('')+'</tr></thead><tbody>'+
 POS.map(r=>`<tr><td>${r[0]}</td>${r[1].map(v=>`<td><span class="pv ${v}">${PV[v]}</span></td>`).join('')}</tr>`).join('')+'</tbody>';
let tsel='all',psel='all';
function renderMx(){
  document.getElementById('ppf').innerHTML='<b>Partido</b>'+chipBtn('data-pp','all','Todos',psel==='all')+PARTS.map(p=>chipBtn('data-pp',p[0],p[1],psel===p[0])).join('');
  document.getElementById('tf').innerHTML='<b>Tema</b>'+chipBtn('data-t','all','Todos',tsel==='all')+TOPICS.map((t,i)=>chipBtn('data-t',i,t,String(tsel)===String(i))).join('');
  document.querySelectorAll('[data-pp]').forEach(b=>b.addEventListener('click',()=>{psel=b.dataset.pp;renderMx()}));
  document.querySelectorAll('[data-t]').forEach(b=>b.addEventListener('click',()=>{tsel=b.dataset.t;renderMx()}));
  const rows=TOPICS.map((t,i)=>[t,i]).filter(([t,i])=>tsel==='all'||String(i)===String(tsel));
  const cols=PARTS.filter(p=>psel==='all'||p[0]===psel);
  const m=document.getElementById('mx');
  m.style.minWidth=cols.length===4?'':'0';
  m.innerHTML='<thead><tr><th></th>'+cols.map(p=>`<th style="--c:${p[2]}">${p[1]}</th>`).join('')+'</tr></thead><tbody>'+
   rows.map(([t,i])=>`<tr><td>${t}</td>${cols.map(p=>`<td data-p="${p[1]}" style="--c:${p[2]}">${esc(PROP[p[0]][i])}</td>`).join('')}</tr>`).join('')+'</tbody>';
  if(window.rvReady)rvScan();
}
renderMx();

