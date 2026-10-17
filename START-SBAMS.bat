@echo off
chcp 65001 >nul
title PULSE PLATE - SBAMS Launcher
color 0B

echo.
echo  ============================================================
echo    BUS ATTENDANCE ^& MONITORING SYSTEM (SBAMS)
echo    PULSE PLATE - KPRIET College, Coimbatore
echo  ============================================================
echo.

:: Ensure Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not found in your PATH!
    echo  Please install Node.js [v18 or higher] from https://nodejs.org
    echo.
    pause
    exit /b 1
)

set "ROOT=%~dp0"

echo  Starting SBAMS Services...
echo  ------------------------------------------------------------

:: 1. Backend
echo  [1/4] Starting Backend API (Port 5000)...
start "SBAMS - Backend (Port 5000)" cmd /k "title SBAMS Backend [5000] & cd /d "%ROOT%backend" & npm run dev"

:: 2. Admin Portal
echo  [2/4] Starting Admin Portal (Port 3001)...
start "SBAMS - Admin Portal (Port 3001)" cmd /k "title SBAMS Admin Portal [3001] & cd /d "%ROOT%admin-portal" & npm run dev"

:: 3. Student Portal
echo  [3/4] Starting Student Portal (Port 3002)...
start "SBAMS - Student Portal (Port 3002)" cmd /k "title SBAMS Student Portal [3002] & cd /d "%ROOT%student-portal" & npm run dev"

:: 4. ngrok Tunnel (if available)
if exist "%ROOT%tunnel\ngrok.exe" (
    echo  [4/4] Starting ngrok Cloud Tunnel...
    start "SBAMS - ngrok Tunnel" cmd /k "title SBAMS ngrok Tunnel & cd /d "%ROOT%tunnel" & ngrok.exe start --config ngrok.yml --all"
) else (
    echo  [4/4] ngrok tunnel not found in %ROOT%tunnel, skipping tunnel.
)

echo.
echo  Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

:: Open portals in default browser
start http://localhost:3001
start http://localhost:3002

:MENU
cls
color 0A
echo.
echo  ============================================================
echo    SBAMS IS RUNNING!
echo  ============================================================
echo.
echo    Local Web Portals:
echo    * Admin Portal   : http://localhost:3001
echo    * Student Portal : http://localhost:3002
echo    * Backend API    : http://localhost:5000
echo.
if exist "%ROOT%tunnel\ngrok.exe" (
    echo    Cloud Tunnel:
    echo    * ngrok Dashboard: http://localhost:4040
    echo      [View live public URLs for student/admin portals]
    echo.
)
echo    Demo Credentials:
echo    ------------------------------------------------------------
echo    * AO      : riyashmoorthy@gmail.com   ^| AO@KPRIET
echo    * Admin 1 : 23ec094@kpriet.ac.in      ^| 23EC094
echo    * Driver  : driver1@kpriet.ac.in      ^| Driver1
echo    * Student : student1@kpriet.ac.in     ^| Student1
echo  ============================================================
echo.
echo    Options:
echo    [1] Open Admin Portal in Browser
echo    [2] Open Student Portal in Browser
echo    [3] Open ngrok Dashboard (Cloud URLs)
echo    [4] Run AI Demo Simulator (Python)
echo    [5] Stop all SBAMS Services and Exit
echo.

set /p CHOICE="  Enter choice (1-5): "

if "%CHOICE%"=="1" (
    start http://localhost:3001
    goto MENU
)
if "%CHOICE%"=="2" (
    start http://localhost:3002
    goto MENU
)
if "%CHOICE%"=="3" (
    start http://localhost:4040
    goto MENU
)
if "%CHOICE%"=="4" (
    start "SBAMS - AI Simulator" cmd /k "title SBAMS AI Simulator & cd /d "%ROOT%ai-module" & python demo_simulator.py"
    goto MENU
)
if "%CHOICE%"=="5" (
    goto SHUTDOWN
)

goto MENU

:SHUTDOWN
echo.
echo  Stopping all SBAMS services...
powershell -Command "Get-NetTCPConnection -LocalPort 3001, 3002, 5000, 4040 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
taskkill /FI "WINDOWTITLE eq SBAMS Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS Admin Portal*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS Student Portal*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS ngrok Tunnel*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS AI Simulator*" /T /F >nul 2>&1
echo  All SBAMS services stopped.
timeout /t 2 /nobreak >nul
exit
