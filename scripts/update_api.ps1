# 更新/取得用スクリプト
# api フォルダ直下に towakey/pokedex リポジトリを clone し、
# 既に存在する場合は git pull で更新します。
# 実行例: powershell -ExecutionPolicy Bypass -File scripts/update_api.ps1

$ErrorActionPreference = 'Stop'

$apiDir = Join-Path $PSScriptRoot "..\api"
$repoDir = Join-Path $apiDir "pokedex"
$repoUrl = "https://github.com/towakey/pokedex.git"

if (-not (Test-Path $apiDir)) {
    New-Item -Path $apiDir -ItemType Directory | Out-Null
}

if (-not (Test-Path $repoDir)) {
    Write-Host "Cloning pokedex repository..."
    git -C $apiDir clone $repoUrl |
        ForEach-Object { $_ }
} else {
    Write-Host "Repository exists. Pulling latest changes..."
    git -C $repoDir pull |
        ForEach-Object { $_ }
}

Write-Host "Done. pokedex.php is located at $repoDir\pokedex.php"
