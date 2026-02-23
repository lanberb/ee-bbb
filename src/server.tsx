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

    let bootstrapModules: string[];
    let bootstrapScriptContent: string | undefined;
    const manifestRes = await env.ASSETS.fetch(new URL("/.vite/manifest.json", url));
    if (manifestRes.ok) {
      const manifest = (await manifestRes.json()) as Record<string, { file: string }>;
      bootstrapModules = [`/${manifest["src/client.tsx"].file}`];
    } else {
      // dev mode: Vite dev serverがクライアントコードを配信
      // React Refresh preamble: モジュール評価前にグローバル変数を設定する
      // bootstrapScriptContent は通常の<script>を生成するため、module scriptsより先に実行される
      bootstrapScriptContent =
        "window.$RefreshReg$ = () => {};window.$RefreshSig$ = () => (type) => type;window.__vite_plugin_react_preamble_installed__ = true;";
      bootstrapModules = ["/@vite/client", "/src/client.tsx"];
    }

    const app = await renderToReadableStream(
      <ThemeStateProvider>
        <GlobalCanvasProvider>
          <StaticRouter location={url.pathname}>
            <App />
          </StaticRouter>
        </GlobalCanvasProvider>
      </ThemeStateProvider>,
      { bootstrapModules, bootstrapScriptContent },
    );

    return new Response(app, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
      status: 200,
    });
  },
} satisfies ExportedHandler<Env>;
