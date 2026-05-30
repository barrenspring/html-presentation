/**
 * render.mjs — 用 Playwright 把 index.html 中每个 .poster 截图为 PNG
 * 
 * 用法: node render.mjs
 * 前置: npm install playwright && npx playwright install chromium
 */
import { chromium } from 'playwright';
import { resolve, join } from 'path';
import { mkdirSync } from 'fs';

const HTML_PATH = resolve(import.meta.dirname, 'index.html');
const OUTPUT_DIR = resolve(import.meta.dirname, 'output');

mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle' });

// Wait for fonts to load
await page.waitForTimeout(2000);

const posters = await page.$$('.poster');
console.log(`Found ${posters.length} posters to render.`);

for (let i = 0; i < posters.length; i++) {
  const id = await posters[i].getAttribute('id') || `poster-${i + 1}`;
  const outPath = join(OUTPUT_DIR, `${id}.png`);
  await posters[i].screenshot({ path: outPath });
  console.log(`  ✓ ${outPath}`);
}

await browser.close();
console.log(`\nDone! ${posters.length} images saved to ${OUTPUT_DIR}/`);
