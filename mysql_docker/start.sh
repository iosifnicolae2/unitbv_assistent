#! /bin/bash

docker rm --force "$1"

docker run --name $1 -P -e MYSQL_ROOT_PASSWORD=jkhjkhakjfhasufasfu9ahfhiuahfsiauhsfiu  -v /asistent_docker/mysql_docker/data:/var/lib/mysql -d mysql





