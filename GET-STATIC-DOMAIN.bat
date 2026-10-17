@echo off
title SBAMS - Get Static ngrok Domain (Free)
color 0E

echo.
echo  ============================================================
echo    SBAMS - Get a STATIC (permanent) ngrok Domain (FREE)
echo  ============================================================
echo.
echo  By default, ngrok URLs change every time you restart.
echo  With a FREE ngrok account, you can get ONE static domain
echo  that NEVER changes: https://YOUR-NAME.ngrok-free.app
echo.
echo  HOW TO GET YOUR FREE STATIC DOMAIN:
echo  ─────────────────────────────────────────────────────
echo   1. Go to: https://dashboard.ngrok.com/cloud-edge/domains
echo   2. Click "New Domain" (it's FREE - you get 1 static domain)
echo   3. Copy the domain name (e.g., "brave-lion-abc123.ngrok-free.app")
echo   4. Paste it below
echo  ─────────────────────────────────────────────────────
echo.
set /p DOMAIN="  Paste your static ngrok domain (without https://): "

if "%DOMAIN%"=="" (
    echo  [ERROR] No domain entered.
    pause
    exit /b 1
)

:: Update ngrok.yml with the static domain
echo.
echo  Updating ngrok.yml with your static domain...

powershell -Command ^
  "$yml = Get-Content 'C:\SBAMS\tunnel\ngrok.yml' -Raw; " ^
  "$yml = $yml -replace 'student-portal:\r?\n    proto: http\r?\n    addr: 3002', " ^
  "'student-portal:`n    proto: http`n    addr: 3002`n    domain: %DOMAIN%'; " ^
  "Set-Content 'C:\SBAMS\tunnel\ngrok.yml' $yml; " ^
  "Write-Host 'Updated!'"

echo.
echo  ============================================================
echo   Your PERMANENT Student Portal URL will be:
echo   https://%DOMAIN%
echo.
echo   This URL NEVER changes - share it permanently!
echo  ============================================================
echo.
pause
