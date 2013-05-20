# Battle logic

This spec defines the logic in our battle executor, herein refered to as the red god.

## Summary

Each battle follows the same core framework. Two teams are passed to the red god. The red god then determines soldier turn order, and then runs the appropriate soldier functions. Once one team has no soldiers standing, we determine winners and losers.

## Soldier functions

Each soldier can define 4 battle functions that the red god will use:

### Initiation

Initiation sets up speed tiers. Soldiers can do the following in the `initiation` function:

* `rush`
	* This increases the soldiers speed tier by 1, but applies the `rushing` debuff.
	
**Example**

	function initiation() {
		this.rush();
	}
	
	
### Standard

A soldiers `standard()` function will trigger when the red god tells the soldier it is his turn. A soldier can do the following actions with their `standard()`:

* `standard_attack()`
	* This will pick the closest enemy target and attack that soldier.
* `brutal_attack()`
	* This will pick the closest enemy target and trigger a brutal attack. Brutal attacks are stronger than standard attacks, but they cause the `reckless` debuff. 
* `counter_stance()`
	* This defers the attack action to trigger when an opponent attacks this soldier.
* `heal()`
	* This heals 25% of the units health

**Example**

	function attack() {
		if(HP < HALF_HP) {
			this.heal();
		}
		standard_attack();
	}

### Defend

When a soldier is the target of an attack, he can perform a defensive action (as long as a previous condition hasn't defined that he loose his defensive action).

* `standard_defend()`
	* This allows a soldier to mitigate some damage from an attack.
* `strong_defend()`
	* This allows a soldier to mitigate all damage from an attack, but causes the soldier to enter into the `turtled` state.
* `no_defend()`
	* This causes the soldier to defend no damage, but puts the soldier in the `bloodlust` state
	
**Example**

	function defend() {
		if(HP === FULL_HP) {
			this.no_defend();
		}
		if(HP > HALF_HP) {
			this.standard_defend();
		}
		else {
			strong_defend();
		}

	}

## Initiation roles

First we group soldiers up by their speed tier. If any soldier triggers a `rush` state, we bump up their speed tier by 1 and apply any debuffs.

