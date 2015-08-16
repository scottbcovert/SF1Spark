FROM maven:3.3.3-jdk-7
# Update aptitude with new repo
RUN apt-get update
# Install software 
RUN apt-get install -y git
RUN mkdir --parents /usr/src/app
ADD . /usr/src/app
RUN git clone https://github.com/scottbcovert/ttt.git /usr/src/app/src/main/webapp/WEB-INF/components/ttt
WORKDIR /usr/src/app
RUN mvn clean install
EXPOSE 8080
CMD mvn jetty:run