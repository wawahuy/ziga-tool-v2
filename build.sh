#!/bin/bash

# goto inject add build code
cd inject_script || exit
npm run build

# goto server app and build typescript
cd app || exit
npm run build

# /.. and copy inject_sript/dist file to tool/dist
mkdir -p app/dist/assets
cp -a inject_script/dist app/dist/assets

cd app || exit
npm run build-pkg