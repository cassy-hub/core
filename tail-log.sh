#!/bin/bash

if [[ "$1" == "" ]]; then
	echo "Please enter log to tail, e.g: 'tail-log.sh router' or 'tail-log.sh api' or 'tail-log.sh dal'"
	exit
fi

# construct container name for lookup
containerName="cassyhub-"$1

# get id of container
containerID=$(docker ps -a -f "name=$containerName" -q)

if [[ "$containerID" != "" ]]; then

	# set forever list columns to logfile only
	docker exec $containerID forever columns set logfile

	# get filepath of forever log file
	logfile=$(docker exec $containerID forever list | grep -oE '\/(.*)\.log')

	# reset forever list columns to default
	docker exec $containerID forever columns reset

	# tail log file via docker
	echo "Tailing log file: '"$logfile"' for container: '"$containerID"'"
	echo ""
	echo ""
	docker exec $containerID tail -f -n 50 $logfile

else
	echo "ERROR: Could not find container with name: '"$containerName"'"
fi
