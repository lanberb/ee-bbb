import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: "./src/client.tsx",
    },
    manifest: true,
  },
  plugins: [
    cloudflare(),
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
});
