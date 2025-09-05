import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/',
  plugins: [
    svelte(),
  ],
  build: {
    minify: 'esbuild',
    target: 'es2018',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('katex')) return 'katex';
        },
      },
    },
  },
  publicDir: 'public',
});
