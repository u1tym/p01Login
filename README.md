# Portal Login

Vue3 + TypeScript で作成されたログイン画面アプリケーション

## 機能

- PCとスマホ対応のレスポンシブデザイン
- ユーザ名・パスワードによるログイン認証
- セッション管理

## 開発環境のセットアップ

### 必要な環境

- Node.js (v18以上推奨)
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは `http://localhost:5173/portal/login` で起動します。

### ビルド

```bash
npm run build
```

ビルド結果は `dist` ディレクトリに出力されます。

## デプロイ

### nginx設定

1. ビルド結果をnginxのHTMLディレクトリに配置
2. `nginx.conf` を参考にnginx設定を追加
3. IPv4とIPv6の両方でリッスンするように設定

### 環境変数

本番環境では、API用のベースURLを環境変数で設定できます：

```bash
VITE_API_BASE_URL=https://api.example.com
```

開発環境では、デフォルトで `http://localhost:8000` が使用されます。

## プロジェクト構造

```
.
├── src/
│   ├── config/
│   │   └── urls.ts          # URL設定
│   ├── router/
│   │   └── index.ts         # ルーター設定
│   ├── views/
│   │   └── Login.vue        # ログイン画面
│   ├── App.vue              # メインアプリケーション
│   ├── main.ts              # エントリーポイント
│   └── vite-env.d.ts       # 型定義
├── comlibs/                 # 共通ライブラリ
│   ├── ssm.ts              # Verifyクラス
│   └── telegram-common.ts  # Telegramクラス
├── images/
│   └── PORTAL.jpg          # トレードマーク
├── nginx.conf              # nginx設定例
└── package.json
```

## API仕様

### プレ要求

エンドポイント: `POST /api/pre`

リクエスト:
```json
{
  "USER": "ユーザ名"
}
```

レスポンス:
```json
{
  "RESULT": true,
  "MAGIC_NUMBER": 12345
}
```

### 開錠要求

エンドポイント: `POST /api/unlock`

リクエスト:
```json
{
  "USER": "ユーザ名",
  "MAGIC_NUMBER": 12345,
  "HASH_PASS": "ハッシュ化パスワード"
}
```

レスポンス:
```json
{
  "RESULT": true,
  "SEQ_NUMBER": 67890
}
```

