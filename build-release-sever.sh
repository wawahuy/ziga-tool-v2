#!/bin/bash

# build script
cd ./script || exit
npm run build

# # build server
cd ../server || exit
npm run build

cd ..
mkdir -p release

# create /release/release_server
rm -rf ./release/release_server || true
mkdir -p ./release/release_server

cp -r ./env/prod.env ./release/release_server/.env
cp -r ./server/package.json ./release/release_server/package.json
cp -r ./server/deploy/* ./release/release_server
cp -r ./server/dist/* ./release/release_server
cp -r ./script/dist ./release/release_server/assets

git add .
git commit -m "release server"
git push origin main
git subtree push --prefix=release/release_server origin release_server