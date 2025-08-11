# 静的サイトアップロードガイド

このドキュメントは `upload-to-server.bat` を使用してNuxtプロジェクトをレンタルサーバーにアップロードする方法を説明します。

## 前提条件

### 必要なソフトウェア
- **OpenSSH**: Windows 10 Build 1809以降に標準インストール済み
  - 確認方法: `ssh -V` をコマンドプロンプトで実行
- **Node.js & npm**: プロジェクト実行用
- **Git Bash** (推奨): rsync使用時に必要

### サーバー側の要件
- SSH接続が有効
- 適切なディレクトリへの書き込み権限
- ウェブサーバー（Apache/Nginx）が設定済み

## セットアップ手順

### 1. batファイルの設定

`upload-to-server.bat` をテキストエディタで開き、以下の項目を設定してください：

```batch
REM SSH接続設定（必須項目）
set SSH_HOST=your-domain.com          # サーバーのホスト名またはIP
set SSH_USER=your-username             # SSHユーザー名
set REMOTE_PATH=/home/user/public_html # アップロード先ディレクトリ

REM SSH秘密鍵ファイルのパス（オプション）
set SSH_KEY_FILE=C:\path\to\private\key.pem

REM SSH接続ポート（通常は22）
set SSH_PORT=22
```

### 2. SSH認証方式の選択

#### パスワード認証の場合
- `SSH_KEY_FILE` を空欄のままにする
- 実行時にパスワードの入力を求められます

#### 秘密鍵認証の場合（推奨）
- 秘密鍵ファイルのフルパスを `SSH_KEY_FILE` に設定
- 秘密鍵の権限が適切に設定されていることを確認

## 実行手順

### 1. 基本実行
```cmd
C:\xampp\htdocs\pokedex-online-deno> upload-to-server.bat
```

### 2. 実行フロー
スクリプトは以下の順序で処理を実行します：

1. **設定確認**: SSH接続情報の検証
2. **静的生成**: `npm run generate` の実行
3. **ファイル確認**: `.output\public` の内容をチェック
4. **SSH接続テスト**: サーバーへの接続確認
5. **バックアップ作成** (オプション): 既存ファイルの保存
6. **ファイルアップロード**: rsync または scp を使用
7. **完了確認**: アップロード結果の表示

## トラブルシューティング

### よくある問題と解決方法

#### 1. SSH接続エラー
**症状**: `Connection refused` または `Permission denied`

**解決方法**:
- ホスト名/IP、ユーザー名、ポート番号を確認
- SSH接続の手動テスト: `ssh -p 22 user@your-server.com`
- ファイアウォール設定の確認

#### 2. 秘密鍵認証エラー
**症状**: `Load key "path": invalid format`

**解決方法**:
```cmd
# 秘密鍵の権限設定（Git Bashで実行）
chmod 600 /path/to/private/key.pem

# 秘密鍵形式の確認
ssh-keygen -l -f /path/to/private/key.pem
```

#### 3. 静的生成エラー
**症状**: `npm run generate` が失敗

**解決方法**:
```cmd
# 依存関係の再インストール
npm ci

# 開発サーバーでのテスト
npm run dev

# キャッシュのクリア
rm -rf .nuxt .output node_modules/.cache
```

#### 4. アップロード権限エラー
**症状**: `Permission denied` (ファイル書き込み時)

**解決方法**:
- リモートディレクトリの権限確認: `ls -la /path/to/upload/directory`
- ディレクトリ所有者の確認: `whoami` vs `ls -la`
- 権限修正: `chmod 755 /path/to/upload/directory`

### デバッグ方法

#### SSH接続の詳細ログ
```cmd
ssh -v -p 22 user@your-server.com
```

#### rsync詳細出力
```cmd
rsync -avz --progress --delete -e "ssh -p 22" .output/public/ user@server:/path/
```

## 設定例

### 一般的なレンタルサーバー設定例

#### さくらのレンタルサーバー
```batch
set SSH_HOST=your-domain.sakura.ne.jp
set SSH_USER=your-account
set REMOTE_PATH=/home/your-account/www
set SSH_PORT=22
```

#### エックスサーバー
```batch
set SSH_HOST=your-server.xserver.jp
set SSH_USER=your-account
set REMOTE_PATH=/home/your-account/your-domain.com/public_html
set SSH_PORT=10022
```

#### ロリポップ
```batch
set SSH_HOST=ssh.lolipop.jp
set SSH_USER=ssh-your-account
set REMOTE_PATH=/home/users/0/lolipop.jp-your-account/web
set SSH_PORT=22
```

## パフォーマンス最適化

### 大容量アップロード時の設定

1. **rsyncの並列処理**（Git Bashで実行）:
```bash
rsync -avz --delete --partial --progress \
  -e "ssh -p 22 -o Compression=yes" \
  .output/public/ user@server:/path/
```

2. **除外ファイルの設定**:
```bash
# .rsyncignore ファイルを作成
*.log
*.tmp
node_modules/
.git/
```

### 定期自動アップロード

Windows タスクスケジューラでの自動実行設定:
```cmd
schtasks /create /tn "Pokedex Upload" /tr "C:\path\to\upload-to-server.bat" /sc daily /st 02:00
```

## セキュリティ考慮事項

1. **秘密鍵の管理**
   - 秘密鍵ファイルの適切な権限設定
   - 秘密鍵の暗号化パスフレーズ使用を推奨

2. **接続設定**
   - SSH鍵認証の使用を強く推奨
   - 不要なポートの開放を避ける

3. **バックアップ**
   - アップロード前のリモートファイルバックアップ
   - 定期的なローカルプロジェクトバックアップ

## 関連ファイル

- `upload-to-server.bat`: メインアップロードスクリプト
- `nuxt.config.ts`: Nuxt設定（baseURL、静的生成設定）
- `package.json`: npm scripts設定
- `.output/public/`: 静的生成されたファイル

## サポート

問題が解決しない場合は、以下の情報を含めて問い合わせしてください：

1. エラーメッセージの全文
2. 使用しているOS版 (`winver`)
3. SSH版 (`ssh -V`)
4. Node.js版 (`node -v`)
5. サーバー環境（レンタルサーバー名、プラン）

---

**注意**: このスクリプトは本番環境への直接デプロイを行います。十分なテストを行ってから使用してください。
