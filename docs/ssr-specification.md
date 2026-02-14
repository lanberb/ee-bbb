# SSR化仕様書

## 機能要件

### 必須要件

- [ ] 初期描画をSSRで高速化できること
- [ ] サイト内ページ遷移は全てSPAで行えること
- [ ] 上記2点の達成により、サイト全体の動作が高速であること
- [ ] サイト全体で共有のグローバルstateを持っていること
- [ ] SEOが十分に機能すること（クローラーがSSRされたHTMLを取得できる）
- [ ] OGP対応（SNSシェア時のプレビュー: タイトル、説明、画像）
- [ ] ブログ機能（markdownからHTMLへの変換・表示）
- [ ] テーマ（light/dark）がSSR時点でユーザー端末の状態と一致していること
- [ ] i18n（言語）がSSR時点でユーザー端末の状態と一致していること（Accept-Language）
- [ ] 404/エラーページをSSRで適切に返すこと

### 非機能要件

- [ ] Lighthouse スコア 95以上（全カテゴリ）
- [ ] 開発体験: 高速ビルド、HMR
- [ ] Vite維持（可能であれば）
- [ ] ビルド/デプロイの複雑化は最小限に

### 制約事項

- Canvas/Three.js はSSRで描画不可。サーバーでは空のコンテナを返し、クライアントでハイドレーション後に描画
- 画像等のアセット取得はクライアントサイドで行う

---

## 現状のアーキテクチャ

### 技術スタック

| レイヤー | 技術 | 役割 |
|---------|------|------|
| ホスティング | Cloudflare Workers | 静的ファイル配信のみ |
| フレームワーク | Vite + React 19 | CSR |
| ルーティング | react-router-dom | クライアントサイドのみ |
| スタイリング | Emotion | ランタイムCSS生成 |
| 状態管理 | Zustand | クライアントのみ |
| Canvas | Three.js | ブラウザのみ |

### 現在の動作フロー

```
1. ブラウザ → Workers → 静的HTML（空のdiv#root）
2. JSダウンロード・パース
3. React マウント（ここで初めて画面描画）
4. BrowserRouterでSPA遷移
```

### グローバルstate

| Store | 用途 | 永続化 |
|-------|------|--------|
| useGlobalStore | アニメーション状態、操作状態 | なし |
| useThemeStore | テーマモード | localStorage |
| useDialogStore | ダイアログ開閉 | なし |

---

## SSR化に必要な要素

| 項目 | 現状 | 必要なこと |
|------|------|-----------|
| サーバーレンダリング | なし | `renderToString`でHTML生成 |
| ルーティング | クライアントのみ | サーバーでもURL解決が必要 |
| スタイル | ランタイム生成 | SSR時にCSS抽出 or ビルド時生成 |
| ハイドレーション | なし | `hydrateRoot`への切り替え |
| state初期化 | クライアントのみ | サーバー→クライアントへの引き継ぎ |

---

## 未決定事項

### 1. スタイリング方針

**選択肢:**
- A. Emotion維持 + Workers SSR（動作検証が必要）
- B. vanilla-extract等に移行（ビルド時生成、確実）

**決定:** B. vanilla-extract移行

**理由:**
- ゼロランタイムCSS。SSR時のCSS抽出処理が不要になり、実装の複雑さが大幅に低減する
- ビルド時に全CSSが生成済みのため、Workers環境との互換性問題が発生しない
- Lighthouseパフォーマンススコア向上に直結（ランタイムオーバーヘッド排除）

---

### 2. SSR実装方式

**選択肢:**
- A. 自前実装（Hono + renderToString）
- B. フレームワーク導入（Vike, React Router v7等）

**決定:** A. 自前実装（Workers native fetch handler + renderToString）

**理由:**
- サーバー側はcatch-allハンドラ1つのみ（ルーティングはReact StaticRouterが担当）のため、Hono等のサーバーフレームワークは不要
- Workers/Pagesのネイティブ fetch API（Web標準）で十分実現可能
- 依存を最小限に保てる
- vanilla-extract移行との同時進行においても、SSR側の挙動を完全にコントロールできる
- StaticRouterへの差し替えのみでreact-router-domの既存ルーティングを維持可能

---

### 3. ホスティング

**選択肢:**
- A. Cloudflare Workers維持
- B. Cloudflare Pages
- C. 他プラットフォーム

**決定:** A. Cloudflare Workers（+ Static Assets）

**理由:**
- Workers Static Assets機能により、静的アセットの自動CDN配信がWorkers単体で実現可能（Pagesと同等）
- Cloudflareの公式推奨。全投資・新機能開発がWorkersに集中しており、Pagesは将来Workersに統合予定
- Durable Objects, KV, D1, Cron Triggers等の全プラットフォーム機能に直接アクセス可能
- 将来APIルートが増えた場合もHono等を後付けするだけで対応可能

---

## 確定事項

| 項目 | 決定 | 備考 |
|------|------|------|
| スタイリング | vanilla-extract移行 | ゼロランタイムCSS |
| SSR実装 | 自前実装（native fetch handler） | renderToString + StaticRouter |
| ホスティング | Cloudflare Workers | Static Assets + fetch handler でSSR |

---

## SSRアーキテクチャ詳細設計

### SSR後の技術スタック

| レイヤー | 技術 | 役割 |
|---------|------|------|
| ホスティング | Cloudflare Workers | Static Assets（CDN配信）+ fetch handler（SSR） |
| サーバー | Workers native fetch handler | リクエスト処理、SSR実行（フレームワーク不使用） |
| レンダリング | React 19 renderToString | サーバーサイドHTML生成 |
| ルーティング | react-router-dom (StaticRouter / BrowserRouter) | サーバー: StaticRouter / クライアント: BrowserRouter |
| スタイリング | vanilla-extract | ビルド時CSS生成（ゼロランタイム） |
| 状態管理 | Zustand | サーバー→クライアントへの引き継ぎ |
| Canvas | Three.js + Canvas 2D | クライアントのみ（SSRスキップ） |

---

### ディレクトリ構成（SSR後）

```
ee-bbb/
├── src/
│   ├── client/
│   │   └── main.tsx              # クライアントエントリ（hydrateRoot）
│   ├── server/
│   │   ├── entry.ts              # サーバーエントリ（fetch handler）
│   │   ├── renderer.tsx          # renderToString + HTMLテンプレート組み立て
│   │   ├── detect-theme.ts       # Cookie → テーマ検出
│   │   ├── detect-i18n.ts        # Accept-Language → 言語検出
│   │   └── meta.ts               # ルートメタデータ（OGP）
│   ├── shared/
│   │   ├── App.tsx               # 共通Appコンポーネント（現 components/app/App.tsx を移動）
│   │   └── routes.tsx            # ルート定義（server/client共用）
│   ├── components/               # 変更なし
│   ├── hooks/                    # SSR安全化が必要
│   ├── state/                    # 初期state注入の仕組み追加
│   ├── canvas/                   # 変更なし（クライアントのみ）
│   ├── util/                     # 変更なし
│   └── types/
├── dist/                         # ビルド出力
│   ├── client/                   # Vite client build 出力
│   │   ├── assets/               # JS/CSS バンドル
│   │   └── index.html            # ビルド済みHTMLテンプレート
│   └── server/                   # Vite SSR build 出力
│       └── entry.js              # サーバーバンドル
├── plugins/
│   └── injectHtmlsPlugin.ts      # 変更なし
├── vite.config.ts                # client/server ビルド設定
├── wrangler.toml                 # Cloudflare Workers設定（新規）
└── package.json
```

---

### ビルドパイプライン

```
1. vite build
   入力: src/client/main.tsx
   出力: dist/client/assets/  (JS/CSS バンドル)
         dist/client/index.html (HTMLテンプレート、icons/filters注入済み)

2. vite build --ssr src/server/entry.ts
   入力: src/server/entry.ts
   出力: dist/server/entry.js (サーバーバンドル)

3. ビルド後処理
   dist/client/index.html をHTMLテンプレートとして dist/server/ にコピー
   → サーバーがこのテンプレートの <!--ssr-outlet--> を実際のSSRコンテンツで置換

4. wrangler deploy
   dist/server/entry.js（Worker本体）+ dist/client/（Static Assets）をデプロイ
```

**wrangler.toml:**

```toml
name = "ee-bbb"
main = "./dist/server/entry.js"
compatibility_date = "2026-02-15"

[assets]
directory = "./dist/client"
binding = "ASSETS"
```

静的アセットに該当するリクエスト → CDN直接配信（Workerコード未実行）
該当しないリクエスト → fetch handler でSSR処理

**package.json scripts:**

```json
{
  "scripts": {
    "dev": "vite",
    "dev:ssr": "wrangler dev",
    "build": "pnpm build:client && pnpm build:server",
    "build:client": "tsc -b && vite build --outDir dist/client",
    "build:server": "vite build --ssr src/server/entry.ts --outDir dist/server",
    "preview": "pnpm build && wrangler dev",
    "deploy": "pnpm build && wrangler deploy"
  }
}
```

---

### SSRリクエストフロー

```
┌──────────┐     ┌───────────────────┐     ┌──────────────────────────┐
│ ブラウザ   │────▶│ Cloudflare Workers│────▶│ 静的アセット?             │
└──────────┘     │  Edge Network     │     │  /assets/*.js, *.css     │
                 └───────────────────┘     │  /favicon.ico            │
                                           └──────────┬───────────────┘
                                                      │
                                            Yes ──────┤────── No
                                            │                  │
                                            ▼                  ▼
                                    ┌──────────────┐  ┌─────────────────────────┐
                                    │ Static Assets│  │ Worker (fetch handler)   │
                                    │ CDN直接配信   │  │                         │
                                    └──────────────┘  │ 1. i18n検出              │
                                                      │ 2. theme検出             │
                                                      │ 3. ルートマッチング       │
                                                      │ 4. OGPメタデータ解決      │
                                                      │ 5. renderToString        │
                                                      │ 6. HTMLテンプレート注入    │
                                                      │ 7. Response返却          │
                                                      └─────────────────────────┘
```

---

### エントリポイント設計

#### サーバーエントリ（src/server/entry.ts）

```ts
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "@/shared/App";
import { detectTheme } from "./detect-theme";
import { detectI18n } from "./detect-i18n";
import { resolveRouteMeta, renderMeta } from "./meta";
import { serializeState } from "./serialize";
import template from "./template.html?raw";  // ビルド済みHTMLテンプレート

type Env = {
  ASSETS: { fetch: typeof fetch };  // Workers Static Assets バインディング
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // リクエストヘッダーから初期stateを決定
    const theme = detectTheme(request.headers);
    const lang = detectI18n(request.headers);
    const initialState = { theme, lang };

    // ルートメタデータ（OGP用）
    const meta = resolveRouteMeta(url.pathname, lang);

    // React SSR
    const appHtml = renderToString(
      <StaticRouter location={url.pathname}>
        <App initialState={initialState} />
      </StaticRouter>
    );

    // HTMLテンプレートに注入
    const html = template
      .replace("<!--ssr-outlet-->", appHtml)
      .replace("<!--ssr-head-->", renderMeta(meta))
      .replace("<!--ssr-initial-state-->", serializeState(initialState))
      .replace('<html lang="ja">', `<html lang="${lang}">`);

    // 404判定
    const status = meta.is404 ? 404 : 200;

    return new Response(html, {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
```

#### クライアントエントリ（src/client/main.tsx 変更後）

```ts
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/shared/App";

const initialState = window.__INITIAL_STATE__;

const root = document.querySelector("#root");
if (root == null) throw new Error("Root Element could not be found.");

hydrateRoot(
  root,
  <BrowserRouter>
    <App initialState={initialState} />
  </BrowserRouter>
);
```

---

### 共通Appコンポーネント設計

サーバー/クライアント両方で使用する共通Appコンポーネント。
Router部分は各エントリ側で包むため、App自体はRouterを含まない。

```tsx
// src/shared/App.tsx
type InitialState = {
  theme: ThemeMode;
  lang: LocaleKey;
};

type Props = {
  initialState?: InitialState;
};

export function App({ initialState }: Props) {
  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <QueryClientProvider client={queryClient}>
          <I18nStateProvider initialLang={initialState?.lang}>
            <ThemeStateProvider initialTheme={initialState?.theme}>
              <GlobalCanvasProvider>
                {/* vanilla-extract移行後: <Global> は不要。CSSファイルとして読み込み */}
                <GlobalCanvas />
                <GlobalCanvasNavigator />
                <GlobalNavigation />
                <GlobalFootprintDialog />

                <Routes>
                  <Route path={routes.top} element={<TopPage />} />
                  <Route path={routes.blog} element={<BlogPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </GlobalCanvasProvider>
            </ThemeStateProvider>
          </I18nStateProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
```

---

### State管理（サーバー→クライアント引き継ぎ）

#### 引き継ぎが必要なState

| State | サーバーでの決定方法 | クライアントでの受け取り |
|-------|-------------------|----------------------|
| theme | Cookie（過去の選択）→ 未設定時はデフォルト値 | `window.__INITIAL_STATE__.theme` |
| lang | `Accept-Language` ヘッダー | `window.__INITIAL_STATE__.lang` |

#### 引き継ぎが不要なState

| State | 理由 |
|-------|------|
| useGlobalStore | アニメーション・操作状態。初期値固定で問題ない |
| useDialogStore | ダイアログ開閉。初期値は常にfalse |

#### 初期State注入方式

```html
<!-- サーバーがHTMLに埋め込む -->
<script>
  window.__INITIAL_STATE__ = {"theme":"dark","lang":"ja"};
</script>
```

**セキュリティ考慮:** `JSON.stringify` の出力に対して `<` と `>` をエスケープし、XSSを防止する。

```ts
function serializeState(state: object): string {
  const json = JSON.stringify(state)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
  return `<script>window.__INITIAL_STATE__=${json};</script>`;
}
```

---

### テーマ検出フロー

```
┌─────────────────────────────────────────────────────────┐
│ サーバー側（初回レンダリング）                              │
│                                                         │
│  1. Cookie "theme-preference" を確認                     │
│     ├─ 値あり → その値をテーマとして使用                    │
│     └─ 値なし → Sec-CH-Prefers-Color-Scheme を確認       │
│                 ├─ 値あり → その値を使用                   │
│                 └─ 値なし → デフォルト("light")を使用       │
│                                                         │
│  2. body[data-theme-mode] にテーマ値を設定してレンダリング  │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ クライアント側（ハイドレーション後）                        │
│                                                         │
│  1. window.__INITIAL_STATE__.theme を受け取る             │
│  2. localStorage (Zustand persist) を確認                │
│     ├─ 値あり → localStorageの値を優先                    │
│     └─ 値なし → サーバー決定値を使用                       │
│  3. テーマ変更時 → Cookie "theme-preference" も更新       │
│     → 次回SSR時にサーバーが正しいテーマでレンダリング可能     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**FOUC（Flash of Unstyled Content）防止:**
- 現状のCSS変数定義方式（`:root` に light/dark 両方の変数を定義）はSSR後も維持
- `body[data-theme-mode]` によるテーマ切替はCSSレベルで即座に反映される
- サーバーHTMLの `<body data-theme-mode="dark">` がそのまま初期表示に使われるため、FOUC は発生しない

**Cookie同期の実装:**

```ts
// src/server/detect-theme.ts
import type { ThemeMode } from "@/components/styles/theme";

export function detectTheme(headers: Headers): ThemeMode {
  // 1. Cookie から過去の選択を取得
  const cookie = headers.get("Cookie") ?? "";
  const match = cookie.match(/theme-preference=(light|dark)/);
  if (match) return match[1] as ThemeMode;

  // 2. Client Hints（ブラウザ対応時）
  const clientHint = headers.get("Sec-CH-Prefers-Color-Scheme");
  if (clientHint === "dark") return "dark";

  // 3. デフォルト
  return "light";
}
```

```ts
// クライアント側: テーマ変更時にCookieも更新
const change = (mode: ThemeMode) => {
  setThemeMode(mode);
  document.cookie = `theme-preference=${mode};path=/;max-age=31536000;SameSite=Lax`;
};
```

---

### i18n検出フロー

```
サーバー側:
  1. Accept-Language ヘッダーを解析
     "ja,en-US;q=0.9,en;q=0.8" → "ja"
  2. サポート言語（ja, en）とマッチング
  3. <html lang="ja"> としてレンダリング
  4. I18nStateProvider に initialLang として渡す

クライアント側:
  1. window.__INITIAL_STATE__.lang を受け取り
  2. I18nStateProvider が初期値として使用
  3. ユーザーが言語を切り替えた場合、document.documentElement.lang を更新
```

```ts
// src/server/detect-i18n.ts
import type { LocaleKey } from "@/util/i18n/localize";

const SUPPORTED_LANGS: readonly LocaleKey[] = ["ja", "en"];

export function detectI18n(headers: Headers): LocaleKey {
  const acceptLang = headers.get("Accept-Language") ?? "";
  return parseAcceptLanguage(acceptLang);
}

function parseAcceptLanguage(header: string): LocaleKey {
  const langs = header.split(",").map((part) => {
    const [lang, q] = part.trim().split(";q=");
    return { lang: lang.trim().split("-")[0], q: q ? Number(q) : 1 };
  });
  langs.sort((a, b) => b.q - a.q);

  for (const { lang } of langs) {
    if (SUPPORTED_LANGS.includes(lang as LocaleKey)) {
      return lang as LocaleKey;
    }
  }
  return "ja"; // デフォルト
}
```

---

### Canvas/Three.js SSR対応

Canvas関連コンポーネントはブラウザAPIに依存するため、SSR時にはスキップする。

#### 方針: クライアントのみレンダリング

```tsx
// src/hooks/useGlobalCanvas/index.tsx（SSR対応版）
import { lazy, Suspense } from "react";

// Canvas関連はlazy importでクライアントのみ読み込み
const CanvasContent = lazy(() => import("./CanvasContent"));

export const GlobalCanvasProvider: FC<PropsWithChildren> = ({ children }) => {
  // サーバー側: canvasなしの状態でchildrenのみレンダリング
  if (typeof window === "undefined") {
    return (
      <GlobalCanvasContext.Provider value={null}>
        {children}
      </GlobalCanvasContext.Provider>
    );
  }

  // クライアント側: 従来通り
  return (
    <Suspense fallback={null}>
      <CanvasContent>{children}</CanvasContent>
    </Suspense>
  );
};
```

**SSR出力時のHTML:**

```html
<!-- サーバーが返すHTML -->
<div id="root">
  <!-- Canvas部分は空のコンテナ -->
  <canvas id="global-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;"></canvas>
  <!-- 他のUI要素はSSRされたコンテンツ -->
  <nav>...</nav>
  <main>...</main>
</div>
```

ハイドレーション後にCanvasの初期化・描画が開始される。

---

### OGP / SEOメタデータ

ルートごとにメタデータを定義し、サーバーHTMLの `<head>` に注入する。

```ts
// src/server/meta.ts
type RouteMeta = {
  title: string;
  description: string;
  ogImage?: string;
  is404?: boolean;
};

const routeMetaMap: Record<string, (lang: string) => RouteMeta> = {
  "/": (lang) => ({
    title: "EE-BBB.© | Extend Expression, Bit by Bit.",
    description: lang === "ja"
      ? "Nao Sasaki / Lanberb のポートフォリオサイト"
      : "Portfolio of Nao Sasaki / Lanberb, A Creative Developer",
    ogImage: "/og-image.png",
  }),
  "/blog": (lang) => ({
    title: lang === "ja" ? "Blog | EE-BBB.©" : "Blog | EE-BBB.©",
    description: lang === "ja"
      ? "ブログ記事一覧"
      : "Blog articles",
    ogImage: "/og-image-blog.png",
  }),
};

export function resolveRouteMeta(pathname: string, lang: string): RouteMeta {
  const resolver = routeMetaMap[pathname];
  if (resolver) return resolver(lang);

  // 404
  return {
    title: "404 | EE-BBB.©",
    description: "Page not found",
    is404: true,
  };
}
```

**HTMLテンプレートへの注入:**

```html
<head>
  <!-- 静的なmeta（現状のindex.htmlから維持） -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SSRで動的に注入 -->
  <!--ssr-head-->
  <!--
    <title>EE-BBB.© | Extend Expression, Bit by Bit.</title>
    <meta name="description" content="..." />
    <meta property="og:title" content="..." />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="..." />
    <meta property="og:url" content="..." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  -->
</head>
```

---

### エラーハンドリング

#### 404 Not Found

```
1. fetch handler がリクエストを受信
2. resolveRouteMeta で該当ルートなし → is404: true
3. React側: <Route path="*" element={<NotFoundPage />} />
4. renderToString で404ページのHTMLを生成
5. new Response(html, { status: 404 }) でステータスコード404を返却
```

#### 500 Internal Server Error

```ts
// src/server/entry.ts 内の fetch handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // ... SSR処理 ...
    } catch (err) {
      console.error("SSR Error:", err);
      // フォールバック: 最低限のHTMLを返し、CSRにフォールバック
      return new Response(
        `<!DOCTYPE html>
         <html><body>
           <div id="root"></div>
           <script type="module" src="/assets/main.js"></script>
         </body></html>`,
        { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  },
};
```

500エラー時はCSRにフォールバック。クライアントJSが読み込まれれば通常通り動作する。

---

### HTMLテンプレート設計

現在の `index.html` をベースに、SSR用のプレースホルダーを追加する。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rock+Salt&text=..." />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:..." />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--ssr-head-->
  </head>
  <body data-theme-mode="light">
    <div id="root"><!--ssr-outlet--></div>
    <div id="icons" style="display: none;"><!-- injectHtmlsPlugin で注入 --></div>
    <div id="filters" style="display: none;"><!-- injectHtmlsPlugin で注入 --></div>
    <!--ssr-initial-state-->
    <script type="module" src="/src/client/main.tsx"></script>
  </body>
</html>
```

---

### 開発環境（HMR対応）

開発時はVite dev serverを使用し、SSRとHMRを両立する。

```ts
// vite.config.ts（開発時SSR対応）
export default defineConfig({
  plugins: [
    injectHtmlsPlugin(),
    vanillaExtractPlugin(),  // vanilla-extract移行後
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
    },
  },
  ssr: {
    target: "webworker",
  },
});
```

**開発フロー:**
1. `vite dev` でHMR付き開発（CSRモード）
2. `wrangler dev` でSSR動作確認（本番同等）

---

### Providerのサーバー安全化

各Providerをサーバー環境で安全に動作するよう修正する。

| Provider | 現状の問題 | SSR対応 |
|----------|-----------|---------|
| ThemeStateProvider | `window.matchMedia` 直接呼び出し | `initialTheme` props追加。サーバーではprops値を使用 |
| I18nStateProvider | `document.documentElement.lang` 参照 | `initialLang` props追加。サーバーではprops値を使用 |
| GlobalCanvasProvider | Canvas API依存 | サーバーではnull contextを提供 |
| QueryClientProvider | 問題なし | 変更不要 |
| BrowserRouter | サーバーで使用不可 | App外に移動。サーバーはStaticRouter、クライアントはBrowserRouter |

---

## 移行フェーズ

### Phase 1: SSR基盤構築（Emotion維持）

vanilla-extract移行を待たず、現行のEmotionのままSSRを先行実装する。
`@emotion/server` の `extractCriticalToChunks` でCSS抽出を行う。

1. サーバーエントリ（`src/server/entry.ts`）作成
2. 共通App（`src/shared/App.tsx`）分離
3. クライアントエントリを `hydrateRoot` に変更
4. Providerのサーバー安全化
5. Emotion SSR（`@emotion/server`）設定
6. テーマ/i18n検出middleware実装
7. HTMLテンプレート整備
8. Viteビルド設定（client + server）
9. wrangler.toml 設定（Workers + Static Assets）
10. Cloudflare Workersへのデプロイ検証

### Phase 2: vanilla-extract移行

SSRが動作する状態を維持しながら、Emotionからvanilla-extractへ段階的に移行する。

1. vanilla-extract + Viteプラグイン導入
2. テーマシステム移行（CSS変数定義 → vanilla-extract themes）
3. globalStyles移行
4. unitコンポーネント移行（Box, Text, Button, ...）
5. moduleコンポーネント移行
6. pageコンポーネント移行
7. mixins移行（vanilla-extractのrecipes/sprinklesで代替）
8. Emotion依存削除（@emotion/react, @emotion/styled, @emotion/server, @emotion/babel-plugin）
9. Vite設定からEmotion JSX設定を削除

### Phase 3: 最適化・仕上げ

1. OGPメタデータ設定・検証
2. 404ページ実装
3. Lighthouseスコア検証・チューニング
4. Streaming SSR検討（`renderToReadableStream`）
5. ブログ記事の個別ルート対応（`/blog/:slug`）
6. OGP画像の自動生成検討

---

## 参考資料

- [Vike (vite-plugin-ssr)](https://vike.dev/)
- [React Router v7](https://reactrouter.com/)
- [vanilla-extract](https://vanilla-extract.style/)
- [Cloudflare Workers SSR](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Static Assets バインディング設定](https://developers.cloudflare.com/workers/static-assets/binding/)
- [React renderToString](https://react.dev/reference/react-dom/server/renderToString)
- [StaticRouter (react-router-dom)](https://reactrouter.com/en/main/router-components/static-router)
