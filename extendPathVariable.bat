@echo off

set PROJECT_ROOT=%~dp0
set GIT_HOME=D:\software\Git\PortableGit\cmd
set NODE_HOME=D:\software\Node.js\node-v12.16.2-win-x64
set GRUNT_HOME=%PROJECT_ROOT%\node_modules\.bin

if not exist %GIT_HOME% (
   echo.
   echo ERROR: Home folder "%GIT_HOME%" of GIT does not exist!
   echo.
   pause
   exit 1
)

if not exist %NODE_HOME% (
   echo.
   echo ERROR: Home folder "%NODE_HOME%" of node.js does not exist!
   echo.
   pause
   exit 1
)

if not exist %GRUNT_HOME% (
   echo.
   echo WARNING: Home folder "%GRUNT_HOME%" of grunt does not exist!
   echo.
   pause
)

set PATH=%PATH%;%GIT_HOME%;%NODE_HOME%;%GRUNT_HOME%
