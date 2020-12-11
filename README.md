# Dynamic Webpage (FeuerwehrApp)
This project contains the source code the virtual CoderDojo will use in the workshop on August 7th.

## Prerequisites

The following software is required to install and use the workshop project.

* a text editor (e.g. [Notepad++](https://notepad-plus-plus.org), [Visual Studio Code](https://code.visualstudio.com))
* [Node.js](https://nodejs.org/en/download/)
* [Git](https://git-scm.com/download/win)

## Installation

This section describes how to install the workshop project.

### Windows
1. create a folder on your hard disk and open a command line box
2. execute `git clone https://github.com/coderdojo-neusiedl/dynamic-webpage.git`
3. close the command line box
4. start `dynamic-webpage/openCliHere.bat` (info: a command line box will inform you that the home folder of grunt does not exist. That's ok ... just press any key to continue)
5. execute `git checkout workshop-20201211`
6. execute `npm install`
7. close the command line box
8. start `dynamic-webpage/openCliHere.bat`
9. execute `grunt`

### Mac
1. create a folder on your hard disk and open a command line box
2. execute `git clone https://github.com/coderdojo-neusiedl/dynamic-webpage.git`
3. execute `cd dynamic-webpage`
4. execute `git checkout workshop-20201211`
5. execute `npm install`
6. execute `npm run grunt`

## Starting the webserver

**Windows**: Start `dynamic-webpage/startWebserver.bat`. After a few seconds you should see a message like `listening at http://:::8080` telling you that the server is ready.<br />
**Mac**: execute `npm start`

## Starting the chatApp

Open a browser (e.g. Firefox) and enter the address `http://localhost:8080/`.

## Building the Docker Image
1. change to the that contains the Dockerfile
2. execute `docker build -t dynamic-webpage .`

## Starting a Docker Container
To start a Docker Container execute `docker run --rm -p8080:8080 dynamic-webpage`
