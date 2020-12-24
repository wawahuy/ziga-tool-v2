#!/bin/bash
# update version app
node update-version.js

# call shell build app
./build-release-app.sh

# call shell release server
./build-release-server.sh

# update version ui
read -r -p "Press enter to continue"