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
    var self = this;
    if (!soldier.isDead() && !ally.isDead()) {
      ally.hasBehaviour('guardAlly', function(err, hasGuard) {
        if (hasGuard) {
          self.isNeighbour(soldier, ally, function(isNeighbour) {
              if (isNeighbour) {
                ally.getBehaviour('guardAlly', function(err, behaviour) {
                  // Check if the allys conditions allow for guarding this soldier
                  var willGuard = self.checkBehaviour(behaviour, ally, soldier, null, null);
                  if (willGuard) {
                    // The ally will guard this soldier
                    console.log('EVENT:: ' + ally.name + ' has guarded ally ' + soldier.name + '\n');
                    callback(null, ally, true);
                  } else {
                    // The ally won't defend this soldier
                    callback(null, soldier, false);
                  }
                });
              } else {
                // The ally and the soldier are not neighbours
                callback(null, soldier, false);
              }
            });
          } else {
            // Ally isn't this soldiers neighbour
            callback(null, soldier, false);
          }
      });
    } else {
      // One of these guys are dead! We dont guard dead people
     callback(null, soldier, false);
    }
  }
  /*
    Causes all archers in the array to attack
  */
  combatBehaviours.prototype.volley = function(archers, callback) {
    
  }
  /*
    Causes the wizard to heal the ally
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
  /*
    Validates conditions
    
    Test harness: http://jsfiddle.net/ngallagher87/ftsQN/
  */
  combatBehaviours.prototype.checkBehaviour = function(behaviour, self, neighbour, allySide, enemySide) {
    var context = {},
        // Stores comparison functions for dynamic usage
        ops = {
          'greater':  function(a, b) { return a > b},
          'less':     function(a, b) { return a < b},
          'equal':    function(a, b) { return a == b},
          'not equal':function(a, b) { return a != b}
        };
    // Populates the target
    switch (behaviour.target) {
      case 'self': context.target = self; break;
      case 'neighbour': context.target = neighbour; break;
      default: context.target = null; break;
    }
    // Populates the stat to compare
    switch (behaviour.stat) {
      case 'hp':      context.stat = context.target.stats.currentHP / context.target.stats.maxHP; break;
      case 'attack':  context.stat = context.target.stats.attack; break;
      case 'defence': context.stat = context.target.stats.defence; break;
      case 'speed':   context.stat = context.target.stats.speed; break;
      default: context.stat = null; break;
    }
    // Populate behaviour
    switch (behaviour.value) {
      case '100%':  context.value = 1; break;
      case '75%':   context.value = 0.75; break;
      case '50%':   context.value = 0.5; break;
      case '25%':   context.value = 0.25; break;
      case '0%':    context.value = 0; break;
      case 'mine':
        // Using 'mine' is contextual
        // Map mine to the stat, and use the self object to get variables
        switch (behaviour.stat) {
          case 'hp':      context.value = self.stats.currentHP / self.stats.maxHP; break;
          case 'attack':  context.value = self.stats.attack; break;
          case 'defence': context.value = self.stats.defence; break;
          case 'speed':   context.value = self.stats.speed; break;
          default: context.value = null; break;
        }
        break;
    }
    // Takes all the contextual variables and compares them
    return ops[behaviour.conditions.operator](context.stat, context.value);
  }
  // Return the object
  return new combatBehaviours();
})();
// Export the red god for node
module.exports = combatBehaviours;