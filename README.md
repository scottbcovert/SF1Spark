Salesforce1 SparkHub
====================

An open-sourced project for collaboratively coding Salesforce1 lightning components

This project is built on a [MEAN](https://meanjs.org) stack and utilizes [Dokku](https://github.com/progrium/dokku), a [Docker](https://docker.com)-powered mini [Heroku](https://heroku.com), to create a code playground for Salesforce1 lightning components.

## Usage

* Go to sf1spark.com and login with your Salesforce credentials

* Create a Spark using a public git repo that contains the code for the lightning component that is giving you problems

* Visit [spark name].sf1spark.com by clicking on the new Spark tile to (hopefully) see your lightning component in action. 

* Other developers can then fork your repo, fix any bugs they find, and create a new, updated Spark

* Sparks run as individual Docker containers *externally* from Salesforce-nothing is installed on your Salesforce org OR your local machine so there is no security risk to tinkering with other developers' code

## Setup

So you want to create your own SparkHub? That's cool, I get it. Here's what you need to do:

* Purchase a domain & SSL wildcard certificate from DNSimple; preferably through [my referral link](https://dnsimple.com/r/4365127fa33374) :-)

* Setup [Dokku](https://github.com/progrium/dokku) on a DigitalOcean droplet; again preferably through [my referral link](https://www.digitalocean.com/?refcode=60be092278fa)
	  * Here's a [reference video on Dokku](https://vimeo.com/68631325) and a [tutorial on setting up Dokku on DigitalOcean](http://thewebivore.com/tutorial-deploying-dokku-to-digitalocean-for-excellent-deploying-goodness/)

* [Add Swap to your DigitalOcean Droplet](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04)

* Add your SSH key to the *dokku* user's authorized_keys file on your DigitalOcean droplet

```
[On your local machine]
$ cat ~/.ssh/id_rsa.pub | ssh root@[your domain].com "sudo sshcommand acl-add dokku [key name]" 
```

* Clone this repo to your local machine for further tinkering

## Development

* Prerequisites

  * Install node and npm.

    ```
    [On your local machine]
    [Install node either from [nodejs.org](http://nodejs.org) or homebrew]
    $ brew install node
    [Update npm]
    $ npm install -g npm
    ```

  * Install necessary CLIs on your machine.
    
    ```
    [On your local machine]
    [Install CLI dependencies]
    $ npm install -g grunt-cli bower
    ```

  * Install [Docker Toolbox](https://www.docker.com/toolbox)

  * [Setup an OAuth-enabled Connected App in Salesforce](https://help.salesforce.com/apex/HTViewHelpDoc?id=connected_app_create.htm) with full access, the ability to perform requests at anytime, and the following callback URLs:

	```
	https://[your domain].com/auth/forcedotcom/callback
	http://localhost:3000/auth/forcedotcom/callback
	```

* After cloning this repo, CD into the project folder

* Create local.js file in config/env & set the Salesforce ENV vars (SALESFORCE_ID, SALESFORCE_SECRET, SALESFORCE_CALLBACK) to match the values from your Connected App in Salesforce

* Update the Dockerfile in the main repo folder to run in development mode

* Set up docker machine

```
[On your local machine]
$ docker-machine create -d virtualbox dev [Starts VM]
$ docker-machine ip dev [Optional to get VM's ip] 
$ eval "$(docker-machine env dev)" [Connects terminal session to VM]
$ bower install [Installs dependencies prior to Docker build]
$ docker-compose up [Start MongoDB container & Build/Start SparkHub app container]
```

* Change etc/hosts file to map 'localhost' to VM's ip

	  * This is because the only callback that Salesforce Connected Apps don't require to be over HTTPS is localhost
	  * The alternative is to set up self-signed SSL certs, but personally I think this is easier
	  * It's worth noting that you should BE SURE TO UNDO THIS LATER once you're done testing as localhost really should be mapped to your true loopback or bad things can happen

* Go to localhost:3000 in your browser to see the app running

* Livereload should be enabled by default in development mode so as you make changes to the source you should see the app update automatically

## Deployment

* Deploy app

```
[On your local machine]
$ git remote add [your domain] root@[your domain].com:[your domain].com
$ git push [your domain] master
```

* Install mongo on DigitalOcean Droplet:

```
[On DigitalOcean Droplet]
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
$ echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```

* Start mongo on DigitalOcean Droplet:

```
[On DigitalOcean Droplet]
$ sudo service mongod start
```

* Install mongodb plugin for dokku

```
[On DigitalOcean Droplet]
$ git clone https://github.com/jeffutter/dokku-mongodb-plugin.git /var/lib/dokku/plugins/mongodb
$ dokku plugins-install
```

* Start mongodb and create production db

```
[On DigitalOcean Droplet]
$ dokku mongodb:start
$ dokku mongodb:create [your domain].com
```

* Verify that config vars are NOT set yet for connection to mongo

```
[On DigitalOcean Droplet]
$ dokku config [your domain].com
```

* Link app container to mongodb

```
[On DigitalOcean Droplet]
$ dokku mongodb:link [your domain].com
```

* Verify that config vars are now set for connection to mongo

```
[On DigitalOcean Droplet]
$ dokku config [your domain].com
```

* Set NODE_ENV to production & your Salesforce ENV Vars; this should restart the container

```
[On DigitalOcean Droplet]
$ dokku config:set [your domain].com NODE_ENV=production SALESFORCE_ID=[YOUR CLIENT ID] SALESFORCE_SECRET=[YOUR SECRET] SALESFORCE_CALLBACK=https://[your domain].com/auth/forcedotcom/callback
```

* Set up recursive SSH Key

```
[On DigitalOcean Droplet]
$ cd ~/.ssh
$ ssh-keygen -t rsa -C "Self" [Enter 3 times for default location and no passphrase]
$ chown dokku:dokku id_rsa
$ chown dokku:dokku id_rsa.pub
$ cat ./id_rsa.pub | sudo sshcommand acl-add dokku Self
[Add Dokku Option to mount the SSH key you just created on the host droplet to the SparkHub container]
$ dokku docker-options:add [your domain].com run "-v /root/.ssh/id_rsa:/home/spark/.ssh/id_rsa"
$ dokku docker-options:add [your domain].com deploy "-v /root/.ssh/id_rsa:/home/spark/.ssh/id_rsa"
```

* Rebuild

```
[On DigitalOcean Droplet]
dokku ps:rebuild [your domain].com
```

## SSL/TLS Support

To enable SSL/TLS connections for all your applications at once you will need a wildcard SSL/TLS certificate.

To enable SSL/TLS across all apps, copy or symlink the .crt and .key files into the /home/dokku/tls folder (create this folder if it doesn't exist) as server.crt and server.key respectively.

```
[On DigitalOcean Droplet]
cd /home/dokku
mkdir tls
chown dokku:dokku tls
```

```
[On your local machine]
scp /path/to/file/server.crt root@[your domain].com:/home/dokku/tls/server.crt
scp /path/to/file/server.key root@[your domain].com]:/home/dokku/tls/server.key
```

Make sure permissions are set to have dokku own the server.key and server.crt files

```
[On DigitalOcean Droplet]
$ cd /home/dokku/tls
$ chown dokku:dokku server.crt
$ chown dokku:dokku server.key
```

Then, enable the certificates by editing /etc/nginx/conf.d/dokku.conf on your DigitalOcean droplet and uncommenting these two lines (remove the #):

```
ssl_certificate /home/dokku/tls/server.crt;
ssl_certificate_key /home/dokku/tls/server.key;
```

The nginx configuration will need to be reloaded in order for the updated SSL/TLS configuration to be applied. This can be done either via the init system or by re-deploying the application. Once SSL/TLS is enabled, the application will be accessible by https:// (redirection from http:// is applied as well).

Note: SSL/TLS will not be enabled unless the application's VHOST matches the certificate's name. (i.e. if you have a cert for *.example.com SSL/TLS won't be enabled for something.example.org or example.net)

## Limitations

* Salesforce1 lightning components are built on the [Aura framework](http://documentation.auraframework.org/auradocs). This means all lightning components are essentially specialized Aura components. One of the biggest differences between the two is that the backend for a lightning component is written in Apex while the backend for an Aura component is written in Java. If you have backend Apex written for your lightning component you will need to either convert the class(es) to Java or mock the data being sent to or returned from your backend for your component to run on SparkHub.

* SparkHub is under heavy development - it is in its beta stage at best and should be treated accordingly. Please log any issues you find and feel free to contribute via pull requests!

## Contributing

* Thank you for your interest in contributing!

* In general, try to follow the "fork-and-pull" Git workflow.
  
	  * Fork the repo on GitHub
	  * Commit changes to a branch in your fork
	  * Pull request "upstream" with your changes
	  * Merge changes in to "upstream" repo
	  * NOTE: Be sure to merge the latest from "upstream" before making a pull request!

* I know it's not fun, but please write tests for any additional features you build or issues you resolve. An easy way of doing this is to follow a test-driven development pattern by logging an issue and submitting a pull request with a failing test that references the new issue. Afterwards, you can develop the feature or patch the bug you found and submit a new pull request to close the issue.

## Acknowledgements

* Special thanks to:

	  * [@rajaraodv](https://github.com/rajaraodv) for writing two great blog posts and [sample code](https://github.com/rajaraodv/tictactoe) on running externally-hosted Aura apps either [locally](https://developer.salesforce.com/blogs/developer-relations/2015/06/running-aura-app-heroku.html) or [with Docker](https://developer.salesforce.com/blogs/developer-relations/2015/07/running-aura-app-docker.html), which served as the predecessors to this project
	  * The amazing [@docker](https://github.com/docker) team
	  * Jeff Lindsay (aka [@progrium](https://github.com/progrium)) for building [Dokku](https://github.com/progrium/dokku)
	  * The [@meanjs](https://github.com/meanjs) team and maintainers of [its official Yeoman generator](https://github.com/meanjs/generator-meanjs)
	  * YOU for contributing to open source and (almost) finishing this entire README :-)

## Additional Resources

* [MEAN.JS](https://meanjs.org/)
* [Angular Material](https://material.angularjs.org/latest/#/)

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.