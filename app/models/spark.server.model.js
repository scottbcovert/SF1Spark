'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Spark Schema
 */
var SparkSchema = new Schema({
	name: {
		type: String,
		unique: 'There is already a Spark with this name',
		required: 'Please give a name to your new Spark',
		trim: true
	},
	repositoryUrl: {
		type: String,
		required: 'Please specify the repository url for your Spark\'s codebase',
		validate: [/.*\.git$/, 'Please specify a valid git repository url (should end in .git)']
	},
	description: {
		type: String,
		trim: true
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updated: {
		type: Date
	},
	created: {
		type: Date
	}
});

SparkSchema.pre('save', function(next){
  now = new Date();
  this.updated = now;
  if ( !this.created ) {
    this.created = now;
  }
  next();
});

mongoose.model('Spark', SparkSchema);