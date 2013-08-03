/*
  This defines the Soldier Schema/Model
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Init schema
var SoldierSchema = new Schema({
  name:     String,
  pointValue: Number,
  type:   String,
  stats: {
    level:    Number,
    maxHP:    Number,
    currentHP:  Number,
    minDamage:  Number,
    maxDamage:  Number,
    exp:    Number
  },
  record: {
    kills:    Number,
    deaths:   Number,
    dmgDone:  Number,
    dmgTaken: Number,
    hpRecovered: Number
  },
  gridPosition: {
    x: Number,
    y: Number
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
  dealDamage: function() {
    return Math.floor(Math.random() * this.stats.maxDamage ) + this.stats.minDamage;
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
  takeDamage: function(amount) {
    this.stats.currentHP -= amount;
    this.record.dmgTaken += amount;
  }
}

/*
   Statics
*/
SoldierSchema.statics = {
  // Loads a soldier based on an ID
  load: function (id, callback) {
    console.log("loading a soldier");
    this.findByID(id, function(err, soldier) {
      callback(err, soldier);
    });
  }
}

// Set the model after we define some methods
mongoose.model('Soldier', SoldierSchema);

