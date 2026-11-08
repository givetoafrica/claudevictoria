const { chromium } = require('playwright'); const path=require('path'), fs=require('fs');
(async()=>{const [scene,dir,a,b,st]=process.argv.slice(2);fs.mkdirSync(dir,{recursive:true});
const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.error('PAGEERROR',e.message));
await p.goto('file://'+path.resolve(scene));await p.waitForFunction(()=>window.renderFrame);
await p.evaluate(s=>{window.STYLE=s;},st);
for(let f=+a;f<+b;f++){await p.evaluate(n=>window.renderFrame(n),f);await p.screenshot({path:path.join(dir,String(f).padStart(5,'0')+'.jpg'),type:'jpeg',quality:92});}
await br.close();})();
