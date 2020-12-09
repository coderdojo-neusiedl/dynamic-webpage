#!/bin/bash

scriptDir=$(cd $(dirname $0) && pwd)
cd $scriptDir
projectName=$(echo $scriptDir | sed -E 's/(.*\/)*//')
destination=/root/$projectName

if [ "$projectName" == "" ]; then
   echo "failed to evaluate project name"
   exit 1
fi

echo "The content of $scriptDir is available in $destination"

sudo docker run -it --rm --volume=$scriptDir:/root/$projectName:rw -p8080:8080 node:current-slim /bin/bash