import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat custom elements as Vue components
          isCustomElement: (tag) => tag.startsWith('custom-')
        }
      }
    })
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/composables': resolve(__dirname, 'src/composables'),
      '@/services': resolve(__dirname, 'src/services'),
      '@/stores': resolve(__dirname, 'src/stores'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/styles': resolve(__dirname, 'src/styles'),
      '@/views': resolve(__dirname, 'src/views'),
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: true, // Open browser automatically
    cors: true,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Build configuration optimized for Bun
  build: {
    target: 'es2022', // Bun supports newer ES features
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild', // Use esbuild for faster builds (Bun compatible)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vue: ['vue'],
          pinia: ['pinia'],
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.css";`
      }
    }
  },

  // Environment variables
  envPrefix: ['VITE_'],

  // Optimize dependencies for Bun
  optimizeDeps: {
    include: ['vue', 'pinia'],
    exclude: [],
    esbuildOptions: {
      target: 'es2022'
    }
  },

  // Preview configuration (for production preview)
  preview: {
    port: 4173,
    host: true,
    cors: true
  },

  // Define global constants
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },

  // Bun specific optimizations
  esbuild: {
    target: 'es2022',
    format: 'esm'
  }
});