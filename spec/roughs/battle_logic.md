# Round structure

Each soldier will have 3 actions per combat round

* Initiation
* Target
* Standard

# Initiation

This is where a soldier's turn order is sorted out. Soldiers will have the ability to influence their turn order in combat each round.

Every soldier has a speed stat. This stat goes from `0 … n`. The higher the number the faster the soldier.

Turn order is determined by taking every soldiers speed number and ordering them descending. In the event of a speed tie (2 soldiers have the same speed stat), we flip a coin.

### Example

Say we have 2 teams, each with 3 soldiers a piece: one warrior, one wizard, and one archer. Below is a table illustrating their speed stats:

| Class | Team 1 | Team 2 |
| ---- | ---- | ----| 
| Warrior| 5 | 6 |
| Wizard | 1 | 1 |
| Archer | 3 | 2 |

As we can see, the wizards share the same speed stat. Here we would preflight generating the round stack by iterating thru each combatant, finding speed ties, and flipping a coin to determine the round placement.

	for each combatant {
		if this.combatant.speed = another.combatant.speed {
			if flipCoint() === heads
				roundOrder.push(this.combatant)
				roundOrder.push(another.combatant)
			else
				roundOrder.push(another.combatant)
				roundOrder.push(this.combatant)
		}
	}
> This is obviously pseudo-code: I'm too lazy to write this out in js right now

Based on the above, the order round order would look like this:
	
	[
		"warrior team 2",
		"warrior team 1",
		"archer team 1",
		"archer team 2",
		"wizard team 2",   <-- assuming he won the coin flip
		"wizard team 1"
	]
	
Using FIFO on this array we now know who is going first.

## Soldier overrides

Soldiers will have ways to influence their speed stat during combat. Each soldier has a function that allows them to speed up or slow down depending on context.

The basic concept is slowing down allows for the sldier to be more defensive, and rushing allows for more offense.

The red god will apply these buffs/debuffs for a soldier - all they have to do is say how they plan to act this battle turn.

## Example

Here is a simple example of how a soldier would apply his initiation turn:

	if (hp < 15) {
		return SLOW_DOWN;
	}
	if (hp === maxHP) {
		return RUSH;
	}
	return STANDARD;

I think that's pretty straight forward. I'll define another spec that shows exactly what a soldier can do, but this works in this example.

Note that `SLOW_DOWN` and `RUSH` refer to integer constants. That is, all this function is really doing is returning 0, 1, or 2. In fact, since I'm letting end users write these functions, if these dont return that info then the we will refuse the soldier his turn.

# Target

Todo: put targeting info here

# Standard

Todo: put standard info here
