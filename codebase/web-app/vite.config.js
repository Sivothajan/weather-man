import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import Inspect from "vite-plugin-inspect";

// ESM-style Vite config
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd());

  const ANALYZE = env.VITE_ANALYZE === "true";

  return {
    plugins: [
      react(),
      ANALYZE &&
        visualizer({
          filename: "./dist/stats.html",
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
      Inspect(),
    ].filter(Boolean), // Filter out null values
    envPrefix: ["VITE_", "ANALYZE"],
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
