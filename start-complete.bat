@echo off
cls
echo ========================================
echo    ChatZen - Complete Startup
echo ========================================
echo.

echo [Step 1/4] Checking Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama is not running!
    echo.
    echo Please start Ollama first:
    echo 1. Open a new terminal
    echo 2. Run: ollama serve
    echo.
    pause
    exit /b 1
)
echo ✅ Ollama is running

echo.
echo [Step 2/4] Checking llama3.2:1b model...
ollama list | findstr "llama3.2:1b" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Model not found. Installing...
    ollama pull llama3.2:1b
)
echo ✅ Model is available

echo.
echo [Step 3/4] Starting Backend Server...
cd Backend
start "ChatZen Backend" cmd /k "node server-complete.js"
timeout /t 3 >nul
cd ..

echo.
echo [Step 4/4] Starting Frontend Server...
cd Frontend
start "ChatZen Frontend" cmd /k "node node_modules/vite/bin/vite.js"
timeout /t 3 >nul
cd ..

echo.
echo ========================================
echo ✅ ChatZen is Starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Opening browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:5173
echo.
echo ========================================
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo ========================================
echo.
pause
