#!/bin/bash

npm run build

cp ../env/prod.env ./dist/.env

npm run build-pkg

read -r -p "Press enter to continue"