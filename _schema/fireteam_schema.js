var mongoose 		= require('mongoose'),
	SoldierSchema 	= require('soldier_schema');
/*
	This defines the Fireteam Schema
*/
var FireteamSchema = new Schema({
	FireteamID: Number,
	ownerID: 	Number,
	ownerName: 	String,
	name: 		String,	
	motto:		String,
	curPoints:	0,
	stats: {
		wins: 		Number,
		losses: 	Number,
		rank:		Number
	},
	soldiers: [
		SoldierSchema
	]
});