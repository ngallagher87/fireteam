# Battle renderer

We're going to need a way for people to see the battles happen. The battles will not be real time - they will be a visual representation of the battle that the server has performed.

## Flow

Below illustrates the basic interaction for battles:

* A user wants to battle
* He either challenges a friend, or finds an opponent at random
* The server gets both users and passess their Fireteams to the redgod
* The redgod performs the battle, saves the battle events, and sends the event log to the client
* The client's battle renderer then loads the assets/battle events in its battle renderer
* The user is then shown what happened in the battle

This approach has the benefits of simpler client/server interactions; however, it also means the user doesn't need to watch the battle to see the results. This is less desirable as we want the battles to be engaging and fun to watch.

## Prevention

In order to not cheapen the battles, we'll want to add some ways to prevent the user from skipping the battle. Here are a few approaches:

1. Battle results are only awarded if the user watches the whole battle (send ACK at end of battle)
	* This implies that people loosing in a battle could close the browser, re-open it, and never watch it to completion.
	* We could deter this behaviour by not allowing new battles to occur if you haven't completed your current battle.
	
2. Give end of battle bonuses for completing the battle
	* This would be a small in game reward for observing battles - enforcing the completion of battles.
	
We don't want to expose the idea that "your battle is already complete," and the battles should be exiting/fun enough for people to not want to skip them anyways. The above prevention methods are merely for an edge case of users that I feel we still need to protect.

## Rendering

While the server is generating battle results, we should be loading the necessary sprites. This will be the handshake between the server:

1. Client requests a battle
2. Server grabs both fireteams
3. Server sends asset list to client
	* The asset list is a list of spritesheets/graphics to load
4. The client starts loading art resources used in the battle
5. The server generates battle results
6. The server sends the battle log to the client
7. THe client starts rendering the battle for the user