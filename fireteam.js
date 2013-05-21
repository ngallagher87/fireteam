/* 
	This defines a fireteam
	
	Fireteams are groups of up to 5 soldiers. 
	
	Usage:
	--------------
	When creating a fireteam, you pass in an ID. The fireteam will then be loaded from Mongo.
	A fireteam consists of soldiers. Soldiers define their grid position, and the fireteam enforces that.
	The fireteam acts as a wrapper for all soldiers - it is the fireteam that is passed to the red god.
	
*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
// Bind db connection error here
db.on('error', console.error.bind(console, 'connection error:'));

var Fireteam = (function(id) {
	function Fireteam(id) {
		// Init instance props in constructors
		
		console.log("A fireteam has been loaded");
	}
	
	Fireteam.prototype.doSomething = function() {
		// Do something man!
	}
	return new Fireteam(id);
})();

// Export the fireteam for node
module.exports = Fireteam;