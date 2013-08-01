/* 
  The red God manages all things battle related.
  
  Here we're going to define our battle flow
*/
var RedGod = (function() {
  // Creates a red god
  function RedGod() {
    // Init instance variables here
  }
  
  // Starts the battle between the two passed soldiers
  RedGod.prototype.startBattle = function(soldier1, soldier2) {
    this.victor = null;
    console.log("The red god recieved 2 soldiers: " + 
          soldier1.name + ", and " + soldier2.name);
    // Initilize our combat variables here
    var order = [],
      damage = 0,
      i = 0,
      target = {};
    // loop until there is a sacrifice to the red god
    while(!soldier1.isDead() && !soldier2.isDead()) {
      console.log("================ Combat start ================");
      // Determine turn order
      // TODO: shell this out to a function
      if(Math.random() > 0.5) 
        order = [soldier1, soldier2];
      else
        order = [soldier2, soldier1];
      
      // The core of the combat occurs here
      for (i; i < order.length; i++) {
        damage = order[i].dealDamage();
        target = this.findTarget(order[i], order);

        // First 1 attacks 2
        target.takeDamage(damage);
        order[i].record.dmgDone += damage;
        
        console.log(target.name + " has taken " + damage + " damage");
        // Right now we only have 2 soldiers fighting
        // So if one is dead, we have a winner
        // TODO: Build a winning condition checking function
        if (target.isDead()) break;
      }
      // Reset i
      i = 0;
      console.log("=============== Turn complete =================");
      console.log(soldier1.name + " has " + soldier1.stats.currentHP + " hp left.");
      console.log(soldier2.name + " has " + soldier2.stats.currentHP + " hp left.");
    }
    // Combat has ended - find the winner
    if(soldier1.isDead()) {
      console.log(soldier2.name + " is the winner!");
      victor = soldier2.name;
      soldier2.record.kills++;
    } else {
      console.log(soldier1.name + " is the winner!");
      victor = soldier1.name;
      soldier1.record.kills++;
    }
    console.log("\n");
    // Save all record changes
    soldier1.save();
    soldier2.save();
    return victor;
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
  // Return the object
  return new RedGod();
})();
// Export the red god for node
module.exports = RedGod;
