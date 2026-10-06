import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { fetchCategories, firstProduct } from '../fixtures/api';
import { StorefrontPage } from '../pages/storefront.page';

/**
 * Accessibility (axe-core, WCAG 2.x A/AA) cho các trang chính ở mobile 390px và desktop 1440px.
 *
 * Chặn: vi phạm `serious`/`critical`, TRỪ `color-contrast` — đổi màu là thay đổi giao diện cần
 * chủ sản phẩm duyệt, nên contrast chỉ được ghi vào annotation/attachment để báo cáo.
 *
 * `A11Y_REPORT_DIR` (tuỳ chọn): ghi JSON vi phạm + screenshot từng trang vào thư mục đó.
 */
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

const BLOCKING_IMPACTS = new Set(['serious', 'critical']);
const REPORT_ONLY_RULES = new Set(['color-contrast']);
const REPORT_DIR = process.env.A11Y_REPORT_DIR;

type PageCase = { key: string; path: (ctx: { productSlug: string; categorySlug?: string }) => string | null };

const PAGES: PageCase[] = [
  { key: 'home', path: () => '/' },
  { key: 'catalog', path: () => '/catalog' },
  { key: 'category', path: ({ categorySlug }) => (categorySlug ? `/category/${categorySlug}` : null) },
  { key: 'product-detail', path: ({ productSlug }) => `/products/${productSlug}` },
  { key: 'cart', path: () => '/cart' },
  { key: 'checkout', path: () => '/checkout' },
  { key: 'login', path: () => '/login' },
  { key: 'register', path: () => '/register' },
  { key: 'search', path: () => '/search?q=giay' },
];

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('load');
  await page.locator('main:visible, #noi-dung-chinh').first().waitFor({ state: 'visible' });
  // Chờ client island hydrate và các query đầu tiên xong để axe quét đúng DOM cuối.
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
  await new StorefrontPage(page).dismissOverlay();
}

for (const viewport of VIEWPORTS) {
  test.describe(`A11y — ${viewport.name} ${viewport.width}px`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const pageCase of PAGES) {
      test(`A11Y ${pageCase.key} @${viewport.width}`, async ({ page, request }, testInfo) => {
        const product = await firstProduct(request);
        const categorySlug = (await fetchCategories(request))[0]?.slug;
        const path = pageCase.path({ productSlug: product.slug, categorySlug });
        test.skip(!path, 'Môi trường không có danh mục để quét');

        await page.goto(path!);
        await settle(page);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        const summarize = (v: (typeof results.violations)[number]) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          targets: v.nodes.map((n) => n.target.join(' ')),
          html: v.nodes.slice(0, 5).map((n) => n.html.slice(0, 200)),
        });
        const blocking = results.violations
          .filter((v) => BLOCKING_IMPACTS.has(v.impact ?? '') && !REPORT_ONLY_RULES.has(v.id))
          .map(summarize);
        const reportOnly = results.violations
          .filter((v) => REPORT_ONLY_RULES.has(v.id))
          .map(summarize);

        await testInfo.attach('axe-violations.json', {
          body: JSON.stringify(results.violations.map(summarize), null, 2),
          contentType: 'application/json',
        });
        for (const v of reportOnly) {
          testInfo.annotations.push({ type: `a11y-report-only:${v.id}`, description: v.targets.join(' | ') });
        }
        if (REPORT_DIR) {
          mkdirSync(REPORT_DIR, { recursive: true });
          const base = join(REPORT_DIR, `${pageCase.key}-${viewport.width}`);
          writeFileSync(`${base}.json`, JSON.stringify(results.violations.map(summarize), null, 2));
          await page.screenshot({ path: `${base}.png`, fullPage: false });
        }

        expect(blocking, `Vi phạm serious/critical tại ${path}`).toEqual([]);
      });
    }
  });
}
