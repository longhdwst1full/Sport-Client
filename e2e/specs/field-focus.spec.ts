import { expect, test } from '@playwright/test';
import { inputVariants } from '../../src/foundation/components/field-system/input-variants';

for (const width of [375, 1280]) {
  test(`field focus: no doubled outline, keyboard fallback preserved (${width}px)`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/pwa');
    // Use the actual production stylesheet and shared preset, without posting checkout/customer data.
    await page.evaluate(({ normal, invalid }) => {
      const fixture = document.createElement('section');
      fixture.id = 'field-focus-fixture';
      fixture.className = 'mx-auto max-w-2xl space-y-4 bg-white p-6';
      fixture.innerHTML = '<h2>Kiểm tra đường viền ô nhập</h2><button id="focus-start">Bắt đầu</button>';
      for (const tag of ['input', 'select', 'textarea']) {
        const label = document.createElement('label');
        label.textContent = tag;
        const field = document.createElement(tag);
        field.id = `focus-${tag}`;
        field.className = normal;
        if (field instanceof HTMLInputElement) { field.type = 'email'; field.placeholder = 'email@example.com'; }
        if (field instanceof HTMLSelectElement) field.add(new Option('Chọn tỉnh / thành phố', ''));
        label.append(field);
        fixture.append(label);
      }
      const error = document.createElement('input');
      error.id = 'focus-invalid'; error.className = invalid; error.setAttribute('aria-label', 'Ô nhập lỗi');
      fixture.append(error);
      const disabled = document.createElement('input');
      disabled.id = 'focus-disabled'; disabled.className = normal; disabled.disabled = true;
      fixture.append(disabled);
      const fallback = document.createElement('button');
      fallback.id = 'focus-fallback'; fallback.textContent = 'Nút dùng focus mặc định';
      fixture.append(fallback);
      document.body.prepend(fixture);
    }, { normal: inputVariants(), invalid: inputVariants({ invalid: true }) });

    await page.locator('#focus-start').focus();
    for (const tag of ['input', 'select', 'textarea']) {
      await page.keyboard.press('Tab');
      const field = page.locator(`#focus-${tag}`);
      await expect(field).toBeFocused();
      await expect(field).toHaveCSS('border-top-width', '1px');
      await expect(field).toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
      await expect(field).toHaveCSS('border-top-color', 'rgb(23, 23, 23)');
      const shadow = await field.evaluate((element) => getComputedStyle(element).boxShadow);
      expect(shadow).toContain('rgba(23, 23, 23, 0.1)');
      await field.screenshot({ path: testInfo.outputPath(`${tag}-${width}.png`) });
    }
    await page.keyboard.press('Tab');
    await expect(page.locator('#focus-invalid')).toBeFocused();
    await expect(page.locator('#focus-invalid')).toHaveCSS('border-top-color', 'rgb(239, 68, 68)');
    await expect(page.locator('#focus-invalid')).toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator('#focus-disabled')).toBeDisabled();
    await page.keyboard.press('Tab');
    await expect(page.locator('#focus-fallback')).toBeFocused();
    await expect(page.locator('#focus-fallback')).toHaveCSS('outline-width', '2px');
    await expect(page.locator('#focus-fallback')).toHaveCSS('outline-color', 'rgb(23, 23, 23)');
  });
}
