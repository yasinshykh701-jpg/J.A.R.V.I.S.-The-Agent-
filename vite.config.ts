import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { miaodaDevPlugin } from "miaoda-sc-plugin";

export default defineConfig(({ mode }) => ({
   base:"./",
  plugins: [
    react({ fastRefresh: true }),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    }),
    ...(mode === 'development' ? [miaodaDevPlugin()] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':    ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor':       ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'three-vendor':    ['three', '@react-three/fiber', '@react-three/drei'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
    // Exclude large model from bundle analysis
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js', 'lucide-react', 'sonner'],
  },
  server: {
    compress: true,
    hmr: { overlay: true },
    // Proxy all /jarvis/* requests to the local backend — fixes CORS/NetworkError
    proxy: {
      '/jarvis': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/jarvis/, ''),
        configure: (_proxy, _options) => {
          _proxy.on('error', (err) => {
            console.warn('[vite-proxy] backend unreachable:', err.message);
          });
        },
      },
      '/api/speech': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/gesture': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/body': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/eye': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/tts': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/zevorix': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/zevorix/, ''),
        configure: (_proxy, _options) => {
          _proxy.on('error', (err) => {
            console.warn('[vite-proxy] Zevorix unreachable:', err.message);
          });
        },
      },
      '/iot': {
        target: 'http://127.0.0.1:8010',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/iot/, ''),
        configure: (_proxy, _options) => {
          _proxy.on('error', (err) => {
            console.warn('[vite-proxy] IoT API unreachable:', err.message);
          });
        },
      },
      '/image-rag': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/image-rag-api': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/image-rag-api/, ''),
        configure: (_proxy, _options) => {
          _proxy.on('error', (err) => {
            console.warn('[vite-proxy] Image RAG unreachable:', err.message);
          });
        },
      },
    },
   
  },
  // Ensure large static assets are served
  assetsInclude: ['**/*.fbx', '**/*.glb', '**/*.gltf'],
}));
