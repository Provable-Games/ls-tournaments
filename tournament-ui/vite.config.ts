import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import mkcert from "vite-plugin-mkcert";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    process.env.VITE_CHAIN_ID !== "KATANA_LOCAL" && mkcert(),
    topLevelAwait(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
