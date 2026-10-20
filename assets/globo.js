/* ================= GLOBO 3D DE VUELOS =================
   Globo giratorio dibujado en un <canvas> sin librerías: la textura es el mapa de calor de países (misma proyección que el mapa plano:
   lon = (x - 470,5) / 2,778 ; lat = (223 - y) / 2,778) y los aviones vuelan en arcos sobre la superficie desde Madrid a los destinos.
   Se llama a initGlobo({G,D,mkSC,LAND}) una vez y a globoSet(W) cuando cambian los filtros (W = {ISO: nº de vuelos}). */
(function(){
  const SX=1000/360,X0=470.5,Y0=223,LON_L=-X0/SX,TOFF=27,TS=1.44,TW=1440,TH=720;   // texturas: 1.440 × 720 px, de 90° N a 90° S
  const d2r=Math.PI/180,TILT=24*d2r,cT=Math.cos(TILT),sT=Math.sin(TILT);
  const SEA='#c4dbee',SPAIN='#52657c',NS=440,R=NS/2-5,C=NS/2;
  const ll=(x,y)=>[(x-X0)/SX,(Y0-y)/SX];                                   // coordenadas del mapa plano → [lon, lat] en grados
  const vec=(lon,lat)=>{lon*=d2r;lat*=d2r;const c=Math.cos(lat);return [c*Math.sin(lon),Math.sin(lat),c*Math.cos(lon)]};
  let curUrl,cfg,cv,ctx,paths={},tex,tctx,arcs=[],planes=[],base,rowT,pix,img,out,lonC=-3.7,drag=null,t0=0,rot=0,run=false,vis=true,last=0,
      reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,madrid=vec(-3.7,40.4),grad;
  function pre(){   // píxel → (longitud relativa, fila de textura): con la inclinación fija, solo hay que sumar el giro en cada fotograma
    pix=[];const b=[],r=[];
    for(let py=0;py<NS;py++)for(let px=0;px<NS;px++){
      const nx=(px+.5-C)/R,ny=(C-(py+.5))/R,d2=nx*nx+ny*ny;if(d2>1)continue;
      const nz=Math.sqrt(1-d2),yw=ny*cT+nz*sT,zw=-ny*sT+nz*cT,lat=Math.asin(yw)/d2r,lon=Math.atan2(nx,zw)/d2r;
      pix.push(py*NS+px);b.push(lon/360*TW);r.push(Math.min(TH-1,Math.max(0,Math.floor((Y0-SX*lat+TOFF)*TS)))*TW)}
    base=Float32Array.from(b);rowT=Int32Array.from(r);pix=Int32Array.from(pix)}
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
      tex=new Uint32Array(tctx.getImageData(0,0,TW,TH).data.buffer)};
    paint(url&&imgs[url]&&imgs[url].complete?imgs[url]:null);
    if(url&&!(imgs[url]&&imgs[url].complete)){const im=imgs[url]=new Image();im.onload=()=>{if(curUrl===url){paint(im);if(!run)frame(performance.now())}};im.src=url}
    curUrl=url}
  function buildArcs(W){
    arcs=[];planes=[];const G=cfg.G,top=Object.entries(W).filter(([k,v])=>v>0&&k!=='ESP'&&G.cent[k]).sort((a,b)=>b[1]-a[1]).slice(0,45);
    if(!top.length)return;const mx=top[0][1],A=madrid;
    top.forEach(([k,v],i)=>{
      const [lo,la]=ll(...G.cent[k]),B=vec(lo,la),dot=Math.max(-1,Math.min(1,A[0]*B[0]+A[1]*B[1]+A[2]*B[2])),om=Math.acos(dot);if(om<.02)return;
      const so=Math.sin(om),alt=.05+.2*om/Math.PI,pts=[];
      for(let j=0;j<=44;j++){const t=j/44,a=Math.sin((1-t)*om)/so,b=Math.sin(t*om)/so,h=1+alt*Math.pow(Math.sin(Math.PI*t),.85);
        pts.push([(a*A[0]+b*B[0])*h,(a*A[1]+b*B[1])*h,(a*A[2]+b*B[2])*h,a*A[0]+b*B[0],a*A[1]+b*B[1],a*A[2]+b*B[2]])}
      const w=.7+1.7*Math.log(1+v)/Math.log(1+mx),a={pts,w,v,dur:5.5+om*5};arcs.push(a);
      const np=1+(v>mx*.12?1:0)+(v>mx*.45?1:0);for(let q=0;q<np;q++)planes.push({a,ph:((i*.3819+q*.4143)%1),dir:q%2?-1:1})})}
  function proj(x,y,z){   // vector del globo → pantalla (y visibilidad)
    const cL=Math.cos(lonC*d2r),sL=Math.sin(lonC*d2r),x2=x*cL-z*sL,z2=x*sL+z*cL,ny=y*cT-z2*sT,nz=y*sT+z2*cT;
    return [C+x2*R,C-ny*R,nz>0||x2*x2+ny*ny>1]}
  function frame(ms){
    // 1) superficie: cada píxel del disco lee su color en la textura
    const cp=(((lonC-LON_L)/360)%1+1)%1*TW;
    for(let i=0;i<pix.length;i++){let t=(base[i]+cp)|0;if(t<0)t+=TW;else if(t>=TW)t-=TW;out[pix[i]]=tex[rowT[i]+t]}
    ctx.clearRect(0,0,NS,NS);ctx.putImageData(img,0,0);
    ctx.save();ctx.beginPath();ctx.arc(C,C,R,0,6.2832);ctx.fillStyle=grad;ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle='rgba(30,50,80,.35)';ctx.stroke();ctx.restore();
    // 2) rutas: línea base sobre la superficie (tenue) y arco elevado (negro)
    ctx.lineCap='round';ctx.lineJoin='round';
    arcs.forEach(a=>{
      ctx.beginPath();let on=false;a.pts.forEach(p=>{const q=proj(p[3],p[4],p[5]);if(q[2]&&Math.hypot(q[0]-C,q[1]-C)<=R+.5){on?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);on=true}else on=false});
      ctx.strokeStyle='rgba(10,16,24,.13)';ctx.lineWidth=a.w*.8;ctx.stroke();
      ctx.beginPath();on=false;a.pts.forEach(p=>{const q=proj(p[0],p[1],p[2]);if(q[2]){on?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);on=true}else on=false});
      ctx.strokeStyle='rgba(10,16,24,.62)';ctx.lineWidth=a.w;ctx.stroke()});
    // 3) aviones: sombra en el suelo + avión elevado orientado según su rumbo
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
    // 4) Madrid
    const m=proj(madrid[0]*1.002,madrid[1]*1.002,madrid[2]*1.002);
    if(m[2]){const pu=reduce?0:((sec%2.4)/2.4);ctx.beginPath();ctx.arc(m[0],m[1],4+pu*14,0,6.2832);ctx.strokeStyle='rgba(16,22,31,'+(.55*(1-pu))+')';ctx.lineWidth=1.6;ctx.stroke();
      ctx.beginPath();ctx.arc(m[0],m[1],4.2,0,6.2832);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#14202e';ctx.stroke()}
  }
  function loop(ms){
    if(!run)return;requestAnimationFrame(loop);
    if(ms-last<30)return;const dt=Math.min(.1,(ms-last)/1000);last=ms;
    if(!drag&&!reduce)lonC+=dt*6;frame(ms)}
  function start(){if(run||reduce||!vis||document.hidden)return;run=true;last=0;requestAnimationFrame(loop)}
  function stop(){run=false}
  window.initGlobo=function(c){
    cfg=c;cv=document.getElementById('globo');if(!cv)return;cv.width=cv.height=NS;ctx=cv.getContext('2d');
    for(const k in cfg.G.world)if(k!=='ATA')paths[k]=new Path2D(cfg.G.world[k]);
    const tc=document.createElement('canvas');tc.width=TW;tc.height=TH;tctx=tc.getContext('2d',{willReadFrequently:true});
    pre();img=ctx.createImageData(NS,NS);out=new Uint32Array(img.data.buffer);
    grad=ctx.createRadialGradient(C-.35*R,C-.4*R,R*.15,C,C,R);grad.addColorStop(0,'rgba(255,255,255,.2)');grad.addColorStop(.65,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(15,30,60,.3)');
    cv.addEventListener('pointerdown',e=>{drag={x:e.clientX};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing'});
    cv.addEventListener('pointermove',e=>{if(!drag)return;lonC-=(e.clientX-drag.x)*.45;drag.x=e.clientX;if(!run)frame(performance.now())});
    const up=()=>{drag=null;cv.style.cursor='grab'};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    new IntersectionObserver(es=>{vis=es[0].isIntersecting;vis?start():stop()},{threshold:.05}).observe(cv);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start())};
  window.globoSet=function(W,url){if(!cfg||!cv)return;buildTex(W,url);buildArcs(W);if(reduce||!run)frame(performance.now());start()};
})();
