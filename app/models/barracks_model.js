/*
	This defines the Barracks Schema/Model
*/

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Init schema
var BarracksSchema = new Schema({
	soldiers:	[{ type: Schema.Types.ObjectId, ref: 'Soldier' }]
}, { collection : 'Barracks' });

/*
	 Statics
*/
BarracksSchema.statics = {
	
}

// Set the model after we define some methods
mongoose.model('Barracks', BarracksSchema);
