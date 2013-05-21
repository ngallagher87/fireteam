var mongoose = require('mongoose');
/*
	This defines the Soldier Schema
*/
var SoldierSchema = new Schema({
	SoldierID:	Number,
	FireteamID: Number,
	name: 		String,
	pointValue:	Number,
	stats: {
		level:		Number,
		maxHP:		Number,
		currentHP: 	Number,
		minDamage:	Number,
		maxDamage:	Number,
		exp:		Number
	},
	gridPosition: {
		x: Number,
		y: Number
	}
});

// Define a deal damage method
// This generates a random number between minDamage and maxDamage
SoldierSchema.methods.dealDamage = function() {
	return Math.floor(Math.random() * this.maxDamage ) + this.minDamage;	
}

// Add a method to check whether a soldier is dead or not
SoldierSchema.methods.isDead = function() {
	return this.currentHP <= 0;
}

// Adds the ability to heal a soldier. Soldiers cannot be healed more than their max hp
SoldierSchema.methods.heal = function(amount) {
	this.currentHP += amount;
	this.currentHP = Math.min(this.currentHP, this.maxHP);
}