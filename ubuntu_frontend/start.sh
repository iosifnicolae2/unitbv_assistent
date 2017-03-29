#! /bin/bash

if docker ps | awk -v app="app" 'NR>1{  ($(NF) == app )  }'; then
  docker stop "$UBUNTU_INSTANCE" && docker rm -f "$UBUNTU_INSTANCE"
fi


docker run --name $UBUNTU_INSTANCE \
--link $MONGO_INSTANCE:mongodb_inst \
--link $REDIS_INSTANCE:redis_inst \
--link $NODE_INSTANCE:node_inst \
--link $NGINX_INSTANCE:nginx_inst \
-i -d -P  --privileged -t ubuntu_frontend:latest /bin/bash




