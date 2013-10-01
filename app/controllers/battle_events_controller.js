/*
  Battle events is an arm of the red god - it handles our in-battle events
*/
var mongoose    = require('mongoose'),
    async       = require('async'),
    events      = require('events'),
    combatBehaviours  = require('./behaviour_controller'); 

var battleEvents = (function() {

  function battleEvents() {
    // Init instance variables here
    events.EventEmitter.call(this);
    this.one = {};
    this.two = {};
    
    function initContainers(team) {
	    team.guardAlly = [];
	    team.volley = [];
	    team.allyHeal = [];
	    return team;
    }
    this.one = initContainers(this.one);
    this.two = initContainers(this.two);
  }

  battleEvents.prototype.init = function(teamOne, teamTwo, callback) {
    // Create a function that will store all our behaviours 
    function storeBehaviours(soldier, team, stored) {
      async.each(soldier.behaviours, function(behaviour, cb) {
        switch (behaviour) {
          case 'guardAlly':   team.guardAlly.push(soldier); break;
          case 'volley':      team.volley.push(soldier); break;
          case 'allyHeal':    team.allyHeal.push(soldier); break;
        }
        cb(null);
      }, function(err) {
        stored(null);
      });
    }
    var self = this;
    // Store our teams behaviours in collections
    async.parallel([
      function(callb) {
        // Here we'll note down any behaviours.
        async.each(teamOne, function(soldier, cb) {
            storeBehaviours(soldier, self.one, function(err) {    
              cb(null);
            });
        }, function(err) {
          // Done with this collection
          callb(null);
        });
      },
      function(callb) {
        // Here we'll note down any behaviours.
        async.each(teamTwo, function(soldier, cb) {
            storeBehaviours(soldier, self.two, function(err) {    
              cb(null);
            });
        }, function(err) {
          // Done with this collection
          callb(null);
        });
      }
    ], function(err, res){
      callback(err);
    });
  }
  battleEvents.prototype.check = function(behaviour, soldier, side, callback) {
    // Check for defender logic
    if (behaviour === 'guardAlly' && !soldier.isDead()) {
      var defender = null; 
      async.each(side, function(ally, cb) {
        // Ensure we dont guardAlly ourself!
        //if (ally._id !== soldier._id) {
          combatBehaviours.guardAlly(soldier, ally, function(err, target, guard) {
            if (guard) {
              defender = target;
            }
            cb(null);
          });
       // } else cb('Cannot defend self');
      }, function(err) {
        if (defender == null) callback(err, soldier);
        else callback(err, defender);
      });
    } else {
      callback(null, soldier);
    }
  }
  /*
    Checks if an array of soldiers has been defeated yet or not
  */
  battleEvents.prototype.doSomething = function() {
    
  }
  // Apply the eventEmitter prototype here
  battleEvents.prototype.__proto__ = events.EventEmitter.prototype;
  // Return the object
  return new battleEvents();
})();
// Export the red god for node
module.exports = battleEvents;