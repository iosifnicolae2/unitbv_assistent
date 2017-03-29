#! /bin/bash
  docker rm -f "$1"
docker run --name "$1"  -i -d   -v /asistent_docker/reddis_docker/:/server -t redis_app:latest /bin/bash






