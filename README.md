# Dynamic Webpage (ChatApp & FeuerwehrApp)
This project contains the source code the virtual CoderDojo will use in the workshop on May 15th.

## Prerequisites

The following software is required to install and use the workshop project.

* a text editor (e.g. [Notepad++](https://notepad-plus-plus.org), [Visual Studio Code](https://code.visualstudio.com))
* [Node.js](https://nodejs.org/en/download/)
* [Git](https://git-scm.com/download/win)

## Installation

This section describes how to install the workshop project.

1. create a folder on your hard disk and open a command line box
2. execute `git clone https://github.com/coderdojo-neusiedl/dynamic-webpage.git`
3. close the command line box
4. start `dynamic-webpage/openCliHere.bat` (info: a command line box will inform you that the home folder of grunt does not exist. That's ok ... just press any key to continue)
5. execute `git checkout -b workshop-20200605 remotes/origin/workshop-20200605`
6. execute `npm install`
7. close the command line box
8. start `dynamic-webpage/openCliHere.bat`
9. execute `grunt`

## Starting the webserver

Start `dynamic-webpage/startWebserver.bat`. After a few seconds you should see a message like `listening at http://:::8080` telling you that the server is ready.

## Starting the chatApp

Open a browser (e.g. Firefox) and enter the address `http://localhost:8080/`.
