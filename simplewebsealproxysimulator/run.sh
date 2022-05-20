#!/usr/bin/env bash

contextpath="/"
#docker build . -t websealsimulator
sleep 3 && ip=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' webseal) && echo "your webseal simulator is running on http://$ip:9090$contextpath" &
docker run -p 9090:9090 --name webseal --rm -it -v $(pwd):/usr/src/nodeproxy websealsimulator 
