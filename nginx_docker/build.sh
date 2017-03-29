#!/bin/sh
echo "DOCKER is building: $1"
docker build -t nginx_app$1:latest .
