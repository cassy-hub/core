FROM    centos:centos6

# NodeJS
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
RUN     yum install -y npm

# Node Modules
RUN npm install pm2 -g

# Bundle app source
COPY . /app/

# Install app dependencies
RUN cd /app; npm install && ./node_modules/.bin/gulp build

EXPOSE  80
CMD cd /app && npm start && bash
