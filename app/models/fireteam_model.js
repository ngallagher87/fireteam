/*
  This defines the Fireteam Schema/Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    generator = require('../utils/name_generator'),
    async = require('async');

// Init schema
var FireteamSchema = new Schema({
  name: String,
  stats: {
    wins: Number,
    losses: Number
  },
  soldiers: [
    {type : Schema.Types.ObjectId, ref : 'Soldier'}
  ]
}, { collection : 'Fireteam' });

FireteamSchema.methods = {

  generateDefaultTeam: function(callback) {
    var Soldier = mongoose.model('Soldier'),
        i = 1,
        type = 'warrior',
        soldiers = [];
        
    var warrior = this.generateWarrior,
        archer = this.generateArcher,
        wizard = this.generateWizard,
        stats = this.calcStats;
    // Generate 5 soldiers for this fireteam
    // Run this in parallel for speed considerations
    async.parallel([
      function(cb) {
        warrior(1, 1, Soldier, stats, function(err, soldier){
          soldiers.push(soldier._id);
          cb(null);
        });
      },
      function(cb) {
        warrior(2, 1, Soldier, stats, function(err, soldier){
          soldiers.push(soldier._id);
          cb(null);
        });
      },
      function(cb) {
        archer(2, 1, Soldier, stats, function(err, soldier){
          soldiers.push(soldier._id);
          cb(null);
        });
      },
      function(cb) {
        archer(2, 2, Soldier, stats, function(err, soldier){
          soldiers.push(soldier._id);
          cb(null);
        });
      },
      function(cb) {
        wizard(3, 2, Soldier, stats, function(err, soldier){
          soldiers.push(soldier._id);
          cb(null);
        });
      }
    ], function(err, res){
      callback(null, soldiers);
    });
  },
  generateWarrior: function(xPos, yPos, Soldier, stats, callback) {
    var stats = stats('warrior');
    
    var warrior = new Soldier({
        name: generator.getName(),
        pointValue: 1,
        type: 'warrior',
        stats: {
          maxHP: Math.floor(Math.random() * 20 ) + 55,
          currentHP:  1,
          attack: stats.attack,
          defence: stats.defence,
          speed: stats.speed
        },
        record: {
          kills:    0,
          deaths:   0,
          dmgDone:  0,
          dmgTaken: 0,
          hpRecovered:0
        },
        gridPosition: {
          x: xPos,
          y: yPos
        },
        behaviours: [
          {
            name: 'guardAlly',
            conditions: 
              {
                target:   'neighbour',
                stat:     'HP',
                operator: 'less',
                value:    '75%'
              },
              cooldown: {
                type:     'round',
                active:   false
              }
          }
        ]
      });
      warrior.save();
      callback(null, warrior);
  },
  generateWizard: function(xPos, yPos, Soldier, stats, callback) {
    var stats = stats('wizard');
  
    var wizard = new Soldier({
        name: generator.getName(),
        pointValue: 1,
        type: 'wizard',
        stats: {
          maxHP:    Math.floor(Math.random() * 15 ) + 35,
          currentHP:  1,
          attack: stats.attack,
          defence: stats.defence,
          speed: stats.speed
        },
        record: {
          kills:    0,
          deaths:   0,
          dmgDone:  0,
          dmgTaken: 0,
          hpRecovered:0
        },
        gridPosition: {
          x: xPos,
          y: yPos
        },
        behaviours: [
           {
            name: 'allyHeal',
            conditions: 
              {
                target:   'team',
                stat:     'HP',
                operator: 'less',
                value:    '25%'
              },
              cooldown: {
                type:     'combat',
                active:   true
              }
          }
        ]
      });
      wizard.save();
      callback(null, wizard);
  },
  generateArcher: function(xPos, yPos, Soldier, stats, callback) {
    var stats = stats('archer');
  
    var archer = new Soldier({
        name: generator.getName(),
        pointValue: 1,
        type: 'archer',
        stats: {
          maxHP:    Math.floor(Math.random() * 15 ) + 30,
          currentHP:  1,
          attack: stats.attack,
          defence: stats.defence,
          speed: stats.speed
        },
        record: {
          kills:    0,
          deaths:   0,
          dmgDone:  0,
          dmgTaken: 0,
          hpRecovered:0
        },
        gridPosition: {
          x: xPos,
          y: yPos
        },
        behaviours: [
          {
            name: 'volley',
            conditions: 
              {
                target:   'mine',
                stat:     'HP',
                operator: 'greater',
                value:    '25%'
              },
              cooldown: {
                type:     'round',
                active:   true
              }
          }
        ]
      });
      archer.save();
      callback(null, archer);
  },
  // Generates default stats
  calcStats: function (type) {
    /*
      NOTE:
      There is a testbed for this code. 
      If you want to easily test this and make changes,
      visit this link:
      
      http://jsfiddle.net/ngallagher87/h6Sz4/
    */
    // Add a function that ensures no stat goes below 0
    function basement(val) {
      return val < 0 ? 0 : val;   
    }
    
    var max = 10,
        typeBonus = 5,
        attBonus = 0,
        defBonus = 0,
        spdBonus = 0,
        attack = 0,
        defence = 0,
        speed = 0;
    // Cause class to influence the type bonus
    switch (type) {
        case 'warrior': defBonus = typeBonus; break;
        case 'wizard' : spdBonus = typeBonus; break;
        case 'archer' : attBonus = typeBonus; break;
    }
    // Generate some stats!
    attack = Math.floor(Math.random() * max) + (3 + attBonus);
    var attRemainder = max - attack;
    
    defence = Math.floor(Math.random() * max) + (1 + defBonus);
    var defRemainder = max - defence;
    defence = basement(attRemainder + defence);
    
    speed = Math.floor(Math.random() * (max - 2)) + (1 + spdBonus);
    speed = basement(defRemainder + speed);
    
    var diff = (max*3) - (attack + defence + speed);
    
    var bonus = Math.floor(Math.random() * 4) + 1;
    // Apply any left over stats at random
    switch (bonus) {
        case 1: attack += diff; break;
        case 2: defence += diff; break;
        case 3: speed += diff; break;
        case 4: var s = Math.floor(diff/3);
                attack += s;
                defence += s;
                speed += s;
                break;
    }

    return {  attack: attack, 
              defence: defence, 
              speed: speed };
  }
}

/*
   Statics
*/
FireteamSchema.statics = {
  // Loads a fireteam based on an ID
  load: function (id, callback) {
    console.log("loading fireteam "+id);
    this.find({_id : id}, function(err, fireteam) {
      if (err || !fireteam) {
        console.log('Ohh no theres no fireteam with an ID of %s', id);
      }
      callback(err, fireteam[0]);
    });
  }
}

// Set the model after we define some methods
mongoose.model('Fireteam', FireteamSchema);