const { chromium } = require('@playwright/test');

async function testUI() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.toString()));
  page.on('requestfailed', req => failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`));

  console.log('\n--- 1. Testing Homepage http://127.0.0.1:3000 ---');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Check if error box or products are displayed
  const homeError = await page.locator('text="Không thể tải sản phẩm"').count();
  const homeCards = await page.locator('article, [data-testid="product-card"]').count();
  console.log('Homepage products count / cards count:', homeCards);
  console.log('Homepage has "Không thể tải sản phẩm"?', homeError > 0);

  console.log('\n--- 2. Testing Products Page http://127.0.0.1:3000/products ---');
  await page.goto('http://127.0.0.1:3000/products', { waitUntil: 'networkidle', timeout: 30000 });
  const productsError = await page.locator('text="Không thể tải sản phẩm"').count();
  const productArticles = await page.locator('article').count();
  console.log('Products page article count:', productArticles);
  console.log('Products page has "Không thể tải sản phẩm"?', productsError > 0);

  // Check tabs
  const tabButtons = await page.locator('button:has-text("Tất cả"), button:has-text("Bóng bàn"), button:has-text("Gym")').count();
  console.log('Category tab buttons count:', tabButtons);

  console.log('\n--- 3. Testing Product Detail Page ---');
  await page.goto('http://127.0.0.1:3000/products/ban-bong-ban-double-fish-233', { waitUntil: 'networkidle', timeout: 30000 });
  const detailTitle = await page.locator('h1').textContent().catch(() => null);
  console.log('Product detail H1:', detailTitle);

  console.log('\n--- 4. Testing Login Page http://127.0.0.1:3000/login ---');
  await page.goto('http://127.0.0.1:3000/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="text"], input[name="identifier"], input[type="email"]', 'long@gmail.com');
  await page.fill('input[type="password"]', 'Aa@123456');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log('Current URL after login:', page.url());
  const loginErrorMsg = await page.locator('.text-red-500, [role="alert"], text="Đăng nhập không thành công"').textContent().catch(() => null);
  console.log('Login error message (if any):', loginErrorMsg);

  console.log('\n--- SUMMARY ---');
  console.log('Page Errors:', errors);
  console.log('Failed Requests:', failedRequests);
  const nonTrivialLogs = consoleLogs.filter(l => !l.includes('Fast Refresh') && !l.includes('[HMR]'));
  console.log('Console Logs (non-HMR):', nonTrivialLogs.slice(0, 15));

  await browser.close();
}

testUI().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
