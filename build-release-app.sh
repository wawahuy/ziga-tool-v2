#!/bin/bash

# call build app
cd ./app || false
./build-prod.sh

# cut app/build to release/release_app
cd ..
rm -rf ./release/release_app || true
mkdir -p ./release/release_app
mv ./app/build/* ./release/release_app