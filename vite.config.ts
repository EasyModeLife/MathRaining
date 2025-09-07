/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    // Enable compression
    compress: true,
    // Better chunking for optimal caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate KaTeX into its own chunk for better caching
          vendor: ['katex'],
          // Group utility libraries
          utils: ['svelte'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? [];
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Enable brotli compression
    brotliSize: true,
    // Minify with esbuild
    minify: 'esbuild',
    // Generate sourcemaps for debugging
    sourcemap: false, // Disable in production for smaller bundles
    // Target modern browsers
    target: 'es2020',
    // Optimize CSS
    cssCodeSplit: true,
    // Preload modules for better LCP
    preloadModules: ['svelte', 'katex'],
  },
