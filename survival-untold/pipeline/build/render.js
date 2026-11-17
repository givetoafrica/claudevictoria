// usage: node render.js <scene.html> <outdir> test t1,t2,...   |   node render.js <scene.html> <outdir> all
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [scene, outdir, mode, arg, outname] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  await page.goto('file://' + path.resolve(scene));
  await page.waitForFunction(() => window.renderFrame);
  const total = await page.evaluate(() => Math.ceil(window.TL.total * window.TL.fps));
  const fps = await page.evaluate(() => window.TL.fps);

  if (mode === 'test') {
    for (const t of arg.split(',').map(Number)) {
      await page.evaluate(f => window.renderFrame(f), Math.round(t * fps));
      await page.screenshot({ path: path.join(outdir, `t_${t}.png`) });
    }
  } else {
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-i', path.join(outdir, 'audio.mp3'), '-map', '0:v', '-map', '1:a',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(fps),
      '-c:a', 'aac', '-b:a', '192k', '-t', String(total / fps), '-movflags', '+faststart',
      path.join(outdir, outname || 'edison-exposed.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < total; f++) {
      await page.evaluate(n => window.renderFrame(n), f);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 300 === 0) console.log('frame', f, '/', total);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
