import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: { host: '127.0.0.1' },
  // Khớp alias `@/*` của tsconfig/Next để test resolve được barrel như `@/core/storage`.
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { pool: 'threads' },
});
