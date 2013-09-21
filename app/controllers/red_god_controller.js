/*
  The red God manages all things battle related.

  Here we're going to define our battle flow
*/
var mongoose      = require('mongoose'),
    async         = require('async'),
    battleEvents  = require('./battle_events_controller');

var red_god = (function() {
  // Creates a red god
  function red_god() {
    // Init instance variables here
   
  }

  // Starts the battle between the two passed fireteams
  red_god.prototype.startBattle = function(fireteam1, fireteam2, endBattle) {
    // Battle loop is here!
    // Determine turn order
    var finished = false,
        combatLog = [],
        roundCounter = 1,
        winner = 0,
        roundLength = Math.max(fireteam1.length, fireteam2.length);
        // Store function scope for async
        turnOrder = this.getTurnOrder,
        findTarget = this.findTarget,
        isDefeated = this.checkIfDefeated,
        battleEvents.init(fireteam1, fireteam2, begin);
    
    // Function to handle our battle logic
    function begin(err) {
      console.log('Combat started');
      async.whilst(
        function () { return finished == false; },
        function (roundCallback) {
          var teamOne = turnOrder(fireteam1),
              teamTwo = turnOrder(fireteam2),
              teamOneUsed = [],
              teamTwoUsed = [],
              round = true,
              turnCount = 0;
          console.log('\n==========\nNew round beginning\n==========\n');
          async.whilst(
            function () { return turnCount < roundLength; },
            function (turnCallback) {
              turnCount++;
              // Get the current soldiers for this turn, then store them in the used array
              var attackerOne = teamOne.shift(),
                  attackerTwo = teamTwo.shift();
              teamOneUsed.push(attackerOne);
              teamTwoUsed.push(attackerTwo);

              // Init order variables
              var first = null,
                  second = null,
                  order = [],
                  fullTeamOne = fireteam1.concat(teamOneUsed),
                  fullTeamTwo = fireteam2.concat(teamTwoUsed);
              // Sort out who goes when
              var oneFirst = false;
              // First we check if the first soldier is faster
              if (attackerOne.stats.speed > attackerTwo.stats.speed) 
                oneFirst = true;
               // If they have the same speed, do a speed tie check (50/50 chance to go first)
              else if (attackerOne.stats.speed === attackerTwo.stats.speed) 
                oneFirst = Math.round(Math.random() * 100) > 50;
              // He is slower, so he goes 2nd
              else 
                oneFirst = false;
              
              // Now apply the current turn order here
              if (oneFirst) {
                first = attackerOne;
                second = attackerTwo;
                order = [fullTeamTwo, fullTeamOne];
              } else {
                first = attackerTwo;
                second = attackerOne;
                order = [fullTeamOne, fullTeamTwo];
              }
              // Find targets 
              firsts_enemy = findTarget(first, order[0]);
              seconds_enemy = findTarget(second, order[1]);
              
              // Create a function we can run to see if there is a winner
              function evalVictory() {
                if (!finished) {
                  // Check if team one is defeated
                  isDefeated(fullTeamOne, function(err, defeated) {
                    if (defeated) {
                      finished = true;
                      winner = 1;
                      console.log('Team 1 is the winner!');
                      roundCallback(null);
                    }
                    else {
                      // Check if team 2 is defeated
                      isDefeated(fullTeamTwo, function(err, defeated) {
                        if (defeated) {
                          finished = true;
                          winner = 2;
                          console.log('Team 2 is the winner!');
                          roundCallback(null);
                        }
                      });
                    }
                  });
                } 
              }
              // Create a combat function for our soldiers to duke it out in!
              function dukeItOut(attacker, defender, attSide, defSide) {
                if (!attacker.isDead()) {
                  // Attacker does damage
                  var attack = attacker.dealDamage(function(dmg) {
                    // TODO: we need to see if the defender has a neighbour that will defend him.
                    // To do this, we need to ask the battle_event handler if this is possible.
                    battleEvents.check('guardAlly', defender, defSide, function(err, target) {
                       // We have dmg amount, so apply that to the soldier
                      target.takeDamage(dmg, function(defendedDmg) {
                        // Defender has had a chance to defend, store dmg amount for soldier
                        attacker.statDamage(defendedDmg);
                        console.log(attacker.name + ' deals ' + 
                                    defendedDmg + ' to ' + target.name);
                      });
                      if (target.isDead()) { 
                        console.log(target.name + ' has been slain by ' + attacker.name);
                        // On death, see if there is a winner or not
                        evalVictory();
                      }
                    });
                  });
                }
              }
              // Run our battle commands in series to prevent silly things
              async.series([
                function(callback) {
                  team = oneFirst ? 1 : 2;
                  if (typeof first === 'undefined' || typeof firsts_enemy === 'undefined' || finished)
                    evalVictory();
                  else
                    callback(null, dukeItOut(first, firsts_enemy, order[0], order[1]));
                },
                function(callback) {
                  team = oneFirst ? 2 : 1;
                  if (typeof second === 'undefined' || typeof seconds_enemy === 'undefined' || finished)
                    evalVictory();
                  else
                    callback(null, dukeItOut(second, seconds_enemy, order[1], order[0]));
                },
                function(callback) {
                  callback(null, evalVictory());
                }
              ], function(err, res) {
                // Combat is done, so head back to the top of the loop
                turnCallback(err);
              });
            },
            // Round is complete
            function (err) {
              console.log('Round '+ roundCounter +' is over');
              roundCounter++;
              fireteam1 = teamOneUsed;
              fireteam2 = teamTwoUsed;
              // Loop to a new round
              roundCallback(err);
            }
          );
        },
        // Combat is complete
        function (err) {
          // Battle loop is finished!
          // Round loop is complete
          combatLog = 'Winner is team #'+winner; //TODO: implement combat log and return it correctly
          // Trigger the callback if we're done
          console.log('This combat took ' + roundCounter + ' rounds to complete.');
      	  endBattle(null, combatLog);
        }
      );
    }
  }
  // Generates turn order for a combat round
  red_god.prototype.getTurnOrder = function(team) {
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
  red_god.prototype.findTarget = function(soldier, team) {
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
  red_god.prototype.checkIfDefeated = function(team, callback) {
    var dead = 0,
        isDefeated = false;
    async.each(team, function(soldier, cb) {
       if (soldier.isDead()) {
        dead++;
        isDefeated = (dead == team.length);
      }
      cb(null);
    }, function (err) {
      callback(err, isDefeated);
    });
  }
  // Return the object
  return new red_god();
})();
// Export the red god for node
module.exports = red_god;