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

**決定:** 未定

---

### 2. SSR実装方式

**選択肢:**
- A. 自前実装（Hono + renderToString）
- B. フレームワーク導入（Vike, React Router v7等）

**決定:** 未定

---

### 3. ホスティング

**選択肢:**
- A. Cloudflare Workers維持
- B. Cloudflare Pages
- C. 他プラットフォーム

**決定:** 未定

---

## 確定事項

（議論で決まったものをここに追記）

---

## 参考資料

- [Vike (vite-plugin-ssr)](https://vike.dev/)
- [React Router v7](https://reactrouter.com/)
- [vanilla-extract](https://vanilla-extract.style/)
- [Cloudflare Workers SSR](https://developers.cloudflare.com/workers/)
