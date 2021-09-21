#!/bin/bash

npm run build

cp ../env/prod.env ./dist/.env

npm run build-pkg

cp ./bin/ucci13.exe ./build/ucci13.exe
cp ./bin/ucci14.exe ./build/ucci14.exe
cp ./bin/file1.nnue ./build/file1.nnue
cp ./bin/paste.txt ./build/paste.txt
cp -r ../script/dist ./build/assets
# read -r -p "Press enter to continue"