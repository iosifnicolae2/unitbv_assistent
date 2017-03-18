#! /bin/bash

docker rm --force "$1"

docker run --name $1  -d -v /asistent_docker/mongodb_docker/data/db/:/data/db -v /asistent_docker/mongodb_docker/conf/mongo.conf:/etc/mongo.conf -v /asistent_docker/mongodb_docker/log/:/server/log/  mongo





