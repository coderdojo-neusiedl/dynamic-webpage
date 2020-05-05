@echo off

set PROJECT_ROOT=%~dp0

@echo off

call extendPathVariable.bat

if %ERRORLEVEL% GTR 0 (
   echo errorlevel = %ERRORLEVEL%
   pause
   exit 1
)

start cmd /k cd /d %PROJECT_ROOT%