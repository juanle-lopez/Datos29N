// Día electoral: comparativa interactiva con 28-A y 10-N de 2019 y 23-J de 2023, frente al «hoy» del modelo (datos en comp-data.js).
(function(){
  if(typeof COMP==='undefined')return;
  const $=id=>document.getElementById(id);
  const N={PP:'PP',PSOE:'PSOE',VOX:'Vox',SUMAR:'Sumar / Podemos',CS:'Cs'};
  const COL={PP:'var(--pp)',PSOE:'var(--psoe)',VOX:'var(--vox)',SUMAR:'var(--sumar)',CS:'#d9812b'};
  const PA=['PP','PSOE','VOX','SUMAR'];
  const E=COMP.elec,H=COMP.hoy,SEATS=Object.fromEntries(COMP.prov.map(p=>[p.n,p.s]));
  const nm=(k,e)=>k==='SUMAR'?(e&&e.id!=='23J'?'Unidas Podemos':'Sumar'):N[k];
  const f1=v=>v==null?'—':v.toFixed(1).replace('.',','),sg=(v,d)=>(v>0?'+':v<0?'−':'±')+Math.abs(d==null?v:+v.toFixed(d)).toString().replace('.',',');
  let sel='23J',party='PP',metric='pct',sort='dif',q='';
  const cur=()=>E.find(e=>e.id===sel);
  const parties=e=>e.id==='23J'?PA:[...PA,'CS'];
  const win=(o,ks)=>{let b=null,bv=-1;ks.forEach(k=>{const v=o[k]&&o[k][0];if(v!=null&&v>bv){bv=v;b=k}});return b};
  const tag=k=>k?`<span class="ctag" style="--c:${COL[k]}">${k==='SUMAR'?'Sumar/UP':N[k]}</span>`:'—';
  function view(){
    const e=cur(),ks=parties(e);
    // --- selector
    $('cchips').innerHTML=E.slice().reverse().map(x=>`<button type="button" aria-pressed="${x.id===sel}" data-e="${x.id}">${x.label}</button>`).join('');
    // --- resumen nacional
    const pv=e.esc.PP+e.esc.VOX,pvh=H.esc.PP+H.esc.VOX;
    $('csum').innerHTML=`<b>${e.label}:</b> PP + Vox ${pv} escaños; hoy, con la media de encuestas, ${pvh} (${sg(pvh-pv)}). PSOE ${e.esc.PSOE} → ${H.esc.PSOE} (${sg(H.esc.PSOE-e.esc.PSOE)}).`;
    $('ccards').innerHTML=ks.map(k=>{const a=e.esc[k]||0,b=k==='CS'?null:H.esc[k],v1=e.vot&&e.vot[k],v2=k==='CS'?null:H.vot[k];
      return `<div class="hs" style="--c:${COL[k]}"><span class="hn">${nm(k,e)}</span><b>${a}${b!=null?` <i>→ ${b}</i>`:' <i>→ —</i>'}</b><small>${b!=null?sg(b-a)+' escaños · ':'ya no concurre · '}${v1!=null?f1(v1)+' % → '+(v2!=null?f1(v2)+' %':'—'):'voto: sin dato'}</small></div>`}).join('');
    // --- barras y evolución
    const mx=Math.max(...ks.map(k=>Math.max(e.esc[k]||0,H.esc[k]||0)),1);
    $('cbars').innerHTML=ks.map(k=>{const a=e.esc[k]||0,b=k==='CS'?0:H.esc[k];
      return `<div class="cbr"><span style="color:${COL[k]}">${nm(k,e)}</span><div><div class="cb" style="width:${a/mx*84}%;background:${COL[k]};opacity:.45" title="${e.label}: ${a} escaños"><em>${a}</em></div><div class="cb" style="width:${b/mx*84}%;background:${COL[k]}" title="Hoy: ${b} escaños"><em>${b}</em></div></div></div>`}).join('')+`<p class="note" style="margin:6px 0 0"><span class="ck" style="opacity:.45"></span>${e.label} &nbsp; <span class="ck"></span>Hoy (media de encuestas)</p>`;
    evo();
    // --- provincias
    $('cmetric').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m===metric)));
    $('cparty').innerHTML=['WIN',...ks.filter(k=>k!=='CS')].map(k=>`<button type="button" aria-pressed="${k===party}" data-p="${k}" ${k==='WIN'?'':`style="--c:${COL[k]}"`}>${k==='WIN'?'Primera fuerza':nm(k,e)}</button>`).join('');
    if(party==='CS')party='PP';
    table();
  }
  function evo(){
    const pts=[...E,{id:'hoy',label:'Hoy',esc:H.esc}],W=360,Ht=170,pl=40,pr=22,pt=10,pb=26,mxv=Math.max(...pts.flatMap(p=>PA.map(k=>p.esc[k]||0)));
    const X=i=>pl+i*(W-pl-pr)/(pts.length-1),Y=v=>pt+(1-v/(mxv*1.05))*(Ht-pt-pb);
    let s=`<svg viewBox="0 0 ${W} ${Ht}" class="cevo" role="img" aria-label="Escaños de cada partido en 28-A, 10-N, 23-J y hoy">`;
    [0,100,200].filter(v=>v<=mxv*1.05).forEach(v=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" class="cgr"/><text x="${pl-4}" y="${Y(v)+3}" text-anchor="end" class="cax">${v}</text>`);
    pts.forEach((p,i)=>s+=`<text x="${X(i)}" y="${Ht-8}" text-anchor="middle" class="cax${p.id===sel?' on':''}">${p.label}</text>`);
    PA.forEach(k=>{const d=pts.map((p,i)=>(p.esc[k]!=null?`${X(i)},${Y(p.esc[k])}`:null));
      const pth=d.filter(Boolean).join(' ');s+=`<polyline points="${pth}" fill="none" stroke="${COL[k]}" stroke-width="2.2" stroke-linejoin="round"/>`;
      pts.forEach((p,i)=>{if(p.esc[k]==null)return;s+=`<circle cx="${X(i)}" cy="${Y(p.esc[k])}" r="${p.id===sel?5:3.2}" fill="${COL[k]}" ${p.id!=='hoy'?`data-e="${p.id}" style="cursor:pointer"`:''}><title>${nm(k,p)} · ${p.label}: ${p.esc[k]} escaños</title></circle>`})});
    $('cevo').innerHTML=s+'</svg>';
  }
  function table(){
    const e=cur(),ks=parties(e).filter(k=>k!=='CS'),rows=[];
    COMP.prov.forEach(p=>{const a=e.prov[p.n],b=H.prov[p.n];if(!a||!b)return;
      if(q&&!p.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(q))return;
      if(party==='WIN'){const w0=win(a,parties(e)),w1=win(b,PA);rows.push({n:p.n,s:p.s,w0,w1,ch:w0!==w1,dif:w0!==w1?1:0});return}
      const i=metric==='pct'?0:1,v0=a[party][i],v1=b[party][i],nc=p.n==='Navarra'&&party==='PP';rows.push({n:p.n,s:p.s,v0,v1,nc,dif:nc||v0==null||v1==null?null:v1-v0})});
    const bn=party==='WIN'?null:Math.max(...rows.map(r=>Math.abs(r.dif||0)),1);
    rows.sort((x,y)=>sort==='name'?x.n.localeCompare(y.n,'es'):sort==='size'?y.s-x.s:party==='WIN'?(y.ch-x.ch)||(y.s-x.s):sort==='up'?(y.dif||-99)-(x.dif||-99):sort==='down'?(x.dif||99)-(y.dif||99):Math.abs(y.dif||0)-Math.abs(x.dif||0));
    let h='';
    if(party==='WIN'){
      const ch=rows.filter(r=>r.ch);
      $('cprovsum').innerHTML=`<b>${ch.length} de ${rows.length} provincias</b> cambian de primera fuerza (por % de voto, entre PP, PSOE, Vox y Sumar/UP${e.id==='23J'?'':', Cs en 2019'}) entre ${e.label} y hoy${ch.length?': '+ch.slice(0,8).map(r=>r.n).join(', ')+(ch.length>8?'…':''):''}.`;
      h=`<thead><tr><th>Provincia</th><th class="m">Esc.</th><th>${e.label}</th><th>Hoy</th></tr></thead><tbody>`+rows.map(r=>`<tr class="${r.ch?'chg':''}"><td>${r.n}</td><td class="m">${r.s}</td><td>${tag(r.w0)}</td><td>${tag(r.w1)}${r.ch?' <small>cambia</small>':''}</td></tr>`).join('')+'</tbody>';
    }else{
      const u=metric==='pct'?' pp':' esc.',tot=rows.reduce((a,r)=>a+(r.dif||0),0);
      const top=rows.filter(r=>r.dif!=null).slice().sort((x,y)=>y.dif-x.dif),up=top[0],dn=top[top.length-1];
      $('cprovsum').innerHTML=`<b>${nm(party,e)}</b> frente a ${e.label}: `+(up&&up.dif>0?`mayor subida en ${up.n} (${sg(up.dif,1)}${u}); `:'')+(dn&&dn.dif<0?`mayor bajada en ${dn.n} (${sg(dn.dif,1)}${u}).`:'sin bajadas.')+(metric==='esc'?` Suma de cambios provinciales: ${sg(tot)} escaños.`:'')+(rows.some(r=>r.nc)?' (*) Navarra no es comparable: el 29-N PP y UPN van juntos y antes concurrían por separado.':'');
      h=`<thead><tr><th>Provincia</th><th class="m">Esc.</th><th class="m">${e.label}</th><th class="m">Hoy</th><th>Cambio</th></tr></thead><tbody>`+rows.map(r=>{const d=r.dif,w=d==null?0:Math.min(100,Math.abs(d)/bn*100);
        const f=v=>v==null?'—':metric==='pct'?f1(v)+' %':v;
        return `<tr><td>${r.n}${r.nc?' *':''}</td><td class="m">${r.s}</td><td class="m">${f(r.v0)}</td><td class="m"><b>${f(r.v1)}</b></td><td><div class="dv"><i class="${d>0?'up':'dn'}" style="width:${w/2}%;${d>0?'left:50%':'right:50%'};background:${COL[party]};opacity:${d>0?1:.45}"></i></div><small>${r.nc?'no comparable':d==null?'—':sg(d,metric==='pct'?1:0)+(metric==='pct'?' pp':'')}</small></td></tr>`}).join('')+'</tbody>';
    }
    $('ctab').innerHTML=h;
  }
  const root=$('ncomp');if(!root)return;
  root.addEventListener('click',ev=>{
    const b=ev.target.closest('button[data-e],circle[data-e],button[data-p],button[data-m]');if(!b)return;
    if(b.dataset.e)sel=b.dataset.e;else if(b.dataset.p)party=b.dataset.p;else if(b.dataset.m)metric=b.dataset.m;
    if(sel==='23J'&&party==='CS')party='PP';view()});
  $('csort').addEventListener('change',e=>{sort=e.target.value;table()});
  $('cq').addEventListener('input',e=>{q=e.target.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();table()});
  view();
})();
