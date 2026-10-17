@echo off
echo ========================================================
echo  PULSE PLATE — Push to GitHub
echo ========================================================
echo.
echo Pushing local 'main' branch to https://github.com/Riyash77/PulsePlate.git ...
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  SUCCESS! Repository successfully pushed to GitHub!
    echo ========================================================
) else (
    echo.
    echo If GitHub asks to sign in, please complete the browser authentication.
)
echo.
pause
