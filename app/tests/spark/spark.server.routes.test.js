'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Spark = mongoose.model('Spark'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, credentials2, user, user2, spark;

/**
 * Spark routes tests
 */
describe('Spark CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};
		credentials2 = {
			username: 'username2',
			password: 'password2'
		};

		// Create two new users
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials2.username,
			password: credentials2.password,
			provider: 'local'
		});


		// Save the users to the test db and create new Spark
		user.save(function() {
			user2.save(function() {
				spark = {
					name: 'Spark Name',

					repositoryUrl: 'https://github.com/test/test.git',
					description: 'Test',
					owner: user
				};

				done();
			});
		});
	});

	it('should be able to save Spark instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(200)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Handle Spark save error
						if (sparkSaveErr) done(sparkSaveErr);

						// Get a list of Sparks
						agent.get('/sparks')
							.end(function(sparksGetErr, sparksGetRes) {
								// Handle Spark save error
								if (sparksGetErr) done(sparksGetErr);

								// Get Sparks list
								var sparks = sparksGetRes.body;

								// Set assertions
								(sparks[0].owner._id).should.equal(userId);
								(sparks[0].name).should.match('Spark Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Spark instance if not logged in', function(done) {
		agent.post('/sparks')
			.send(spark)
			.expect(401)
			.end(function(sparkSaveErr, sparkSaveRes) {
				// Call the assertion callback
				done(sparkSaveErr);
			});
	});

	it('should not be able to save Spark instance if no name is provided', function(done) {
		// Invalidate name field
		spark.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(400)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Set message assertion
						(sparkSaveRes.body.message).should.match('Please give a name to your new Spark');
						
						// Handle Spark save error
						done(sparkSaveErr);
					});
			});
	});

	it('should not be able to save Spark instance if no application name is provided', function(done) {
		// Invalidate name field
		spark.application = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(400)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Set message assertion
						(sparkSaveRes.body.message).should.match('Please enter the application name for this Spark');
						
						// Handle Spark save error
						done(sparkSaveErr);
					});
			});
	});

	it('should not be able to save Spark instance if no repository URL is provided', function(done) {
		// Invalidate repositoryUrl field
		spark.repositoryUrl = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(400)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Set message assertion
						(sparkSaveRes.body.message).should.match('Please specify the repository url for your Spark\'s codebase');
						
						// Handle Spark save error
						done(sparkSaveErr);
					});
			});
	});

	it('should not be able to save Spark instance if an invalid repository URL is provided', function(done) {
		// Invalidate repositoryUrl field
		spark.repositoryUrl = 'https://github.com/test/test';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(400)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Set message assertion
						(sparkSaveRes.body.message).should.match('Please specify a valid git repository url (should end in .git)');
						
						// Handle Spark save error
						done(sparkSaveErr);
					});
			});
	});

	it('should be able to update Spark instance if signed in as Spark owner', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(200)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Handle Spark save error
						if (sparkSaveErr) done(sparkSaveErr);

						// Update Spark name
						spark.name = 'Spark Name 2';

						// Update existing Spark
						agent.put('/sparks/' + sparkSaveRes.body._id)
							.send(spark)
							.expect(200)
							.end(function(sparkUpdateErr, sparkUpdateRes) {
								// Handle Spark update error
								if (sparkUpdateErr) done(sparkUpdateErr);

								// Set assertions
								(sparkUpdateRes.body._id).should.equal(sparkSaveRes.body._id);
								(sparkUpdateRes.body.name).should.match('Spark Name 2');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to update Spark instance if not signed in as Spark owner', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(200)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Handle Spark save error
						if (sparkSaveErr) done(sparkSaveErr);

						agent.post('/auth/signout')
							.expect(200)
							.end(function(signoutErr, singoutRes) {
								// Handle signout error
								if (signoutErr) done(signoutErr);

								agent.post('auth/signin')
									.send(credentials2)
									.expect(200)
									.end(function(signin2Err, signin2Res) {
										// Handle signin error
										if (signin2Err) done(signin2Err);

										// Update Spark name
										spark.name = 'Spark Name 2';

										// Update existing Spark
										agent.put('/sparks/' + sparkSaveRes.body._id)
											.send(spark)
											.expect(403)
											.end(function(sparkUpdateErr, sparkUpdateRes) {
												// Set message assertion
												(sparkUpdateRes.body.message).should.match('Unauthorized');

												// Handle Spark update error
												done(sparkUpdateErr);												
											});
									});
							});						
					});
			});
	});

	it('should be able to get a list of Sparks even if not signed in', function(done) {
		// Create new Spark model instance
		var sparkObj = new Spark(spark);

		// Save the Spark
		sparkObj.save(function() {
			// Request Sparks
			request(app).get('/sparks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Spark even if not signed in', function(done) {
		// Create new Spark model instance
		var sparkObj = new Spark(spark);

		// Save the Spark
		sparkObj.save(function() {
			request(app).get('/sparks/' + sparkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', spark.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Spark instance if signed in as Spark owner', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(200)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Handle Spark save error
						if (sparkSaveErr) done(sparkSaveErr);

						// Delete existing Spark
						agent.delete('/sparks/' + sparkSaveRes.body._id)
							.send(spark)
							.expect(200)
							.end(function(sparkDeleteErr, sparkDeleteRes) {
								// Handle Spark delete error
								if (sparkDeleteErr) done(sparkDeleteErr);

								// Set assertions
								(sparkDeleteRes.body._id).should.equal(sparkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Spark instance if not signed in as Spark owner', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Spark
				agent.post('/sparks')
					.send(spark)
					.expect(200)
					.end(function(sparkSaveErr, sparkSaveRes) {
						// Handle Spark save error
						if (sparkSaveErr) done(sparkSaveErr);

						agent.post('/auth/signout')
							.expect(200)
							.end(function(signoutErr, singoutRes) {
								// Handle signout error
								if (signoutErr) done(signoutErr);

								agent.post('auth/signin')
									.send(credentials2)
									.expect(200)
									.end(function(signin2Err, signin2Res) {
										// Handle signin error
										if (signin2Err) done(signin2Err);

										// Delete existing Spark
										agent.delete('/sparks/' + sparkSaveRes.body._id)
											.send(spark)
											.expect(403)
											.end(function(sparkDeleteErr, sparkDeleteRes) {
												// Set message assertion
												(sparkDeleteRes.body.message).should.match('Unauthorized');

												// Handle Spark delete error
												done(sparkDeleteErr);
											});
									});
							});						
					});
			});
	});

	it('should not be able to delete Spark instance if not signed in', function(done) {
		// Set Spark user 
		spark.user = user;

		// Create new Spark model instance
		var sparkObj = new Spark(spark);

		// Save the Spark
		sparkObj.save(function() {
			// Try deleting Spark
			request(app).delete('/sparks/' + sparkObj._id)
			.expect(401)
			.end(function(sparkDeleteErr, sparkDeleteRes) {
				// Set message assertion
				(sparkDeleteRes.body.message).should.match('User is not logged in');

				// Handle Spark delete error
				done(sparkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Spark.remove().exec();
		done();
	});
});