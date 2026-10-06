import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: { host: '127.0.0.1' },
  // Khớp alias `@/*` của tsconfig/Next để test resolve được barrel như `@/core/storage`.
  // tsconfig để `jsx: preserve` cho Next; Vitest cần runtime JSX tự động để component không phải `import React`.
  esbuild: { jsx: 'automatic' },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    pool: 'threads',
    // `e2e/` là bộ Playwright, chạy bằng `yarn e2e`. Vitest nạp nó sẽ hỏng vì
    // `@playwright/test` không phải runner của Vitest.
    exclude: ['node_modules/**', 'dist/**', '.next/**', 'e2e/**', '.agents/**', '.claude/**'],
  },
});
