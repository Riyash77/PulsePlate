@echo off
title SBAMS - First Time Setup
color 0B

echo.
echo  ============================================================
echo    SBAMS - First Time Setup (Run this ONCE only)
echo  ============================================================
echo.
echo  STEP 1: Get your FREE ngrok authtoken
echo  ─────────────────────────────────────
echo   1. Open your browser and go to: https://ngrok.com
echo   2. Click "Sign Up" (it's FREE)
echo   3. After login, go to: https://dashboard.ngrok.com/get-started/your-authtoken
echo   4. Copy your authtoken (it looks like: 2abc...XYZ)
echo.
echo  ─────────────────────────────────────
set /p TOKEN="  Paste your ngrok authtoken here and press Enter: "

if "%TOKEN%"=="" (
    echo  [ERROR] No token entered. Please re-run SETUP.bat.
    pause
    exit /b 1
)

echo.
echo  Saving authtoken to ngrok...
C:\SBAMS\tunnel\ngrok.exe authtoken %TOKEN%

if %errorlevel% equ 0 (
    echo.
    echo  ============================================================
    echo   Setup complete! Your authtoken is saved.
    echo   Now double-click START-SBAMS.bat to go live!
    echo  ============================================================
) else (
    echo.
    echo  [ERROR] Failed to save token. Check the token and try again.
)

echo.
pause
