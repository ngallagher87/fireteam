/*
	This defines the Fireteam Schema/Model
*/

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Init schema
var FireteamSchema = new Schema({
	user: {type : Schema.ObjectId, ref : 'User'},
	name: String,
	stats: {
		wins: Number,
		losses: Number
	},
	soldiers: [
		{type : Schema.ObjectId, ref : 'Soldier'}
	]
});


// Set the model after we define some methods
mongoose.model('Fireteam', FireteamSchema);