#!/bin/bash

# Clean up old docker containers
mongoId=$(docker ps -a -f "status=running" -f "name=cassyhub-" -q)

if [[ "$mongoId" == "" ]] || [[ "$1" == "clear-db" ]]; then
  ECHO "Clearing everything. Starting from scratch!"

  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-" -q))

  # Mongo DB
  docker pull mongo
  docker run --name cassyhub-db -d mongo
else
  ECHO "Keeping database. Rebuilding other packages!"

  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-dal" -q))
  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-api" -q))
  docker rm $(docker kill $(docker ps -a -f "name=cassyhub-router" -q))
fi

# Cassy Data Access Layer
docker build -t cassyhub/dal ./dal/.
docker run -it --name cassyhub-dal --link cassyhub-db:cassyhub-db -d cassyhub/dal

# Cassy API
docker build -t cassyhub/api ./api/.
docker run -it --name cassyhub-api --link cassyhub-dal:cassyhub-dal -d cassyhub/api

# Cassy Router
docker build -t cassyhub/router ./router/.
docker run -it --name cassyhub-router -p 80:80 --link cassyhub-api:cassyhub-api -d cassyhub/router
