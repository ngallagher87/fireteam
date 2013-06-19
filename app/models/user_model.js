/*
	This defines the Soldier Schema/Model
*/

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Init schema
var UserSchema = new Schema({
	email:		{ 	
					type: String, 
					required: true, 
					index: { unique: true }, 
					validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ 
				},
	name:		{ type: String },
	displayName:{ type: String },
	profile: 	{ type: Object }
}, { collection : 'User' });

/*
	 Methods
*/
// Define a deal damage method
// This generates a random number between minDamage and maxDamage
UserSchema.methods = {
	// Calculates this soldiers damage
	dealDamage: function() {
		return Math.floor(Math.random() * this.stats.maxDamage ) + this.stats.minDamage;	
	}
}

/*
	 Statics
*/
UserSchema.statics = {
	// Loads a user record
	load: function (email, callback) {
		console.log("loading a user record");
		this.findOne({email: email}, function(err, user) { 
			callback(err, user); 
		});
	},
	// Saves a user record
	save: function (profile, callback) {
		callback("Error: not implemented", null);
	},
	// Finds a user record
	find: function (email, callback) {
		this.findOne({email: profile.email}), function(err, user) {
			callback(err, user);
		})
	}
	
}

// Set the model after we define some methods
mongoose.model('User', UserSchema, 'User');
