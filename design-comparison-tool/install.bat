@echo off
REM Installation Script for AI Analysis Tools (Windows)
REM Automatically detects and installs dependencies

setlocal enabledelayedexpansion

echo =======================================
echo   Design Comparison AI Tools Setup
echo =======================================
echo.

REM Detect available package managers
set PYTHON_AVAILABLE=false
set NODE_AVAILABLE=false

REM Check for Python
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set PYTHON_AVAILABLE=true
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo [32m√[0m Python detected: !PYTHON_VERSION!
)

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set NODE_AVAILABLE=true
    for /f "delims=" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [32m√[0m Node.js detected: !NODE_VERSION!
)

echo.

REM If neither is available, exit
if "%PYTHON_AVAILABLE%"=="false" if "%NODE_AVAILABLE%"=="false" (
    echo [31mError: Neither Python nor Node.js found[0m
    echo.
    echo Please install one of the following:
    echo   - Python 3.8+: https://www.python.org/downloads/
    echo   - Node.js 18+: https://nodejs.org/
    pause
    exit /b 1
)

REM Ask user preference if both are available
set INSTALL_CHOICE=
if "%PYTHON_AVAILABLE%"=="true" if "%NODE_AVAILABLE%"=="true" (
    echo Both Python and Node.js are available.
    echo.
    echo Which would you like to use for AI analysis?
    echo   1^) Python ^(recommended^)
    echo   2^) Node.js
    echo   3^) Both
    echo.
    set /p "choice=Enter choice (1-3): "
    
    if "!choice!"=="1" set INSTALL_CHOICE=python
    if "!choice!"=="2" set INSTALL_CHOICE=node
    if "!choice!"=="3" set INSTALL_CHOICE=both
    
    if "!INSTALL_CHOICE!"=="" (
        echo [31mInvalid choice[0m
        pause
        exit /b 1
    )
) else if "%PYTHON_AVAILABLE%"=="true" (
    set INSTALL_CHOICE=python
) else (
    set INSTALL_CHOICE=node
)

echo.
echo Installing dependencies...
echo.

REM Install Python dependencies
if "%INSTALL_CHOICE%"=="python" (
    goto :install_python
) else if "%INSTALL_CHOICE%"=="both" (
    goto :install_python
) else (
    goto :install_node
)

:install_python
echo [32mInstalling Python packages...[0m
where pip >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo [31mError installing Python packages[0m
        pause
        exit /b 1
    )
    echo [32m√[0m Python dependencies installed
    echo.
) else (
    echo [31mError: pip not found[0m
    pause
    exit /b 1
)

if "%INSTALL_CHOICE%"=="python" goto :complete

:install_node
echo [32mInstalling Node.js packages...[0m
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npm install openai @anthropic-ai/sdk
    if %ERRORLEVEL% NEQ 0 (
        echo [31mError installing Node.js packages[0m
        pause
        exit /b 1
    )
    echo [32m√[0m Node.js dependencies installed
    echo.
) else (
    echo [31mError: npm not found[0m
    pause
    exit /b 1
)

:complete
echo =======================================
echo [32m√ Installation Complete![0m
echo =======================================
echo.
echo Next steps:
echo.
echo 1. Get an API key:
echo    • OpenAI: https://platform.openai.com/api-keys
echo    • Anthropic: https://console.anthropic.com/settings/keys
echo.
echo 2. Set your API key:
echo    set OPENAI_API_KEY=sk-proj-your-key-here
echo    REM OR
echo    set ANTHROPIC_API_KEY=sk-ant-your-key-here
echo.
echo 3. Run analysis:
if "%INSTALL_CHOICE%"=="python" (
    echo    python ai-analysis-script.py --figma design.png --production prod.png
) else if "%INSTALL_CHOICE%"=="node" (
    echo    node ai-analysis-script.js --figma design.png --production prod.png
) else (
    echo    analyze.bat design.png prod.png
)
echo.
echo For more details, see SETUP.md
echo.
pause

endlocal
