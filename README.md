Salesforce1 Spark
=================

An open-sourced project for collaboratively coding Salesforce1 Lightning components

This project is built on a [MEAN](https://meanjs.org) stack and utilizes [Dokku](https://github.com/progrium/dokku), a [Docker](https://docker.com)-powered mini [Heroku](https://heroku.com), to create a code playground for Salesforce1 Lightning components.

## Usage

* At sf1spark.com you can create new 'Sparks' to test out lightning components

* These Sparks will run as individual Docker containers external to Salesforce (though you need to login with your Salesforce user id to create one)
 
* After you create a Spark visit [spark name].sf1spark.com to see your component in action. 

* Sparks require a public git url to pull code from so if you have an error, reach out to a fellow Salesforce developer for help!

## Development

If you'd like to run Spark locally follow these steps:

* Download this repo to your local machine

* CD into the project folder

```
$ ssh-keygen -t rsa -C "SF1Spark"
```
* For path choose [project folder]/id_rsa like this: /Users/Scott/myMac/workspace/sf1spark/id_rsa and leave passphrase empty]

* Add to dokku user's authorized_keys file on DO droplet

```
$ cat ./id_rsa.pub | ssh root@sf1spark.com "sudo sshcommand acl-add dokku SF1Spark" 
$ docker-machine create -d virtualbox dev [Starts VM]
$ docker-machine ip dev [Optional to get VM's ip] 
$ eval "$(docker-machine env dev)" [Connects terminal session to VM]
$ bower install [Installs dependencies prior to Docker build]
$ docker-compose up [Start MongoDB container & Build/Start MEAN.js app container]
```

* Go to [VM's ip]:3000 in your browser

* Create local.js file in config/env & set ENV var values there

* Change etc/hosts file to map localhost to VM's ip; be sure to undo this later