#! /bin/bash

# Transpile TypeScript into JavaScript
tsc || exit 1

# Transpile Tests
cd ./tests || exit 1
tsc 
cd ..

# add trile-slash reference directive to our declaration file
mv ./index.d.ts ./index.d.ts.bk

echo '/// <reference path="./src/types/SheetsAPI/sheets.d.ts" />' > ./index.d.ts
cat ./index.d.ts.bk >> ./index.d.ts
rm ./index.d.ts.bk
