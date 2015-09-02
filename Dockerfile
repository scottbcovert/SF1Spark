FROM node:0.10

MAINTAINER Scott Covert, scott.covert@tython.co

# Update aptitude with new repo
RUN apt-get update

# Install git
RUN apt-get install -y git

# Setup Spark user for using mounted SSH Key
RUN useradd -ms /bin/bash spark
CMD ["usermod","-u","1000","spark"]

# Setup SSH Key Config
RUN mkdir -p /home/spark/.ssh
RUN echo "Host sf1spark.com\n\tIdentityFile \"/home/spark/.ssh/id_rsa\"" >> /home/spark/.ssh/config
RUN ssh-keyscan -t rsa sf1spark.com > /home/spark/.ssh/known_hosts

# Make everything available for start
ADD . /home/spark/mean
RUN chown -R spark:spark /home/spark

# Set Work Directory
WORKDIR /home/spark/mean

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Switch to new spark user
USER spark

# Install Mean.JS packages
ADD package.json /home/spark/mean/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/spark/mean/.bowerrc
ADD bower.json /home/spark/mean/bower.json
RUN bower install --config.interactive=false --allow-root

# Uncomment below for running in development mode
# ENV NODE_ENV development
# EXPOSE 3000 35729
# CMD ["grunt"]
# End of development mode

# Uncomment below for running in production mode
ENV NODE_ENV production
EXPOSE 8080
CMD ["grunt","prod"]
# End of production mode