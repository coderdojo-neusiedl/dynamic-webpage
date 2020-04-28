@echo off

call extendPathVariable.bat

if %ERRORLEVEL% GTR 0 (
   echo errorlevel = %ERRORLEVEL%
   pause
   exit 1
)

node %PROJECT_ROOT%src\webserver\start.js

if errorlevel 1 pause
