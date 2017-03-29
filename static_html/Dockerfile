FROM node:6
RUN npm install -g nodemon@1.10.2
RUN npm install -g pm2

RUN apt-get update && \
	apt-get install libstdc++6

EXPOSE  3000

VOLUME  /server
WORKDIR /server



#Run application
#CMD ["/server/scripts/start_server.sh"]
ENTRYPOINT /server/scripts/start_server.sh
#CMD /bin/bash

