/**
  Module dependencies
*/
var mongoose = require('mongoose'),
    async    = require('async'),
    redgod   = require('./red_god_controller.js'),
    Fireteam = mongoose.model('Fireteam'),
    Soldier  = mongoose.model('Soldier');
    
/**
Loads an array of soldiers from a fireteam
*/
var loadSoldiers = function loadSoldier(fireteam_id, callback) {
  var team = null;

  Fireteam.load(fireteam_id, function (err, fireteam) {
      if (err || fireteam === null) {
        err = "No firetam with id " + id + " found.\n";
      } else {
        team = fireteam;
      }
  });

  if (team != null) {
    var soldiers = [],
        i = 0,
        err = null;
    for (i; i < team.soldiers.length; i++) {
      soldiers.push(Soldier.load(team.soldiers[i]));
    }
    if (soldiers.length === 0) {
      err = 'No soldiers loaded.';
    }
    team = soldiers;
  }
  callback(err, team);
}

/**
  Loads a soldier
    id is the soldier to load
*/
var startBattle = function startBattle(fireteam_id_1, fireteam_id_2, root_cb) {
  // Loads a soldier
  //try {
    // Load our fireteams using the above loader
    async.parallel([
      function(callback) {
        var fireteam1 = loadSoldiers(fireteam_id_1, callback);
      },
      function(callback) {
        var fireteam2 = loadSoldiers(fireteam_id_2, callback);
      }
    ],
    function (err, result) {
       // Now that we have loaded both teams, battle them!
       async.parallel([
         function(callback) {
           var victor = redgod.startBattle(result[0], result[1], callback);
         }
       ],
       function (err, result) {
         root_cb(err, result[0]);
       }
      );
    }
  )}
  //catch(e) {
  //  console.log(e);
  //  root_cb("Error loading fireteams", null);
  //}
//}

/**
  Export our functions for node
*/
exports.loadSoldiers = loadSoldiers;
exports.startBattle = startBattle;