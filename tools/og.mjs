// Genera las imágenes de vista previa (WhatsApp, redes) con una captura real de cada página, tal como se ve hoy.
import {createRequire} from 'module';import fs from 'fs';import path from 'path';
const require=createRequire(import.meta.url);const {chromium}=require('playwright');
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const pages=fs.readdirSync(root).filter(f=>f.endsWith('.html')&&!f.startsWith('google'));
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1200,height:630},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
const done=new Set();
for(const f of pages){
  const h=fs.readFileSync(path.join(root,f),'utf8');
  const m=h.match(/og:image" content="[^"]*\/assets\/(og-[a-z-]+\.png)/);if(!m)continue;
  // varias páginas comparten imagen: manda la que se llama igual que el archivo
  const own='og-'+f.replace('.html','')+'.png';
  if(m[1]!==own&&done.has(m[1]))continue;
  const p=await ctx.newPage();
  await p.goto('file://'+path.join(root,f));await p.waitForTimeout(900);
  await p.addStyleTag({content:'.addhome,.newdom,.totop,.wshare,.msheet,nav.tabs,.prog,.cookie,#cookie{display:none!important}html{scroll-behavior:auto!important}'});
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(200);
  await p.screenshot({path:path.join(root,'assets',m[1]),clip:{x:0,y:0,width:1200,height:630}});
  done.add(m[1]);await p.close();console.log('og',f,'->',m[1]);
}
await b.close();
// versión en la URL de la imagen: WhatsApp y otras redes guardan la vista previa por dirección y así se refresca
const v=new Date().toISOString().slice(5,16).replace(/[-T:]/g,'');
for(const f of pages){const p=path.join(root,f);let h=fs.readFileSync(p,'utf8');
  const n=h.replace(/(assets\/og-[a-z-]+\.png)(\?v=\d+)?/g,'$1?v='+v);if(n!==h)fs.writeFileSync(p,n)}
