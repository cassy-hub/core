DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

docker rm $(docker stop $(docker ps -a -f "IMAGE=cassyhub/core" -q))

docker build -t cassyhub/core .
docker run -it -d -p 8080:8080 -v $DIR/src:/app/src -d cassyhub/core
