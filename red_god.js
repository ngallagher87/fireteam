/* 
	The red God manages all things battle related.
	
	Here we're going to define our battle flow
*/
var RedGod = (function() {
		function RedGod() {
		// Init instance variables here
		this.harryWins = 0;
		this.destroyerWins = 0;
	}
	
	// Starts the battle between the two passed soldiers
	RedGod.prototype.startBattle = function(soldier1, soldier2) {
		this.victor = null;
		console.log("The red god recieved 2 soldiers: " + 
					soldier1.getName() + ", and " + soldier2.getName());
	
		// loop until there is a sacrifice to the red god
		while(!soldier1.checkDead() && !soldier2.checkDead()) {
			// Add some randomness to the combat
			if(Math.random() > 0.5) {
				// First 1 attacks 2
				soldier2.takeDamage(soldier1.attack());
				// Then 2 attacks 1
				soldier1.takeDamage(soldier2.attack());
			} else {
				// First 1 attacks 2
				soldier1.takeDamage(soldier2.attack());
				// Then 2 attacks 1
				soldier2.takeDamage(soldier1.attack());
			}
			console.log("A combat turn has been completed");
		}
		// Combat has ended - find the winner
		if(soldier1.checkDead()) {
			console.log(soldier2.getName() + " is the winner!");
			victor = soldier2.getName();
			this.destroyerWins++;
		} else {
			console.log(soldier1.getName() + " is the winner!");
			victor = soldier1.getName();
			this.harryWins++;
		}
		return victor;
	}
	
	// Shows the victors
	RedGod.prototype.showWinners = function() {
		return "Harry wins: " + this.harryWins + "\nDestroyer wins: " + this.destroyerWins + "\n";
	}
	// Return the object
	return new RedGod();
})();
// Export the red god for node
module.exports = RedGod;
