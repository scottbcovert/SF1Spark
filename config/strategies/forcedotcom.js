'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	ForceDotComStrategy = require('passport-forcedotcom').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	// Use ForceDotCom strategy
	passport.use(new ForceDotComStrategy({
		  	clientID: config.forcedotcom.clientID,
			clientSecret: config.forcedotcom.clientSecret,
			callbackURL: config.forcedotcom.callbackURL
		},
		function verify(req, accessToken, refreshToken, profile, done) {
	  		// Set the provider data and include tokens
			var providerData = profile._raw;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile._raw.username,
				photo: profile._raw.photos.thumbnail,
				provider: profile.provider,
				providerIdentifierField: 'id',
				providerData: providerData
			};

	  		// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};