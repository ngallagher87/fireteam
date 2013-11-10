/*
  This defines the Soldier Schema/Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

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
  },
  behaviours: [
    {
      name:     String,
      conditions: 
        {
          target:   String,
          stat:     String,
          operator: String,
          value:    String
        },
        cooldown: {
          type:     String,
          active:   Boolean
        }
    }
  ]
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
    return this.stats.currentHP <= 0;
  },
  // Adds the ability to heal a soldier. Soldiers cannot be healed more than their max hp
  heal: function(amount) {
    this.stats.currentHP  += amount;
    this.stats.currentHP  = Math.min(this.stats.currentHP, this.stats.maxHP);
    this.record.hpRecovered += amount;
  },
  // Take damage
  takeDamage: function(amount, callback) {
    var dmg = Math.round(amount / (this.stats.defence/4));
    this.stats.currentHP -= dmg;
    this.record.dmgTaken += dmg;
    if (this.isDead()) {
      // This guy is dead
      this.record.deaths++;
    }
    console.log('%s takes %s dmg', this.name, dmg);
    callback(dmg);
  },
  // Add to this soldiers damage done amount
  statDamage: function(amount) {
    this.record.dmgDone += amount;
  },
  // Gets a soldiers grid position
  getPosition: function() {
    return this.gridPosition;
  },
  /* 
    Moves a soldier to a grid position
    Requires the requested x and y coordinates
    An array of their teammates (soldiers)
    A callback
  
    The callback will contain an error if there was one, 
    and true/false if the move was successful
  */
  moveSoldier: function(x, y, teammates, callback) {
    var err = null;
    if ((x > 3 || y > 3) && (x < 0 || y < 0)) {
      err = 'Out of bounds move';
      callback(err, false);
    } else {
      async.each(teammates, function(soldier, cb) {
        var pos = soldier.getPosition();
        if (pos.x == x || pos.y == y) {
          err = 'Cannot move soldier - this space is occupied';
          cb(err, null);
        }
      }, function (err) {
        if (err) {
          callback(err, false);
        } else {
          this.gridPosition.x = x;
          this.gridPosition.y = y;
          callback(null, true);
        }
      });
    }
  },
  // Checks if a soldier has a behaviour
  hasBehaviour: function(behaviour, callback) {
    var hasBehaviour = false;
    async.each(this.behaviours, function(item, cb) {
      if (item.name === behaviour) hasBehaviour = true;
      cb(null);
    }, function(err) {
      callback(err, hasBehaviour);
    });
  },
  // Returns the behaviour specified. If no behaviour is present, returns null
  getBehaviour: function(behaviour, callback) {
    var self = this;
    self.hasBehaviour(behaviour, function(err, hasBehaviour) {
      if (hasBehaviour) {
        // The soldier has this behaviour, lets go find it and return it
        var b = null;
        async.each(self.behaviours, function(item, cb) {
          if (item.name === behaviour) {
            b = item;
          }
          cb(null);
        }, function(err) {
          if (b == null) err = 'Behaviour '+behaviour+' not found';
          callback(err, b);
        });
      // This soldier doesn't have the requested behaviour
      } else {
         callback('Behaviour '+behaviour+' not found', null);
      }
    });
  },
  updateBehaviour: function(name, target, stat, operator, value) {
    
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

