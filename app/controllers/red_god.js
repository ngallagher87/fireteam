/*
  The red God manages all things battle related.

  Here we're going to define our battle flow
*/
var RedGod = (function() {
  // Creates a red god
  function RedGod() {
    // Init instance variables here
  }

  // Starts the battle between the two passed fireteams
  RedGod.prototype.startBattle = function(fireteam1, fireteam2, callback) {
    console.log("The red god recieved 2 fireteams: " +
          fireteam1.name + ", and " + fireteam1.name);
    // Initilize our combat variables here
    var order = [],
        damage = 0,
        i = 0,
        target = {},
        team1 = [],
        team2 = [],
        victor = null;
    // Load our teams here
    fireteam1.loadSoldiers(function(err, team) {
      if (err) {
        throw new Exception('Couldn\'t load fireteam '+ fireteam1.name);
      }
      team1 = team;
    });
    fireteam2.loadSoldiers(function(err, team) {
      if (err) {
        throw new Exception('Couldn\'t load fireteam '+ fireteam2.name);
      }
      team2 = team;
    });
    // Keep battling until a team dies
    // TODO: make this a real cobat sequence!
    // while(!this.checkIfDefeated(team1) && !this.checkIfDefeated(team2)) {
    while(victor == null) {
      console.log("================ Combat start ================");
      // Determine turn order
      // TODO: shell this out to a function
      if(Math.random() > 0.5)
        victor = fireteam1.name;
      else
        victor = fireteam2.name;

      // The core of the combat occurs here
      // TODO: put in real combat!

      console.log("=============== Turn complete =================");
    }
    // Combat has ended - find the winner

    // Save all record changes
    // soldier1.save();
    // soldier2.save();
    callback(null, victor);
  }
  // Finds the opponent this soldier would target
  RedGod.prototype.findTarget = function(soldier, order) {
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
  RedGod.prototype.checkIfDefeated: function(soldiers) {
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
  return new RedGod();
})();
// Export the red god for node
module.exports = RedGod;
