import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { injectHtmlsPlugin } from './src/plugins/injectHtmlsPlugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
     injectHtmlsPlugin(),
     react({
       jsxImportSource: "@emotion/react",
     }),
    ]
});
