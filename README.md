# WorkMate — セットアップ手順

シドニーで働く留学生と雇用主をつなぐジョブマッチングアプリ。

---

## ① Supabase でテーブル作成

1. [Supabase Dashboard](https://supabase.com/dashboard) → プロジェクト選択
2. 左メニュー「SQL Editor」を開く
3. `SUPABASE_SETUP.sql` の内容を全部貼り付けて「Run」

作成されるテーブル：

| テーブル | 内容 |
|----------|------|
| `jobs` | 求人情報（posted_by で投稿者を紐付け）|
| `profiles` | ユーザープロフィール（Google Auth 連携）|
| `saved_jobs` | 保存した求人 |
| `applications` | 応募履歴 |
| `conversations` | DMスレッド（求人DM / スタッフDM）|
| `messages` | リアルタイムメッセージ |

---

## ② ストレージバケット作成

Supabase Dashboard > Storage > New bucket で **2つ** 作成：

| バケット名 | Public | 用途 |
|-----------|--------|------|
| `job-images` | ON | 求人の写真 |
| `avatars` | ON | プロフィール写真 |

各バケットは **最大5MB**、許可MIMEタイプは
`image/jpeg`, `image/png`, `image/webp` に制限してください。
書き込みポリシーでは、ファイルパスの先頭がログイン中ユーザーの
`auth.uid()` と一致する場合だけ INSERT / UPDATE / DELETE を許可します。

既存環境を再開する場合は、先に `sql/security_hardening.sql` を実行して
プロフィール・DM・応募データの権限を更新してください。旧機能で
`resumes` / `dm-files` バケットが存在する場合、このSQLはデータを残した
まま Private に切り替え、本人・求人投稿者・会話参加者だけに限定します。

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
2. 「Google」→ Enable にする
3. Client ID と Client Secret を貼り付けて保存

---

## ④ Realtime 有効化

Supabase Dashboard > Database > Replication で以下の3テーブルを ON：

- `messages`
- `conversations`
- `jobs`

---

## ⑤ ローカル開発

```bash
npm install
npm run dev
```

---

## ⑥ Vercel / Netlify デプロイ

```bash
npm run build
# dist/ フォルダをデプロイ
```

環境変数不要（Supabase URLとKeyはコードに含まれています）。

---

## 実装済み機能一覧

| 機能 | 状態 |
|------|------|
| 求人一覧・詳細 | ✅ |
| 求人投稿（ログイン必須・posted_by 記録）| ✅ |
| 求人画像アップロード | ✅ |
| 検索・フィルター | ✅ |
| Google ログイン | ✅ |
| 求人保存 | ✅ |
| 応募システム | ✅ |
| リアルタイムDM（求人→企業）| ✅ バグ修正済み |
| スタッフ→ユーザー間DM | ✅ 新機能 |
| プロフィール編集 | ✅ |
| プロフィール写真アップロード | ✅ 新機能 |
| 応募履歴タブ | ✅ |
| 保存済み求人タブ | ✅ |
| Staffページ（実データ）| ✅ 新機能 |
| 採用ダッシュボード（応募者管理）| ✅ 新機能 |
| 採用・不採用ボタン | ✅ 新機能 |
| プロフィール完成度バー | ✅ |

---

## 修正済みバグ

- **DM の participant_b バグ**: 自分自身とのDMが開かれていた問題を修正。`job.posted_by` を相手として使用するよう修正。
- **PostJob 未認証投稿**: ログインなしで求人が投稿できた問題を修正。ログイン必須ガードを追加。
- **jobs テーブル欠落**: SQL に jobs テーブルが未定義だった問題を修正。

---

## 今後の拡張候補

- [ ] Push通知（Supabase Edge Functions）
- [ ] 多言語対応（英語/日本語切替）
- [ ] 求人の編集・削除機能
- [ ] 未読メッセージバッジ

---

## 再開前の確認

```bash
npm ci
npm audit
npm run build
```

- Supabase プロジェクトが稼働中であること
- `sql/security_hardening.sql` を実行済みであること
- Storage のサイズ・MIMEタイプ・ユーザー別パス制限が有効であること
- Vercel の本番URLで新規登録、求人投稿、応募、DMを2アカウントで確認すること
