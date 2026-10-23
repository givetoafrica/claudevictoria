// SOURCE CAPTURE: photograph a real web page (full length) and find the sentence to highlight.
//   node capture.js <video-name> <scene-id> <url> ["sentence to highlight"] [--width 1280] [--max 7000]
// Writes videos/<name>/captures/<scene-id>.png and <scene-id>.json ({w,h,hl:{x,y,w,h}|null,title,url,host,date}).
// film.js "source" scenes read these. Needs Chromium (CHROME_PATH or /opt/pw-browsers/chromium) and Node 22+.
const fs = require('fs'), path = require('path'), { spawn } = require('child_process'), os = require('os');
const args = process.argv.slice(2), flag = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const WIDTH = +flag('--width', 1280), MAXH = +flag('--max', 7000);
const [name, id, url, phrase] = args;
if (!name || !id || !url) { console.error('usage: node capture.js <video-name> <scene-id> <url> ["sentence to highlight"]'); process.exit(1); }
const chrome = process.env.CHROME_PATH || '/opt/pw-browsers/chromium';
const port = 9300 + Math.floor(Math.random() * 500);
const dir = path.join(__dirname, 'videos', name, 'captures'); fs.mkdirSync(dir, { recursive: true });
(async () => {
  const proc = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'cap-'))}`, `--window-size=${WIDTH},900`, 'about:blank'], { stdio: 'ignore' });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch (e) {} await sleep(200); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let n = 0; const pend = {}; ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) pend[d.id](d); };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++n; pend[i] = (d) => (d.error ? rej(new Error(d.error.message)) : res(d.result)); ws.send(JSON.stringify({ id: i, method, params })); });
  try {
    await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 900, deviceScaleFactor: 1.5, mobile: false });
    await send('Page.navigate', { url }); await sleep(1500);
    for (let i = 0; i < 40; i++) { const r = await send('Runtime.evaluate', { expression: 'document.readyState' }); if (r.result.value === 'complete') break; await sleep(250); }
    await sleep(2500); // let late scripts and fonts settle
    // dismiss cookie banners and sticky overlays that would cover the page
    await send('Runtime.evaluate', { expression: `document.querySelectorAll('[id*=cookie i],[class*=cookie i],[id*=consent i],[class*=consent i],[class*=banner i][style*=fixed]').forEach(e=>{if(getComputedStyle(e).position!=='static')e.remove()})` });
    const info = (await send('Runtime.evaluate', { returnByValue: true, expression: `(()=>{
      const h=Math.min(Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),${MAXH});
      let hl=null; const p=${JSON.stringify(phrase || '')}.toLowerCase().replace(/\\s+/g,' ');
      if(p){const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let nd;
        while(nd=w.nextNode()){const t=nd.textContent.replace(/\\s+/g,' ');const i=t.toLowerCase().indexOf(p.slice(0,40));
          if(i>=0&&nd.parentElement&&getComputedStyle(nd.parentElement).visibility!=='hidden'){const r=document.createRange();r.setStart(nd,Math.min(i,nd.length));r.setEnd(nd,Math.min(nd.length,i+p.length));
            const b=r.getBoundingClientRect(); if(b.width>0){hl={x:b.x+scrollX,y:b.y+scrollY,w:b.width,h:b.height};break;}}}}
      return {h,w:innerWidth,title:document.title,hl};})()` })).result.value;
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: info.w, height: info.h, scale: 1 } });
    fs.writeFileSync(path.join(dir, id + '.png'), Buffer.from(shot.data, 'base64'));
    const meta = { w: info.w, h: info.h, scale: 1, hl: info.hl, title: info.title, url, host: new URL(url).hostname.replace(/^www\./, ''), captured: new Date().toISOString().slice(0, 10) };
    fs.writeFileSync(path.join(dir, id + '.json'), JSON.stringify(meta, null, 1));
    console.log(`${id}: ${info.w}x${info.h}${info.hl ? '' : (phrase ? '  (phrase NOT found)' : '')} -> ${path.relative(__dirname, dir)}`);
  } finally { ws.close(); proc.kill(); }
})().catch((e) => { console.error(e.message); process.exit(1); });
