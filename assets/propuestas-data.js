/* ================= PROPUESTAS ================= */
/* Mismas reglas para todos: mismos temas, cada celda con tipo/fecha del documento de origen y fuente enlazada.
   Si no hay posición concreta en las fuentes consultadas, la celda queda vacía (null). */
const PARTS=[
 ['PP','PP','var(--pp)'],['PSOE','PSOE','var(--psoe)'],['VOX','Vox','var(--vox)'],['SUMAR','Sumar / Frente Amplio','var(--sumar)'],
 ['PODEMOS','Podemos','var(--reg)'],['ERC','ERC','var(--reg)'],['JUNTS','Junts','var(--reg)'],['PNV','PNV','var(--reg)'],['BILDU','EH Bildu','var(--reg)']
];
const TOPICS=['Vivienda','Impuestos','Inmigración','Energía','Sanidad','Pensiones','Empleo y salarios','Educación','Financiación y territorio','Justicia y regeneración','Política exterior y defensa'];
const PE='https://www.politicaelectoral.com/es/espana/generales-2026/nacional/';
const S={
 pp:['Política Electoral: PP',PE+'pp'],psoe:['Política Electoral: PSOE',PE+'psoe'],vox:['Política Electoral: Vox',PE+'vox'],
 su:['Política Electoral: Sumar',PE+'sumar'],pod:['Política Electoral: Podemos',PE+'podemos'],erc:['Política Electoral: ERC',PE+'erc'],
 jun:['Política Electoral: Junts',PE+'junts'],pnv:['Política Electoral: PNV',PE+'pnv'],
 hac:['Infobae (13-oct-2026)','https://www.infobae.com/espana/2026/10/13/hacienda-advierte-del-coste-de-la-rebaja-del-irpf-que-defiende-vox-85000-millones-y-pregunta-como-pagaran-la-sanidad-y-la-educacion-publicas/'],
 haci:['El Independiente (13-oct-2026)','https://www.elindependiente.com/economia/2026/10/13/hacienda-cifra-en-85-000-millones-el-coste-de-la-rebaja-del-irpf-de-vox-el-61-de-toda-la-recaudacion-del-impuesto/'],
 mon16:['Moncloa.com (16-oct-2026)','https://www.moncloa.com/2026/10/16/propuestas-economicas-vox-pp-29n-3449552/'],
 mon5:['Moncloa.com (5-oct-2026)','https://www.moncloa.com/2026/10/05/eh-bildu-elecciones-generales-29n-3443002/'],
 colau:['Infobae (17-oct-2026)','https://www.infobae.com/espana/agencias/2026/10/17/frente-amplio-presenta-a-ada-colau-de-candidata-sin-lograr-un-acuerdo-general-con-podemos/'],
 el22:['El Español (22-oct-2026)','https://elespanol.com/espana/politica/20261022/feijoo-completa-plan-vivienda-medidas-jovenes-emancipen-lograr-espana-propietarios/1003744429961_0.amp.html'],
 rt21:['RTVC (21-oct-2026)','https://rtvc.es/feijoo-promete-la-mayor-ayuda-de-la-historia-para-los-jovenes-21-octubre-2026/'],
 ser23:['Diario de Avisos (23-oct-2026)','https://diariodeavisos.elespanol.com/2026/10/feijoo-reforma-eutanasia-subida-salario-minimo/'],
 jor:['RTVC (sep. 2025)','https://rtvc.es/pp-vox-junts-tumban-ley-jornada-laboral-10-septiembre-2025/']
};
const c=(t,o,f)=>({t,o,f});
const PROP={
PP:[
 c('Plan de 23 medidas (Sevilla, 21-oct): un millón de viviendas en una legislatura; silencio positivo a los 90 días; Portal Nacional del Suelo; IVA del 4% en rehabilitación y en obra nueva. Para jóvenes: Hucha Hogar Joven con rendimientos exentos; avales públicos del 95–100% (viviendas de hasta unos 250.000 €); IVA e ITP al 4% en la primera vivienda con pago aplazado (RTVC lo describe como rebaja del 60%); donaciones familiares al 0%; deducción del 15% del alquiler; IRPF cero el primer año de trabajo. Derogar la Ley de Vivienda, las zonas tensionadas y los topes; desalojo de okupas en 24–48 horas; 75% de bonificación en el IRPF a quien alquile una vivienda vacía. Ejemplo de Feijóo: hasta 25.000 € de ahorro fiscal para un joven que compre una vivienda de 250.000 €. Requisito de edad: menos de 40 (RTVC); aval de fianza para menores de 35 (El Español). Sin coste público calculado.','Decálogo de sept. 2026 y plan de vivienda (21-oct-2026)',['pp','rt21','el22']),
 c('IVA 0% en alimentos básicos; IVA de luz y gas del 21% al 10%; deflactar la tarifa del IRPF; duplicar el mínimo por descendientes (de 2.400 a 4.800 € por el primer hijo); suprimir el impuesto a la generación eléctrica. Sin coste total calculado.','Decálogo de sept. 2026',['pp']),
 c('Visado por puntos; cuotas anuales por países y sectores, solo para países que colaboren en repatriaciones; fin de las regularizaciones generalizadas; expulsión como regla tras delitos especialmente graves.','Plan nacional del partido (oct. 2025)',['pp']),
 c('Derogar el calendario de cierre nuclear; suprimir el impuesto a la generación eléctrica; plan de choque para desbloquear el acceso a la red.','Decálogo de sept. 2026',['pp']),
 c('Plantillas en torno a un 15% mayores; más plazas MIR; 10.000 profesionales de salud mental. Que las mutuas puedan dar altas en determinadas patologías (sindicatos en contra, mutuas a favor). Reformar la ley de la eutanasia para dar más peso a los profesionales médicos (Feijóo, 23-oct).','Carta a los médicos (mar. 2026), dossier del partido y entrevista (23-oct-2026)',['pp','ser23']),
 c('Revalorización anual con el IPC (Feijóo, 13-oct-2026). Proposición de ley (nov. 2025) para actualizarlas aunque no haya presupuestos. Sin detalle de financiación.','Anuncio y proposición de ley',['pp']),
 c('Contratar al primer empleado sin cotizar durante un año; tarifa cero para autónomos nuevos; exención de IVA por debajo de 85.000 € de facturación; elevar el límite de horas extraordinarias (sin cifra publicada). Salario mínimo: no fija subida; la pactaría con sindicatos y patronal (Feijóo, 23-oct).','Decálogo de sept. 2026 y declaraciones (hasta 23-oct-2026)',['pp','mon16','ser23']),
 c('Retirar dispositivos individuales de las aulas al menos hasta Secundaria; sustituir la LOMLOE por una ley nueva con pacto de Estado; prueba de acceso a la universidad común; derecho a estudiar en español.','Anuncio de Feijóo (sept. 2026) y ponencia política (jul. 2025)',['pp']),
 c('Rechaza la financiación singular para Cataluña; nuevo modelo acordado en el Consejo de Política Fiscal y Financiera, con la AIReF y sin acuerdos bilaterales; limitar a una la prórroga presupuestaria.','Ponencia política (jul. 2025) y declaraciones',['pp']),
 c('Normas de regeneración democrática como primera tarea; que los jueces elijan a los vocales judiciales del CGPJ; cese automático del fiscal general si es procesado; derogar la Ley de Amnistía y recuperar el delito de sedición.','Ponencia política (jul. 2025) y anuncios (oct. 2026)',['pp']),
 c('Cumplir los compromisos de gasto de la OTAN con aval del Congreso, sin porcentaje fijado; desplegar el Ejército en la frontera de Ceuta si Marruecos no frena la presión; los acuerdos con Gibraltar pasarán por las Cortes.','Ponencia política y declaraciones (oct. 2026)',['pp'])
],
PSOE:[
 c('Mantener los decretos de vivienda rechazados el 2-oct y reaprobados el 6-oct: suspender desahucios de familias vulnerables hasta 2030, tope del 2% a la subida de alquileres vigentes hasta finales de 2027, IVA del 10% a pisos turísticos. Votación prevista en la Diputación Permanente el 12-nov.','Decretos-ley del Gobierno (oct. 2026)',['psoe']),
 c('Tipo del 50% en el IRPF para rentas de más de 300.000 €; mantener el impuesto a la banca y el mínimo del 15% a multinacionales (ya aprobados).','Ponencia del Congreso Federal (2024) y legislación vigente',['psoe']),
 c('Mantener la regularización extraordinaria (RD 316/2026, 1.174.978 solicitudes); vías legales con control de fronteras; reparto de menores no acompañados entre comunidades.','Real decreto (abr. 2026) y declaraciones del Gobierno',['psoe']),
 c('Cumplir el PNIEC 2023–2030 (81% de electricidad renovable en 2030). Almaraz podrá operar hasta junio de 2030 tras informe favorable del CSN.','Plan vigente y decisión del Gobierno (ago. 2026)',['psoe']),
 c('"Cero recortes" en sanidad pública (Sánchez, 14-oct). La ley de gestión pública del SNS (mayo 2026) decae con la disolución de las Cortes.','Declaración (14-oct-2026) y proyecto de ley',['psoe']),
 c('Cuatro años más de revalorización con el IPC; Fondo de Reserva hasta 20.000 M€; subida de 2027 por decreto-ley en diciembre.','Declaraciones de Sánchez (14 y 15-oct-2026)',['psoe']),
 c('SMI de 1.221 € en 14 pagas (2026). Jornada media de 36 horas semanales en 2030 y SMI de al menos el 60% del salario medio garantizado en la Constitución.','Balance del Gobierno y resoluciones del Congreso Federal (2024)',['psoe']),
 c('Proyecto de ley de ratios (máximo 22 alumnos en Primaria y 25 en la ESO) y tope de 23 horas lectivas en Infantil y Primaria; decae con la disolución. Becas: 2.559 M€ en 2026-27.','Proyecto de ley y balance del Gobierno',['psoe']),
 c('Nuevo modelo de financiación autonómica: 20.975 M€ más para las comunidades en 2027, cesión del 55% del IRPF y del 56,5% del IVA, adhesión voluntaria. Solo Cataluña y Canarias lo respaldaron en el CPFF; necesita mayoría absoluta. Financiación singular para Cataluña pactada en 2025.','Propuesta de Hacienda (ene. 2026) y CPFF (4-sep-2026)',['psoe']),
 c('Instrucción penal a los fiscales con un juez de garantías (reforma de la LECrim, pendiente); Ley de Integridad Pública con agencia independiente anticorrupción (proyecto de jul. 2026). Defiende la Ley de Amnistía.','Proyectos de ley del Gobierno',['psoe']),
 c('Gasto en defensa del 2,1% del PIB, que considera suficiente; rechaza el 5% fijado en La Haya. Reconoció Palestina (2024) y decretó el embargo de armas a Israel (2025); pide suspender el acuerdo de asociación UE-Israel.','Declaraciones del Gobierno y decretos',['psoe'])
],
VOX:[
 c('Vivienda social "masiva" con "prioridad nacional"; IVA 0% en la primera vivienda; derogar la Ley de Vivienda de 2023; desalojo policial de okupas en 24 horas.','Programa de junio 2025, plan de junio 2026 y Garriga (11-oct-2026)',['vox']),
 c('IRPF: 22.000 € exentos, 15% hasta 70.000 € y 25% por encima; IVA general del 18% y reducido del 8%; Sociedades al 15%. Vox calcula 64.000 M€ para todo el paquete; el Ministerio de Hacienda cifró el 13-oct en 85.000 M€ solo el coste del IRPF.','Programa de junio 2025; cifra de Hacienda, 13-oct-2026',['vox','hac','haci']),
 c('"Prioridad nacional" en ayudas y vivienda pública; deportación inmediata por delitos; "remigración" (Abascal, Ceuta, 12-oct), sin detallar cómo se aplicaría. Recurrió ante el Supremo la regularización extraordinaria.','Declaraciones (oct. 2026) y pactos autonómicos',['vox']),
 c('IVA del 4% en luz y gas; alargar la vida de las nucleares (Almaraz); derogar la Ley de Cambio Climático de 2021.','Plan de junio 2026 y programa de 2023',['vox']),
 c('Limitar la atención a inmigrantes irregulares a urgencias (derogar el RD 180/2026); tarjeta sanitaria única y devolver competencias al Estado; más conciertos con la sanidad privada.','Iniciativa en el Congreso (abr. 2026) y programa de 2023',['vox']),
 c('Garantizar el pago "como sea", sin detalle de financiación (Abascal, 11-oct). Sistema mixto de reparto y capitalización defendido por el diputado Figaredo; el portavoz andaluz dijo que no está en el programa.','Declaraciones (jul. 2025 y oct. 2026)',['vox','mon16']),
 c('Cuota cero para autónomos por debajo del SMI; derogar la reforma laboral de 2021, el registro horario obligatorio y los planes de igualdad obligatorios.','Plan de desregulación (jun. 2026)',['vox']),
 c('Ley Nacional de Educación con contenidos comunes y prueba única de acceso a la universidad; derecho a estudiar en español; cheque escolar y consentimiento previo de los padres en contenidos afectivo-sexuales.','Programa de 2023 y propuestas posteriores',['vox']),
 c('Sustituir el Estado de las autonomías por un Estado unitario; leyes de armonización (art. 150.3 de la Constitución); enmienda a la totalidad contra la condonación de 83.000 M€ de deuda autonómica (jul. 2026).','Programa de 2023, plan de jun. 2026 e iniciativa parlamentaria',['vox']),
 c('Que los jueces elijan a los vocales judiciales del CGPJ; integrar el Constitucional en el Supremo; prohibir indultos por corrupción; derogar la Ley de Amnistía y la de Memoria Democrática.','Programa de 2023 e iniciativas parlamentarias',['vox']),
 c('Exigir a Marruecos un reconocimiento expreso de la soberanía sobre Ceuta y Melilla y, si no llega, suspender el Tratado de Amistad de 1991 (iniciativa de sept. 2026); nuevo tratado europeo que devuelva poder a los Estados; revertir el acuerdo con Mercosur.','Iniciativa (sept. 2026) y declaraciones (jun.–oct. 2026)',['vox'])
],
SUMAR:[
 c('Prórroga de alquileres hasta 2028, suspensión de desahucios de vulnerables hasta 2030 y límites a grandes tenedores (decretos negociados con el PSOE); prohibir la compra de vivienda por empresas y fondos (mayo 2026). En 2023: dos millones de alquileres asequibles en diez años.','Decretos de oct. 2026, posición de mayo 2026 y programa de 2023',['su']),
 c('Impuesto estatal a herencias y donaciones de más de 1 M€ (proposición de mayo 2026, con IU); suelo fiscal contra el "dumping" entre comunidades (ene. 2026). En 2023: impuesto permanente a grandes fortunas.','Proposición de ley (may. 2026), declaración (ene. 2026) y programa de 2023',['su']),
 c('Respalda la regularización extraordinaria (RD 316/2026) y el reparto de menores no acompañados. En 2023: cerrar los CIE.','Apoyo a decretos del Gobierno y programa de 2023',['su']),
 c('Mantener el cierre nuclear (2035) sin prórrogas; moratoria a nuevos proyectos; rechaza la prórroga de Almaraz hasta 2030.','Posición pública (ago. 2026)',['su']),
 c('Gestión pública como norma en el SNS (ley aprobada en Consejo de Ministros el 12-may-2026, decae con la disolución). En 2023: +0,5 puntos de PIB al año en gasto sanitario.','Proyecto de ley (2026) y programa de 2023',['su']),
 c('Respaldó la revalorización de 2026 (RDL 3/2026: +2,7%). En 2023: revalorización por ley con el IPC.','Apoyo a decreto del Gobierno y programa de 2023',['su']),
 c('Jornada de 37,5 horas sin bajar el sueldo (rechazada en el Congreso el 10-sep-2025 por PP, Vox y Junts); SMI de al menos el 60% del salario medio (Díaz).','Proyecto de ley (2025) y declaración (2026)',['su','jor']),
 c('Proposición de ley de ratios: máximo de 20 alumnos por aula en Primaria, ESO e Infantil (2.º ciclo); decaída. En 2023: gasto educativo del 5% del PIB.','Proposición de ley (dic. 2025) y programa de 2023',['su']),
 c('Nuevo modelo de financiación con suelo fiscal (ene. 2026) y herencias de más de 1 M€ (may. 2026). En 2023: reforma de la financiación caducada desde 2014 y nuevo pacto territorial.','Posiciones de 2026 y programa de 2023',['su']),
 c('En 2023: al menos 10 de los 20 vocales del CGPJ avalados por jueces y asociaciones; instrucción a los fiscales con juez de garantías. La fuente no recoge programa de justicia de 2026.','Programa de 2023',['su']),
 c('Embargo de armas a Israel (RDL 10/2025) y proyecto para eliminar sus excepciones; rechaza el 2% y el 5% del PIB de la OTAN. En 2023: reconocer Palestina y 0,7% de la renta a cooperación en 2030.','Decreto (2025), posición pública y programa de 2023',['su'])
],
PODEMOS:[
 c('Bajar por ley un 40% todos los alquileres (exigido en 2024 y 2025); contratos de 10 años; limitar las hipotecas variables al euríbor +0,1% durante un año (proposición de mar. 2026); expropiar el uso del 50% de las viviendas de grandes tenedores. Votó a favor de los decretos del Gobierno en oct. 2026.','Exigencias públicas, proposiciones de ley y documento político (abr. 2025)',['pod']),
 c('Impuesto a grandes patrimonios, gravamen del 50% a beneficios extraordinarios del IBEX, impuestos extra a banca y energéticas, igualar la tributación del capital y del trabajo. Descarta subir impuestos a trabajadores, autónomos y pymes.','Documento político (2025) y declaraciones (sept. 2026)',['pod']),
 c('Regularización extraordinaria (anunciada el 26-ene-2026; RD 316/2026). Documento de 2025: regularizar a todas las personas que viven y trabajan en España, derogar la Ley de Extranjería y cerrar los CIE.','Decreto (abr. 2026) y documento político (2025)',['pod']),
 c('Pagar cada MWh a su coste de producción, eliminar el sistema marginalista y crear una empresa pública de energía; 100% renovable en 2040 y salir de la nuclear.','Documento político (2025) y programa europeo (2024)',['pod']),
 c('Derogar la Ley 15/1997 de gestión con empresas privadas; más financiación para atención primaria; farmacéutica pública y cobertura pública del 100% de atención dental, oftalmológica, auditiva y de fisioterapia.','Campaña (feb. 2026) y programa europeo (2024)',['pod']),
 c('Que ninguna pensión quede por debajo del salario mínimo (sin cuantificar); subir el ingreso mínimo vital hacia una renta básica; blindar el carácter público del sistema.','Programa europeo (2024) y documento político (2025)',['pod']),
 c('SMI de 1.800 € al mes (Belarra, feb. 2026); jornada de 30 horas semanales sin pérdida de sueldo; que el salario más alto de una empresa no supere 20 veces el más bajo.','Declaración parlamentaria (feb. 2026) y programa europeo (2024)',['pod']),
 c('Gratuidad de 0 a 18 años (libros, comedor y transporte) y matrícula gratuita en la universidad pública; inversión mínima del 5% del PIB.','Programa europeo (2024)',['pod']),
 c('República plurinacional y confederal que reconozca el derecho a decidir de los pueblos. Sin propuestas concretas de financiación autonómica en las fuentes.','Documento político (abr. 2025)',['pod']),
 c('Democratizar el poder judicial y cambiar el acceso a la carrera judicial; acceso gratuito a la justicia.','Documento político (2025) y programa europeo (2024)',['pod']),
 c('Salir de la OTAN "a la mayor brevedad" y no aumentar el gasto militar; romper relaciones con Israel y embargo total de armas.','Documento político (2025)',['pod'])
],
ERC:[
 c('Regulación del alquiler en zonas tensionadas, más vivienda pública, límites a la compra especulativa y a los pisos turísticos. Votó a favor de los decretos rechazados el 2-oct.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Fiscalidad progresiva y gestión de los impuestos por la Agencia Tributaria de Cataluña, dentro de la financiación singular.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Acogida e integración mediante el catalán y el empleo; más capacidad de Cataluña sobre permisos de trabajo.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Transición renovable y soberanía energética, con participación del territorio.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Más financiación para la sanidad pública catalana; refuerzo de atención primaria y salud mental.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Revalorización con el IPC y complementos autonómicos para las pensiones más bajas.','Resumen de la fuente; no cita documento concreto',['erc']),
 null,
 c('Inmersión en catalán; rechazo a las sentencias que fijan un mínimo de castellano; gratuidad de 0 a 3 años; más becas.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Financiación singular (pactada con el PSC en 2024), traspaso completo de Rodalies y referéndum de autodeterminación pactado.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Aplicación plena de la Ley de Amnistía y reforma del sistema de elección del CGPJ.','Resumen de la fuente; no cita documento concreto',['erc']),
 c('Europeísmo, oficialidad del catalán en la UE y apoyo al reconocimiento de Palestina. Sin propuesta de defensa en las fuentes.','Resumen de la fuente; no cita documento concreto',['erc'])
],
JUNTS:[
 c('Votó en contra de los decretos de vivienda (2-oct), junto con PP, Vox y UPN. Pide más oferta, combatir la ocupación ilegal y dar seguridad jurídica a los pequeños propietarios.','Votación del 2-oct y resumen de la fuente',['jun']),
 c('Bajar impuestos a empresas, autónomos y clases medias; que Cataluña gestione su recaudación y reduzca el déficit fiscal con el Estado.','Resumen de la fuente; no cita documento concreto',['jun']),
 c('Que Cataluña gestione flujos, permisos y expulsiones; integración ligada al conocimiento del catalán y al empleo.','Resumen de la fuente; no cita documento concreto',['jun']),
 c('Transición renovable sin cargas excesivas a la industria y al campo; más competencias en energía y agua.','Resumen de la fuente; no cita documento concreto',['jun']),
 c('Más recursos para la sanidad catalana; colaboración público-privada si reduce las listas de espera.','Resumen de la fuente; no cita documento concreto',['jun']),
 c('Garantizar el poder adquisitivo y la sostenibilidad sin cargar más a empresas y autónomos; Cataluña podría complementarlas.','Resumen de la fuente; no cita documento concreto',['jun']),
 null,
 c('Inmersión en catalán; rechaza las imposiciones judiciales de porcentajes de castellano; libertad de elección de centro y colaboración con la concertada.','Resumen de la fuente; no cita documento concreto',['jun']),
 c('Independencia como objetivo; a corto plazo, amnistía plena, catalán oficial en la UE y traspaso de competencias.','Resumen de la fuente; no cita documento concreto',['jun']),
 c('Aplicación plena de la Ley de Amnistía, también a Puigdemont; reforma del poder judicial para garantizar su independencia frente a los partidos.','Resumen de la fuente; no cita documento concreto',['jun']),
 c('Europeísmo y oficialidad del catalán en la UE. Sin propuesta de defensa en las fuentes.','Resumen de la fuente; no cita documento concreto',['jun'])
],
PNV:[
 c('Más construcción y vivienda pública de alquiler gestionada desde Euskadi. Votó a favor del decreto principal el 2-oct y rechaza la renovación automática de alquileres ("un ataque al pequeño propietario").','Programa de 2023, votación y declaración',['pnv']),
 c('Blindar el Concierto y renovar el Cupo (la ley vence a finales de 2026); todo impuesto nuevo debe concertarse; convertir en ordinarios los gravámenes a banca y energéticas.','Posición del partido y votaciones (2024–2025)',['pnv']),
 c('Competencias integrales en inmigración para Euskadi (Aitor Esteban, 28-ago-2026); reparto equitativo de menores no acompañados.','Declaración (ago. 2026) y programa de 2023',['pnv']),
 c('Acelerar renovables y dar prioridad de red a comunidades energéticas; hidrógeno verde y eólica marina.','Programa de 2023',['pnv']),
 c('Traspasar el MIR, el control de bajas laborales y la sanidad exterior; estatuto marco propio para Euskadi.','Programa de 2023 y declaración (feb. 2026)',['pnv']),
 c('Gestionar el régimen económico de la Seguridad Social sin romper la caja única; revalorizar con el IPC y blindar el Fondo de Reserva.','Programa de 2023',['pnv']),
 c('Política industrial que mantenga el empleo; menos trámites para pymes y autónomos.','Precampaña (oct. 2026); la fuente no indica documento',['pnv']),
 c('Respetar la competencia vasca en educación; FP dual en todos los niveles; euskera como eje del sistema universitario.','Programa de 2023; la fuente no indica más',['pnv']),
 c('Nuevo estatus que reconozca a Euskadi como nación, negociado con PSE-EE y EH Bildu; traspasos pendientes (Seguridad Social, puertos).','Declaraciones (2025–2026) y programa de 2023',['pnv','mon5']),
 c('Consejo Vasco de Justicia; suprimir aforamientos y la inviolabilidad del Rey en actos no institucionales; eliminar la prisión permanente revisable.','Programa de 2023',['pnv']),
 c('UE más federal y sin unanimidad en política exterior; mantener el apoyo militar a Ucrania; votó a favor del embargo de armas a Israel (oct. 2025); autodeterminación del pueblo saharaui.','Programa europeo (2024), votación y programa de 2023',['pnv'])
],
BILDU:[
 c('La vivienda es el eje de su campaña (Elejabarrieta, 5-oct-2026). No he encontrado medidas concretas publicadas.','Entrevista en Naiz Irratia (5-oct-2026)',['mon5']),
 null,null,null,null,null,null,null,
 c('Avanzar en la plurinacionalidad y negociar con PNV y PSE-EE un nuevo estatus político para Euskadi (sin fecha pública de la próxima reunión).','Entrevista en Naiz Irratia (5-oct-2026)',['mon5']),
 null,null
]
};
/* Medida estrella por partido: mismo formato para todos (titular, chips y nota de coste o estado) */
