#!/bin/bash


source set_enviroment.sh

echo $MONGO_INSTANCE

./mongodb_docker/start.sh $MONGO_INSTANCE $PROJECT_NAME
#./mysql_docker/start.sh $MYSQL_INSTANCE $PROJECT_NAME
./reddis_docker/start.sh $REDIS_INSTANCE $PROJECT_NAME
#./node_docker/start.sh $NODE_INSTANCE $MONGO_INSTANCE $REDIS_INSTANCE
./static_html/start.sh $NODE_INSTANCE_STATIC $MONGO_INSTANCE $REDIS_INSTANCE $MYSQL_INSTANCE $PROJECT_NAME
#./static_html/start.sh $NODE_INSTANCE_STATIC2 $MONGO_INSTANCE $REDIS_INSTANCE
#./static_html/start.sh $NODE_INSTANCE_STATIC3 $MONGO_INSTANCE $REDIS_INSTANCE
#./mailo/start.sh $NODE_MAILO $MONGO_INSTANCE $REDIS_INSTANCE
./nginx_docker/start.sh $NGINX_INSTANCE $PROJECT_NAME
./nginx_docker/connect.sh  $PROJECT_NAME
#./ubuntu_frontend/start.sh 






