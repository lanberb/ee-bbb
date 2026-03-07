import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
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
    /**
     * @see https://mdxjs.com/docs/getting-started/#vite
     */
    {enforce: "pre", ...mdx({
      jsxImportSource: "@emotion/react",
    })},
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
});
