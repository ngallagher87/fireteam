/* 
	This defines a soldier object the red god can use

*/
var Soldier = (function(name) {
	function Soldier(name) {
		// Init instance props in constructors
		this.name = name;
		this.hp = Math.floor(Math.random()*100)+1; // Sets HP to be within 1 - 100
		this.damage = Math.floor(Math.random()*10)+10; // Sets damage to be within 10 - 20 dmg
		this.isDead = false;
		console.log("A soldier by the name of " + this.name + 
					" has been born with "+ this.hp + " hp and does " 
					+ this.damage + " damage");
	}
	
	Soldier.prototype.getName = function() {
		return this.name;
	}
	
	// Define an attack routine for a soldier
	Soldier.prototype.attack = function() {
		return this.damage;
	}
	
	// Define a way for a soldier to take damage
	Soldier.prototype.takeDamage = function(damage) {
		this.hp -= damage;
		if(this.hp <= 0) {
			this.isDead = true;
			console.log("A soldier by the name of "+ this.name + " has died");
		} else {
			console.log("A soldier by the name of "+ this.name + " has taken "+damage+" damage");
		}
	}
	
	// Getter for seeing if a soldier is dead
	Soldier.prototype.checkDead = function() {
		return this.isDead;
	}
	return Soldier;
})();

// Export the soldier for node
module.exports = Soldier;