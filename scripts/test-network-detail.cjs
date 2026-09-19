const { chromium } = require('@playwright/test');

async function testNetwork() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('request', req => {
    console.log('-> REQ:', req.method(), req.url());
  });

  page.on('requestfinished', async req => {
    const res = await req.response();
    console.log('<- FINISHED:', req.method(), req.url(), 'STATUS:', res ? res.status() : 'NO RES');
  });

  page.on('requestfailed', req => {
    console.log('XX FAILED:', req.method(), req.url(), 'ERR:', req.failure()?.errorText);
  });

  console.log('Visiting http://127.0.0.1:3000/products ...');
  await page.goto('http://127.0.0.1:3000/products', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(10000);

  // Take screenshot to see what is on screen
  await page.screenshot({ path: 'scripts/products-debug.png' });
  console.log('Screenshot saved to scripts/products-debug.png');

  await browser.close();
}

testNetwork().catch(console.error);
