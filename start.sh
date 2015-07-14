# Clean up old docker containers
docker rm $(docker stop $(docker ps -a -f "name=cassyhub-" -q))

# Mongo DB
docker pull mongo
docker run --name cassyhub-db -d mongo

# Cassy Data Access Layer
docker build -t cassyhub/dal ./dal/.
docker run -it --name cassyhub-dal --link cassyhub-db:cassyhub-db -d cassyhub/dal

# Cassy API
docker build -t cassyhub/api ./api/.
docker run -it --name cassyhub-api --link cassyhub-dal:cassyhub-dal -d cassyhub/api

# Cassy Router
docker build -t cassyhub/router ./router/.
docker run -it --name cassyhub-router -p 80:80 --link cassyhub-api:cassyhub-api -d cassyhub/router
