#!/bin/bash

npm run build

cp ../env/dev.env ./dist/.env

npm run build-pkg

cp ./bin/ucci.exe ./build/ucci.exe

read -r -p "Press enter to continue"