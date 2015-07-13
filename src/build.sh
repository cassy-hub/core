DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

docker rm $(docker stop $(docker ps -a -f "IMAGE=cassy/core" -q))

docker build -t cassy/core .
docker run -it -p 8080:8080 -v $DIR:/src -d cassy/core
