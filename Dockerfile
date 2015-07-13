FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

RUN npm install supervisor -g

# Bundle app source
COPY . /app/

# Install app dependencies
RUN cd /app/src; npm install

EXPOSE  8080
CMD cd /app/src && npm start
