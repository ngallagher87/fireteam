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
      if (i < 3) type = 'warrior';
      if (i > 3 && i < 6) type = 'archer';
      if (i === 5) type = 'wizard';

      var soldier = new Soldier({
        name:     generator.getName(),
        pointValue: 1,
        type: type,
        stats: {
          level:    1,
          maxHP:    40,
          currentHP:  40,
          minDamage:  10,
          maxDamage:  15,
          exp:    0
        },
        record: {
          kills:    0,
          deaths:   0,
          dmgDone:  0,
          dmgTaken: 0,
          hpRecovered:0
        },
        gridPosition: {
          x: i % 3,
          y: Math.round(i / 2)
        }
      });
      soldier.save();
      this.soldiers.push(soldier._id);
    }
    return callback(null, this.soldiers);
  },
}

/*
   Statics
*/
FireteamSchema.statics = {
  // Loads a fireteam based on an ID
  load: function (id, callback) {
    console.log("loading fireteam "+id);
    this.find({_id : id}, function(err, fireteam) {
      callback(err, fireteam);
    });
  }
}

// Set the model after we define some methods
mongoose.model('Fireteam', FireteamSchema);