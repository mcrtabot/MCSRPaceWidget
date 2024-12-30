#!/bin/bash

export PUBLIC_URL="https://mcrtabot.github.io/MCSRImageBuilder"
export REACT_APP_PATH_PREFIX="https://mcrtabot.github.io/MCSRImageBuilder"
export REACT_APP_PATH_PREFIX="/MCSRImageBuilder"

cd $(dirname $0)/../web

rm -rf build public
ln -s public-builder public

rm -f src/index.tsx
ln -s index-builder.tsx src/index.tsx

react-scripts build
cp build/index.html build/404.html
rm -rf build/MCSRImageBuilder