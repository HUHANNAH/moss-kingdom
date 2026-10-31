@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 请保持本窗口打开，然后在浏览器打开 http://127.0.0.1:4173
where node >nul 2>nul
if errorlevel 1 (
  if exist "D:\Nodejs\node.exe" (
    "D:\Nodejs\node.exe" tools\serve.cjs
  ) else (
    echo 未找到 Node.js。请安装 Node.js，或使用 VS Code Live Server。
  )
) else (
  node tools\serve.cjs
)
pause
