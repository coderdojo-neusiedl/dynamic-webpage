#!/bin/bash

scriptDir=$(cd $(dirname $0) && pwd)

node $scriptDir/src/webserver/start.js
