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
    // Battle loop is here!
    // Determine turn order
    var finished = false,
        combatLog = [],
        roundCounter = 0;
    
    while (!finished) {
      // Get a stack for turn order
      var teamOne = this.getTurnOrder(fireteam1),
          teamTwo = this.getTurnOrder(fireteam2),
          round = true;
      
      while (round) {
        // Loop thru order
        var attackerOne = teamOne.shift(),
            attackerTwo = teamTwo.shift();
        
        var first = null,
            second = null,
            order = [];
        // Sort out who goes when
        if (attackerOne.stats.speed > attackerTwo.stats.speed) {
          first = attackerOne;
          second = attackerTwo;
          order = [fireteam2, fireteam1];
        } else {
          first = attackerTwo;
          second = attackerOne;
          order = [fireteam1,fireteam2];
        }
        // Find targets
        firsts_enemy = this.findTarget(first, order[0]);
        seconds_enemy = this.findTarget(second, order[1]);
        
        // Create a combat function for out soldiers to duke it out in!
        function dukeItOut(attacker, defender) {
          if (!attacker.isDead()) {
            var attack = attacker.dealDamage();
            defender.takeDamage();
            combatLog[] = attacker.name + ' deals ' + attack + ' to ' + defender.name;
            if (defender.isDead()) 
              combatLog[] = defender.name ' has been slain by ' + attacker.name;
          }
        }
        // Perform actions
        dukeItOut(first, firsts_enemy);
        dukeItOut(second, seconds_enemy);
        // Check to see if this round is done
        round = teamOne.length == 0 && teamTwo.length == 0;
        
        if (!round) roundCounter++;
      }
      // Check if a team is defeated
      finished = this.checkIfDefeated(fireteam1) || this.checkIfDefeated(fireteam2);
    }
    combatLog[] = 'This combat took ' + roundCounter + ' rounds to complete';
    callback(null, combatLog);
  }
  
  // Generates turn order for a combt round
  red_god.prototype.getTurnOrder(team) {
    function compare(a,b) {
      if (a.stats.speed < b.stats.speed)
         return -1;
       if (a.stats.speed > b.stats.speed)
         return 1;
      return 0;
    }
	  return team.sort(compare);
  }
  
  // Finds the opponent this soldier would target
  red_god.prototype.findTarget = function findTarget(soldier, team) {
    // Right now this basically finds the first enemy that isn't dead...
    // TODO: put real logic here, haha
    var i = 0;
    for (i; i < team.length; i++) {
      if (!team[i].isDead())
        return team[i];
    }
  }
  /*
    Checks if an array of soldiers has been defeated yet or not
  */
  red_god.prototype.checkIfDefeated = function checkIfDefeated(team) {
    var i = 0,
        dead = 0;
    for (i; i < team.length; i++) {
      if (team[i].isDead) {
        dead++;
      }
    }
    return dead === team.length;
  }

  // Return the object
  return new red_god();
})();
// Export the red god for node
module.exports = red_god;
