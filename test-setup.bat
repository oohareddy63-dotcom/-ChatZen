@echo off
echo ========================================
echo ChatZen Setup Verification
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js NOT installed!
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js installed
node --version
echo.

echo [2/5] Checking Backend dependencies...
if not exist Backend\node_modules (
    echo ❌ Backend dependencies NOT installed!
    echo Installing now...
    cd Backend
    call npm install
    cd ..
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Backend dependencies installed
echo.

echo [3/5] Checking Frontend dependencies...
if not exist Frontend\node_modules (
    echo ❌ Frontend dependencies NOT installed!
    echo Installing now...
    cd Frontend
    call npm install
    cd ..
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies installed
echo.

echo [4/5] Checking .env configuration...
if not exist Backend\.env (
    echo ⚠️  .env file not found, creating from example...
    copy Backend\.env.example Backend\.env
)
echo ✅ .env file exists
echo.

echo [5/5] Checking Ollama (optional)...
ollama --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Ollama NOT installed (optional)
    echo.
    echo ChatZen will work in demo mode without Ollama.
    echo To enable AI features:
    echo   1. Install Ollama from: https://ollama.com
    echo   2. Run: ollama pull llama3.2
    echo.
) else (
    echo ✅ Ollama installed
    ollama --version
    echo.
    echo Checking for llama3.2 model...
    ollama list | findstr "llama3.2" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️  llama3.2 model NOT installed
        echo Run: ollama pull llama3.2
    ) else (
        echo ✅ llama3.2 model installed
    )
)
echo.

echo ========================================
echo Setup Verification Complete!
echo ========================================
echo.
echo You can now run: start-chatzen.bat
echo.
pause
