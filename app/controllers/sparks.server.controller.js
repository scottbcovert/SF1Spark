'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
	Spark = mongoose.model('Spark'),
	shell = require('shelljs');

/**
 * Create a Spark
 */
exports.create = function(req, res) {
	var spark = new Spark(req.body);
	spark.owner = req.user;

	spark.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Use shelljs & dokku to upload Spark codebase as hosted Aura app
			shell.mkdir(spark.name);
			shell.cp('-Rf','aura_template/',spark.name);
			shell.cd(spark.name);
			shell.sed('-i', 'REPOSITORY_URL', spark.repositoryUrl, 'Dockerfile');
			shell.sed('-i', 'SPARK_NAME', spark.name, 'Dockerfile');
			shell.sed('-i', 'SPARK_NAME', spark.name, 'src/main/webapp/index.jsp');
			shell.sed('-i', 'APPLICATION_NAME', spark.application, 'src/main/webapp/index.jsp');
			shell.exec('git init');
			shell.exec('git config user.name \'' + spark.owner.displayName + '\'');
			shell.exec('git config user.email \'' + spark.owner.email + '\'');
			shell.exec('git add .');
			shell.exec('git commit -a -m \'Initial commit for Spark: ' + spark.name + '\'');
			shell.exec('git remote add ' + spark.name + ' dokku@sf1spark.com:' + spark.name);
			shell.exec('git push -f ' + spark.name + ' master', {async: true, silent: true}, function(code, output) {
			  console.log('Exit code:', code);
			  console.log('Program output:', output);
			  shell.rm('-Rf',spark.name);
			});
			shell.cd('..');
			res.jsonp(spark);
		}
	});
};

/**
 * Show the current Spark
 */
exports.read = function(req, res) {
	res.jsonp(req.spark);
};

/**
 * Update a Spark
 */
exports.update = function(req, res) {
	var spark = req.spark;

	spark = _.extend(spark, req.body);

	spark.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(spark);
		}
	});
};

/**
 * Delete a Spark
 */
exports.delete = function(req, res) {
	var spark = req.spark;

	spark.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(spark);
		}
	});
};

/**
 * List of All Sparks
 */
exports.list = function(req, res) {
	/*if (req.sortType === 'Personal'){

	}
	else if (req.sortType === 'Starred'){

	}
	else if (req.sortType === 'Trending'){
		
	}
	else {*/
		// Sort Sparks by Newest
		Spark.find().sort('-created').exec(function(err, sparks) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(sparks);
			}
		});
	//}
};

/**
 * Spark middleware
 */
exports.sparkByID = function(req, res, next, id) { 
	Spark.findById(id).exec(function(err, spark) {
		if (err) return next(err);
		if (! spark) return next(new Error('Failed to load Spark'));
		req.spark = spark;
		next();
	});
};

/**
 * Spark authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.spark.user.id !== req.user.id) {
		return res.status(403).send('Unauthorized');
	}
	next();
};