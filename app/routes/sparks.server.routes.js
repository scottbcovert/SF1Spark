'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sparks = require('../../app/controllers/sparks.server.controller');

	// Sparkss Routes
	app.route('/sparks')
		.get(users.requiresLogin, sparks.list)
		.post(users.requiresLogin, sparks.create);

	app.route('/sparks/:sparkId')
		.get(sparks.hasAuthorization, sparks.read)
		.put(users.requiresLogin, sparks.hasAuthorization, sparks.update)
		.delete(users.requiresLogin, sparks.hasAuthorization, sparks.delete);

	// Finish by binding the Spark middleware
	app.param('sparkId', sparks.sparkByID);
};