#!/bin/bash

npm run build

cp ../env/prod.env ./dist/.env

npm run build-pkg

cp ./bin/ucci.exe ./build/ucci.exe
cp ./bin/paste.txt ./build/paste.txt
cp -r ../script/dist ./build/assets
# read -r -p "Press enter to continue"