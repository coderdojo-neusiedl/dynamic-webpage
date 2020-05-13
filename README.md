# dynamic-webpage
This project contains the source code the virtual CoderDojo will use in the workshop on May 15th.

## Prerequisites

The following software is required to install and use the workshop template.

* a text editor (e.g. [Notepad++](https://notepad-plus-plus.org), [Visual Studio Code](https://code.visualstudio.com))
* [Node.js](https://nodejs.org/en/download/)
* [Git](https://git-scm.com/download/win)

## installation

This section describes how to install the workshop template.

1. create a folder on your hard disk and open a command line box
2. execute `git clone https://github.com/coderdojo-neusiedl/dynamic-webpage.git`
3. execute `cd dynamic-webpage`
4. close the command line box
5. start `dynamic-webpage/openCliHere.bat`
6. execute `git checkout -b workshop-20200515 remotes/origin/workshop-20200515`
7. execute `npm install`

## starting the webserver

Start `dynamic-webpage/startWebserver.bat`. After a few seconds you should see a message like `listening at http://:::8080` telling you that the server is ready.

## starting the chatApp

Open a browser (e.g. Firefox) and enter the address `http://localhost:8080/`.
