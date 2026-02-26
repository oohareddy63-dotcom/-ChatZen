@echo off
echo ========================================
echo ChatZen Startup Script
echo ========================================
echo.

REM Check if Ollama model is installed
echo [1/4] Checking Ollama model...
ollama list | findstr "llama3.2" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ollama model NOT installed!
    echo.
    echo Please run: install-ollama-model.bat
    echo Or manually: ollama pull llama3.2
    echo.
    pause
    exit /b 1
)
echo ✅ Ollama model found!
echo.

REM Check if .env exists
echo [2/4] Checking configuration...
if not exist Backend\.env (
    echo ❌ .env file NOT found!
    echo.
    echo Please copy Backend\.env.example to Backend\.env
    echo.
    pause
    exit /b 1
)
echo ✅ Configuration found!
echo.

REM Start backend
echo [3/4] Starting Backend Server...
start "ChatZen Backend" cmd /k "cd Backend && npm start"
timeout /t 3 >nul
echo ✅ Backend starting...
echo.

REM Start frontend
echo [4/4] Starting Frontend...
start "ChatZen Frontend" cmd /k "cd Frontend && npm run dev"
timeout /t 2 >nul
echo ✅ Frontend starting...
echo.

echo ========================================
echo ChatZen is starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Wait 5-10 seconds, then open: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
