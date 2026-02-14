# ブログ ビルド時変換アーキテクチャ

## 全体フロー

```
┌─────────────────────────────────────────────────────────────┐
│  ビルド時                                                    │
│                                                              │
│   docs/blog/*.md                                             │
│         │                                                    │
│         ▼                                                    │
│   ┌──────────────┐                                          │
│   │ Viteプラグイン │                                         │
│   │  (remark)     │                                          │
│   └──────────────┘                                          │
│         │                                                    │
│         ▼                                                    │
│   HTML文字列に変換                                            │
│         │                                                    │
│         ▼                                                    │
│   バンドルに含める (virtual module or JSON)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  ランタイム                                                  │
│                                                              │
│   import { html } from 'virtual:blog/fec-tokyo-2025'        │
│         │                                                    │
│         ▼                                                    │
│   <article dangerouslySetInnerHTML={{ __html: html }} />    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## ステップ

### ビルド時
1. `docs/blog/*.md` をプラグインが読む
2. remark で HTML に変換
3. virtual module か JSON としてバンドルに含める

### ランタイム
1. ページで `import` するだけ（パース処理なし）
2. 変換済みHTMLを `dangerouslySetInnerHTML` で表示

## 使用イメージ

```ts
import { html, meta } from 'virtual:blog/fec-tokyo-2025';

<article dangerouslySetInnerHTML={{ __html: html }} />
```
