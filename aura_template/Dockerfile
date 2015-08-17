FROM maven:3.3.3-jdk-7
# Update aptitude with new repo
RUN apt-get update
# Install software 
RUN apt-get install -y git
RUN mkdir --parents /usr/src/app
ADD . /usr/src/app
RUN git clone REPOSITORY_URL /usr/src/app/src/main/webapp/WEB-INF/components/SPARK_NAME
WORKDIR /usr/src/app
RUN mvn clean install
EXPOSE 8080
CMD mvn jetty:run