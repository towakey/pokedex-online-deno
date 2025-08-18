@echo off
setlocal enabledelayedexpansion

rem カウント変数を初期化
set /A count=1

rem このバッチファイルの名前を取得
set "bat_file=%~nx0"

rem ファイルをループ処理
for %%f in (*) do (
    rem 自分自身のバッチファイルかどうかを確認
    if not "%%~nxf"=="%bat_file%" (
        rem ファイル名を gallery-カウント に変更
        ren "%%f" "gallery-!count!%%~xf"
        set /A count+=1
    )
)

endlocal
