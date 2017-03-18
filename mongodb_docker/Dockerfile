FROM ubuntu

MAINTAINER Iosif Nicolae<iosifnicolae2@gmail.com>


# Install MongoDB.
RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get install -y mongodb-org && \
  rm -rf /var/lib/apt/lists/*



EXPOSE  27017
EXPOSE  27018

VOLUME  /server

RUN mkdir -p /var/run/mongodb/

WORKDIR /server


ADD /conf/mongod.conf /etc/mongodb/mongod.cong

#ENTRYPOINT ["/server/entrypoint.sh"]
CMD ["/server/entrypoint.sh"]
