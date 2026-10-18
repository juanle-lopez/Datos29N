/* ================= PROMESAS ================= */
const U={
 pub11:['Público (dic. 2011)','https://www.publico.es/actualidad/rajoy-incumple-palabra-sube-impuestos.amp.html'],
 legal:['LegalToday (jul. 2012)','https://www.legaltoday.com/actualidad-juridica/noticias-de-derecho/el-gobierno-ejecuta-por-real-decreto-las-subidas-tributarias-2012-07-17/'],
 libre:['Libre Mercado (nov. 2013)','https://www.libertaddigital.com/libremercado/2013-11-20/las-diez-grandes-promesas-incumplidas-de-rajoy-en-materia-economica-1276504565/'],
 diacri:['Diariocrítico (nov. 2012)','https://www.diariocritico.com/noticia/423171/nacional/rajoy:-un-ano-de-promesas-incumplidas-recortes-sombras-y-luces-al-final-del-tunel.html'],
 orain:['Orain (2020)','https://orain.eus/es/actualidad/economia/2020/05/22/que-cambios-introdujo-reforma-laboral-aprobada-pp-2012/'],
 eld:['elDiario.es (ene. 2015)','https://www.eldiario.es/politica/promesas-incumplidas-rajoy-frustracion-generado_1_4425493.html'],
 ley19:['Texto de la Ley 19/2013','https://www.csn.es/documents/10182/896578/Ley%2019-2013,%20de%209%20de%20diciembre,%20de%20transparencia,%20acceso%20a%20la%20informaci%C3%B3n%20y%20buen%20gobierno'],
 pub15:['Público (jul. 2015)','https://www.publico.es/politica/pp-presenta-web-dice-haber-cumplido-92-5-programa-electoral.html'],
 mal:['Maldita Hemeroteca (nov. 2023)','https://maldita.es/malditahemeroteca/20231115/feijoo-hemeroteca-sanchez-investidura/'],
 malA:['Maldita Hemeroteca (amnistía)','https://maldita.es/malditahemeroteca/20231031/pedro-sanchez-amnistia-constitucion/'],
 amn:['Menorca.info (may. 2024)','https://www.menorca.info/actualidad/nacional/2024/05/30/2174477/ley-amnistia-aprobada-definitivamente-mayoria-del-congreso.html'],
 tjue:['El Independiente (ago. 2026)','https://www.elindependiente.com/espana/2026/08/02/curso-judicial-sentencias-historicas-seis-frentes-psoe/amp/'],
 ntl23:['Newtral (jun. 2023)','https://www.newtral.es/compromisos-gobierno-coalicion-pactocheck/20230603/'],
 ntl26:['Newtral (jul. 2026)','https://www.newtral.es/gobierno-medidas-pactos-investidura-sanchez/20260723/'],
 jor:['RTVC (sep. 2025)','https://rtvc.es/pp-vox-junts-tumban-ley-jornada-laboral-10-septiembre-2025/'],
 jor2:['Bolsamanía (sep. 2025)','https://www.bolsamania.com/noticias_print/economia/economia--ugt-y-ccoo-se-movilizaran-en-la-calle-por-la-reduccion-de-jornada-y-censuran-el-veto-de-pp-vox-y-junts--20870686.html'],
 dec:['Por Esto (oct. 2026)','https://www.poresto.com/internacional/2026/10/5/pedro-sanchez-adelanta-elecciones-en-espana-seran-el-29-de-noviembre-de-2026.amp.html'],
 dec2:['Euronews (sep. 2026)','https://es.euronews.com/2026/09/28/la-acampada-en-sol-entra-en-su-tercer-dia-socios-negocian-contrarreloj'],
 viv:['Housfy (feb. 2024)','https://housfy.com/blog/ya-se-puede-consultar-el-indice-estatal-de-precios-para-limitar-el-alquiler/'],
 smi:['OIE (tabla SMI)','https://www.oie.es/salario-minimo-interprofesional/'],
 smi2:['Mallorcadiario (2026)','https://www.mallorcadiario.com/salario-minimo-interprofesional-subira-1-221-euros-brutos-mes-2026'],
 pe:['Política Electoral (PSOE)','https://www.politicaelectoral.com/es/espana/generales-2026/nacional/psoe'],
 su:['Política Electoral (Sumar)','https://www.politicaelectoral.com/es/espana/generales-2026/nacional/sumar']
};
const PCOL={pp:['PP','var(--pp)'],psoe:['PSOE','var(--psoe)'],sumar:['Sumar','var(--sumar)']};
const PROM=[
 {k:'pp',s:'b',t:'No subir impuestos',p:'Rajoy defendió bajar impuestos; en 2009 dijo "subir los impuestos hoy significa más paro y más recesión" y días antes de anunciarlo aseguró que no pensaba subirlos.',h:'El 30-dic-2011 aprobó un recargo temporal del IRPF y subió el IBI. El RDL 20/2012 elevó el IVA general del 18% al 21% desde el 1-sep-2012.',f:[U.pub11,U.legal,U.libre]},
 {k:'pp',s:'b',t:'Pensiones como prioridad',p:'En nov-2011 las llamó su "prioridad".',h:'Dejó de indexarlas al IPC de noviembre; la subida de 2013 (1%) no compensó la pérdida de poder adquisitivo.',f:[U.libre,U.eld]},
 {k:'pp',s:'b',t:'Contratos laborales más simples',p:'El programa prometía simplificar los tipos de contrato para reducir la temporalidad.',h:'La reforma de feb-2012 no los simplificó: siguen vigentes los 41 contratos y se añadieron modalidades.',f:[U.libre]},
 {k:'pp',s:'b',t:'No abaratar el despido',p:'Un mes antes de las elecciones, el PP aseguró que no abarataría el despido.',h:'La reforma de 2012 bajó la indemnización por despido improcedente de 45 a 33 días por año (tope de 24 mensualidades) y fijó 20 días para el objetivo.',f:[U.orain,U.eld]},
 {k:'pp',s:'b',t:'Rescate bancario sin coste',p:'En oct-2011 dijo que la ayuda a la banca serían préstamos a devolver.',h:'Se inyectaron unos 54.000 M€ en Banco de Valencia, Bankia, Catalunya Banc y NCG; Bankia recibió 23.000 M€ (cifras de Libre Mercado).',f:[U.libre]},
 {k:'pp',s:'b',t:'Tarifas de la luz',p:'En su investidura dijo que no se podía aplicar una subida de tarifas que recayera íntegramente sobre los consumidores.',h:'El déficit de tarifa siguió creciendo en 2012 y la reforma eléctrica de jul-2013 no resolvió el problema de fondo.',f:[U.libre,U.diacri]},
 {k:'pp',s:'m',t:'Déficit público',p:'Llegar al objetivo de la UE: 4,5% del PIB en 2012 y cerca del 3% en 2013.',h:'Lo redujo, pero tarde: el 3% no se alcanzaría hasta 2016, según Libre Mercado; Diariocrítico lo calificó en 2012 de "insuficiente".',f:[U.libre,U.diacri]},
 {k:'pp',s:'g',t:'Reforma laboral',p:'Anunció una reforma laboral al llegar al Gobierno y dio unas semanas a patronal y sindicatos para pactarla.',h:'La aprobó por decreto-ley en febrero de 2012 y el Congreso la tramitó después con apoyo de CiU, UPN y Foro.',f:[U.orain]},
 {k:'pp',s:'g',t:'Ley de Transparencia',p:'Compromiso de transparencia del Gobierno.',h:'Ley 19/2013, de 9 de diciembre. Público cuestiona que sea "la más avanzada de Europa", como la define el PP.',f:[U.ley19,U.pub15]},
 {k:'psoe',s:'b',t:'Amnistía',p:'A tres días del 23-J de 2023 dijo que la amnistía era algo "que desde luego este Gobierno no va a aceptar".',h:'La ley se aprobó definitivamente el 30-may-2024. El TJUE avaló su compatibilidad con el derecho europeo el 16-jul-2026.',f:[U.mal,U.amn,U.tjue]},
 {k:'psoe',s:'b',t:'Indultos',p:'En 2014: "Siento vergüenza de que un político indulte a otros políticos".',h:'En 2021 aprobó los indultos a los líderes condenados por el procés.',f:[U.mal]},
 {k:'psoe',s:'b',t:'Podemos e independentistas en el Gobierno',p:'2019: "Ni yo ni el 95% de los españoles dormiríamos tranquilos con Podemos en el Gobierno". Entre 2016 y 2019: no dejaría que la gobernabilidad descansara en partidos independentistas.',h:'Gobierna en coalición con Unidas Podemos y luego Sumar, y la investidura de 2023 se apoyó en pactos con ERC, Junts y otros.',f:[U.mal,U.ntl23,U.ntl26]},
 {k:'psoe',s:'b',t:'Decretos de vivienda',p:'En sept-2026 Sánchez prometió aprobar el decreto de vivienda ante la presión social.',h:'El Congreso rechazó los dos decretos el 2-oct-2026 y días después se adelantaron las elecciones.',f:[U.dec2,U.dec]},
 {k:'psoe',s:'m',t:'Ley de Vivienda y zonas tensionadas',p:'Limitar el alquiler en zonas tensionadas.',h:'La ley se aprobó en 2023, pero en febrero de 2024 solo Cataluña había propuesto zonas. Dato por actualizar.',f:[U.viv]},
 {k:'psoe',s:'g',t:'Impuesto a la banca y mínimo del 15%',p:'Gravar a la banca y fijar un mínimo del 15% a grandes empresas.',h:'Ambos están aprobados.',f:[U.pe]},
 {k:'psoe',s:'g',t:'Pensiones con el IPC',p:'Mantener por ley la revalorización con el IPC.',h:'Se aplicó la subida del 2,7% de 2026 (RDL 3/2026).',f:[U.su]},
 {k:'sumar',s:'b',t:'Reducción de jornada a 37,5 horas',p:'Compromiso del pacto de Gobierno, impulsado por Sumar.',h:'El Congreso la tumbó el 10-sep-2025 con los votos de PP, Vox y Junts.',f:[U.jor,U.jor2]},
 {k:'sumar',s:'b',t:'Ley de gestión pública del SNS',p:'Hacer de la gestión pública la norma en la sanidad.',h:'El Consejo de Ministros la aprobó el 12-may-2026, pero decae con la disolución de las Cortes.',f:[U.su]},
 {k:'sumar',s:'g',t:'Subir el salario mínimo',p:'Subir el SMI de forma sostenida.',h:'De 735,90 € al mes en 14 pagas (2018) a 1.221 € (RD 126/2026): un 66% más.',f:[U.smi,U.smi2]}
];
const ICON={g:'✓',m:'◐',b:'✕'},SNAME={g:'Cumplida',m:'Parcial',b:'Incumplida o contraria'};
let pf='all',sf='all';
function counts(k){return ['g','m','b'].map(s=>PROM.filter(x=>x.k===k&&x.s===s).length)}
function renderSem(){
  const rows=[['pp','PP','Gobierno 2011–2018','Rajoy'],['psoe','PSOE','Gobierno 2018–2026','Sánchez'],['sumar','Sumar','Coalición 2023–2026','Muestra pequeña']];
  document.getElementById('sem').innerHTML=rows.map(([k,n,sub])=>{
    const c=counts(k),tot=c[0]+c[1]+c[2];
    return `<div class="sr2"><div class="nm" style="color:${PCOL[k][1]}">${n}<small>${sub}</small></div><div class="sbar" role="group" aria-label="${n}: ${c[0]} cumplidas, ${c[1]} parciales, ${c[2]} incumplidas">${['g','m','b'].map((s,i)=>c[i]?`<button type="button" class="${s}" style="--w:${c[i]/tot*100}%" data-go="${k}|${s}" title="${SNAME[s]}: ${c[i]}">${c[i]}</button>`:'').join('')}</div><div class="sn">${tot} promesas documentadas</div></div>`;
  }).join('')+`<div class="sr2"><div class="nm">Vox<small>Sin Gobierno nacional</small></div><div class="sbar none">Nada que medir en el Gobierno de España</div><div class="sn">También ERC, Junts, EH Bildu, PNV y el resto.</div></div>`;
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{const [k,s]=b.dataset.go.split('|');pf=k;sf=s;renderPF();renderCards();go('d_cum')}));
}
function renderPF(){
  document.getElementById('pf').innerHTML='<b>Partido</b>'+chipBtn('data-pf','all','Todos',pf==='all')+Object.keys(PCOL).map(k=>chipBtn('data-pf',k,PCOL[k][0],pf===k)).join('');
  document.getElementById('sf').innerHTML='<b>Estado</b>'+chipBtn('data-sf','all','Todos',sf==='all')+['g','m','b'].map(s=>chipBtn('data-sf',s,`${ICON[s]} ${SNAME[s]}`,sf===s)).join('');
  document.querySelectorAll('[data-pf]').forEach(b=>b.addEventListener('click',()=>{pf=b.dataset.pf;renderPF();renderCards()}));
  document.querySelectorAll('[data-sf]').forEach(b=>b.addEventListener('click',()=>{sf=b.dataset.sf;renderPF();renderCards()}));
}
function renderCards(){
  const arr=PROM.filter(x=>(pf==='all'||x.k===pf)&&(sf==='all'||x.s===sf));
  document.getElementById('cg').innerHTML=arr.length?arr.map(x=>`<article class="pc"><span class="st ${x.s}" aria-hidden="true">${ICON[x.s]}</span><div><span class="pt" style="background:${PCOL[x.k][1]}">${PCOL[x.k][0]}</span><h3>${esc(x.t)} <span style="position:absolute;left:-9999px">(${SNAME[x.s]})</span></h3></div><p><span class="lab">Prometió</span><br>${esc(x.p)}</p><p><span class="lab">Hizo</span><br>${esc(x.h)}</p><p class="srcs">Fuentes: ${x.f.map(f=>A(f[0],f[1])).join('')}</p></article>`).join(''):'<p class="note">Ninguna con ese filtro.</p>';
  if(window.rvReady)rvScan();
}
renderSem();renderPF();renderCards();

