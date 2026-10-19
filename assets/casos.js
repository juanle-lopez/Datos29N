/* ================= CASOS ================= */
const STG=['Instrucción','Juicio','Sentencia','Firme'];
const L={
 koldo:['Euronews (jun. 2026)','https://es.euronews.com/my-europe/2026/06/22/el-supremo-condena-a-abalos-a-24-anos-de-carcel-en-el-caso-mascarillas'],
 koldo2:['RTVC (jun. 2026)','https://rtvc.es/el-supremo-condena-a-abalos-a-24-anos-de-carcel-22-junio-2026/'],
 koldo3:['Infobae (13-oct-2026)','https://www.infobae.com/espana/2026/10/13/el-ultimo-cartucho-de-abalos-y-koldo-presionar-al-supremo-para-que-suspenda-sus-condenas-a-24-y-19-anos-de-prision-y-abrir-la-via-del-amparo-ante-el-constitucional/'],
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
 koldo4:['ESdiario (13-oct-2026)','https://www.esdiario.com/nacional/261013/200092/abalos-koldo-guardan-ultimo-as-manga-escapar-condenas.html'],
 leire:['Diario de León / Europa Press (9-oct-2026)','https://www.diariodeleon.es/nacional/261009/2099772/juez-descarta-imputar-psoe-caso-leire-diez-esperara-practicar-diligencias.html'],
 ere3:['Legal Today / Europa Press (abr. 2026)','https://www.legaltoday.com/practica-juridica/derecho-penal/la-ce-dictamina-que-el-tjue-es-manifiestamente-incompetente-para-pronunciarse-sobre-el-caso-de-los-ere-2026-04-20/'],
 bego:['RTVC (21-sep-2026)','https://rtvc.es/el-juez-peinado-envia-a-juicio-con-jurado-a-begona-gomez-21-septiembre-2026/'],
 bego2:['Euronews (8-sep-2026)','https://es.euronews.com/my-europe/2026/09/08/el-juez-que-investiga-a-begona-gomez-concluye-la-instruccion'],
 med:['ESdiario (24-sep-2026)','https://www.esdiario.com/nacional/260924/198633/tito-berni-reaparece-peor-momento-psoe-hay-fecha-juicio-turbio-caso-empezo-todo.html'],
 gur5:['El Plural (7-ago-2026)','https://www.elplural.com/sociedad/tribunales/gurtel-cifras-18-anos-12-juicios-94-condenados-tres-condenas-pp_397450102'],
 ga:['Ara (7-nov-2025)','https://es.ara.cat/politica/audiencia-madrid-confirma-procesamiento-pareja-ayuso-envia-juicio_1_5554743.html'],
 ga2:['Moncloa.com (24-ago-2026)','https://www.moncloa.com/2026/08/24/curso-judicial-madrid-causas-3420047/'],
 vox3:['Ara (16-jun-2025)','https://en.ara.cat/politics/the-anti-corruption-prosecutor-s-office-files-the-complaint-for-irregular-financing-of-vox_25_5413776.html'],
 pu2:['Moncloa.com (5-oct-2026)','https://www.moncloa.com/2026/10/05/psoe-causas-judiciales-koldo-plus-ultra-3443108/'],
 puj:['Deia (may. 2026)','https://www.deia.eus/politica/2026/05/14/juicio-pujol-queda-visto-sentencia-11070304.html']
};
const CASES=[
 {k:'psoe',n:'PSOE y su entorno',c:'var(--psoe)',items:[
  {t:'Koldo / mascarillas',w:'José Luis Ábalos (exministro, suspendido de militancia en feb. 2024), Koldo García, Víctor de Aldama',s:3,r:'Supremo, 22-jun-2026: Ábalos 24 años y 3 meses; Koldo García 19 años y 8 meses; Aldama 4 años y 6 meses (ingreso suspendido). Ábalos anunció recurso ante el Constitucional; en octubre Ábalos y Koldo piden al Supremo que suspenda las condenas mientras preparan el amparo, y según ESdiario el 8-oct el Supremo rechazó suspender la ejecución de las penas. Las fuentes no dicen que la sentencia sea firme.',f:[L.koldo,L.koldo2,L.koldo3,L.koldo4]},
  {t:'Koldo / obra pública y Santos Cerdán',w:'Santos Cerdán (exsecretario de Organización) y su entorno',s:1,r:'Informe de la UCO: 323.178 € de ganancias irregulares atribuidas a Cerdán y su entorno (2015–2024). Falta valoración judicial. La causa está en el Juzgado Central de Instrucción 2 de la Audiencia Nacional (el Supremo se la remitió en feb-2026) y el juez esperaba nuevos informes de la UCO (Vozpópuli, 16-sep-2026).',f:[L.a14,L.indep]},
  {t:'Leire Díez',w:'Leire Díez y Santos Cerdán; Audiencia Nacional',s:1,r:'Se investiga una presunta estructura para recopilar información contra jueces y fiscales. El 9-oct el juez Pedraz descartó por ahora imputar al PSOE, como pedía el PP, y esperará a más diligencias; Anticorrupción lo consideró prematuro, aunque ve indicios de conductas posiblemente delictivas.',f:[L.a14,L.indep,L.leire]},
  {t:'Pagos en efectivo del PSOE',w:'El partido (2017–2024); sin personas imputadas indicadas',s:1,r:'Pieza separada abierta el 17-dic-2025. Sin responsabilidad penal establecida.',f:[L.a14,L.eleco]},
  {t:'ERE de Andalucía',w:'Manuel Chaves y José Antonio Griñán (expresidentes de la Junta)',s:3,r:'Condenados en 2019 por la Audiencia de Sevilla (confirmado por el Supremo). El Constitucional anuló en jul-2024 sus condenas (7 votos a 4) y ordenó dictar nuevas sentencias; no consta el resultado. La Audiencia de Sevilla planteó una cuestión prejudicial al TJUE y la Comisión Europea pidió en abr-2026 inadmitirla; no consta resolución.',f:[L.ere,L.ere2,L.ere3]},
  {t:'David Sánchez y Gallardo',w:'David Sánchez (hermano del presidente) y Miguel Ángel Gallardo (exlíder del PSOE extremeño)',s:3,r:'Audiencia de Badajoz, 14-jul-2026: 9 años de inhabilitación a David Sánchez por prevaricación (absuelto de tráfico de influencias) y 18 a Gallardo. No firme: recurso ante el TSJ de Extremadura.',f:[L.indep,L.a14]},
  {t:'Begoña Gómez',w:'Esposa del presidente (sin cargo en el partido)',s:2,r:'El juez Peinado dictó la apertura de juicio oral con jurado (sep-2026) por tráfico de influencias y malversación; la Audiencia Provincial de Madrid fijará la fecha. La Fiscalía pide el archivo; la acusación popular, 13 años. (El 16-jul la Audiencia Provincial había avalado el jurado.)',f:[L.indep,L.a14,L.bego,L.bego2]},
  {t:'Caso Mediador',w:'Juan Bernardo Fuentes Curbelo ("Tito Berni", exdiputado) y otros 13 acusados',s:2,r:'Apertura de juicio oral contra 14 acusados (sep-2026); juzgará la Audiencia Provincial de Santa Cruz de Tenerife, sin fecha. La Fiscalía pide 8 años para Fuentes Curbelo. Abrir juicio implica indicios suficientes, no culpabilidad.',f:[L.a14,L.med]},
  {t:'Plus Ultra',w:'José Luis Rodríguez Zapatero (expresidente del Gobierno) y otros',s:1,r:'Zapatero fue imputado el 19-may-2026 por blanqueo y tráfico de influencias (Audiencia Nacional). Sus hijas, también investigadas, están citadas a declarar el 30-nov. Sin sentencia.',f:[L.indep,L.a14,L.pu2]}]},
 {k:'pp',n:'PP y su entorno',c:'var(--pp)',items:[
  {t:'Gürtel',w:'Francisco Correa, Luis Bárcenas y el propio PP',s:4,r:'Sentencias firmes: el PP fue condenado como partícipe a título lucrativo; penas de hasta 51 años (Correa) y 33 (Bárcenas), confirmadas por el Supremo en oct-2020. El Supremo también confirmó 6 años a Correa en la pieza de Aena. La última pieza quedó vista para sentencia el 12-nov-2025; sin sentencia a 7-ago-2026 y no he encontrado ninguna posterior.',f:[L.gur,L.gur2,L.gur3,L.gur4,L.gur5]},
  {t:'Púnica',w:'Francisco Granados (exconsejero) y exalcaldes del PP',s:3,r:'Audiencia Nacional, 2-jul-2026: Granados 2,5 años; Boza 4; otros dos, 2 años; dos exalcaldes de Móstoles absueltos. En dic-2025 otra pieza condenó a seis exalcaldes. Las fuentes no indican si son firmes.',f:[L.pun,L.pun2]},
  {t:'Kitchen',w:'Jorge Fernández Díaz (exministro del Interior), Francisco Martínez, José Manuel Villarejo y otros',s:2,r:'Visto para sentencia el 28-jul-2026. La Fiscalía pide 15 años para Fernández Díaz y Martínez y hasta 19 para Villarejo. No encontré sentencia a 18-oct. Los acusados niegan haber ordenado el operativo.',f:[L.kit,L.kit2,L.indep]},
  {t:'Lezo',w:'Ignacio González (expresidente de la Comunidad de Madrid) y otros cuatro acusados',s:2,r:'Primer juicio por dos delitos de cohecho en el Canal de Isabel II, en la Audiencia Nacional; estaba previsto que comenzara el 13-oct-2026 (EFE). No he podido confirmar con una segunda fuente que haya empezado. Anticorrupción pide 6 años de prisión por acusado.',f:[L.lez]},
  {t:'Montoro / Equipo Económico',w:'Cristóbal Montoro (exministro de Hacienda) y su equipo',s:1,r:'Instruye un juez de Tarragona. Se investiga si se modificaron leyes a favor de gasistas a cambio de pagos (850.000 € sospechosos, 2011–2019). Montoro figura entre los investigados aún sin declarar. Sin sentencia.',f:[L.mon]},
  {t:'Alberto González Amador',w:'Pareja de Isabel Díaz Ayuso (sin cargo en el partido)',s:2,r:'Juicio oral abierto en sep-2025 por fraude fiscal y falsedad (confirmado por la Audiencia de Madrid en nov-2025). Fiscalía y Abogacía del Estado piden 3 años y 9 meses. Sin fecha de juicio en los juzgados de lo Penal.',f:[L.ga,L.ga2]}]},
 {k:'vox',n:'Vox',c:'var(--vox)',items:[
  {t:'Financiación irregular',w:'El partido',s:1,r:'Archivado. El Tribunal de Cuentas multó a Vox en jul-2024 (sanción administrativa; las fuentes dan cuantías distintas: 200.000, 230.000 y 233.000 €). Anticorrupción abrió diligencias en mar-2025 y las archivó en jun-2025 porque esa multa ya castigaba los mismos hechos. Nunca hubo proceso judicial.',f:[L.vox1,L.vox2,L.vox3]}]},
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
