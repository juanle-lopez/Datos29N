/* ================= GASTOS ================= */
const YRS=[2018,2019,2020,2021,2022,2023,2024];
const FN=[
 ['GF10','Protección social','var(--g10)',[203470,216733,247445,248671,252111,277327,297532]],
 ['GF07','Sanidad','var(--g7)',[72146,75917,85545,88541,93327,98630,102942]],
 ['GF09','Educación','var(--g9)',[47764,50052,52003,55885,58669,62532,65862]],
 ['GF04','Asuntos económicos','var(--g4)',[51532,52761,65789,78943,77131,74851,80908]],
 ['GF01','Servicios públicos generales','var(--g1)',[67520,67671,66059,70976,77818,84425,92551]],
 ['GF03','Orden público y seguridad','var(--g3)',[21542,22685,23458,24540,25798,27414,28628]],
 ['GF08','Ocio, cultura y religión','var(--g6)',[13544,14420,13382,14607,17120,18638,19193]],
 ['GF05','Medio ambiente','var(--g5)',[10258,10803,10785,11465,13335,14579,15539]],
 ['GF02','Defensa','var(--g2)',[10287,10537,10549,11716,15347,14008,14233]],
 ['GF06','Vivienda y servicios comunitarios','var(--g8)',[5130,5190,5149,5780,6461,7821,7613]]
];
const TOT=[503193,526769,580164,611124,637117,680225,725001];
const HICP={2018:103.46,2019:104.26,2020:103.91,2021:107.04,2022:115.95,2023:119.89,2024:123.33};
const GDP=[1212276,1253710,1129214,1235474,1375863,1497761,1594330];
const TAXR=[[2017,37.9],[2018,39.0],[2019,39.0],[2020,41.5],[2021,42.8],[2022,41.7],[2023,42.1],[2024,42.3]];
const real=(v,i)=>v*HICP[2018]/HICP[YRS[i]];
const fmt=(n,d=0)=>n.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const mm=v=>fmt(v/1000,1)+' mil M€';
const SRC={
 eu:['Eurostat gov_10a_exp (COFOG, S13)','https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table?lang=en&geo=ES'],
 hicp:['Eurostat prc_hicp_aind (IPCA)','https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_aind/default/table?lang=en&geo=ES'],
 gdp:['Eurostat nama_10_gdp (PIB)','https://ec.europa.eu/eurostat/databrowser/view/nama_10_gdp/default/table?lang=en&geo=ES'],
 main:['Eurostat gov_10a_main (ingresos % PIB)','https://ec.europa.eu/eurostat/databrowser/view/gov_10a_main/default/table?lang=en&geo=ES']
};
const GW=()=>{const e=document.getElementById('gstack');return e&&e.clientWidth&&e.clientWidth<560?470:760};
const LK=(s)=>`<a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a>`;
let mode='cur',hid=new Set(),selY=6;

/* ---- KPIs ---- */
(function(){
  const nom=TOT[6]/TOT[0]-1,re=real(TOT[6],6)/TOT[0]-1,p18=TOT[0]/GDP[0]*100,p24=TOT[6]/GDP[6]*100;
  document.getElementById('gk').innerHTML=[
   [mm(TOT[6]),'gasto de las Administraciones en 2024 (provisional)'],
   ['+'+fmt(nom*100,1)+'%','sube el gasto en euros corrientes desde 2018 ('+mm(TOT[0])+')'],
   ['+'+fmt(re*100,1)+'%','sube quitando la inflación (euros de 2018)'],
   [fmt(p18,1)+'% → '+fmt(p24,1)+'%','del PIB: gasto público en 2018 y en 2024']
  ].map(x=>`<div class="rv"><b>${x[0]}</b><small>${x[1]}</small></div>`).join('');
})();

/* ---- stacked bars ---- */
function series(){return FN.map(f=>({k:f[0],n:f[1],c:f[2],v:f[3].map((x,i)=>mode==='cur'?x:mode==='real'?real(x,i):x/GDP[i]*100)}))}
function renderStack(){
  const S=series().filter(s=>!hid.has(s.k)),W=GW(),H=360,L=54,B=28,T=10,R=10,bw=(W-L-R)/YRS.length;
  const sums=YRS.map((_,i)=>S.reduce((a,s)=>a+s.v[i],0)),mx=Math.max(...sums,1)*1.08;
  const unit=mode==='pct'?'% PIB':'M€';
  const y=v=>H-B-(v/mx)*(H-B-T);
  let g='';
  for(let k=0;k<=4;k++){const v=mx*k/4;g+=`<line class="ax" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${mode==='pct'?fmt(v,0)+'%':fmt(v/1000,0)+'k'}</text>`}
  YRS.forEach((yr,i)=>{
    let acc=0;const x=L+i*bw+bw*.14,w=bw*.72;
    S.forEach(s=>{const h=(s.v[i]/mx)*(H-B-T);g+=`<rect class="gseg" data-i="${i}" x="${x}" y="${y(acc+s.v[i])}" width="${w}" height="${h}" fill="${s.c}" opacity="${selY===i?1:.82}" stroke="var(--panel)" stroke-width=".6"><title>${s.n} ${yr}</title></rect>`;acc+=s.v[i]});
    g+=`<text x="${x+w/2}" y="${H-8}" text-anchor="middle" style="${selY===i?'fill:var(--fg);font-weight:700':''}">${yr}</text>`;
  });
  document.getElementById('gstack').innerHTML=`<svg class="gsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gasto público por áreas en ${unit}">${g}</svg>`;
  document.querySelectorAll('#gstack rect').forEach(r=>r.addEventListener('click',()=>{selY=+r.dataset.i;renderStack();tip()}));
  tip();
}
function tip(){
  const S=series(),i=selY,tot=S.reduce((a,s)=>a+s.v[i],0);
  const rows=S.slice().sort((a,b)=>b.v[i]-a.v[i]).map(s=>`${s.n}: <b>${mode==='pct'?fmt(s.v[i],1)+'% del PIB':fmt(s.v[i])+' M€'}</b> (${fmt(s.v[i]/tot*100,1)}%)`).join(' · ');
  document.getElementById('gtip').innerHTML=`<b>${YRS[i]}</b>${YRS[i]===2024?' (provisional)':''}${YRS[i]===2018?' (año con dos Gobiernos)':''} — ${mode==='cur'?'euros corrientes':mode==='real'?'euros constantes de 2018':'% del PIB'}. Total: <b>${mode==='pct'?fmt(tot,1)+'% del PIB':fmt(tot)+' M€'}</b>.<br>${rows}`;
}
function renderCtl(){
  const M=[['cur','Euros corrientes'],['real','Euros constantes (2018)'],['pct','% del PIB']];
  document.getElementById('gmode').innerHTML=M.map(m=>`<button type="button" data-m="${m[0]}" aria-pressed="${mode===m[0]}">${m[1]}</button>`).join('');
  document.querySelectorAll('#gmode button').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.m;renderCtl();renderStack()}));
  document.getElementById('glg').innerHTML=FN.map(f=>`<button type="button" data-k="${f[0]}" aria-pressed="${!hid.has(f[0])}"><i style="background:${f[2]}"></i>${f[1]}</button>`).join('');
  document.querySelectorAll('#glg button').forEach(b=>b.addEventListener('click',()=>{hid.has(b.dataset.k)?hid.delete(b.dataset.k):hid.add(b.dataset.k);renderCtl();renderStack()}));
}

/* ---- cambio 2018->2024 y mapa de calor ---- */
function renderDiv(){
  const rows=FN.map(f=>({n:f[1],ch:real(f[3][6],6)/f[3][0]-1,a:f[3][0],b:real(f[3][6],6)})).sort((a,b)=>b.ch-a.ch);
  const mx=Math.max(...rows.map(r=>Math.abs(r.ch)));
  document.getElementById('gdiv').innerHTML=rows.map(r=>{const w=Math.abs(r.ch)/mx*50;return `<div class="dv"><span>${r.n}</span><div class="tr"><div class="bb" style="${r.ch>=0?'left:50%':'right:50%;transform-origin:right'};width:${w}%;background:${r.ch>=0?'var(--up)':'var(--dn)'}"></div></div><span class="v">${r.ch>=0?'+':''}${fmt(r.ch*100,0)}%</span></div>`}).join('');
  const cuts=[];
  let h='<tr><th>Área</th>'+YRS.slice(1).map(y=>`<th>${y}</th>`).join('')+'</tr>';
  FN.forEach(f=>{
    h+=`<tr><td>${f[1]}</td>`;
    for(let i=1;i<7;i++){const c=real(f[3][i],i)/real(f[3][i-1],i-1)-1,a=Math.min(Math.abs(c)/.15,1),col=c>=0?'var(--up)':'var(--dn)';
      if(c<0)cuts.push(`${f[1]} ${YRS[i]} (${fmt(c*100,1)}%)`);
      h+=`<td><span class="heat" style="background:color-mix(in srgb,${col} ${Math.round(a*70)}%,transparent)">${c<0?'▼ ':''}${c>=0?'+':''}${fmt(c*100,1)}%</span></td>`}
    h+='</tr>';
  });
  document.getElementById('gheat').innerHTML=h;
  document.getElementById('gcut').innerHTML=`<b>Años con caída real del gasto en un área (${cuts.length}):</b> ${cuts.join('; ')||'ninguno'}. «Caída real» significa que el gasto creció menos que los precios o bajó en euros; no dice por qué ni si fue una decisión del Gobierno central, de una comunidad o fin de una medida temporal (por ejemplo ayudas de la pandemia).`;
}

/* ---- sueldos ---- */
const SAL=[
 {y:2018,p:80953.08,v:null,m:71424.12,n:'Presupuestos 2018 (Rajoy hasta el 2-jun; Sánchez desde entonces)'},
 {y:2019,p:82978.56,v:77991.72,m:73211.28,n:'Incremento 2,25%; vicepresidente: solo Calvo'},
 {y:2020,p:84845.16,v:79746.24,m:74858.16,n:'BOE 22-ene-2020; cuatro vicepresidentes'},
 {y:2021,p:84845.16,v:79746.24,m:74858.16,n:'Congelado por enmienda a los PGE (nov-2020); el proyecto inicial preveía +0,9%. Otra fuente cita 85.608 € para el presidente: por confirmar en BOE'},
 {y:2022,p:86542.08,v:81341.16,m:null,n:'Ministro: cifra oficial pendiente de verificar'},
 {y:2023,p:90010.20,v:84600.72,m:79415.16,n:'Ley 31/2022 (PGE 2023), +4%'},
 {y:2024,p:91810.40,v:86292.74,m:81003.46,d:1,n:'Cálculo: cifra de 2023 × 1,02 (BOE-A-2024-13050 fija +2% para altos cargos). Hubo además un +0,5% consolidable con efectos desde 1-ene-2024 (BOE-A-2025-13617) cuya aplicación a altos cargos no he podido confirmar. Cifra oficial: Portal de la Administración Presupuestaria'},
 {y:2025,p:94105.66,v:88450.05,m:83028.55,d:1,n:'Cálculo: 2024 × 1,025 (RDL 14/2025, BOE-A-2025-24445). Otra fuente secundaria cita 95.943,96 € para el presidente, que no cuadra con este cálculo: por aclarar con el Portal de Transparencia'},
 {y:2026,p:95517.25,v:89776.80,m:84273.98,d:1,n:'Cálculo: 2025 × 1,015 (RDL 14/2025). Podría haber un +0,5% adicional si el IPC de 2026 ≥ 1,5% (se abonaría en 2027)'}
];
function renderSal(){
  const W=GW(),H=300,L=54,R=14,T=14,B=28,all=[];
  const yr=SAL.map(s=>s.y),x=i=>L+(i+.5)*(W-L-R)/yr.length,min=60000,max=100000,y=v=>H-B-(v-min)/(max-min)*(H-B-T);
  const defs=[['p','Presidente','var(--g10)'],['v','Vicepresidente','var(--g3)'],['m','Ministro','var(--g4)']];
  let g='';for(let k=0;k<=4;k++){const v=min+(max-min)*k/4;g+=`<line class="ax" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${fmt(v/1000,0)}k€</text>`}
  SAL.forEach((s,i)=>g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle">${s.y}</text>`);
  defs.forEach(([k,n,c])=>{
    let d='',pen=false,d2='';SAL.forEach((s,i)=>{if(s[k]==null){pen=false;return}if(s.d){d2+=(d2||!i?'':'')+(!d2?'M'+x(i-1)+' '+y(SAL[i-1][k])+'L':'L')+x(i)+' '+y(s[k]);return}d+=(pen?'L':'M')+x(i)+' '+y(s[k]);pen=true});
    g+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="2.4"/>`+(d2?`<path d="${d2}" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="5 4"/>`:'');
    SAL.forEach((s,i)=>{if(s[k]!=null)g+=s.d?`<circle cx="${x(i)}" cy="${y(s[k])}" r="4" fill="var(--panel)" stroke="${c}" stroke-width="2"><title>${n} ${s.y} (cálculo): ${fmt(s[k],2)} €</title></circle>`:`<circle cx="${x(i)}" cy="${y(s[k])}" r="4" fill="${c}"><title>${n} ${s.y}: ${fmt(s[k],2)} €</title></circle>`});
  });
  document.getElementById('gsal').innerHTML=`<svg class="gsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sueldos brutos anuales">${g}</svg><div class="gl">${defs.map(d=>`<span style="display:flex;gap:6px;align-items:center"><i style="width:14px;height:3px;background:${d[2]}"></i>${d[1]}</span>`).join('')}</div>`;
  const cell=(v,d)=>v==null?'<span class="na">pendiente</span>':d?'<span class="na">≈ '+fmt(v,2)+' €</span>':fmt(v,2)+' €';
  document.getElementById('gsaltb').innerHTML='<tr><th>Año</th><th>Presidente</th><th>Vicepresid.</th><th>Ministro</th><th style="text-align:left">Nota</th></tr>'+SAL.map(s=>`<tr><td>${s.y}</td><td>${cell(s.p,s.d)}</td><td>${cell(s.v,s.d)}</td><td>${cell(s.m,s.d)}</td><td style="text-align:left;white-space:normal;min-width:240px">${s.n}</td></tr>`).join('');
  const a=SAL[0],b=SAL[5];
  document.getElementById('gsalsrc').innerHTML=`<b>Lectura.</b> Entre 2018 y 2023 el sueldo base del presidente pasó de ${fmt(a.p,0)} a ${fmt(b.p,0)} € (+${fmt((b.p/a.p-1)*100,1)}%); el del ministro, de ${fmt(a.m,0)} a ${fmt(b.m,0)} € (+${fmt((b.m/a.m-1)*100,1)}%). Los precios (IPCA) subieron un ${fmt((HICP[2023]/HICP[2018]-1)*100,1)}% en ese tiempo. Fuentes: <a href="https://www.publico.es/politica/coste-sueldos-altos-cargos-sube-15-9-gobierno-sanchez.html" target="_blank" rel="noopener">Público/Europa Press (dic-2018)</a>, <a href="https://www.ultimahora.es/noticias/nacional/2018/12/27/1047603/pedro-sanchez-cobrara-000-euros-mas-ano-mariano-rajoy.html" target="_blank" rel="noopener">Última Hora (dic-2018)</a>, <a href="https://www.elindependiente.com/?p=800270" target="_blank" rel="noopener">El Independiente (ene-2020)</a>, <a href="https://valenciaplaza.com/valenciaplaza/el-psoe-y-unidas-podemos-corrigen-los-presupuestos-y-congelan-el-sueldo-de-pedro-sanchez-y-sus-ministros" target="_blank" rel="noopener">Valencia Plaza (nov-2020)</a>, <a href="https://www.eldiario.es/politica/sanchez-y-sus-ministros-si-se-aplican-en-2021-la-subida-salarial-que-se-rechazo-en-el-congreso-para-los-diputados_1_6369810.html" target="_blank" rel="noopener">elDiario.es (2020)</a>, <a href="https://vozpopuli.com/espana/sanchez-ministros-suben-sueldo-4-por-encima-funcionarios.html" target="_blank" rel="noopener">Vozpópuli (oct-2022)</a>, <a href="https://theobjective.com/espana/2022-10-06/sueldo-sanchez-gobierno/" target="_blank" rel="noopener">The Objective (oct-2022)</a>, <a href="https://netoapp.es/blog/cuanto-cobra-el-presidente-del-gobierno/" target="_blank" rel="noopener">Netoapp (2025)</a>, <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-13050" target="_blank" rel="noopener">BOE-A-2024-13050 (+2% en 2024)</a>, <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-24445" target="_blank" rel="noopener">RDL 14/2025 (+2,5% en 2025 y +1,5% en 2026)</a>. La mayoría son prensa que cita los Presupuestos y el BOE: el siguiente paso es contrastar cada cifra con el texto oficial.`;
}


/* ---- conceptos y personal político ---- */
function renderCoste(){
  const L=(t,u)=>`<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
  const rows=[
   ['Sueldo base (ministro)','79.415,16 € / año (2023)','12 mensualidades, sin pagas extra. '+L('Vozpópuli / The Objective','https://vozpopuli.com/espana/sanchez-ministros-suben-sueldo-4-por-encima-funcionarios.html')],
   ['Dieta de manutención y alojamiento (solo ministros que son diputados)','917,03 € / mes en Madrid y 1.921,20 € / mes en otras circunscripciones (2020); 958,75 € / mes (2023, según prensa)','Es compatible con el sueldo de ministro. Hay casos de ministros con vivienda oficial o domicilio en Madrid que la han cobrado y el Supremo avaló el derecho en la etapa de Rajoy. '+L('Maldita (2020)','https://maldita.es/malditateexplica/20200113/ni-vicepresidentes-ni-ministros-tienen-derecho-a-una-paga-vitalicia-como-maximo-pueden-obtener-una-paga-del-80-de-su-sueldo-durante-dos-anos/')+' · '+L('Vozpópuli (nov-2023)','https://www.vozpopuli.com/espana/90-010-euros-anuales-sanchez-dietas-ministros-costara-nuevo-gobierno.html')],
   ['Vivienda oficial en Madrid','Sin cifra publicada','Disponible hasta el cese; según Newtral la usaron 14 de los 22 ministros del Gobierno anterior (cita de Vozpópuli).'],
   ['Coche oficial y conductor','Sin cifra publicada','Lo tienen presidente, vicepresidentes, ministros y secretarios de Estado mientras ocupan el cargo.'],
   ['Escolta y seguridad','Sin cifra publicada','Puede asignarla el Ministerio del Interior.'],
   ['Viajes, taxis, comidas y combustible oficiales','Sin total publicado','Los paga el Estado. Solo hay respuestas sueltas a peticiones de transparencia (ver abajo).'],
   ['Cotizaciones a la Seguridad Social y trienios','Sin cifra publicada','Coste para el Estado además del sueldo; los trienios dependen de cada persona.'],
   ['Indemnización al cesar','Hasta el 80% del sueldo, el mismo tiempo que se estuvo en el cargo, máximo 2 años (≈127.064 € como tope con el sueldo de 2023)','Ley 74/1980, art. 10.5. No es una pensión vitalicia. '+L('Maldita (ene-2020)','https://maldita.es/malditateexplica/20200113/ni-vicepresidentes-ni-ministros-tienen-derecho-a-una-paga-vitalicia-como-maximo-pueden-obtener-una-paga-del-80-de-su-sueldo-durante-dos-anos/')]
  ];
  document.getElementById('gcomp').innerHTML='<tr><th>Concepto</th><th style="text-align:left">Importe documentado</th><th style="text-align:left">Notas y fuente</th></tr>'+rows.map(r=>`<tr><td>${r[0]}</td><td style="text-align:left;white-space:normal;min-width:170px">${r[1].startsWith('Sin')?'<span class="na">'+r[1]+'</span>':r[1]}</td><td style="text-align:left;white-space:normal;min-width:240px">${r[2]}</td></tr>`).join('');
  document.getElementById('gcomptot').innerHTML='<b>Orden de magnitud, no un total oficial.</b> Sueldo de 79.415 € (2023) + dieta de 958,75 € × 12 = 11.505 €: unos <b>90.920 € al año</b> para un ministro que es diputado y la cobra, y 79.415 € para uno que no. A eso hay que sumar los conceptos «sin cifra publicada», que no puedo estimar sin inventar.';
  const P=[['Altos cargos',70.7,85.4],['Personal eventual o de confianza',41.4,75.4],['«Otros» (no definido)',20.1,89.6]];
  const d=HICP[2018]/HICP[2024],t0=P.reduce((a,p)=>a+p[1],0),t1=P.reduce((a,p)=>a+p[2],0),mx=Math.max(t0,t1*d)*1.0;
  const bar=(lab,vals,sc)=>`<div class="dv" style="grid-template-columns:minmax(96px,150px) 1fr 70px"><span>${lab}</span><div class="tr" style="background:none;display:flex;gap:1px"><div class="bb" style="position:static;height:16px;width:0;background:var(--g1)" data-w="${vals[0]*sc/mx*100}"></div><div class="bb" style="position:static;height:16px;width:0;background:var(--g9)" data-w="${vals[1]*sc/mx*100}"></div><div class="bb" style="position:static;height:16px;width:0;background:var(--g4)" data-w="${vals[2]*sc/mx*100}"></div></div><span class="v">${fmt(vals.reduce((a,b)=>a+b,0),1)} M€</span></div>`;
  document.getElementById('gpol').innerHTML=bar('2018',P.map(p=>p[1]),1)+bar('2024 (corrientes)',P.map(p=>p[2]),1)+bar('2024 (de 2018)',P.map(p=>p[2]*d),1)+`<div class="gl">${P.map((p,i)=>`<span style="display:flex;gap:6px;align-items:center"><i style="width:10px;height:10px;border-radius:3px;background:${['var(--g1)','var(--g9)','var(--g4)'][i]}"></i>${p[0]}</span>`).join('')}</div>`;
  requestAnimationFrame(()=>document.querySelectorAll('#gpol .bb').forEach(b=>b.style.width=b.dataset.w+'%'));
  const real=t1*d;
  document.getElementById('gpolt').innerHTML=`<b>Lectura.</b> Total: ${fmt(t0,1)} M€ en 2018 y ${fmt(t1,1)} M€ en 2024 (+${fmt((t1/t0-1)*100,1)}% corrientes; +${fmt((real/t0-1)*100,1)}% quitando inflación). Altos cargos: ${fmt(P[0][1],1)} → ${fmt(P[0][2],1)} M€ (+${fmt((P[0][2]/P[0][1]-1)*100,1)}% corrientes, +${fmt((P[0][2]*d/P[0][1]-1)*100,1)}% reales). La mayor parte del aumento está en «personal eventual» y en «otros», cuyo contenido no se define. En conjunto son ${fmt(t1/TOT[6]*100,3)}% del gasto público total de 2024. Hubo además más ministerios y más altos cargos (de 671 a 811 según Libre Mercado, jun-2025), que explican parte de la subida. Fuentes: <a href="https://www.eldiariodemadrid.es/articulo/economia/gasto-personal-politico-altos-cargos-asesores-dispara-2024/20260109080951117880.html" target="_blank" rel="noopener">El Diario de Madrid (ene-2026, datos IGAE)</a>, <a href="https://www.libertaddigital.com/libremercado/2025-08-25/lu-sanchez-gasta-un-82-por-ciento-mas-en-asesores-que-rajoy-y-2025-va-camino-de-marcar-un-nuevo-record-7287219/" target="_blank" rel="noopener">Libre Mercado (ago-2025)</a>, que coincide con la suma de altos cargos y eventuales (112,1 y 160,8 M€). Límites: la prensa que lo difunde dice «+94%» y sus propias cifras dan +90%; compara 2018 (año con dos Gobiernos) con 2024.`;
}

/* ---- vuelos ---- */
function renderFly(){
  const C=[
   {t:'Flota VIP del Gobierno, mar-2021 a may-2023',b:'3.132 vuelos',p:'Cinco Falcon 900 y cuatro Airbus (A310 y A330) en 790 jornadas: unos 4 trayectos al día. Estimación de la web falcondespega.es: unos 17 M€ en combustible, 55.507 t de CO₂ y unos 6.000 €/hora de vuelo.',l:'Límites: web de terceros; no se puede asignar cada vuelo a una persona (presidente y Casa Real usan los aviones indistintamente) e incluye vuelos de mantenimiento y maniobras militares. El coste es una estimación, no una cifra oficial.',s:['The Objective (2-may-2023)','https://theobjective.com/espana/politica/2023-05-02/falcon-sanchez-3130-vuelos-55500-toneladas-co2-retiro-donana/']},
   {t:'Comparativa entre presidentes',b:'Aznar 240 · Zapatero 240 · Rajoy 150 · Sánchez 800+',p:'Vuelos del avión oficial según El Debate (31-mar-2024): Aznar 240 en 8 años, Zapatero 240 en 7, Rajoy 150 en 7, Felipe González 165 en 14, Sánchez más de 800 en unos 6 (otra cifra del mismo texto: 615 entre jun-2018 y sep-2022).',l:'No son comparables sin más: periodos distintos, la cifra de Sánchez es una estimación y el texto no nombra el conjunto de datos de origen. No dice cuántos vuelos fueron oficiales o de otro tipo.',s:['El Debate (31-mar-2024)','https://www.eldebate.com/motor/20240331/aznar-zapatero-felipe-gonzalez-rajoy-sanchez-presidentes-han-usado-avion-oficial_185601.html']},
   {t:'Respuesta oficial: viaje a Castellón, jul-2018',b:'282,92 €',p:'Presidencia respondió (28-dic-2018) a una petición de transparencia que el gasto «computado por el Departamento de Protocolo los días previos» al viaje Madrid–Castellón de 20–21 jul-2018 fue de 282,92 €.',l:'Esa cifra no incluye el coste de operar el avión. El Consejo de Transparencia había ordenado informar del coste total y, según el medio, el Gobierno no lo hizo en plazo. Un piloto citado estima solo el combustible de ida y vuelta en unos 5.000 €.',s:['Mediterráneo Digital (1-ene-2019)','https://www.mediterraneodigital.com/espana/comunidad-valenciana/pedro-sanchez-dice-que-sus-viajes-en-falcon-solo-cuestan-282-euros']}
  ];
  document.getElementById('gfly').innerHTML=C.map(c=>`<article class="gcard rv"><span class="gtag p">Dato parcial</span><h3>${c.t}</h3><div class="big3">${c.b}</div><p>${c.p}</p><p>${c.l}</p><p class="srcs">Fuente: ${LK(c.s)}</p></article>`).join('');
}

/* ---- impuestos ---- */
function renderTax(){
  const W=GW(),H=240,L=54,R=14,T=14,B=28,min=36,max=44,x=i=>L+(i+.5)*(W-L-R)/TAXR.length,y=v=>H-B-(v-min)/(max-min)*(H-B-T);
  let g='';for(let k=0;k<=4;k++){const v=min+(max-min)*k/4;g+=`<line class="ax" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${fmt(v,0)}%</text>`}
  const d=TAXR.map((t,i)=>(i?'L':'M')+x(i)+' '+y(t[1])).join('');
  g+=`<path d="${d}" fill="none" stroke="var(--g9)" stroke-width="2.6"/>`+TAXR.map((t,i)=>`<circle cx="${x(i)}" cy="${y(t[1])}" r="4" fill="var(--g9)"><title>${t[0]}: ${t[1]}% del PIB</title></circle><text x="${x(i)}" y="${y(t[1])-9}" text-anchor="middle">${fmt(t[1],1)}</text><text x="${x(i)}" y="${H-8}" text-anchor="middle">${t[0]}</text>`).join('');
  document.getElementById('gtax').innerHTML=`<div class="sources" style="margin-bottom:6px"><b>Ingresos totales de las Administraciones, % del PIB.</b> Incluye impuestos y cotizaciones. 2020–2021 reflejan el efecto de la pandemia sobre el PIB.</div><svg class="gsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ingresos públicos en porcentaje del PIB">${g}</svg>`;
  const C=[
   {t:'Quienes cuentan «subidas»',b:'81 (dic-2024) · ~140 (abr-2026)',p:'El Instituto Juan de Mariana, un think tank liberal, cuenta las subidas de impuestos y cotizaciones desde 2018 (81 en dic-2024, otras 46 en negociación; unas 140 en su informe de 2026) y estima unos 1.657 € más por hogar al año que en 2018. Su método de recuento no se detalla en las notas de prensa.',s:['El Debate (dic-2024)','https://www.eldebate.com/economia/20241211/montero-presume-rebajas-fiscales-gobierno-subir-81-veces-impuestos_252339.html'],s2:['El Español (20-abr-2026)','https://www.elespanol.com/sociedad/20260420/economistas-coinciden-ganado-impuestos-mismo-periodo/1003744207932_0.html']},
   {t:'Quienes cuentan «rebajas»',b:'30.000 M€',p:'La entonces ministra de Hacienda, María Jesús Montero, defendió en el Congreso rebajas de 30.000 M€ en IVA e IRPF para clase media y trabajadora. Esa cifra incluye bonificaciones temporales al combustible que ya se retiraron.',s:['El Debate (dic-2024)','https://www.eldebate.com/economia/20241211/montero-presume-rebajas-fiscales-gobierno-subir-81-veces-impuestos_252339.html']},
   {t:'El informe de ABC (oct-2026)',b:'141 alzas',p:'El 7-oct-2026 ABC publicó un balance de ocho años con «141 alzas de impuestos». No he podido leerlo (el medio bloquea el acceso desde aquí), así que no reproduzco sus cifras. Por la coincidencia con la cifra de ~140 del Instituto Juan de Mariana, probablemente usa ese recuento: sin verificar.',s:['ABC (7-oct-2026)','https://www.abc.es/economia/balance-ocho-anos-gobierno-141-alzas-impuestos-20261007012122-nt.html']}
  ];
  document.getElementById('gtaxc').innerHTML=C.map(c=>`<article class="gcard rv"><span class="gtag p">Cifra de parte</span><h3>${c.t}</h3><div class="big3">${c.b}</div><p>${c.p}</p><p class="srcs">Fuente: ${LK(c.s)}${c.s2?' · '+LK(c.s2):''}</p></article>`).join('')+'<article class="gcard rv"><span class="gtag">Contexto</span><h3>Qué sí es objetivo</h3><p>Contar «subidas» y «rebajas» depende de qué se cuenta y cómo se pondera: una sola subida de un impuesto grande puede pesar más que cien pequeñas. El dato objetivo es el de arriba: los ingresos públicos pasaron del 39,0% del PIB en 2018 al 42,3% en 2024, con la inflación aumentando la recaudación.</p></article>';
}

/* ---- pendientes ---- */
function renderPend(){
  const DOC=[
   {t:'Viajes de una ministra: caso documentado',b:'7.925 €',p:'El Ministerio de Trabajo respondió a una solicitud de transparencia que tres viajes de 2025 (París, 12–13 feb; Buenos Aires y Montevideo, 26 feb–2 mar) costaron 1.584 € y 6.341 € en transporte y alojamiento, con una comitiva de ocho personas en total.',l:'Límites: según el medio, las cifras parecen cubrir solo a la ministra y no a toda la delegación; no hay desglose por persona y se respondió fuera de plazo. Es un caso aislado, no una comparación entre ministros.',s:['The Objective (16-oct-2025)','https://theobjective.com/espana/politica/2025-10-16/diaz-7-900-euros-tres-viajes/']},
   {t:'Ley de Administración Abierta (anteproyecto)',b:'No está en vigor',p:'El Consejo de Ministros aprobó el 7-oct-2025 un anteproyecto que obligaría a publicar agendas institucionales y viajes oficiales de los altos cargos hasta subdirectores generales, con multas coercitivas de 600 a 1.000 € por incumplir.',l:'Aún debe pasar por informes y por el Congreso. No dice si cubriría viajes anteriores a esa fecha.',s:['The Objective (7-oct-2025)','https://theobjective.com/espana/2025-10-07/gobierno-altos-cargos-publicar-viajes-agendas/']}
  ];
  document.getElementById('gdoc').innerHTML=DOC.map(c=>`<article class="gcard rv"><span class="gtag p">Dato parcial</span><h3>${c.t}</h3><div class="big3">${c.b}</div><p>${c.p}</p><p>${c.l}</p><p class="srcs">Fuente: ${LK(c.s)}</p></article>`).join('');
  const P=[
   ['Gastos de viaje de todos los ministros','Solo hay respuestas sueltas a solicitudes de transparencia (ver tarjeta de arriba). Hasta reunir las de todos los ministros y de todos los Gobiernos con la misma plantilla, no se publica ningún ranking.'],
   ['Declaraciones de bienes y actividades','Patrimonio e intereses que cada cargo declara por ley. Existen en el Portal de Transparencia; falta extraerlas ministro a ministro.'],
   ['Asesorías y contratos','Plataforma de Contratación del Sector Público: se puede consultar, pero es enorme. Haré una selección con criterio público (mayores contratos de asesoría por ministerio).'],
   ['Coche oficial y flota','Número de vehículos, conductores y coste. Pendiente de documentos.'],
   ['Sueldos 2024–2026 por cargo','Las cifras oficiales por cargo están en el Portal de la Administración Presupuestaria (no accesible desde aquí). Mientras tanto se muestra un cálculo marcado como tal.'],
   ['Cuentas de los partidos','Cuentas anuales y gastos electorales de todos los partidos desde el Tribunal de Cuentas. Misma plantilla para todos.']
  ];
  document.getElementById('gpend').innerHTML=P.map(p=>`<article class="gcard rv"><span class="gtag p">Pendiente</span><h3>${p[0]}</h3><p>${p[1]}</p></article>`).join('');
}
document.getElementById('gsrc').innerHTML='<b>Fuentes de las series.</b> Gasto por áreas: '+LK(SRC.eu)+'. Inflación: '+LK(SRC.hicp)+' (euros constantes = euros × IPCA 2018 / IPCA del año). PIB: '+LK(SRC.gdp)+'. Ingresos: '+LK(SRC.main)+'. La clasificación COFOG de la ONU asigna cada gasto a una función; «Servicios públicos generales» incluye, entre otros, los intereses de la deuda y «Asuntos económicos» incluye subvenciones y ayudas a empresas. Último dato disponible: 2024 (provisional).';
renderCtl();renderStack();renderDiv();renderSal();renderCoste();renderFly();renderTax();renderPend();
(function(){let w=GW(),t;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(()=>{if(GW()!==w){w=GW();renderStack();renderSal();renderTax()}},200)})})();
if(window.rvReady)rvScan();
