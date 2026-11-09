// Comprueba que las cifras de PRED y los textos fijos del HTML coinciden. Falla si algo no cuadra.
import fs from 'fs';
const s=fs.readFileSync('assets/prediccion-data.js','utf8');
const P=(0,eval)('('+s.replace(/^[^=]*=/,'').replace(/;\s*$/,'')+')');
const err=[];const K=['PP','PSOE','VOX','SUMAR'];
const E=P.escPrivadas,B=P.escBase.priv;
if(P.n!==P.privadas.length)err.push('PRED.n != privadas.length');
if(P.escBaseBloq.priv.PV!==B.PP+B.VOX)err.push('PV hoy != PP+Vox hoy');
if(E.ppVox.c!==E.escanos.PP.c+E.escanos.VOX.c)err.push('PV 29-N != PP+Vox 29-N');
K.forEach(k=>{const e=E.escanos[k];if(!(e.p10<=e.c&&e.c<=e.p90))err.push('central fuera del rango '+k);
  const r=E.ruta[k],u=r[r.length-1];if(u.esc!==e.c)err.push('ruta final != central '+k)});
const f1=x=>x.toFixed(1);
['index.html','prediccion.html','metodo.html'].forEach(h=>{const t=fs.readFileSync(h,'utf8');
  const m=[...t.matchAll(/class="npol">(\d+)</g)];m.forEach(x=>{if(+x[1]!==P.n)err.push(h+': npol '+x[1]+' != '+P.n)})});
if(err.length){console.error('INCOHERENCIA:\n- '+err.join('\n- '));process.exit(1)}console.log('Coherencia de cifras: OK');
