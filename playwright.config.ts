import { defineConfig, devices } from '@playwright/test';

/**
 * E2E cho Storefront.
 *
 * Chạy trên API thật: trang chủ, danh mục và chi tiết sản phẩm render phía server
 * (App Router), nên `page.route` của Playwright không chặn được các lời gọi đó.
 * Mọi kịch bản vì thế đọc dữ liệu thật qua `NEXT_PUBLIC_API_URL`.
 *
 * Dùng cổng riêng thay vì 3000: máy phát triển thường đã có sẵn một server
 * ở 3000, chạy đè lên sẽ làm test đo nhầm bản build cũ.
 */
const PORT = Number(process.env.E2E_PORT ?? 3199);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

/**
 * API dùng cho E2E. Mặc định là API cục bộ: `.env.local` của dự án trỏ sang môi
 * trường dùng chung không mở CORS cho `127.0.0.1`, chạy thẳng sẽ ra trang rỗng
 * chứ không ra lỗi rõ ràng.
 */
const API_URL = process.env.E2E_API_URL ?? 'https://sport-api-doc.vercel.app';

export default defineConfig({
  testDir: './e2e/specs',
  // Test output phải nằm ngoài e2e/ vì repo từng track artifact ở đó.
  outputDir: './.playwright/artifacts',
  // Mỗi test chạy trong browser context riêng nên giỏ hàng (localStorage) không
  // giẫm lên nhau. Spec nào tạo đơn thật tự đặt `mode: 'serial'` cho describe đó.
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: '.playwright/report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: '.playwright/report', open: 'never' }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    // Chỉ giữ dấu vết của lần chạy hỏng; giữ hết sẽ phình thư mục rất nhanh.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    testIdAttribute: 'data-testid',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // Mặc định chạy production build: next dev tạo rất nhiều file watcher và có thể
  // chạm ENOSPC trên workstation/CI. E2E_DEV=1 chỉ dùng khi cần debug UI nhanh.
  // CI có thể trỏ E2E_BASE_URL sang môi trường khác.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: process.env.E2E_DEV === '1'
          ? `yarn next dev -p ${PORT}`
          : `yarn next start -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        env: {
          PORT: String(PORT),
          NEXT_PUBLIC_API_URL: API_URL,
        },
      },
});
