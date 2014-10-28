#! /bin/bash

if [ ! -d "$DIRECTORY" ]; then
  git clone https://github.com/buddycloud/buddycloud-server-java.git
fi
cd buddycloud-server-java
git reset --hard
git pull origin master
mvn package