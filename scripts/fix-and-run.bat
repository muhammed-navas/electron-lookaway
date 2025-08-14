@echo off
echo 🔧 Fixing and setting up LookAway for Windows...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js 18+ is required. Current version: 
    node --version
    echo Please upgrade Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create assets directory
echo 📁 Creating assets directory...
if not exist "assets" mkdir assets

REM Check for required assets
if not exist "assets\icon.png" (
    echo ⚠️  Missing icon.png - please add a 256x256 PNG file to assets\icon.png
)
if not exist "assets\tray-icon.png" (
    echo ⚠️  Missing tray-icon.png - please add a 32x32 PNG file to assets\tray-icon.png
)
if not exist "assets\icon.ico" (
    echo ⚠️  Missing icon.ico - please add an ICO file to assets\icon.ico
)

REM Build the project
echo 🔨 Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Check the error messages above.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Ask if user wants to start development mode
set /p START_DEV="🚀 Start development mode? (y/n): "
if /i "%START_DEV%"=="y" (
    echo 🎯 Starting development mode...
    call npm run dev
) else (
    echo 📋 To start development mode later, run: npm run dev
    echo 📋 To build for production, run: npm run electron:build:win:nsis
)

echo ✨ Setup complete!
pause 