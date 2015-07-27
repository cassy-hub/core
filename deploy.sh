#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# Kill existing instances
docker rm $(docker kill $(docker ps -a -f "name=cassyhub-dal" -q))
docker rm $(docker kill $(docker ps -a -f "name=cassyhub-api" -q))
docker rm $(docker kill $(docker ps -a -f "name=cassyhub-router" -q))

# Cassy Data Access Layer
docker  run -it --name cassyhub-dal -v $DIR/deploy-server.sh:/link/deploy-server.sh -v $DIR/dal/:/app_src/ --link cassyhub-db:cassyhub-db -d cassyhub/dal
sleep 2
docker exec -it cassyhub-dal chmod 700 /link/deploy-server.sh
docker exec -it cassyhub-dal sh /link/deploy-server.sh

# Cassy API
docker run -it --name cassyhub-api -v $DIR/deploy-server.sh:/link/deploy-server.sh -v $DIR/api/:/app_src/ --link cassyhub-dal:cassyhub-dal -d cassyhub/api
sleep 2
docker exec -it cassyhub-api chmod 700 /link/deploy-server.sh
docker exec -it cassyhub-api sh /link/deploy-server.sh

# Cassy Router
docker run -it --name cassyhub-router -v $DIR/deploy-server.sh:/link/deploy-server.sh -v $DIR/router/:/app_src/ -p 80:80  --link cassyhub-api:cassyhub-api -d cassyhub/router
sleep 2
docker exec -it cassyhub-router chmod 700 /link/deploy-server.sh
#docker exec -it cassyhub-router sh /link/deploy-server.sh

sleep 2

# Commit change
docker commit $(docker ps -a -f "name=cassyhub-dal" -q)
docker commit $(docker ps -a -f "name=cassyhub-api" -q)
docker commit $(docker ps -a -f "name=cassyhub-router" -q)

# Push changes to docker hub
docker push cassyhub/dal
docker push cassyhub/api
docker push cassyhub/router
