@echo off
REM Clausen School Management System - Release Script for Windows
REM This script automates the release process

setlocal enabledelayedexpansion

echo.
echo ========================================================
echo    Clausen School Management System - Release v2.0.0
echo ========================================================
echo.

REM Check if we're in the right directory
if not exist package.json (
    echo [ERROR] package.json not found. Please run this script from clausen-desktop-app directory
    exit /b 1
)

REM Check if GitHub token is set
if "%GH_TOKEN%"=="" (
    echo [WARNING] GH_TOKEN environment variable is not set
    echo For automatic publishing to GitHub, you need to set your GitHub Personal Access Token:
    echo set GH_TOKEN=your_github_token_here
    echo.
    set /p continue="Do you want to continue without automatic publishing? (y/n) "
    if /i not "!continue!"=="y" exit /b 1
)

REM Extract current version from package.json
for /f "tokens=2 delims=:, " %%a in ('findstr /C:"\"version\"" package.json') do (
    set VERSION=%%a
    set VERSION=!VERSION:"=!
)

echo [INFO] Current version: !VERSION!
echo.

REM Check git status
git status --short > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not initialized or not available
    exit /b 1
)

echo [INFO] Checking git status...
git status --short > git_status.tmp
set /a file_count=0
for /f %%a in (git_status.tmp) do set /a file_count+=1
del git_status.tmp

if !file_count! gtr 0 (
    echo [WARNING] You have uncommitted changes
    git status --short
    echo.
    set /p commit_changes="Do you want to commit these changes? (y/n) "
    if /i "!commit_changes!"=="y" (
        set /p commit_msg="Enter commit message: "
        git add .
        git commit -m "!commit_msg!"
        echo [SUCCESS] Changes committed
    )
) else (
    echo [SUCCESS] Working directory is clean
)
echo.

REM Create git tag
echo [INFO] Creating git tag v!VERSION!...
git rev-parse v!VERSION! > nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Tag v!VERSION! already exists
    set /p recreate="Do you want to delete and recreate it? (y/n) "
    if /i "!recreate!"=="y" (
        git tag -d v!VERSION!
        git push origin :refs/tags/v!VERSION! 2>nul
    ) else (
        echo [ERROR] Aborting release
        exit /b 1
    )
)

git tag -a v!VERSION! -m "Release version !VERSION!"
echo [SUCCESS] Tag created
echo.

REM Push to GitHub
echo [INFO] Pushing to GitHub...
git push origin main
git push origin v!VERSION!
echo [SUCCESS] Pushed to GitHub
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm ci
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [SUCCESS] Dependencies installed
echo.

REM Build application
echo [INFO] Building application...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)
echo [SUCCESS] Build complete
echo.

REM Build Windows installer
echo [INFO] Building Windows application...
call npm run build:win
if errorlevel 1 (
    echo [ERROR] Windows build failed
    exit /b 1
)
echo [SUCCESS] Windows build complete
echo.

echo.
echo ========================================================
echo             Release Complete! 🎉
echo ========================================================
echo.
echo [INFO] Release Information:
echo   Version: v!VERSION!
echo   Platform: Windows
echo   GitHub Release: https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/tag/v!VERSION!
echo.
echo [INFO] Next Steps:
echo   1. Check GitHub Releases page to verify upload
echo   2. Add release notes on GitHub
echo   3. Test the installer on a clean machine
echo   4. Announce the release to users
echo   5. Monitor for update notifications in existing apps
echo.
echo [INFO] Build artifacts can be found in: .\dist\
echo.

pause
