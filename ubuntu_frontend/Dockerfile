FROM debian:stable

EXPOSE 80
EXPOSE 443
EXPOSE 3000
EXPOSE 27017
EXPOSE 27018
EXPOSE 27018

RUN apt-get update && \
	apt-get -y install iptables 

CMD echo "$NGINX_INST_PORT_80_TCP_ADDR"
CMD iptables -t nat -A  DOCKER -p tcp --dport 80 -j DNAT --to-destination $NGINX_INST_PORT_80_TCP_ADDR:80 && \
	iptables -t nat -A  DOCKER -p tcp --dport 443 -j DNAT --to-destination $NGINX_INST_PORT_443_TCP_ADDR:443

CMD ["/bin/bash"]
