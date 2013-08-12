/*
  The red God manages all things battle related.

  Here we're going to define our battle flow
*/
var red_god = (function() {
  // Creates a red god
  function red_god() {
    // Init instance variables here
  }

  // Starts the battle between the two passed fireteams
  red_god.prototype.startBattle = function startBattle(fireteam1, fireteam2, callback) {
    var victor = "Nathan wins!";
    callback(null, victor);
  }
  // Finds the opponent this soldier would target
  red_god.prototype.findTarget = function findTarget(soldier, order) {
    // Right now this basically finds the first soldier that isnt this soldier
    // TODO: put real logic here, haha
    var i = 0;
    for (i; i < order.length; i++) {
      if (soldier.name !== order[i].name)
        return order[i];
    }
  }
  /*
    Checks if an array of soldiers has been defeated yet or not
  */
  red_god.prototype.checkIfDefeated = function checkIfDefeated(soldiers) {
    var i = 0,
        dead = 0;
    for (i; i < soldiers.length; i++) {
      if (soldiers[i].isDead) {
        dead++;
      }
    }
    return dead === soldiers.length;
  }

  // Return the object
  return new red_god();
})();
// Export the red god for node
module.exports = red_god;
