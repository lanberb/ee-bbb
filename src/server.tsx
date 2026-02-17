import { renderToReadableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./components/app/App";
import { GlobalCanvasProvider } from "./hooks/useGlobalCanvas";
import { ThemeStateProvider } from "./hooks/useTheme";

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    // 静的アセットがあればそのまま返す
    const assetRes = await env.ASSETS.fetch(request);
    if (assetRes.ok) return assetRes;

    const manifestRes = await env.ASSETS.fetch(new URL("/.vite/manifest.json", url));
    const manifest = (await manifestRes.json()) as Record<string, { file: string }>;

    const app = await renderToReadableStream(
      <ThemeStateProvider>
        <GlobalCanvasProvider>
          <StaticRouter location={url.pathname}>
            <App />
          </StaticRouter>
        </GlobalCanvasProvider>
      </ThemeStateProvider>,
      {
        bootstrapScripts: [`/${manifest["src/client.tsx"].file}`],
      },
    );

    return new Response(app, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
      status: 200,
    });
  },
} satisfies ExportedHandler<Env>;
