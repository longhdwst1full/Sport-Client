const { chromium } = require('@playwright/test');

async function testNetwork() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('request', req => {
    if (req.url().includes('api') || req.url().includes('vercel') || req.url().includes('catalog')) {
      console.log('-> REQ:', req.method(), req.url());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('api') || res.url().includes('vercel') || res.url().includes('catalog')) {
      console.log('<- RES:', res.status(), res.url());
      try {
        const text = await res.text();
        console.log('   DATA:', text.substring(0, 150));
      } catch (e) {
        console.log('   DATA: (could not read body)');
      }
    }
  });

  console.log('Visiting http://127.0.0.1:3000 ...');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'load' });
  await page.waitForTimeout(5000);

  console.log('\nVisiting http://127.0.0.1:3000/products ...');
  await page.goto('http://127.0.0.1:3000/products', { waitUntil: 'load' });
  await page.waitForTimeout(5000);

  await browser.close();
}

testNetwork().catch(console.error);
