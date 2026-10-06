import { expect, test } from '@playwright/test';

test.describe('PWA — manifest, offline và reset', () => {
  test('PWA-01: manifest khai icon PNG 192/512 truy cập được', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.ok()).toBe(true);
    const manifest = (await response.json()) as {
      display: string;
      icons: Array<{ src: string; sizes: string; type: string }>;
    };
    expect(manifest.display).toBe('standalone');

    for (const size of [192, 512]) {
      const icon = manifest.icons.find((item) => item.sizes === `${size}x${size}`);
      expect(icon).toMatchObject({ src: `/icon-${size}.png`, type: 'image/png' });
      const iconResponse = await request.get(icon!.src);
      expect(iconResponse.ok()).toBe(true);
      expect(iconResponse.headers()['content-type']).toContain('image/png');
    }
  });

  test('PWA-02: mất mạng hiện cảnh báo, không nhận đơn hàng giả', async ({ page }) => {
    await page.goto('/pwa');

    // `PwaRegistration` cố ý bỏ qua đăng ký khi `navigator.webdriver` (và ngoài production), nên
    // test tự đăng ký đúng script/option của app rồi chờ worker active.
    await page.evaluate(async () => {
      await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      await navigator.serviceWorker.ready;
    });
    // Nạp lại để trang được worker điều khiển ngay từ lúc tải (clients.claim() không làm trang /pwa
    // đọc lại controller, vì nó chỉ đọc một lần khi mount).
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

    // Ô "Service worker" chỉ đổi sang scriptURL sau khi trang hydrate (useEffect chạy) VÀ có
    // controller — một tín hiệu cho cả hai điều kiện, thay vì chờ cứng.
    await expect(page.getByText(/\/sw\.js$/)).toBeVisible();
    // Banner offline nằm trong chunk `dynamic()` của Providers: chờ mọi chunk tải xong, nếu
    // cắt mạng sớm chunk đó không bao giờ mount (nguồn gốc flaky cũ).
    await page.waitForLoadState('networkidle');

    await page.context().setOffline(true);

    const offlineBanner = page.getByRole('status').filter({ hasText: 'Bạn đang ngoại tuyến' });
    await expect(offlineBanner).toBeVisible();
    await expect(offlineBanner).toContainText('đặt hàng và thanh toán cần kết nối mạng');

    // Checkout là network-only: offline phải nhận trang /offline tĩnh từ worker, không render
    // form đặt hàng từ cache.
    await page.goto('/checkout');
    await expect(page.getByRole('heading', { level: 1, name: 'Bạn đang ngoại tuyến' })).toBeVisible();
    await expect(page.getByRole('button', { name: /đặt hàng/i })).toHaveCount(0);
  });

  test('PWA-03: reset chỉ xoá cache Storefront, giữ cache ứng dụng khác', async ({ page }) => {
    await page.goto('/pwa');
    await page.evaluate(async () => {
      await caches.open('dctd-storefront-e2e');
      await caches.open('other-app-e2e');
    });

    await page.getByRole('button', { name: 'Reset cache và service worker' }).click();
    await expect(page.getByRole('heading', { name: 'Trạng thái PWA' })).toBeVisible();
    // Reset chủ động reload trang. Đọc hai điều kiện trong cùng execution context
    // và retry khi context cũ vừa bị huỷ để tránh flaky giữa hai lần poll.
    await expect
      .poll(async () => {
        try {
          const names = await page.evaluate(() => caches.keys());
          return {
            keepsOtherApp: names.includes('other-app-e2e'),
            removesStorefront: !names.includes('dctd-storefront-e2e'),
          };
        } catch {
          return null;
        }
      })
      .toEqual({ keepsOtherApp: true, removesStorefront: true });
  });
});
