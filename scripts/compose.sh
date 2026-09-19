#!/bin/bash

cd $(dirname $0)/..

# theme / setting / icon は jar に同梱され初回起動時にホームへコピーされるので、配布物は jar 1 つ。
# Jingle の plugins に置くファイルなので、版違いが並ばないよう名前に版は入れない
TARGET_NAME=mcsr-pace-widget.jar

MVN_PATH=$(find ~/.m2 -name "mvn")
if [ "$?" == "" ]; then
    echo "mvn command not found"
    exit 1
fi

rm -f ${TARGET_NAME}

# build web app
cd web
rm -rf build
yarn build
rm -rf build/theme build/setting build/icon
cd -

# build server
rm -rf server/target
"${MVN_PATH}" package -f "./server/pom.xml"

cp -p server/target/mcsr-pace-widget-jar-with-dependencies.jar ${TARGET_NAME}
echo "built ${TARGET_NAME}"
