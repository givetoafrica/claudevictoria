// usage: node shard.js <scene.html> <framesdir> <start> <end>
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [scene, dir, a, b] = process.argv.slice(2);
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  await page.goto('file://' + path.resolve(scene));
  await page.waitForFunction(() => window.renderFrame);
  for (let f = +a; f < +b; f++) {
    await page.evaluate(n => window.renderFrame(n), f);
    await page.screenshot({ path: path.join(dir, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  }
  await browser.close();
})();
