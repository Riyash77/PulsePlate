@echo off
title PULSE PLATE - Stop SBAMS Services
color 0C

echo.
echo  ============================================================
echo    Stopping PULSE PLATE / SBAMS Services...
echo  ============================================================
echo.

powershell -Command "Get-NetTCPConnection -LocalPort 3001, 3002, 5000, 4040 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

:: Also kill any remaining cmd windows opened by START-SBAMS
taskkill /FI "WINDOWTITLE eq SBAMS Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS Admin Portal*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS Student Portal*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS ngrok Tunnel*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SBAMS AI Simulator*" /T /F >nul 2>&1

echo.
echo  [DONE] All SBAMS services on ports 5000, 3001, 3002, and 4040 have been stopped.
echo.
pause
