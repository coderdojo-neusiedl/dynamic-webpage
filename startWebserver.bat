@echo off

call extendPathVariable.bat

if %ERRORLEVEL% GTR 0 (
   echo errorlevel = %ERRORLEVEL%
   pause
   exit 1
)

set "FEUERWEHR_APP_PASSWORD=5678"
set "FEUERWEHR_APP_USERNAMES=Thomas,Andreas,Moimir"

node %PROJECT_ROOT%src\webserver\start.js

if errorlevel 1 pause
