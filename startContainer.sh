#!/bin/bash

sudo docker run -it --rm --env FEUERWEHR_APP_PASSWORD=ninja --env FEUERWEHR_APP_USERNAMES=coderdojo -p 8080:8080 tederer/firefighters-app