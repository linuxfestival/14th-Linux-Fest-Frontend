import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    watch: {
      // Live preview checkpoints must not trigger another page reload.
      ignored: ["**/.impeccable/**"],
    },
    proxy: {
      "/api": {
        target: "https://linuxfest.ceit-ssc.ir",
        changeOrigin: true,
      },
    },
  },
});
