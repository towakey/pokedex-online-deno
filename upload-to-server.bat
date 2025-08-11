@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

echo ====================================
echo    静的サイトアップロードスクリプト
echo ====================================
echo.

REM ===========================================
REM ここでSSH接続情報を設定してください
REM ===========================================

REM SSH接続設定（デフォルト値）
set DEFAULT_SSH_HOST=your-server.com
set DEFAULT_SSH_USER=your-username
set DEFAULT_REMOTE_PATH=/path/to/your/web/directory
set DEFAULT_SSH_KEY_FILE=
set DEFAULT_SSH_PORT=22

REM ===========================================

REM SSH接続情報の入力
echo SSH接続情報を入力してください（Enterで前回値/デフォルト値を使用）:
echo.

REM SSH_HOSTの入力
set /p SSH_HOST="SSH Host [%DEFAULT_SSH_HOST%]: "
if "%SSH_HOST%" == "" set SSH_HOST=%DEFAULT_SSH_HOST%

REM SSH_USERの入力
set /p SSH_USER="SSH User [%DEFAULT_SSH_USER%]: "
if "%SSH_USER%" == "" set SSH_USER=%DEFAULT_SSH_USER%

REM REMOTE_PATHの入力
echo.
echo アップロード先ディレクトリを入力してください:
echo 例: /home/user/public_html, /var/www/html, /home/user/www
set /p REMOTE_PATH="Remote Path [%DEFAULT_REMOTE_PATH%]: "
if "%REMOTE_PATH%" == "" set REMOTE_PATH=%DEFAULT_REMOTE_PATH%

REM SSH_PORTの入力
set /p SSH_PORT="SSH Port [%DEFAULT_SSH_PORT%]: "
if "%SSH_PORT%" == "" set SSH_PORT=%DEFAULT_SSH_PORT%

REM SSH_KEY_FILEの入力
echo.
echo SSH秘密鍵ファイルのパス（パスワード認証の場合は空欄）:
set /p SSH_KEY_FILE="SSH Key File [%DEFAULT_SSH_KEY_FILE%]: "
if "%SSH_KEY_FILE%" == "" set SSH_KEY_FILE=%DEFAULT_SSH_KEY_FILE%

echo.
echo ===========================================

REM 設定チェック
if "%SSH_HOST%" == "your-server.com" (
    echo [エラー] SSH接続設定が未完了です。
    echo 有効なSSH_HOSTを入力してください。
    echo.
    pause
    exit /b 1
)

REM 入力された設定の確認表示
echo 設定内容を確認してください:
echo SSH Host: %SSH_HOST%
echo SSH User: %SSH_USER%
echo Remote Path: %REMOTE_PATH%
echo SSH Port: %SSH_PORT%
if not "%SSH_KEY_FILE%" == "" (
    echo SSH Key File: %SSH_KEY_FILE%
) else (
    echo SSH Auth: Password
)
echo.
echo この設定でアップロードを開始しますか？ (Y/N)
set /p CONFIRM=
if /i not "%CONFIRM%" == "Y" (
    echo アップロードを中止します。
    pause
    exit /b 0
)

REM プロジェクトディレクトリに移動
cd /d "%~dp0"

echo [1/4] 静的サイト生成を開始します...
echo.

REM 静的サイトの生成
call npm run generate
if errorlevel 1 (
    echo [エラー] 静的サイト生成に失敗しました。
    pause
    exit /b 1
)

echo.
echo [2/4] 生成されたファイルを確認中...

REM 出力ディレクトリの存在確認
if not exist ".output\public" (
    echo [エラー] 出力ディレクトリ '.output\public' が見つかりません。
    pause
    exit /b 1
)

REM ファイル数をカウント
for /f %%i in ('dir /s /b ".output\public\*" ^| find /c /v ""') do set FILE_COUNT=%%i
echo 生成されたファイル数: !FILE_COUNT!個

echo.
echo [3/4] SSH接続設定を確認中...
echo SSH Host: %SSH_HOST%
echo SSH User: %SSH_USER%
echo SSH Port: %SSH_PORT%
echo Remote Path: %REMOTE_PATH%
if not "%SSH_KEY_FILE%" == "" (
    echo SSH Key File: %SSH_KEY_FILE%
)
echo.

REM SSH接続テスト
echo SSH接続をテスト中...
if not "%SSH_KEY_FILE%" == "" (
    ssh -i "%SSH_KEY_FILE%" -p %SSH_PORT% -o ConnectTimeout=10 -o BatchMode=yes %SSH_USER%@%SSH_HOST% "echo 'SSH接続成功'"
) else (
    ssh -p %SSH_PORT% -o ConnectTimeout=10 %SSH_USER%@%SSH_HOST% "echo 'SSH接続成功'"
)

if errorlevel 1 (
    echo [警告] SSH接続テストに失敗しました。認証情報を確認してください。
    echo 続行しますか？ (Y/N)
    set /p CONTINUE=
    if /i not "!CONTINUE!" == "Y" (
        echo アップロードを中止します。
        pause
        exit /b 1
    )
)

echo.
echo [4/4] ファイルアップロード開始...

REM リモートディレクトリのバックアップ作成（オプション）
echo リモートディレクトリのバックアップを作成しますか？ (Y/N)
set /p CREATE_BACKUP=
if /i "!CREATE_BACKUP!" == "Y" (
    echo バックアップ作成中...
    set BACKUP_NAME=backup_!date:~0,4!!date:~5,2!!date:~8,2!_!time:~0,2!!time:~3,2!!time:~6,2!
    set BACKUP_NAME=!BACKUP_NAME: =0!
    
    if not "%SSH_KEY_FILE%" == "" (
        ssh -i "%SSH_KEY_FILE%" -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cp -r %REMOTE_PATH% %REMOTE_PATH%_!BACKUP_NAME!"
    ) else (
        ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cp -r %REMOTE_PATH% %REMOTE_PATH%_!BACKUP_NAME!"
    )
    echo バックアップ作成完了: %REMOTE_PATH%_!BACKUP_NAME!
)

REM rsyncが利用可能かチェック（Git BashやWSL環境）
where rsync >nul 2>nul
if %errorlevel% == 0 (
    echo rsyncを使用してアップロード中...
    
    if not "%SSH_KEY_FILE%" == "" (
        rsync -avz --delete -e "ssh -i %SSH_KEY_FILE% -p %SSH_PORT%" ".output/public/" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    ) else (
        rsync -avz --delete -e "ssh -p %SSH_PORT%" ".output/public/" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    )
    
    if errorlevel 1 (
        echo [エラー] rsyncアップロードに失敗しました。
        pause
        exit /b 1
    )
) else (
    echo scpを使用してアップロード中...
    
    REM リモートディレクトリをクリア（既存ファイルを削除）
    echo 既存ファイルを削除中...
    if not "%SSH_KEY_FILE%" == "" (
        ssh -i "%SSH_KEY_FILE%" -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "rm -rf %REMOTE_PATH%/* %REMOTE_PATH%/.*[!.]*"
    ) else (
        ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "rm -rf %REMOTE_PATH%/* %REMOTE_PATH%/.*[!.]*"
    )
    
    REM scpでファイルをアップロード
    if not "%SSH_KEY_FILE%" == "" (
        scp -i "%SSH_KEY_FILE%" -P %SSH_PORT% -r ".output\public\*" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    ) else (
        scp -P %SSH_PORT% -r ".output\public\*" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    )
    
    if errorlevel 1 (
        echo [エラー] scpアップロードに失敗しました。
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo     アップロード完了！
echo ====================================
echo.
echo サイトURL: https://%SSH_HOST%/pokedex-online/
echo アップロード先: %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%
echo 処理時刻: %date% %time%
echo.

REM アップロード後の確認
echo サイトの動作を確認しますか？ (Y/N)
set /p OPEN_SITE=
if /i "!OPEN_SITE!" == "Y" (
    start https://%SSH_HOST%/pokedex-online/
)

echo.
echo 処理が完了しました。何かキーを押してください。
pause >nul
