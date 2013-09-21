/*
  Battle events is an arm of the red god - it handles our in-battle events
*/
var mongoose  = require('mongoose'),
    async     = require('async');

var combatBehaviours = (function() {

  function combatBehaviours() {
    // Init instance variables here
  }
  /*
    Causes the soldier to defend the ally
  */
  combatBehaviours.prototype.guardAlly = function(soldier, ally, callback) {
    this.isNeighbour(soldier, ally, function(isNeighbour) {
      if (isNeighbour) {
        console.log('\nEVENT\n' + soldier.name + ' has guarded ally ' + ally.name);
        callback(null, soldier, true);
      } else {
        // Don't guard the ally!
        callback(null, ally, false);
      }
    });
  }
  /*
    Causes all archers in the array to attack
  */
  combatBehaviours.prototype.volley = function(archers, callback) {
    
  }
  /*
    Causes the soldier to heal the ally
  */
  combatBehaviours.prototype.allyHeal = function(soldier, ally, callback) {
    
  }
  
  /*
    HELPER FUNCTIONS
  */
  /*
    Checks if two soldiers are neighbours
  */
  combatBehaviours.prototype.isNeighbour = function(one, two, callback) {
    var onePos = one.getPosition(),
        twoPos = two.getPosition();
    if (Math.abs(onePos.x - twoPos.x) > 1) {
      callback(true);
    } else {
      callback(false);
    }
  }
  // Return the object
  return new combatBehaviours();
})();
// Export the red god for node
module.exports = combatBehaviours;