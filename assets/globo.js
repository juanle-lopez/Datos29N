/* ================= GLOBO 3D DE VUELOS =================
   Globo giratorio en 360° (sobre cualquier eje) dibujado en un <canvas> sin librerías, sobre un fondo de espacio azul muy oscuro con estrellas.
   La textura es el mapa de calor de países (misma proyección que el mapa plano: lon = (x - 470,5) / 2,778 ; lat = (223 - y) / 2,778) y los
   aviones vuelan en arcos sobre la superficie desde Madrid a los destinos.
   Se llama a initGlobo({G,D,mkSC,LAND}) una vez y a globoSet(W,urlCalor) cuando cambian los filtros (W = {ISO: nº de vuelos}). */
(function(){
  const SX=1000/360,X0=470.5,Y0=223,LON_L=-X0/SX,TOFF=27,TS=1.44,TW=1440,TH=720,KT=TW/360;   // textura 1.440 × 720 px, de 90° N a 90° S
  const d2r=Math.PI/180,SEA='#3f86b4',SPAIN='#52657c',NS=440,C=NS/2,R=178;                   // R: radio del globo (deja margen para el cielo)
  // Islas y pequeños estados visitados que no tienen contorno en el mapa: se dibujan como punto [lat, lon]
  const EXTRA={CPV:[16,-24],MLT:[35.9,14.4],VGB:[18.4,-64.6],BMU:[32.3,-64.8],SYC:[-4.7,55.5],BHR:[26,50.55]};
  const pos=(G,k)=>EXTRA[k]?[EXTRA[k][1],EXTRA[k][0]]:(G.cent[k]?ll(...G.cent[k]):null);   // → [lon, lat]
  const ll=(x,y)=>[(x-X0)/SX,(Y0-y)/SX];                                                      // mapa plano → [lon, lat] en grados
  const vec=(lon,lat)=>{lon*=d2r;lat*=d2r;const c=Math.cos(lat);return [c*Math.sin(lon),Math.sin(lat),c*Math.cos(lon)]};
  let curUrl,cfg,cv,ctx,off,octx,paths={},tex,tctx,arcs=[],planes=[],NX,NY,NZ,pix,img,out,M,sky,glow,grad,stars=[],
      drag=null,vel=[0,0],run=false,vis=true,last=0,clock=0,fr=0,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,madrid=vec(-3.7,40.4);
  // Orientación: M (3×3, por filas) pasa de vectores del globo a vectores de la cámara (x derecha, y arriba, z hacia el observador)
  function setView(lon,tilt){const cL=Math.cos(lon*d2r),sL=Math.sin(lon*d2r),cT=Math.cos(tilt*d2r),sT=Math.sin(tilt*d2r);
    M=[cL,0,-sL, -sT*sL,cT,-sT*cL, cT*sL,sT,cT*cL]}
  function mul(A,B){const o=new Array(9);for(let i=0;i<3;i++)for(let j=0;j<3;j++)o[i*3+j]=A[i*3]*B[j]+A[i*3+1]*B[3+j]+A[i*3+2]*B[6+j];return o}
  function spin(ay,ax){   // giro en el espacio de la cámara: ay alrededor del eje vertical (izquierda-derecha), ax alrededor del horizontal (arriba-abajo)
    const cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax);
    M=mul([1,0,0,0,cx,-sx,0,sx,cx],mul([cy,0,sy,0,1,0,-sy,0,cy],M));
    if(++fr%240===0){   // corrige la deriva numérica (Gram-Schmidt)
      let r0=M.slice(0,3),r1=M.slice(3,6);const n=v=>{const l=Math.hypot(v[0],v[1],v[2]);return [v[0]/l,v[1]/l,v[2]/l]};
      r0=n(r0);const d=r1[0]*r0[0]+r1[1]*r0[1]+r1[2]*r0[2];r1=n([r1[0]-d*r0[0],r1[1]-d*r0[1],r1[2]-d*r0[2]]);
      M=[...r0,...r1,r0[1]*r1[2]-r0[2]*r1[1],r0[2]*r1[0]-r0[0]*r1[2],r0[0]*r1[1]-r0[1]*r1[0]]}}
  function pre(){   // vector de cámara de cada píxel del disco (no cambia)
    const a=[],b=[],c=[],p=[];
    for(let py=0;py<NS;py++)for(let px=0;px<NS;px++){const nx=(px+.5-C)/R,ny=(C-(py+.5))/R,d2=nx*nx+ny*ny;if(d2>1)continue;a.push(nx);b.push(ny);c.push(Math.sqrt(1-d2));p.push(py*NS+px)}
    NX=Float32Array.from(a);NY=Float32Array.from(b);NZ=Float32Array.from(c);pix=Int32Array.from(p)}
  const ROW=new Int32Array(4096);for(let i=0;i<4096;i++){const wy=i/2047.5-1,lat=Math.asin(Math.max(-1,Math.min(1,wy)))/d2r;ROW[i]=Math.min(TH-1,Math.max(0,Math.floor((Y0-SX*lat+TOFF)*TS)))*TW}
  const imgs={};
  function buildTex(W,url){   // mar liso + tierra gris + campo de calor difuminado dentro de los países visitados (como en el mapa plano)
    const vis=Object.keys(W).filter(k=>W[k]>0&&paths[k]&&k!=='ESP');
    const paint=im=>{
      tctx.setTransform(1,0,0,1,0,0);tctx.fillStyle=SEA;tctx.fillRect(0,0,TW,TH);
      tctx.setTransform(TS,0,0,TS,0,TOFF*TS);tctx.lineWidth=.3;tctx.strokeStyle='rgba(255,255,255,.8)';tctx.lineJoin='round';
      for(const k in paths){tctx.fillStyle=k==='ESP'?SPAIN:cfg.LAND;tctx.fill(paths[k])}
      if(im){tctx.save();const cl=new Path2D();vis.forEach(k=>cl.addPath(paths[k]));tctx.clip(cl);tctx.drawImage(im,0,0,cfg.G.w,cfg.G.h);tctx.restore()}
      else{const cf=cfg.mkSC(vis.map(k=>W[k]));vis.forEach(k=>{tctx.fillStyle=cf(W[k]);tctx.fill(paths[k])})}
      for(const k in paths)tctx.stroke(paths[k]);
      {const cf=cfg.mkSC(Object.values(W).filter(v=>v>0));Object.keys(EXTRA).forEach(k=>{if(!(W[k]>0))return;const x=X0+SX*EXTRA[k][1],y=Y0-SX*EXTRA[k][0];tctx.beginPath();tctx.arc(x,y,2.4,0,6.2832);tctx.fillStyle=cf(W[k]);tctx.fill();tctx.lineWidth=.5;tctx.strokeStyle='#fff';tctx.stroke()})}
      tex=new Uint32Array(tctx.getImageData(0,0,TW,TH).data.buffer)};
    paint(url&&imgs[url]&&imgs[url].complete?imgs[url]:null);
    if(url&&!(imgs[url]&&imgs[url].complete)){const im=imgs[url]=new Image();im.onload=()=>{if(curUrl===url){paint(im);if(!run)frame(performance.now())}};im.src=url}
    curUrl=url}
  function buildArcs(W){
    arcs=[];planes=[];const G=cfg.G,top=Object.entries(W).filter(([k,v])=>v>0&&k!=='ESP'&&pos(G,k)).sort((a,b)=>b[1]-a[1]);   // todos los países visitados, cada uno con su ruta y al menos un avión
    if(!top.length)return;const mx=top[0][1],A=madrid;
    top.forEach(([k,v],i)=>{
      const [lo,la]=pos(G,k),B=vec(lo,la),dot=Math.max(-1,Math.min(1,A[0]*B[0]+A[1]*B[1]+A[2]*B[2])),om=Math.acos(dot);if(om<.02)return;
      const so=Math.sin(om),alt=.05+.2*om/Math.PI,pts=[];
      for(let j=0;j<=44;j++){const t=j/44,a=Math.sin((1-t)*om)/so,b=Math.sin(t*om)/so,h=1+alt*Math.pow(Math.sin(Math.PI*t),.85);
        pts.push([(a*A[0]+b*B[0])*h,(a*A[1]+b*B[1])*h,(a*A[2]+b*B[2])*h,a*A[0]+b*B[0],a*A[1]+b*B[1],a*A[2]+b*B[2]])}
      const w=.7+1.7*Math.log(1+v)/Math.log(1+mx),a={pts,w,v,dur:5.5+om*5};arcs.push(a);
      const np=1+(v>mx*.12?1:0)+(v>mx*.45?1:0);for(let q=0;q<np;q++)planes.push({a,ph:((i*.3819+q*.4143)%1),dir:q%2?-1:1})})}
  function proj(x,y,z){   // vector del globo → pantalla (y si se ve)
    const cx=M[0]*x+M[1]*y+M[2]*z,cy=M[3]*x+M[4]*y+M[5]*z,cz=M[6]*x+M[7]*y+M[8]*z;
    return [C+cx*R,C-cy*R,cz>0||cx*cx+cy*cy>1]}
  function sky_(){   // cielo: azul noche (no negro) con estrellas fijas y un halo de atmósfera
    const g=ctx.createRadialGradient(C,C,R*.6,C,C,NS*.78);g.addColorStop(0,'#16254a');g.addColorStop(1,'#0a1226');sky=g;
    const h=ctx.createRadialGradient(C,C,R*.96,C,C,R*1.12);h.addColorStop(0,'rgba(120,170,255,.38)');h.addColorStop(1,'rgba(120,170,255,0)');glow=h;
    let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;stars=[];for(let i=0;i<110;i++)stars.push([rnd()*NS,rnd()*NS,.4+rnd()*.9,.25+rnd()*.6])}
  function frame(ms){
    // 1) superficie: cada píxel del disco busca su longitud y latitud (giro libre) y lee el color de la textura
    const m0=M[0],m1=M[1],m2=M[2],m3=M[3],m4=M[4],m5=M[5],m6=M[6],m7=M[7],m8=M[8],kk=-LON_L*KT;
    for(let i=0;i<pix.length;i++){const x=NX[i],y=NY[i],z=NZ[i],
      wx=m0*x+m3*y+m6*z,wy=m1*x+m4*y+m7*z,wz=m2*x+m5*y+m8*z;
      let t=(Math.atan2(wx,wz)/d2r)*KT+kk|0;if(t<0)t+=TW;else if(t>=TW)t-=TW;
      out[pix[i]]=tex[ROW[((wy+1)*2047.5)|0]+t]}
    octx.putImageData(img,0,0);
    // 2) cielo, estrellas, atmósfera y globo
    ctx.fillStyle=sky;ctx.fillRect(0,0,NS,NS);
    stars.forEach(s=>{ctx.globalAlpha=s[3];ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s[0],s[1],s[2],0,6.2832);ctx.fill()});ctx.globalAlpha=1;
    ctx.fillStyle=glow;ctx.fillRect(0,0,NS,NS);
    ctx.drawImage(off,0,0);
    ctx.save();ctx.beginPath();ctx.arc(C,C,R,0,6.2832);ctx.fillStyle=grad;ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='rgba(160,200,255,.45)';ctx.stroke();ctx.restore();
    // 3) rutas: línea base sobre la superficie (tenue) y arco elevado
    ctx.lineCap='round';ctx.lineJoin='round';
    arcs.forEach(a=>{
      ctx.beginPath();let on=false;a.pts.forEach(p=>{const q=proj(p[3],p[4],p[5]);if(q[2]&&Math.hypot(q[0]-C,q[1]-C)<=R+.5){on?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);on=true}else on=false});
      ctx.strokeStyle='rgba(10,16,24,.13)';ctx.lineWidth=a.w*.8;ctx.stroke();
      ctx.beginPath();on=false;a.pts.forEach(p=>{const q=proj(p[0],p[1],p[2]);if(q[2]){on?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);on=true}else on=false});
      ctx.strokeStyle='rgba(10,16,24,.7)';ctx.lineWidth=a.w;ctx.stroke()});
    // 4) aviones: sombra en el suelo + avión elevado orientado según su rumbo
    const sec=ms/1000;
    planes.forEach(p=>{
      const n=p.a.pts.length-1;let t=reduce?p.ph:((sec/p.a.dur+p.ph)%1);if(p.dir<0)t=1-t;
      const f=t*n,j=Math.min(n-1,Math.floor(f)),u=f-j,P=p.a.pts[j],Q=p.a.pts[j+1],
        x=P[0]+(Q[0]-P[0])*u,y=P[1]+(Q[1]-P[1])*u,z=P[2]+(Q[2]-P[2])*u,gx=P[3]+(Q[3]-P[3])*u,gy=P[4]+(Q[4]-P[4])*u,gz=P[5]+(Q[5]-P[5])*u,
        s1=proj(x,y,z),s2=proj(Q[0],Q[1],Q[2]),s0=proj(P[0],P[1],P[2]);if(!s1[2])return;
      const g=proj(gx,gy,gz),al=Math.min(1,Math.min(t,1-t)*9),ang=Math.atan2(s2[0]-s0[0],-(s2[1]-s0[1]))+(p.dir<0?Math.PI:0);
      if(g[2]&&Math.hypot(g[0]-C,g[1]-C)<=R){ctx.save();ctx.globalAlpha=.16*al;ctx.fillStyle='#0a1018';ctx.beginPath();ctx.ellipse(g[0],g[1],4.6,2.2,0,0,6.2832);ctx.fill();ctx.restore()}
      ctx.save();ctx.translate(s1[0],s1[1]);ctx.rotate(ang);const k=.95;ctx.scale(k,k);ctx.globalAlpha=al;
      ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(1.5,-3);ctx.lineTo(8,2.6);ctx.lineTo(8,4.4);ctx.lineTo(1.3,2.6);ctx.lineTo(1,6.4);ctx.lineTo(3.4,8);ctx.lineTo(3.4,9.4);ctx.lineTo(0,8.6);ctx.lineTo(-3.4,9.4);ctx.lineTo(-3.4,8);ctx.lineTo(-1,6.4);ctx.lineTo(-1.3,2.6);ctx.lineTo(-8,4.4);ctx.lineTo(-8,2.6);ctx.lineTo(-1.5,-3);ctx.closePath();
      ctx.fillStyle='#10161f';ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='#fff';ctx.stroke();ctx.restore()});
    // 5) Madrid
    const m=proj(madrid[0]*1.002,madrid[1]*1.002,madrid[2]*1.002);
    if(m[2]){const pu=reduce?0:((sec%2.4)/2.4);ctx.beginPath();ctx.arc(m[0],m[1],4+pu*14,0,6.2832);ctx.strokeStyle='rgba(255,255,255,'+(.7*(1-pu))+')';ctx.lineWidth=1.6;ctx.stroke();
      ctx.beginPath();ctx.arc(m[0],m[1],4.2,0,6.2832);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#14202e';ctx.stroke()}
  }
  function loop(ms){
    if(!run)return;requestAnimationFrame(loop);
    if(ms-last<30)return;const dt=Math.min(.1,(ms-last)/1000);last=ms;clock+=dt;
    // giro automático en 360°: avance constante de oeste a este y un balanceo lento arriba-abajo que deja ver los polos y todas las caras
    if(!drag&&!reduce){
      const dec=Math.pow(.04,dt),k=1-dec;vel[0]*=dec;vel[1]*=dec;   // la inercia del arrastre se apaga en un par de segundos y vuelve el giro automático
      spin((vel[0]+k*(6+3*Math.sin(clock*.17))*d2r)*dt,(vel[1]+k*(10*Math.sin(clock*.21)+4*Math.sin(clock*.07+1))*d2r)*dt)}
    frame(ms)}
  function start(){if(run||reduce||!vis||document.hidden)return;run=true;last=0;requestAnimationFrame(loop)}
  function stop(){run=false}
  window.initGlobo=function(c){
    cfg=c;cv=document.getElementById('globo');if(!cv)return;cv.width=cv.height=NS;ctx=cv.getContext('2d');
    off=document.createElement('canvas');off.width=off.height=NS;octx=off.getContext('2d');
    for(const k in cfg.G.world)if(k!=='ATA')paths[k]=new Path2D(cfg.G.world[k]);
    const tc=document.createElement('canvas');tc.width=TW;tc.height=TH;tctx=tc.getContext('2d',{willReadFrequently:true});
    setView(-3.7,24);pre();img=octx.createImageData(NS,NS);out=new Uint32Array(img.data.buffer);sky_();
    grad=ctx.createRadialGradient(C-.35*R,C-.4*R,R*.15,C,C,R);grad.addColorStop(0,'rgba(255,255,255,.2)');grad.addColorStop(.65,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(5,12,35,.4)');
    cv.addEventListener('pointerdown',e=>{vel=[0,0];drag={x:e.clientX,y:e.clientY,t:performance.now()};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing'});
    cv.addEventListener('pointermove',e=>{if(!drag)return;const now=performance.now(),dt=Math.max(.008,(now-drag.t)/1000),k=.45*d2r*(NS/cv.clientWidth),ay=(e.clientX-drag.x)*k,ax=(e.clientY-drag.y)*k;spin(ay,ax);vel=[.6*vel[0]+.4*ay/dt,.6*vel[1]+.4*ax/dt];drag.x=e.clientX;drag.y=e.clientY;drag.t=now;if(!run)frame(now)});
    const up=()=>{drag=null;cv.style.cursor='grab'};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    new IntersectionObserver(es=>{vis=es[0].isIntersecting;vis?start():stop()},{threshold:.05}).observe(cv);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start())};
  window.globoSet=function(W,url){if(!cfg||!cv)return;buildTex(W,url);buildArcs(W);if(reduce||!run)frame(performance.now());start()};
})();
