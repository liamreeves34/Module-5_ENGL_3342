// Measures computed text/background contrast for every visible text node at each width.
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch();
 for (const p of process.argv.slice(2)) for (const w of [1440,1024,820,390]) {
  const pg = await b.newPage({ viewport:{width:w,height:900} }); await pg.goto('file://'+path.resolve(p)); await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => {
   const rgb=s=>s.match(/[\d.]+/g).map(Number); const L=c=>{c=c.slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
   const bg=el=>{while(el){const c=rgb(getComputedStyle(el).backgroundColor);if(c.length<4||c[3]>0.9)return c;el=el.parentElement}return [238,243,228]};
   const out=[];const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
   while(tw.nextNode()){const t=tw.currentNode;if(!t.textContent.trim())continue;const el=t.parentElement;const cs=getComputedStyle(el);if(cs.display==='none'||!el.offsetParent&&cs.position!=='fixed')continue;
    const a=L(rgb(cs.color)),c=L(bg(el));const cr=(Math.max(a,c)+.05)/(Math.min(a,c)+.05);const fs=parseFloat(cs.fontSize),bold=+cs.fontWeight>=700;const large=fs>=24||(bold&&fs>=18.66);
    out.push({t:t.textContent.trim().slice(0,28),cr:+cr.toFixed(2),fs,pass:cr>=(large?3:4.5)});}
   out.sort((x,y)=>x.cr-y.cr);return {min:out.slice(0,3),fails:out.filter(o=>!o.pass).length,n:out.length};});
  console.log(path.basename(p),w,`checked ${r.n} fails ${r.fails} lowest`,JSON.stringify(r.min)); await pg.close(); }
 await b.close(); })();
