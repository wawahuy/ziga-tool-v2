#!/bin/bash

cd ../script || exit

npm run build

cd ../server || exit

npm run build

cp -r ../script/dist ./dist/assets

read -r -p "Press enter to continue"