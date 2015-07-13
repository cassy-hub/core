FROM    centos:centos6

# Mongodb
#RUN     yum update -y
#RUN     yum install mongodb-org -y
#RUN     service mongod start

# NodeJS
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
RUN     yum install -y npm

# Node Modules
RUN npm install forever -g

# Bundle app source
COPY . /app/

# Install app dependencies
RUN cd /app/src; npm install

EXPOSE  8080
CMD cd /app/src && npm start && bash
