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
    await page.context().setOffline(true);

    await expect(page.getByRole('status')).toContainText('Bạn đang ngoại tuyến');
    await expect(page.getByRole('status')).toContainText('đặt hàng và thanh toán cần kết nối mạng');
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
