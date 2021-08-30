#!/usr/bin/env bash

#docker build . -t websealsimulator
docker run -p 9090:9090 --name webseal --rm -it -v $(pwd):/usr/src/nodeproxy websealsimulator 
