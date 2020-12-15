#!/bin/bash

npm run build

cp ../env/dev.env ./dist/.env

npm run build-pkg

read -r -p "Press enter to continue"