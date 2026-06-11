import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const appVersion = process.env.GITHUB_SHA ?? process.env.npm_package_version ?? 'local';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
