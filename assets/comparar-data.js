/* Medidas comparables entre partidos (ver comparar.js). Columnas: PP, PSOE, Vox, Sumar/Frente Amplio, Podemos, ERC, Junts, PNV, EH Bildu.
   y = propone · n = se opone o propone lo contrario (explícito en la fuente) · p = matizado · q = sin posición concreta en las fuentes.
   t = índice del tema en propuestas-data.js, donde está el texto, el origen y las fuentes de cada partido.
   Son las medidas que aparecen en las fuentes de al menos dos partidos o que los dividen; no son todas las propuestas. */
const CMP=[
 {t:0,m:'Topar o prorrogar los alquileres (decretos de vivienda)',v:'nynyyynpq'},
 {t:0,m:'Desalojo rápido de okupas',v:'yqyqqqyqq'},
 {t:0,m:'Rebajar los impuestos de la compra de vivienda (IVA o ITP)',v:'yqyqqqqqq'},
 {t:0,m:'Limitar la compra de vivienda por fondos y grandes tenedores',v:'qqqyyyqqq'},
 {t:1,m:'Bajar impuestos (IRPF, IVA, empresas o autónomos)',v:'yqyqqqyqq'},
 {t:1,m:'Subir impuestos a las rentas y patrimonios más altos',v:'qyqyypqqq'},
 {t:2,m:'Mantener la regularización extraordinaria de inmigrantes',v:'nynyyqqqq'},
 {t:2,m:'Expulsar o deportar a quien cometa delitos',v:'yqyqqqqqq'},
 {t:2,m:'Gestión autonómica de la inmigración (permisos y flujos)',v:'qqqqqyyyq'},
 {t:2,m:'Prioridad a los españoles en ayudas y vivienda pública',v:'qqyqqqqqq'},
 {t:3,m:'Alargar la vida de las nucleares',v:'ypynnqqqq'},
 {t:3,m:'Rebajar el IVA de la luz y el gas',v:'yqyqqqqqq'},
 {t:4,m:'Reforzar la gestión pública de la sanidad',v:'qyqyyqqqq'},
 {t:4,m:'Más colaboración con la sanidad privada',v:'qqyqqqyqq'},
 {t:5,m:'Revalorizar las pensiones con el IPC',v:'yyqyqyqyq'},
 {t:6,m:'Reducir por ley la jornada laboral',v:'nynyyqnqq'},
 {t:6,m:'Cuota o tarifa cero para autónomos',v:'yqyqqqqqq'},
 {t:6,m:'Subir el salario mínimo hasta una cifra concreta',v:'qyqyyqqqq'},
 {t:6,m:'Derogar la reforma laboral de 2021',v:'qqyqqqqqq'},
 {t:7,m:'Prueba común de acceso a la universidad',v:'yqyqqqqqq'},
 {t:7,m:'Derecho a estudiar en español',v:'yqyqqqqqq'},
 {t:7,m:'Limitar el número de alumnos por aula',v:'qyqyqqqqq'},
 {t:7,m:'Inmersión en catalán',v:'qqqqqyyqq'},
 {t:8,m:'Financiación singular para Cataluña',v:'nynqqyyqq'},
 {t:8,m:'Derecho a decidir o autodeterminación',v:'qqqqyyyqq'},
 {t:8,m:'Sustituir las autonomías por un Estado unitario',v:'qqyqqqqqq'},
 {t:9,m:'Derogar la Ley de Amnistía',v:'ynyqqnnqq'},
 {t:9,m:'Que los jueces elijan a los vocales judiciales del CGPJ',v:'yqyqqqqqq'},
 {t:10,m:'Aumentar el gasto en defensa hasta el 5% del PIB',v:'qnqnnqqqq'},
 {t:10,m:'Embargo de armas a Israel',v:'qyqyyqqyq'},
];
/* Votos, documentos y condiciones entre PP y Vox (solo hechos con fecha y fuente enlazada) */
const PPVOX=[
 {f:'23-feb-2026',t:'El PP presenta su documento marco para negociar con Vox: prioridades (impuestos, vivienda, expulsión de reincidentes, natalidad) y líneas rojas (unidad nacional, separación de poderes, no generar desigualdades por territorio, lengua, sexo u origen). Dice que se puede ampliar la oferta electoral del PP, pero no contradecirla.',u:'https://elespanol.com/espana/politica/20260223/documento-feijoo-negociar-vox-pp-acepta-ampliar-oferta-programatica-no-contradecirla/1003744142461_0.html',s:'El Español'},
 {f:'17-jun-2026',t:'Feijóo, en El Hormiguero, admite por primera vez que podría formar coalición con Vox y dice que mantendrá la ley del aborto y los derechos LGTBI ya aprobados.',u:'https://www.moncloa.com/2026/06/18/feijoo-coalicion-vox-lineas-rojas-3386333/',s:'Moncloa.com (18-jun)'},
 {f:'18-jun-2026',t:'El Pleno del Congreso rechaza una moción de Vox que pedía prioridad nacional en vivienda protegida, alquiler social y ayudas; según la noticia, votaron en contra todos los grupos.',u:'https://www.bolsamania.com/noticias/empresas/economia--el-pp-rechaza-en-el-congreso-la-propuesta-de-vox-de-exigir-la-prioridad-nacional-en-ayudas-para-vivienda--22776272.html',s:'Bolsamanía'},
 {f:'5-oct-2026',t:'Abascal fija tres condiciones para pactar con el PP: «prioridad nacional», «desregulación» y «remigración».',u:'https://es.euronews.com/2026/10/05/vox-pp-condiciones-gobernar-espana-remigracion-desregularizacion-prioridad-nacional',s:'Euronews'},
 {f:'18-oct-2026',t:'En La Razón, Abascal define la prioridad nacional: ayudas prioritarias para españoles, condenados que cumplen la pena en su país y auditoría de nacionalidades. Reconoce obstáculos legales y europeos.',u:'https://www.moncloa.com/2026/10/18/abascal-prioridad-nacional-vox-ayudas-3450744/',s:'Moncloa.com (18-oct)'},
 {f:'23-oct-2026',t:'El Parlamento de Andalucía aprueba por 63 votos a 41 una proposición no de ley de Vox (prioridad nacional en vivienda protegida, repatriación de irregulares, «remigración»). El PP vota a favor; su portavoz pidió al Gobierno central centrarse en vivienda asequible y no abordó el fondo del texto. No tiene efecto legal directo.',u:'https://www.moncloa.com/2026/10/23/pnl-vox-inmigracion-vivienda-andalucia-3453968/',s:'Moncloa.com (23-oct)'}
];
