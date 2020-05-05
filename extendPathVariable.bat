@echo off

set PROJECT_ROOT=%~dp0

rem    The following two variables need to be set if the installation folders are not part of the PATH environment variable.
set NODE_HOME=D:\software\Node.js\node-v12.16.2-win-x64
set GIT_HOME=D:\software\Git\PortableGit\cmd

node --version > nul 2>&1

if errorlevel 1 (
	if not exist %NODE_HOME% (
		echo.
		echo ERROR: Neither PATH nor NODE_HOME environment variable points to installation folder of Node.js!
		echo.
		pause
		exit 1
	) else (
	   set "PATH=%PATH%;%NODE_HOME%"
	)
)

git --version > nul 2>&1

if errorlevel 1 (
	if not exist %GIT_HOME% (
		echo.
		echo ERROR: Neither PATH nor GIT_HOME environment variable points to installation folder of Git!
		echo.
		pause
		exit 1
	) else (
		set "PATH=%PATH%;%GIT_HOME%"
	)
)

exit /b 0