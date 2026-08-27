@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Paketlar o'rnatilmoqda...
  call npm install
)
call npm run dev
