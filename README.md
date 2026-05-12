# WorkMate — セットアップ手順

## ① ファイル配置

既存の `workmate-react-v1/src/` の以下のファイルを上書き：

```
src/main.jsx   ← 完全版（Auth + Realtime DM + Applications）
src/supabase.js ← auth設定追加
src/style.css  ← スタイル更新
```

---

## ② Supabase でテーブル作成

1. [Supabase Dashboard](https://supabase.com/dashboard) → プロジェクト選択
2. 左メニュー「SQL Editor」を開く
3. `SUPABASE_SETUP.sql` の内容を全部貼り付けて「Run」

作成されるテーブル：
- `profiles` — ユーザープロフィール（Google Auth連携）
- `saved_jobs` — 保存した求人（localStorageから移行）
- `applications` — 応募履歴
- `conversations` — DMスレッド
- `messages` — リアルタイムメッセージ

---

## ③ Google OAuth 設定

### Google Cloud Console
1. https://console.cloud.google.com/
2. 「APIとサービス」→「認証情報」→「OAuthクライアントID」作成
3. アプリの種類: **ウェブアプリケーション**
4. 承認済みリダイレクトURI に追加：
   ```
   https://zkquchdaizdjrvlsncbs.supabase.co/auth/v1/callback
   ```
5. Client ID と Client Secret をコピー

### Supabase Dashboard
1. 左メニュー「Authentication」→「Providers」
2. 「Google」をクリック → Enable にする
3. Client ID と Client Secret を貼り付けて保存

---

## ④ Realtime 有効化

Supabase Dashboard:
1. 左メニュー「Database」→「Replication」
2. `messages` テーブルと `conversations` テーブルの Realtime を **ON** にする

---

## ⑤ ローカル開発

```bash
npm install
npm run dev
```

---

## ⑥ Netlify deploy（クレジット回復後）

```bash
npm run build
# dist/ フォルダを Netlify にドラッグ&ドロップ
```

Netlify 環境変数は不要（Supabase URLとKeyはコードに含まれています）。

---

## 実装済み機能一覧

| 機能 | 状態 |
|------|------|
| 求人一覧・詳細 | ✅ 既存 |
| 求人投稿・画像アップロード | ✅ 既存 |
| 検索・フィルター | ✅ 既存 |
| Google ログイン | ✅ 新規 |
| 求人保存（Supabase） | ✅ 新規 |
| 応募システム | ✅ 新規 |
| リアルタイムDM | ✅ 新規 |
| プロフィール編集 | ✅ 新規 |
| 応募履歴タブ | ✅ 新規 |
| 保存済み求人タブ | ✅ 新規 |
| プロフィール完成度 | ✅ 新規 |

---

## 今後の拡張候補

- [ ] 求人投稿者（店側）専用画面
- [ ] Push通知（Supabase Edge Functions）
- [ ] 画像プロフィール写真アップロード
- [ ] 応募ステータス更新（店側が承認/却下）
- [ ] 多言語対応（英語/日本語切替）
