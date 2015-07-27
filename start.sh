#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# Are we trying to stop everything?
if [[ "$1" == "stop" ]]; then
  echo "Stopping all docker processes for cassyhub!"

  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-" -q))
  exit
fi

# Install node modules locally
cd $DIR/api/ && npm install
cd $DIR/dal/ && npm install
cd $DIR/router/ && npm install && ./node_modules/.bin/bower install
cd $DIR

# Clean up old docker containers
mongoId=$(docker ps -a -f "status=running" -f "name=cassyhub-" -q)

if [[ "$mongoId" == "" ]] || [[ "$1" == "clear-db" ]]; then
  echo "Clearing everything. Starting from scratch!"

  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-" -q))

  # Mongo DB
  docker pull mongo
  docker run --name cassyhub-db -d mongo
else
  echo "Keeping database. Rebuilding other packages!"

  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-dal" -q))
  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-api" -q))
  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-router" -q))
fi

# Cassy Data Access Layer
docker build -t cassyhub/dal ./dal/.
docker run -it --name cassyhub-dal -v $DIR/dal/:/app/ --link cassyhub-db:cassyhub-db -d cassyhub/dal

# Cassy API
docker build -t cassyhub/api ./api/.
docker run -it --name cassyhub-api -v $DIR/api/:/app/ --link cassyhub-dal:cassyhub-dal -d cassyhub/api

# Cassy Router
docker build -t cassyhub/router ./router/.
docker run -it --name cassyhub-router -p 80:80 -v $DIR/router/:/app/ -v $DIR/stormpath.json:/app/stormpath.json --link cassyhub-api:cassyhub-api -d cassyhub/router
