/**
  Module dependencies
*/

var mongoose = require('mongoose'),
    async    = require('async'),
    red_god  = require('red_god'),
    Fireteam = mongoose.model('Fireteam');

/**
  Loads a soldier
    id is the soldier to load
*/
exports.startBattle = function(fireteam_id_1, fireteam_id_2, callback) {
  // Loads a soldier
  try {
    var loader = function(id, callback) {
      Fireteam.load(id, function (err, fireteam) {
        if (err || fireteam === null) {
          err = "No firetam with id " + id + " found.\n";
        }
        callback(err, fireteam);
      });
    }
    // Load our fireteams using the above loader
    async.parallel([
      function(callback) {
        var fireteam1 = loader(fireteam_id_1, callback);
      },
      function(callback) {
        var fireteam2 = loader(fireteam_id_2, callback);
      }
    ],
    function (err, result) {
       // Now that we have loaded both teams, battle them!
       async.parallel([
         function(callback) {
           var victor = red_god.startBattle(result[0], result[1], callback);
         },
       function (err, result) {
         callback(err, result);
       });
    });
  }
  catch(e) {
    callback("Error loading fireteams", null);
  }
}

