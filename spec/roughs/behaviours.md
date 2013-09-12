# Behaviours

Soldiers will have an array of behaviours. These behaviours will affect their influence in the battle.

Behaviours will trigger based on certain combat hooks. There will be some pre-defined hooks, and when those hooks occur, we will check all soldiers for matching behaviours. If we find a behaviour that applies to the hook, we eval those behaviours. 

## Terms

* `on team` = all soldiers on team (including self)
* `ally soldier` = all soldiers on team (excluding self)
* `enemy team` = all soldiers on enemy team
* `neighbour` = soldier directly to your left or right

## Hooks

The current list of hooks will be short. This list should be easily expandable in the future.

### Attacking

* Soldier on team attacks with melee
* Soldier on team attacks with ranged
* Ally soldier attacks with melee
* Ally soldier attacks with ranged

### Defending

* Enemy team attacks with ranged
* Enemy team attacks with melee
* Neighbour gets attacked

### Special

_< None > (this will get more in the future)_

# Implementation

The red god will broadcast when these hooks occur. Soldiers at the beginning of the battle will add the appropriate listener to the appropriate hook.

When a hook fires and a match is found, the behaviour will trigger and the effects will be applied to the battle.