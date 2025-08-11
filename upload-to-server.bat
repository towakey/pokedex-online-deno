@echo off
setlocal EnableDelayedExpansion

echo ====================================
echo    Static Site Upload Script
echo ====================================
echo.

REM ===========================================
REM SSH Connection Settings (Default Values)
REM ===========================================

REM SSH接続設定（デフォルト値）
set DEFAULT_SSH_HOST=your-server.com
set DEFAULT_SSH_USER=your-username
set DEFAULT_REMOTE_PATH=/path/to/your/web/directory
set DEFAULT_SSH_KEY_FILE=
set DEFAULT_SSH_PORT=22

REM ===========================================

REM SSH Connection Information Input
echo Enter SSH connection information (Press Enter for default values):
echo.

REM SSH_HOST Input
set /p "SSH_HOST=SSH Host [%DEFAULT_SSH_HOST%]: "
if "%SSH_HOST%" == "" set SSH_HOST=%DEFAULT_SSH_HOST%

REM SSH_USER Input
set /p "SSH_USER=SSH User [%DEFAULT_SSH_USER%]: "
if "%SSH_USER%" == "" set SSH_USER=%DEFAULT_SSH_USER%

REM REMOTE_PATH Input
echo.
echo Enter upload destination directory:
echo Examples: /home/user/public_html, /var/www/html, /home/user/www
set /p "REMOTE_PATH=Remote Path [%DEFAULT_REMOTE_PATH%]: "
if "%REMOTE_PATH%" == "" set REMOTE_PATH=%DEFAULT_REMOTE_PATH%

REM SSH_PORT Input
set /p "SSH_PORT=SSH Port [%DEFAULT_SSH_PORT%]: "
if "%SSH_PORT%" == "" set SSH_PORT=%DEFAULT_SSH_PORT%

REM SSH_KEY_FILE Input
echo.
echo SSH private key file path (leave empty for password auth):
set /p "SSH_KEY_FILE=SSH Key File [%DEFAULT_SSH_KEY_FILE%]: "
if "%SSH_KEY_FILE%" == "" set SSH_KEY_FILE=%DEFAULT_SSH_KEY_FILE%

echo.
echo ===========================================

REM Configuration Check
if "%SSH_HOST%" == "your-server.com" (
    echo [ERROR] SSH connection settings incomplete.
    echo Please enter a valid SSH_HOST.
    echo.
    pause
    exit /b 1
)

REM Display Configuration for Confirmation
echo Please confirm the settings:
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
echo Start upload with these settings? (Y/N)
set /p "CONFIRM="
if /i not "%CONFIRM%" == "Y" (
    echo Upload cancelled.
    pause
    exit /b 0
)

REM Move to project directory
cd /d "%~dp0"

echo [1/4] Starting static site generation...
echo.

REM Generate static site
call npm run generate
if errorlevel 1 (
    echo [ERROR] Static site generation failed.
    pause
    exit /b 1
)

echo.
echo [2/4] Checking generated files...

REM Check if output directory exists
if not exist ".output\public" (
    echo [ERROR] Output directory '.output\public' not found.
    pause
    exit /b 1
)

REM Count files
for /f %%i in ('dir /s /b ".output\public\*" ^| find /c /v ""') do set FILE_COUNT=%%i
echo Generated file count: !FILE_COUNT! files

echo.
echo [3/4] Verifying SSH connection settings...
echo SSH Host: %SSH_HOST%
echo SSH User: %SSH_USER%
echo SSH Port: %SSH_PORT%
echo Remote Path: %REMOTE_PATH%
if not "%SSH_KEY_FILE%" == "" (
    echo SSH Key File: %SSH_KEY_FILE%
)
echo.

REM Test SSH connection
echo Testing SSH connection...
if not "%SSH_KEY_FILE%" == "" (
    ssh -i "%SSH_KEY_FILE%" -p %SSH_PORT% -o ConnectTimeout=10 -o BatchMode=yes %SSH_USER%@%SSH_HOST% "echo 'SSH connection successful'"
) else (
    ssh -p %SSH_PORT% -o ConnectTimeout=10 %SSH_USER%@%SSH_HOST% "echo 'SSH connection successful'"
)

if errorlevel 1 (
    echo [WARNING] SSH connection test failed. Please check authentication.
    echo Continue anyway? (Y/N)
    set /p "CONTINUE="
    if /i not "!CONTINUE!" == "Y" (
        echo Upload cancelled.
        pause
        exit /b 1
    )
)

echo.
echo [4/4] Starting file upload...

REM Create backup of remote directory (optional)
echo Create backup of remote directory? (Y/N)
set /p "CREATE_BACKUP="
if /i "!CREATE_BACKUP!" == "Y" (
    echo Creating backup...
    set BACKUP_NAME=backup_!date:~0,4!!date:~5,2!!date:~8,2!_!time:~0,2!!time:~3,2!!time:~6,2!
    set BACKUP_NAME=!BACKUP_NAME: =0!
    
    if not "%SSH_KEY_FILE%" == "" (
        ssh -i "%SSH_KEY_FILE%" -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cp -r %REMOTE_PATH% %REMOTE_PATH%_!BACKUP_NAME!"
    ) else (
        ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cp -r %REMOTE_PATH% %REMOTE_PATH%_!BACKUP_NAME!"
    )
    echo Backup created: %REMOTE_PATH%_!BACKUP_NAME!
)

REM Check if rsync is available (Git Bash or WSL environment)
where rsync >nul 2>nul
if %errorlevel% == 0 (
    echo Uploading using rsync...
    
    if not "%SSH_KEY_FILE%" == "" (
        rsync -avz --delete -e "ssh -i %SSH_KEY_FILE% -p %SSH_PORT%" ".output/public/" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    ) else (
        rsync -avz --delete -e "ssh -p %SSH_PORT%" ".output/public/" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    )
    
    if errorlevel 1 (
        echo [ERROR] rsync upload failed.
        pause
        exit /b 1
    )
) else (
    echo Uploading using scp...
    
    REM Clear remote directory (delete existing files)
    echo Deleting existing files...
    if not "%SSH_KEY_FILE%" == "" (
        ssh -i "%SSH_KEY_FILE%" -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "rm -rf %REMOTE_PATH%/* %REMOTE_PATH%/.*[!.]*"
    ) else (
        ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "rm -rf %REMOTE_PATH%/* %REMOTE_PATH%/.*[!.]*"
    )
    
    REM Upload files using scp
    if not "%SSH_KEY_FILE%" == "" (
        scp -i "%SSH_KEY_FILE%" -P %SSH_PORT% -r ".output\public\*" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    ) else (
        scp -P %SSH_PORT% -r ".output\public\*" "%SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/"
    )
    
    if errorlevel 1 (
        echo [ERROR] scp upload failed.
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo     Upload Complete!
echo ====================================
echo.
echo Site URL: https://%SSH_HOST%/pokedex-online/
echo Upload destination: %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%
echo Process time: %date% %time%
echo.

REM Check site after upload
echo Check site functionality? (Y/N)
set /p "OPEN_SITE="
if /i "!OPEN_SITE!" == "Y" (
    start https://%SSH_HOST%/pokedex-online/
)

echo.
echo Process completed. Press any key to continue.
pause >nul
