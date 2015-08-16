'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Spark = mongoose.model('Spark');

/**
 * Globals
 */
var user, spark;

/**
 * Unit tests
 */
describe('Spark Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			spark = new Spark({
				name: 'Spark Name',
				repositoryUrl: 'https://github.com/test/test.git',
				description: 'Test',
				owner: user
			});

			spark2 = new Spark({
				name: 'Spark Name',
				repositoryUrl: 'https://github.com/test/test.git',
				description: 'Test',
				owner: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return spark.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should fail to save a spark with a pre-existing name', function(done) {
			spark.save();
			return spark2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('owner field should be initialized automatically', function(done) {
			return spark.save(function(err, newSpark) {
				should.exist(newSpark.owner);
				done();
			});
		});

		it('updated and created fields should be initialized automatically and be equal', function(done) {
			return spark.save(function(err, newSpark) {
				should.not.exist(err);
				should.exist(newSpark.updated);
				newSpark.updated.should.equal(newSpark.created);
				done();
			});
		});

		it('should get an error when trying to save without a name', function(done) { 
			spark.name = '';

			return spark.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should get an error when trying to save without a repository URL', function(done) { 
			spark.repositoryUrl = '';

			return spark.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should get an error when trying to save an invalid repository URL', function(done) { 
			spark.repositoryUrl = 'https://github.com/test/test';

			return spark.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	describe('Method Update', function() {
		it('update should refresh updated field without problems', function(done) {
			return spark.save(function() {
				return spark.update({name: 'Spark Name 2'}, function(err,updatedSpark) {
					should.not.exist(err);
					updatedSpark.updated.should.notEqual(updatedSpark.created);
				});
				done();
			});
		});

	});

	afterEach(function(done) { 
		Spark.remove().exec();
		User.remove().exec();

		done();
	});
});