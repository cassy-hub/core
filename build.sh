DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

docker rm $(docker stop $(docker ps -a -f "name=cassyhub-core" -q))

docker build -t cassyhub/core .
docker run --name cassyhub-core -it -p 8080:8080 -v $DIR/src:/app/src -d cassyhub/core
