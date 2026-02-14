import react from '@vitejs/plugin-react';
import path from "path";
import { defineConfig } from 'vite';
import { injectHtmlsPlugin } from './src/plugins/injectHtmlsPlugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
     injectHtmlsPlugin(),
     react({
       jsxImportSource: "@emotion/react",
     }),
    ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
    },
  }
});
