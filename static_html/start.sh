#! /bin/bash
  docker rm -f "$1"
docker run --name $1 --link $2:mongodb$5 --link $3:reddis$5   -i -d  -v /asistent_docker/static_html/:/server -t app$5:latest 





