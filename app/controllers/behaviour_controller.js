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
    Checks if the ally will guard the soldier
  */
  combatBehaviours.prototype.guardAlly = function(soldier, ally, callback) {
    if (!soldier.isDead() && !ally.isDead() && ally.hasBehaviour('guardAlly')) {
      this.isNeighbour(soldier, ally, function(isNeighbour) {
        if (isNeighbour) {
          console.log('EVENT:: ' + ally.name + ' has guarded ally ' + soldier.name + '\n');
          callback(null, ally, true);
        } else {
          // The ally won't defend this soldier
          callback(null, soldier, false);
        }
      });
    } else {
      callback(null, soldier, false);
    }
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
        
    var isNeighbour = (Math.abs(onePos.y - twoPos.y) === 1) && (onePos.x === twoPos.x);
    callback(isNeighbour);
  }
  // Return the object
  return new combatBehaviours();
})();
// Export the red god for node
module.exports = combatBehaviours;