#!/bin/bash

cd $(dirname $0)/..

if [ "$1" == "" ]; then
    echo input version
    exit 1
fi

TARGET_NAME=MCSRPaceWidget-$1

MVN_PATH=$(find ~/.m2 -name "mvn")
if [ "$?" == "" ]; then
    echo "mvn command not found"
    exit 1
fi

rm -rf ${TARGET_NAME} ${TARGET_NAME}.zip
mkdir -p ${TARGET_NAME}

# build web app
cd web
rm -rf build
yarn build
rm -rf build/theme build/setting
cd -

# build server
rm -rf server/target
"${MVN_PATH}" package -f "./server/pom.xml"

cp -pr server/target/mcsr-pace-widget-jar-with-dependencies.jar ${TARGET_NAME}/mcsr-pace-widget.jar

rm -rf ${TARGET_NAME}/public/setting
cp -pr resources/setting ${TARGET_NAME}/setting

rm -rf ${TARGET_NAME}/public/theme
cp -pr resources/theme ${TARGET_NAME}/theme

find ${TARGET_NAME} -name .DS_Store | xargs rm

zip -r ${TARGET_NAME}.zip ${TARGET_NAME}/
rm -rf ${TARGET_NAME}
