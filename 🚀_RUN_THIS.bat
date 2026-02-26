@echo off
color 0A
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║                    🚀 ChatZen Launcher 🚀                  ║
echo ║                                                            ║
echo ║              Your AI Conversation Companion                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo   What would you like to do?
echo.
echo   [1] 🚀 Start ChatZen (Quick Start)
echo   [2] 🔍 Verify Setup First
echo   [3] 📚 Read Documentation
echo   [4] ❌ Exit
echo.
echo ════════════════════════════════════════════════════════════
echo.
set /p choice="   Enter your choice (1-4): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto verify
if "%choice%"=="3" goto docs
if "%choice%"=="4" goto exit
goto invalid

:start
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  🚀 Starting ChatZen...                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
call start-chatzen.bat
goto end

:verify
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                🔍 Verifying Setup...                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
call test-setup.bat
goto end

:docs
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  📚 Documentation Files                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo   Available Documentation:
echo.
echo   1. START_HERE_FINAL.md - Quick start guide
echo   2. QUICK_START.md - Detailed setup
echo   3. READY_TO_RUN.md - What's been fixed
echo   4. ✅_VERIFIED_WORKING.md - Verification report
echo   5. TROUBLESHOOTING.md - Common issues
echo.
echo   Opening START_HERE_FINAL.md...
echo.
start START_HERE_FINAL.md
timeout /t 2 >nul
goto end

:invalid
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ❌ Invalid Choice                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo   Please enter a number between 1 and 4.
echo.
timeout /t 2 >nul
goto start_menu

:exit
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                      👋 Goodbye!                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
timeout /t 1 >nul
exit

:end
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo   Press any key to return to menu...
pause >nul
cls
goto start_menu

:start_menu
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║                    🚀 ChatZen Launcher 🚀                  ║
echo ║                                                            ║
echo ║              Your AI Conversation Companion                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo   What would you like to do?
echo.
echo   [1] 🚀 Start ChatZen (Quick Start)
echo   [2] 🔍 Verify Setup First
echo   [3] 📚 Read Documentation
echo   [4] ❌ Exit
echo.
echo ════════════════════════════════════════════════════════════
echo.
set /p choice="   Enter your choice (1-4): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto verify
if "%choice%"=="3" goto docs
if "%choice%"=="4" goto exit
goto invalid
