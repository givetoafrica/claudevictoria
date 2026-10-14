#!/usr/bin/env node
// Render a NonprofitsDaily video: content.json -> MP4 (1080x1920 reel or 1920x1080 long), optional voiceover.
// Usage: node render.cjs content.json out.mp4 [--audio vo.mp3] [--fps 30] [--seconds N] [--frame T out.png]
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
function loadPlaywright() {
  const cands = [process.env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node-tools/node_modules/playwright'].filter(Boolean);
  for (const c of cands) { try { return require(c); } catch (e) {} }
  throw new Error('playwright not found. Set PLAYWRIGHT_MODULE to its path.');
}
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const [contentPath, outPath] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!contentPath || !outPath) { console.error('usage: render.cjs content.json out.mp4 [--audio file] [--fps 30] [--seconds N]'); process.exit(1); }
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const fps = parseInt(flag('fps', '30'), 10), audio = flag('audio', content.audio || null);
const html = fs.readFileSync(path.join(__dirname, 'engine.html'), 'utf8').replace('/*CONTENT*/ null', JSON.stringify(content));
const tmp = path.join(__dirname, '_render_' + process.pid + '.html'); fs.writeFileSync(tmp, html);
(async () => {
  const { chromium } = loadPlaywright();
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch({ executablePath: exe });
  const long = content.format === 'long', W = long ? 1920 : 1080, H = long ? 1080 : 1920;
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto('file://' + tmp); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  let total = await page.evaluate(() => window.__total);
  if (audio) { const d = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).toString()); total = Math.max(total, d + 0.3); }
  const fi = args.indexOf('--frame');
  if (fi >= 0) { await page.evaluate((t) => window.__render(t), parseFloat(args[fi + 1])); await page.screenshot({ path: args[fi + 2] }); await browser.close(); fs.unlinkSync(tmp); return; }
  const secs = parseFloat(flag('seconds', total)); const n = Math.ceil(Math.min(secs, total) * fps);
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (audio) ff.push('-i', audio);
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'veryfast', '-r', String(fps));
  if (audio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push('-movflags', '+faststart', outPath);
  const p = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.__render(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!p.stdin.write(buf)) await new Promise((r) => p.stdin.once('drain', r));
    if (i % 60 === 0) process.stderr.write(`\rframe ${i}/${n}`);
  }
  p.stdin.end(); await new Promise((r) => p.on('close', r));
  await browser.close(); fs.unlinkSync(tmp);
  console.log(`\nrendered ${n} frames (${(n / fps).toFixed(1)} s) in ${((Date.now() - t0) / 1000).toFixed(0)} s -> ${outPath}`);
})().catch((e) => { try { fs.unlinkSync(tmp); } catch (_) {} console.error(e); process.exit(1); });
