import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import viteCompression from 'vite-plugin-compression';
import compression from 'compression';

const devCompression = () => ({
  name: 'dev-compression',
  apply: 'serve' as const,
  configureServer(server) {
    server.middlewares.use(compression());
  },
});

export default defineConfig({
  base: '/',
  plugins: [
    svelte(),
    viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
    devCompression(),
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
