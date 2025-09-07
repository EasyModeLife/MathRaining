/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    // Output directory
    outDir: 'mathraining_app',
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
    // Minify with esbuild
    minify: 'esbuild',
    // Generate sourcemaps for debugging
    sourcemap: false, // Disable in production for smaller bundles
  },

  // Base configuration
  base: '/',

  // Optimize development server
  server: {
    hmr: {
      overlay: false,
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['katex', 'svelte'],
    exclude: [], // Don't exclude anything critical
  },

  // Public directory
  publicDir: 'public',
});
