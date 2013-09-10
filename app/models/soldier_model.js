/*
  This defines the Soldier Schema/Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Init schema
var SoldierSchema = new Schema({
  name:         String,
  pointValue:   Number,
  type:         String,
  stats: {
    maxHP:      Number,
    currentHP:  Number,
    attack:     Number,
    defence:    Number,
    speed:      Number
  },
  record: {
    kills:      Number,
    deaths:     Number,
    dmgDone:    Number,
    dmgTaken:   Number,
    hpRecovered:Number
  },
  gridPosition: {
    x:          Number,
    y:          Number
  }
}, { collection : 'Soldier' });

/*
   Validation
*/
SoldierSchema.path('name').validate(function(name) {
  return name.length > 0
}, 'Soldier name cannot be blank.');

SoldierSchema.path('type').validate(function(value) {
   return /warrior|wizard|archer/i.test(value);
}, 'Invalid soldier type');

/*
   Methods
*/
// Define a deal damage method
// This generates a random number between minDamage and maxDamage
SoldierSchema.methods = {
  // Calculates this soldiers damage
  dealDamage: function(callback) {
    // RoundDown( {0-1} * attack) + RoundDown(attack/1.5 )
    // Example:
    //    floor(0.43256 * 7) + floor(4.666))
    //    3 + 4 = 7
    // Damage range = min(attack/2), max (attack/1.5 + attack)
    //    (example) = 4 to 9
    var dmg = Math.floor(Math.random() * this.stats.attack ) + 
              Math.floor(this.stats.attack / 1.5);
    callback(dmg);
  },
  // Add a method to check whether a soldier is dead or not
  isDead: function() {
    if (this.stats.currentHP <= 0) {
      // This guy is dead
      this.record.deaths++;
      return true;
    }
    return false;
  },
  // Adds the ability to heal a soldier. Soldiers cannot be healed more than their max hp
  heal: function(amount) {
    this.stats.currentHP  += amount;
    this.stats.currentHP  = Math.min(this.stats.currentHP, this.stats.maxHP);
    this.record.hpRecovered += amount;
  },
  // Take damage
  takeDamage: function(amount, callback) {
    var dmg = Math.floor(amount / (this.stats.defence/2));
    this.stats.currentHP -= dmg;
    this.record.dmgTaken += dmg;
    console.log('%s takes %s dmg', this.name, dmg);
    callback(dmg);
  },
  // Add to this soldiers damage done amount
  statDamage: function(amount) {
    this.record.dmgDone += amount;
  }
}

/*
   Statics
*/
SoldierSchema.statics = {
  // Loads a soldier based on an ID
  load: function (id, callback) {
    this.find({_id: id}, function(err, soldier) {
      if (err || !soldier || typeof soldier === 'undefined') {
        console.log('Error loading soldier with ID %s', id);
      }
      soldier = soldier[0];
      // Reset their current HP on load
      soldier.stats.currentHP = soldier.stats.maxHP;
      console.log('loading a soldier %s', soldier.name);
      callback(err, soldier);
    });
  }
}

// Set the model after we define some methods
mongoose.model('Soldier', SoldierSchema);

