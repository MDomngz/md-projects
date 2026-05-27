@echo off
REM Quick AI Analysis Script for Windows
REM Usage: analyze.bat <figma-image> <production-image> [provider]

setlocal enabledelayedexpansion

REM Check arguments
if "%~1"=="" (
    echo Error: Missing arguments
    echo Usage: %0 ^<figma-image^> ^<production-image^> [provider]
    echo.
    echo Examples:
    echo   %0 figma.png production.png
    echo   %0 figma.png production.png openai
    echo   %0 figma.png production.png anthropic
    exit /b 1
)

if "%~2"=="" (
    echo Error: Missing production image argument
    echo Usage: %0 ^<figma-image^> ^<production-image^> [provider]
    exit /b 1
)

set FIGMA_IMAGE=%~1
set PRODUCTION_IMAGE=%~2
set PROVIDER=%~3
if "%PROVIDER%"=="" set PROVIDER=openai

REM Generate timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "TIMESTAMP=%dt:~0,8%-%dt:~8,6%"
set OUTPUT_FILE=discrepancies-%TIMESTAMP%.json

REM Validate images exist
if not exist "%FIGMA_IMAGE%" (
    echo Error: Figma image not found: %FIGMA_IMAGE%
    exit /b 1
)

if not exist "%PRODUCTION_IMAGE%" (
    echo Error: Production image not found: %PRODUCTION_IMAGE%
    exit /b 1
)

REM Check for API key
if "%PROVIDER%"=="openai" (
    if "%OPENAI_API_KEY%"=="" (
        echo Error: OPENAI_API_KEY environment variable not set
        echo Set it with: set OPENAI_API_KEY=sk-proj-your-key-here
        echo Get your key from: https://platform.openai.com/api-keys
        exit /b 1
    )
) else if "%PROVIDER%"=="anthropic" (
    if "%ANTHROPIC_API_KEY%"=="" (
        echo Error: ANTHROPIC_API_KEY environment variable not set
        echo Set it with: set ANTHROPIC_API_KEY=sk-ant-your-key-here
        echo Get your key from: https://console.anthropic.com/settings/keys
        exit /b 1
    )
) else (
    echo Error: Invalid provider '%PROVIDER%'. Use 'openai' or 'anthropic'
    exit /b 1
)

REM Check if Python or Node.js script exists
set SCRIPT_TYPE=
set SCRIPT_CMD=

if exist "ai-analysis-script.py" (
    set SCRIPT_TYPE=python
    set SCRIPT_CMD=python ai-analysis-script.py
) else if exist "ai-analysis-script.js" (
    set SCRIPT_TYPE=node
    set SCRIPT_CMD=node ai-analysis-script.js
) else (
    echo Error: No analysis script found
    echo Make sure ai-analysis-script.py or ai-analysis-script.js exists in this directory
    exit /b 1
)

REM Print configuration
echo =======================================
echo    AI Vision Analysis
echo =======================================
echo.
echo Figma Image:      %FIGMA_IMAGE%
echo Production Image: %PRODUCTION_IMAGE%
echo Provider:         %PROVIDER%
echo Script:           %SCRIPT_TYPE%
echo Output:           %OUTPUT_FILE%
echo.
echo Starting analysis...
echo.

REM Run the analysis
%SCRIPT_CMD% --figma "%FIGMA_IMAGE%" --production "%PRODUCTION_IMAGE%" --provider "%PROVIDER%" --output "%OUTPUT_FILE%"

REM Check if successful
if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================
    echo √ Analysis Complete!
    echo =======================================
    echo.
    echo Results saved to: %OUTPUT_FILE%
    echo.
    echo Next steps:
    echo 1. Open the Design Comparison Tool in your browser
    echo 2. Upload both images
    echo 3. Click 'Import JSON' and select: %OUTPUT_FILE%
    echo.
) else (
    echo × Analysis failed
    exit /b 1
)

endlocal
