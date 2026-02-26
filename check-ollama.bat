@echo off
echo ========================================
echo Checking Ollama Status
echo ========================================
echo.

echo Checking if Ollama is running...
curl -s http://localhost:11434/api/tags
echo.
echo.

echo Listing installed models...
ollama list
echo.

echo ========================================
echo If you see models listed above, Ollama is working!
echo If not, run: install-ollama-model.bat
echo ========================================
echo.

pause
