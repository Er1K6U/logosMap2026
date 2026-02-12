@echo off
setlocal

REM ====== CONFIG ======
set PORT=4173
set URL=http://localhost:%PORT%/
REM =====================

REM Ir a la carpeta del proyecto (donde está este .bat)
cd /d "%~dp0"

REM Si no existe dist, avisar
if not exist "dist" (
  echo No existe la carpeta dist. Ejecuta: npm run build
  pause
  exit /b 1
)

REM Levanta un servidor estatico con Vite Preview (usa node_modules)
start "LogosMap Server" cmd /c "npm run preview -- --host localhost --port %PORT%"

REM Espera un poquito para que arranque el servidor
timeout /t 2 /nobreak >nul

REM Abre el navegador
start "" "%URL%"

endlocal
