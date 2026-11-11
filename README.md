# むろらんグルメマップ

ビルド不要の静的サイト（HTML/CSS/JS）＋ Supabase。

## 構成
| ファイル | 役割 |
|---|---|
| index.html | 読み込みのみ |
| app.js | 画面01〜16・ルーター・データ層 |
| style.css | 見た目 |
| config.js | Supabase の接続情報（空ならデモモード） |
| schema.sql | テーブル・RLS・サンプル店舗 |

## 1. まず動かす（デモモード）
config.js が空のまま GitHub Pages に置けば、ブラウザ内保存で全画面が動きます。

## 2. GitHub Pages 公開
1. リポジトリを作成し、上記ファイルをルートにアップロード
2. Settings → Pages → Branch: `main` / `/(root)` → Save

## 3. Supabase 接続
1. supabase.com でプロジェクト作成
2. SQL Editor で `schema.sql` を実行
3. Project Settings → API の **Project URL** と **anon (publishable) key** を config.js に記入
4. Authentication → URL Configuration の Site URL に GitHub Pages の URL を設定
5. （任意）Authentication → Sign In / Providers → Email の「Confirm email」をオフにすると登録直後にログインできます

※ anon key は公開して問題ない設計です（RLS で保護）。service_role key は絶対に置かないでください。

## 店舗データの追加
Supabase の Table Editor で shops に行を追加、または CSV インポート。
緯度経度は Google マップで地点を右クリックするとコピーできます。

## 未実装（次の段階）
- 口コミへの写真添付（Supabase Storage）
- 店舗写真の表示
- 口コミの通報・管理者による非表示

---
## 追加機能（店舗自動取り込み・プロフィール・画像）

### 1. DB変更
SQL Editor で `migration.sql` を実行 → 最後の行のメールアドレスを自分のものに変えて実行すると管理者になります。

### 2. 店舗の自動取り込み（GitHub Actions）
1. https://webservice.recruit.co.jp/ でホットペッパーのAPIキーを取得（無料）
2. GitHub の Settings → Secrets and variables → Actions → New repository secret で3つ登録
   - `HOTPEPPER_KEY`：ホットペッパーのAPIキー
   - `SUPABASE_URL`：Project URL
   - `SUPABASE_SERVICE_KEY`：Supabase の service_role（secret）キー ※config.js には絶対に書かない
3. Actions タブ →「店舗データ取り込み」→「Run workflow」で手動実行（以後は毎週月曜3時に自動）
4. アプリのマイページ →「店舗の承認」で公開／却下

### 3. 画像
口コミ投稿・プロフィール編集で画像を選択できます（自動で縮小してから Supabase Storage に保存）。
