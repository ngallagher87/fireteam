/* 
	This defines a soldier object the red god can use

*/
var Soldier = (function(id) {
	function Soldier(id) {
		// Init a db connection
		var mongoose 		= require('mongoose'),
			SoldierSchema 	= require('./_schema/soldier_schema');
		// Connect to db
		mongoose.connect('mongodb://localhost/test');		
		// Store a db connection
		this.db = mongoose.connection;
		this.db.on('error', console.error.bind(console, 'connection error:'));
		this.db.once('open', function callback () {
		  // Initialize the soldier model here
		  	this.SoldierModel = mongoose.model('Soldier', SoldierSchema);
		  	this.SoldierModel.find({SoldierID: id}, function (soldier) {
			  	// We've found our soldier here, so assign it
			  	this.soldier = soldier;
		  	})
		});
		
		// Init instance props in constructors		
		console.log("A soldier by the name of "+this.soldier.name + "has been loaded");
	}
	// Gets a soldiers name
	Soldier.prototype.getName = function() {
		return this.soldier.name;
	}
	
	// Define an attack routine for a soldier
	Soldier.prototype.attack = function() {
		return this.soldier.dealDamage();
	}
	
	// Define a way for a soldier to take damage
	Soldier.prototype.takeDamage = function(damage) {
		this.soldier.currentHP -= damage;
	}
	
	// Getter for seeing if a soldier is dead
	Soldier.prototype.checkDead = function() {
		return this.soldier.isDead();
	}
	return Soldier;
})();

// Export the soldier for node
module.exports = Soldier;