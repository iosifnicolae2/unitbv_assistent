#! /bin/bash
source ../set_enviroment.sh
  docker rm -f "MongoExpress-unitbv"
docker run --name "MongoExpress-unitbv" --link $MONGO_INSTANCE:mongo -p 6081:8081 -e ME_CONFIG_BASICAUTH_USERNAME="admin" -e  ME_CONFIG_BASICAUTH_PASSWORD="yt87uga9fy98asf89yasyf" -i -d -t mongo-express
