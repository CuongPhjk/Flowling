@REM Maven wrapper script for EnglishFlow Backend
@echo off
setlocal

set "MAVEN_CMD=C:\Users\amin\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found.
exit /b 1
