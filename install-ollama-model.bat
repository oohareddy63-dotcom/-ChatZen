@echo off
echo ========================================
echo Installing Ollama Model for ChatZen
echo ========================================
echo.
echo This will download llama3.2 model (~2GB)
echo Please wait, this may take 2-3 minutes...
echo.

ollama pull llama3.2

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Model installed!
    echo ========================================
    echo.
    echo Now refresh your ChatZen browser and try sending a message!
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Could not install model
    echo ========================================
    echo.
    echo Please try manually:
    echo 1. Open Command Prompt
    echo 2. Run: ollama pull llama3.2
    echo 3. Wait for download to complete
    echo 4. Refresh ChatZen
    echo.
)

pause
