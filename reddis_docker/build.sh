#! /bin/bash
echo "DOCKER is building: $1"
docker build -t redis_app$1:latest .
