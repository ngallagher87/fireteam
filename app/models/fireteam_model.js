/*
  This defines the Fireteam Schema/Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
        generator = require('../utils/name_generator'),
        i = 1,
        type = 'warrior';
    // Generate 5 soldiers for this fireteam
    // TODO: Make a function per soldier type for generation
    // Probably house that in the soldier model?
    for (i; i <= 5; i++) {
      // Generate types
      if (i < 3) { 
        this.generateWarrior(i % 3, Math.round(i / 2), function(err, soldier){
          this.soldiers.push(soldier._id);
        });
      }
      if (i > 3 && i < 6) { 
        this.generateArcher(i % 3, Math.round(i / 2), function(err, soldier){
          this.soldiers.push(soldier._id);
        });
      }
      if (i === 5) { 
        this.generateWizard(i % 3, Math.round(i / 2), function(err, soldier){
          this.soldiers.push(soldier._id);
        });
      }
    }
    return callback(null, this.soldiers);
  },
  generateWarrior: function(xPos, yPos, callback) {
    var stats = this.calcStats('warrior');
    
    var warrior = new Soldier({
        name: generator.getName(),
        pointValue: 1,
        type: type,
        stats: {
          maxHP:    Math.floor(Math.random() * 20 ) + 55,
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
          'guardAlly'
        ]
      });
      warrior.save();
      callback(null, warrior);
  },
  generateWizard: function(xPos, yPos, callback) {
    var stats = this.calcStats('wizard');
  
    var wizard = new Soldier({
        name: generator.getName(),
        pointValue: 1,
        type: type,
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
          'allyHeal'
        ]
      });
      wizard.save();
      callback(null, wizard);
  },
  generateArcher: function(xPos, yPos, callback) {
    var stats = this.calcStats('archer');
  
    var archer = new Soldier({
        name: generator.getName(),
        pointValue: 1,
        type: type,
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
          'volley'
        ]
      });
      archer.save();
      callback(null, archer);
  },
  // Generates default stats
  calcStats: function(type) {
     var max = 10,
        attack = 0,
        defence = 0,
        speed = 0;

    attack = Math.floor(Math.random() * max) + 1;
    var attRemainder = max - attack;
    
    defence = Math.floor(Math.random() * max) + 1;
    var defRemainder = max - defence;
    defence += attRemainder;
    
    speed = Math.floor(Math.random() * max) + 1;
    speed += defRemainder;
    
    var diff = (max*3) - (attack + defence + speed);
    
    var bonus = Math.floor(Math.random() * 4) + 1;
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
    var typeBonus = 10;
    switch (type) {
      case 'warrior': defence += typeBonus; break;
      case 'wizard': speed += typeBonus/2; attack += typeBonus/2; break;
      case 'archer': attack += typeBonus; break;
    }
    
    return {attack: attack, defence: defence, speed: speed};
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