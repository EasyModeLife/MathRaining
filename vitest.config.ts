import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./_test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/**', 'src/**/*.d.ts', '**/*.config.{js,ts}'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '$lib': path.resolve('./src'),
    },
  },
});
