const { chromium } = require('@playwright/test');

async function testFullScreenshot() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/products', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'scripts/products-full.png', fullPage: true });
  console.log('Full page screenshot saved!');

  await browser.close();
}

testFullScreenshot().catch(console.error);
