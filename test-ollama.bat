@echo off
echo ========================================
echo Testing Ollama Integration
echo ========================================
echo.

echo [1/3] Checking Ollama service...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama is not running!
    echo Please start Ollama first.
    pause
    exit /b 1
)
echo ✅ Ollama service is running

echo.
echo [2/3] Checking llama3.2:1b model...
ollama list | findstr "llama3.2:1b" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Model llama3.2:1b not found!
    echo Installing model...
    ollama pull llama3.2:1b
)
echo ✅ Model llama3.2:1b is available

echo.
echo [3/3] Testing ChatZen backend with Ollama...
echo Sending test message to backend...
powershell -Command "$body = '{\"message\":\"Hello\",\"threadId\":\"test-' + (Get-Date -Format 'yyyyMMddHHmmss') + '\"}'; try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/chat' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing; $json = $response.Content | ConvertFrom-Json; Write-Host '✅ Backend responded successfully!'; Write-Host 'AI Reply:' $json.reply } catch { Write-Host '❌ Backend test failed:' $_.Exception.Message }"

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
echo Your ChatZen application is ready to use:
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:5173
echo.
pause
