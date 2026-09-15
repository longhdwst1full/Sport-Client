import { defineConfig, devices } from '@playwright/test';

/**
 * E2E cho Storefront.
 *
 * Dùng cổng 3100 chứ không phải 3000: máy phát triển thường đã có sẵn một dev
 * server ở 3000, chạy đè lên sẽ làm test đo nhầm bản build cũ.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  // Trạng thái nằm ở database dùng chung nên chạy tuần tự; song song sẽ giẫm lên nhau.
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    // Chỉ giữ dấu vết của lần chạy hỏng; giữ hết sẽ phình thư mục rất nhanh.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // Tự dựng server khi chạy cục bộ; CI có thể trỏ E2E_BASE_URL sang môi trường khác.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `yarn next dev -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
