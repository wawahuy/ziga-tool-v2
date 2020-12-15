#!/bin/bash

npm run build

cp ./bin/ucci.exe ./dist

cp ../env/dev.env ./dist/.env

npm run build-pkg

read -r -p "Press enter to continue"