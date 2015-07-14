DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# Clean up old docker containers
docker rm $(docker stop $(docker ps -a -q))
#docker rm $(docker stop $(docker ps -a -f "name=mongo" -q))
#docker rm $(docker stop $(docker ps -a -f "name=cassyhub-dal" -q))
#docker rm $(docker stop $(docker ps -a -f "name=cassyhub-api" -q))
#docker rm $(docker stop $(docker ps -a -f "name=cassyhub-router" -q))

# Mongo DB
docker pull mongo
docker run --name cassyhub-db -d mongo

# Cassy Data Access Layer
docker build -t cassyhub/dal ./dal/.
docker run -it --name cassyhub-dal -p 1040:1040 --link cassyhub-db:cassyhub-db -d cassyhub/dal

# Cassy API
docker build -t cassyhub/api ./api/.
docker run -it --name cassyhub-api -p 1041:1041  --link cassyhub-dal:cassyhub-dal -d cassyhub/api

# Cassy Router
docker build -t cassyhub/router ./router/.
docker run -it --name cassyhub-router -p 80:80 --link cassyhub-api:cassyhub-api -d cassyhub/router





#§docker run --name cassyhub-core -it -p 8080:8080 -v $DIR/src:/app/src -d cassyhub/core
