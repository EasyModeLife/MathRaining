import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/',
  plugins: [
    svelte(),
    // Add bundle analyzer (only in production builds)
    ...(process.env.ANALYZE === 'true' ? [visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })] : []),
  ],
  build: {
    outDir: 'mathraining_app',
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
