/* ================= CASOS ================= */
const STG=['Instrucción','Juicio','Sentencia','Firme'];
const L={
 koldo:['Euronews (jun. 2026)','https://es.euronews.com/my-europe/2026/06/22/el-supremo-condena-a-abalos-a-24-anos-de-carcel-en-el-caso-mascarillas'],
 koldo2:['RTVC (jun. 2026)','https://rtvc.es/el-supremo-condena-a-abalos-a-24-anos-de-carcel-22-junio-2026/'],
 a14:['Artículo 14 (oct. 2026)','https://www.articulo14.es/politica/los-9-casos-de-corrupcion-que-rodean-al-psoe-y-a-sanchez-antes-de-las-elecciones-del-29n-20261013.html'],
 eleco:['elEconomista (oct. 2026)','https://www.eleconomista.es/actualidad/noticias/14018468/10/26/el-cerco-sobre-pedro-sanchez-los-nueve-escandalos-y-casos-de-corrupcion-que-amenazan-al-psoe-ante-las-elecciones.html'],
 indep:['El Independiente (ago. 2026)','https://www.elindependiente.com/espana/2026/08/02/curso-judicial-sentencias-historicas-seis-frentes-psoe/amp/'],
 ere:['Ara (jul. 2024)','https://es.ara.cat/politica/tc-anula-condena-prevaricacion-manuel-chaves-caso-ere-andalucia_1_5090487.html'],
 ere2:['Noticias de Navarra (jul. 2024)','https://www.noticiasdenavarra.com/politica/2024/07/03/constitucional-reduce-condena-malversacion-exconsejero-8434423.html'],
 gur:['Público (Supremo confirma)','https://www.publico.es/politica/supremo-confirma-condena-al-pp-guertel.html'],
 gur2:['Economist & Jurist','https://www.economistjurist.es/noticias-juridicas/caso-gurtel-el-ts-confirma-penas-de-hasta-51-anos-de-prision'],
 gur3:['Onda Vasca (Aena)','https://www.ondavasca.com/caso-gurtel-confirman-la-pena-de-6-anos-para-correa-por-los-contratos-irregulares-con-aena/'],
 gur4:['Ara (sep. 2025)','https://en.ara.cat/politics/kitchen-punica-or-gurtel-the-judicial-fronts-the-pp-has-open-this-political-year_1_5488618.html'],
 pun:['Infobae (jul. 2026)','https://www.infobae.com/espana/2026/07/02/la-audiencia-nacional-condena-a-francisco-granados-a-dos-anos-y-medio-de-carcel-por-amanar-contratos-publicos-en-favor-de-una-empresa-de-festejos-del-caso-punica/'],
 pun2:['The Objective (dic. 2025)','https://theobjective.com/espana/tribunales/2025-12-22/condenados-seis-exalcaldes-corrupcion-punica/'],
 kit:['Moncloa.com (jul. 2026)','https://www.moncloa.com/2026/07/28/juicio-kitchen-visto-sentencia-audiencia-nacional-3406964/'],
 kit2:['Ara (jul. 2026)','https://en.ara.cat/politics/the-prosecutor-concludes-that-fernandez-diaz-led-the-kitchen-to-boycott-gurtel-and-ratifies-the-15-year-prison-sentence_1_5784936.html'],
 lez:['Infobae/EFE (oct. 2026)','https://www.infobae.com/espana/agencias/2026/10/11/comienza-el-martes-el-primer-juicio-a-ignacio-gonzalez-por-el-caso-de-corrupcion-lezo/'],
 mon:['Ara (ago. 2026)','https://es.ara.cat/politica/punto-caso-montoro-ano-despues-salir-luz_1_5821351.html'],
 vox1:['Menorca.info (jul. 2024)','https://www.menorca.info/actualidad/nacional/2024/07/08/2199643/vox-tribunal-cuentas-multa-200000-euros-por-financiacion-irregular.html'],
 vox2:['The Objective (mar. 2025)','https://theobjective.com/espana/tribunales/2025-03-10/fiscalia-anticorrupcion-vox-financiacion-irregular/'],
 puj:['Deia (may. 2026)','https://www.deia.eus/politica/2026/05/14/juicio-pujol-queda-visto-sentencia-11070304.html']
};
const CASES=[
 {k:'psoe',n:'PSOE y su entorno',c:'var(--psoe)',items:[
  {t:'Koldo / mascarillas',w:'José Luis Ábalos (exministro, suspendido de militancia en feb. 2024), Koldo García, Víctor de Aldama',s:3,r:'Supremo, 22-jun-2026: Ábalos 24 años y 3 meses; Koldo García 19 años y 8 meses; Aldama 4 años y 6 meses (ingreso suspendido). Ábalos anunció recurso ante el Constitucional.',f:[L.koldo,L.koldo2]},
  {t:'Koldo / obra pública y Santos Cerdán',w:'Santos Cerdán (exsecretario de Organización) y su entorno',s:1,r:'Informe de la UCO: 323.178 € de ganancias irregulares atribuidas a Cerdán y su entorno (2015–2024). Falta valoración judicial.',f:[L.a14,L.indep]},
  {t:'Leire Díez',w:'Leire Díez y Santos Cerdán; Audiencia Nacional',s:1,r:'Se investiga una presunta estructura para recopilar información contra jueces y fiscales. El 9-oct el juez rechazó imputar al PSOE como persona jurídica por falta de indicios hasta ahora.',f:[L.a14,L.indep]},
  {t:'Pagos en efectivo del PSOE',w:'El partido (2017–2024); sin personas imputadas indicadas',s:1,r:'Pieza separada abierta el 17-dic-2025. Sin responsabilidad penal establecida.',f:[L.a14,L.eleco]},
  {t:'ERE de Andalucía',w:'Manuel Chaves y José Antonio Griñán (expresidentes de la Junta)',s:3,r:'Condenados en 2019 por la Audiencia de Sevilla (confirmado por el Supremo). El Constitucional anuló en jul-2024 sus condenas (7 votos a 4) y ordenó dictar nuevas sentencias; no consta el resultado.',f:[L.ere,L.ere2]},
  {t:'David Sánchez y Gallardo',w:'David Sánchez (hermano del presidente) y Miguel Ángel Gallardo (exlíder del PSOE extremeño)',s:3,r:'Audiencia de Badajoz, 14-jul-2026: 9 años de inhabilitación a David Sánchez por prevaricación (absuelto de tráfico de influencias) y 18 a Gallardo. No firme: recurso ante el TSJ de Extremadura.',f:[L.indep,L.a14]},
  {t:'Begoña Gómez',w:'Esposa del presidente (sin cargo en el partido)',s:2,r:'El 16-jul-2026 el tribunal confirmó el juicio con jurado por tráfico de influencias y malversación; fecha por fijar. La Fiscalía pide la absolución; la acusación popular pide 13 años.',f:[L.indep,L.a14]},
  {t:'Caso Mediador',w:'Juan Bernardo Fuentes Curbelo ("Tito Berni", exdiputado) y otros 13 acusados',s:2,r:'Juicio oral abierto el 24-sep-2026. Abrirlo implica indicios suficientes, no culpabilidad.',f:[L.a14]},
  {t:'Plus Ultra',w:'José Luis Rodríguez Zapatero (expresidente del Gobierno) y otros',s:1,r:'Zapatero fue imputado el 19-may-2026 por blanqueo y tráfico de influencias (Audiencia Nacional). Sin sentencia.',f:[L.indep,L.a14]}]},
 {k:'pp',n:'PP y su entorno',c:'var(--pp)',items:[
  {t:'Gürtel',w:'Francisco Correa, Luis Bárcenas y el propio PP',s:4,r:'Sentencias firmes: el PP fue condenado como partícipe a título lucrativo; penas de hasta 51 años (Correa) y 33 (Bárcenas), confirmadas por el Supremo en oct-2020. El Supremo también confirmó 6 años a Correa en la pieza de Aena. La última pieza tenía juicio previsto en nov-2025; no encontré su sentencia.',f:[L.gur,L.gur2,L.gur3,L.gur4]},
  {t:'Púnica',w:'Francisco Granados (exconsejero) y exalcaldes del PP',s:3,r:'Audiencia Nacional, 2-jul-2026: Granados 2,5 años; Boza 4; otros dos, 2 años; dos exalcaldes de Móstoles absueltos. En dic-2025 otra pieza condenó a seis exalcaldes. Las fuentes no indican si son firmes.',f:[L.pun,L.pun2]},
  {t:'Kitchen',w:'Jorge Fernández Díaz (exministro del Interior), Francisco Martínez, José Manuel Villarejo y otros',s:2,r:'Visto para sentencia el 28-jul-2026. La Fiscalía pide 15 años para Fernández Díaz y Martínez y hasta 19 para Villarejo. No encontré sentencia a 18-oct. Los acusados niegan haber ordenado el operativo.',f:[L.kit,L.kit2,L.indep]},
  {t:'Lezo',w:'Ignacio González (expresidente de la Comunidad de Madrid) y otros cuatro acusados',s:2,r:'Primer juicio por dos delitos de cohecho en el Canal de Isabel II, que arrancó en la semana del 11-oct-2026. Anticorrupción pide 6 años de prisión por acusado.',f:[L.lez]},
  {t:'Montoro / Equipo Económico',w:'Cristóbal Montoro (exministro de Hacienda) y su equipo',s:1,r:'Instruye un juez de Tarragona. Se investiga si se modificaron leyes a favor de gasistas a cambio de pagos (850.000 € sospechosos, 2011–2019). Montoro figura entre los investigados aún sin declarar. Sin sentencia.',f:[L.mon]},
  {t:'Alberto González Amador',w:'Pareja de Isabel Díaz Ayuso (sin cargo en el partido)',s:1,r:'Investigación por delitos fiscales; Ara (sep-2025) indicaba que avanzaría en los meses siguientes. Sin juicio ni sentencia en las fuentes que he podido ver.',f:[L.gur4]}]},
 {k:'vox',n:'Vox',c:'var(--vox)',items:[
  {t:'Financiación irregular',w:'El partido',s:1,r:'El Tribunal de Cuentas multó a Vox con 230.000 € en jul-2024 (sanción administrativa). La Fiscalía Anticorrupción abrió una investigación en mar-2025. No consta sentencia penal.',f:[L.vox1,L.vox2]}]},
 {k:'otros',n:'Otros',c:'var(--reg)',items:[
  {t:'Familia Pujol',w:'Jordi Pujol (fundador de CDC) y sus hijos',s:2,r:'Visto para sentencia el 14-may-2026. Jordi Pujol quedó exonerado del juicio (la Audiencia Nacional confirmó su archivo el 11-may); la Fiscalía no rebajó las penas para los hijos.',f:[L.puj]}]}
];
let cpf='all',csf='all';
function renderStg(){
  document.getElementById('stg').innerHTML='<thead><tr><th>Partido</th>'+STG.map(s=>`<th>${s}</th>`).join('')+'</tr></thead><tbody>'+
   CASES.map(g=>`<tr><td style="color:${g.c}">${g.n.replace(' y su entorno','')}</td>${[1,2,3,4].map(n=>{const c=g.items.filter(i=>i.s===n).length;return `<td>${c?`<button type="button" class="cnt s${n}" data-cs="${g.k}|${n}" style="padding:0" aria-label="${g.n}, ${STG[n-1]}: ${c} casos">${c}</button>`:`<span class="cnt z">0</span>`}</td>`}).join('')}</tr>`).join('')+'</tbody>';
  document.querySelectorAll('[data-cs]').forEach(b=>b.addEventListener('click',()=>{const [k,n]=b.dataset.cs.split('|');cpf=k;csf=n;renderCF();renderCols();go('d_cor')}));
}
function renderCF(){
  document.getElementById('cpf').innerHTML='<b>Partido</b>'+chipBtn('data-cpf','all','Todos',cpf==='all')+CASES.map(g=>chipBtn('data-cpf',g.k,g.n.split(' ')[0],cpf===g.k)).join('');
  document.getElementById('csf').innerHTML='<b>Etapa</b>'+chipBtn('data-csf','all','Todas',csf==='all')+STG.map((s,i)=>chipBtn('data-csf',i+1,s,String(csf)===String(i+1))).join('');
  document.querySelectorAll('[data-cpf]').forEach(b=>b.addEventListener('click',()=>{cpf=b.dataset.cpf;renderCF();renderCols()}));
  document.querySelectorAll('[data-csf]').forEach(b=>b.addEventListener('click',()=>{csf=b.dataset.csf;renderCF();renderCols()}));
}
function renderCols(){
  const html=CASES.filter(g=>cpf==='all'||g.k===cpf).map(g=>{
    const its=g.items.filter(i=>csf==='all'||String(i.s)===String(csf));
    if(!its.length)return '';
    return `<div style="--c:${g.c}"><h3 class="colh">${g.n}</h3><div class="cards">${its.map(i=>`<article class="cc"><h3>${esc(i.t)}</h3><p class="who">${esc(i.w)}</p><div class="steps" role="img" aria-label="Etapa: ${STG[i.s-1]}">${STG.map((l,k)=>`<div class="sp ${k<i.s?'on':''}">${l}</div>`).join('')}</div><p>${esc(i.r)}</p><p class="src">Fuentes: ${i.f.map(f=>A(f[0],f[1])).join('')}</p></article>`).join('')}</div></div>`;
  }).join('');
  document.getElementById('cols').innerHTML=html||'<p class="note">Ningún caso con ese filtro.</p>';
  if(window.rvReady)rvScan();
}
renderStg();renderCF();renderCols();
