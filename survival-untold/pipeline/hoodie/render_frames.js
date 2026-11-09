const { chromium } = require('playwright'); const path=require('path'), fs=require('fs');
(async()=>{const dir=process.argv[3];fs.mkdirSync(dir,{recursive:true});const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.error('PAGEERROR',e.message));
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForFunction(()=>window.renderFrame);
const [a,e]=[+process.argv[4],+process.argv[5]];
for(let f=a;f<e;f++){await p.evaluate(n=>window.renderFrame(n),f);await p.screenshot({path:path.join(dir,String(f).padStart(5,'0')+'.jpg'),type:'jpeg',quality:92});}
await b.close();})();
