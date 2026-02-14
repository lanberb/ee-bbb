/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { renderToString } from "react-dom/server";
import App from "./components/app/App";

export default {
  async fetch(request, _env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    const rawHtml = await fetch(`${url.origin}/index.html`);
    const html = await rawHtml.text();

    const app = renderToString(<App />);
    const responseText = html.replace(`<div id="root"></div>`, `<div id="root">${app}</div>`);

    return new Response(responseText, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
      status: 200,
    });
  },
} satisfies ExportedHandler<Env>;
