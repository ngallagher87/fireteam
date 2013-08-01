/**
	Module dependencies
*/

var mongoose = require('mongoose'),
    async    = require('async'),
    Soldier  = mongoose.model('Soldier');

/**
	Loads a soldier
		id is the soldier to load
*/
exports.loadSoldier = function(id, callback) {
	// Loads a soldier
	try {
		Soldier.load(id, function (err, soldier) {
			if (err || soldier === null) {
				err = "No soldier with id " + id + " found.\n";
			}  else {
				// Make sure you load a soldier at full hp
				soldier.stats.currentHP = soldier.stats.maxHP;
				soldier.save();
			}
			callback(err, soldier);
		});
	}
	catch(e) {
		callback("Error loading soldier" + id, null);
	}
}

/**
	Gets a soldiers record
		id is the soldier to fetch
*/
exports.showRecord = function(id, callback) {
	// finds the soldier in question and returns only his record
	Soldier.findOne({ SoldierID: id }, function (err, soldier) {
		callback(err, soldier.record);
	});
}

/**
	Creates a soldier
		Name is the soldiers name
		id is the soldier to load
*/
exports.createSoldier = function(req, res, id, name) {
	// Create a soldier
	var soldier = new Soldier({
		SoldierID:	id,
		name: 		name,
		pointValue:	1,
		stats: {
			level:		1,
			maxHP:		40,
			currentHP: 	40,
			minDamage:	10,
			maxDamage:	15,
			exp:		0
		},
		record: {
			kills: 		0,
			deaths: 	0,
			dmgDone: 	0,
			dmgTaken:	0,
			hpRecovered:0
		},
		gridPosition: {
			x: 2,
			y: 2
		}
	});
	soldier.save();
}