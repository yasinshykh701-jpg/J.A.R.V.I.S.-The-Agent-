// vite.config.ts
import { defineConfig } from "file:///D:/J.A.R.V.I.S/app-8sm6282ej0n5/node_modules/vite/dist/node/index.js";
import react from "file:///D:/J.A.R.V.I.S/app-8sm6282ej0n5/node_modules/@vitejs/plugin-react/dist/index.js";
import svgr from "file:///D:/J.A.R.V.I.S/app-8sm6282ej0n5/node_modules/vite-plugin-svgr/dist/index.js";
import path from "path";
import { miaodaDevPlugin } from "file:///D:/J.A.R.V.I.S/app-8sm6282ej0n5/node_modules/miaoda-sc-plugin/dist/index.js";
var __vite_injected_original_dirname = "D:\\J.A.R.V.I.S\\app-8sm6282ej0n5";
var vite_config_default = defineConfig(({ mode }) => ({
  base: "./",
  plugins: [
    react({ fastRefresh: true }),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent"
      }
    }),
    ...mode === "development" ? [miaodaDevPlugin()] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"],
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
          "supabase-vendor": ["@supabase/supabase-js"]
        }
      }
    },
    chunkSizeWarningLimit: 2e3,
    // Exclude large model from bundle analysis
    assetsInlineLimit: 0
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@supabase/supabase-js", "lucide-react", "sonner"]
  },
  server: {
    compress: true,
    hmr: { overlay: true },
    // Proxy all /jarvis/* requests to the local backend — fixes CORS/NetworkError
    proxy: {
      "/jarvis": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/jarvis/, ""),
        configure: (_proxy, _options) => {
          _proxy.on("error", (err) => {
            console.warn("[vite-proxy] backend unreachable:", err.message);
          });
        }
      },
      "/api/speech": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/api/gesture": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/api/body": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/api/eye": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/api/tts": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/zevorix": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/zevorix/, ""),
        configure: (_proxy, _options) => {
          _proxy.on("error", (err) => {
            console.warn("[vite-proxy] Zevorix unreachable:", err.message);
          });
        }
      },
      "/iot": {
        target: "http://127.0.0.1:8010",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/iot/, ""),
        configure: (_proxy, _options) => {
          _proxy.on("error", (err) => {
            console.warn("[vite-proxy] IoT API unreachable:", err.message);
          });
        }
      },
      "/image-rag": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  },
  // Ensure large static assets are served
  assetsInclude: ["**/*.fbx", "**/*.glb", "**/*.gltf"]
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxKLkEuUi5WLkkuU1xcXFxhcHAtOHNtNjI4MmVqMG41XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxKLkEuUi5WLkkuU1xcXFxhcHAtOHNtNjI4MmVqMG41XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9KLkEuUi5WLkkuUy9hcHAtOHNtNjI4MmVqMG41L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IG1pYW9kYURldlBsdWdpbiB9IGZyb20gXCJtaWFvZGEtc2MtcGx1Z2luXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gICBiYXNlOlwiLi9cIixcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KHsgZmFzdFJlZnJlc2g6IHRydWUgfSksXG4gICAgc3Zncih7XG4gICAgICBzdmdyT3B0aW9uczoge1xuICAgICAgICBpY29uOiB0cnVlLFxuICAgICAgICBleHBvcnRUeXBlOiAnbmFtZWQnLFxuICAgICAgICBuYW1lZEV4cG9ydDogJ1JlYWN0Q29tcG9uZW50JyxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgLi4uKG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyBbbWlhb2RhRGV2UGx1Z2luKCldIDogW10pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHsgZHJvcF9jb25zb2xlOiB0cnVlLCBkcm9wX2RlYnVnZ2VyOiB0cnVlIH0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6ICAgIFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAndWktdmVuZG9yJzogICAgICAgWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JywgJ0ByYWRpeC11aS9yZWFjdC1zZWxlY3QnXSxcbiAgICAgICAgICAndGhyZWUtdmVuZG9yJzogICAgWyd0aHJlZScsICdAcmVhY3QtdGhyZWUvZmliZXInLCAnQHJlYWN0LXRocmVlL2RyZWknXSxcbiAgICAgICAgICAnc3VwYWJhc2UtdmVuZG9yJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwMDAsXG4gICAgLy8gRXhjbHVkZSBsYXJnZSBtb2RlbCBmcm9tIGJ1bmRsZSBhbmFseXNpc1xuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJywgJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcycsICdsdWNpZGUtcmVhY3QnLCAnc29ubmVyJ10sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGNvbXByZXNzOiB0cnVlLFxuICAgIGhtcjogeyBvdmVybGF5OiB0cnVlIH0sXG4gICAgLy8gUHJveHkgYWxsIC9qYXJ2aXMvKiByZXF1ZXN0cyB0byB0aGUgbG9jYWwgYmFja2VuZCBcdTIwMTQgZml4ZXMgQ09SUy9OZXR3b3JrRXJyb3JcbiAgICBwcm94eToge1xuICAgICAgJy9qYXJ2aXMnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHApID0+IHAucmVwbGFjZSgvXlxcL2phcnZpcy8sICcnKSxcbiAgICAgICAgY29uZmlndXJlOiAoX3Byb3h5LCBfb3B0aW9ucykgPT4ge1xuICAgICAgICAgIF9wcm94eS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1t2aXRlLXByb3h5XSBiYWNrZW5kIHVucmVhY2hhYmxlOicsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnL2FwaS9zcGVlY2gnOiB7IHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxuICAgICAgJy9hcGkvZ2VzdHVyZSc6IHsgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo4MDAwJywgY2hhbmdlT3JpZ2luOiB0cnVlIH0sXG4gICAgICAnL2FwaS9ib2R5JzogeyB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAnLCBjaGFuZ2VPcmlnaW46IHRydWUgfSxcbiAgICAgICcvYXBpL2V5ZSc6IHsgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo4MDAwJywgY2hhbmdlT3JpZ2luOiB0cnVlIH0sXG4gICAgICAnL2FwaS90dHMnOiB7IHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCcsIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxuICAgICAgJy96ZXZvcml4Jzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjgwMDEnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwKSA9PiBwLnJlcGxhY2UoL15cXC96ZXZvcml4LywgJycpLFxuICAgICAgICBjb25maWd1cmU6IChfcHJveHksIF9vcHRpb25zKSA9PiB7XG4gICAgICAgICAgX3Byb3h5Lm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3ZpdGUtcHJveHldIFpldm9yaXggdW5yZWFjaGFibGU6JywgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICcvaW90Jzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjgwMTAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwKSA9PiBwLnJlcGxhY2UoL15cXC9pb3QvLCAnJyksXG4gICAgICAgIGNvbmZpZ3VyZTogKF9wcm94eSwgX29wdGlvbnMpID0+IHtcbiAgICAgICAgICBfcHJveHkub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbdml0ZS1wcm94eV0gSW9UIEFQSSB1bnJlYWNoYWJsZTonLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJy9pbWFnZS1yYWcnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgIFxuICB9LFxuICAvLyBFbnN1cmUgbGFyZ2Ugc3RhdGljIGFzc2V0cyBhcmUgc2VydmVkXG4gIGFzc2V0c0luY2x1ZGU6IFsnKiovKi5mYngnLCAnKiovKi5nbGInLCAnKiov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
