FROM node:0.10

MAINTAINER Scott Covert, scott.covert@tython.co

# Update aptitude with new repo
RUN apt-get update

# Install git
RUN apt-get install -y git

# Setup SSH Key
ADD id_rsa /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host sf1spark.com\n\tIdentityFile \"~/.ssh/id_rsa\"" >> /root/.ssh/config
RUN ssh-keyscan -t rsa sf1spark.com > /root/.ssh/known_hosts

WORKDIR /home/mean

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /home/mean/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/mean/.bowerrc
ADD bower.json /home/mean/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/mean

# currently only works for development
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["grunt"]
