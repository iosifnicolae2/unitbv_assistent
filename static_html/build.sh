#! /bin/bash
echo "DOCKER is building: $1"
docker build -t app$1:latest .
