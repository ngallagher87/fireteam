# Data model

We haev a few data components, and below is how they are stored:

	|-----------|	
	|	User	|-----------|
	|-----------|	|-----------|
		 |			|  Barracks |
		 |			|-----------|	
	|-----------|			|
	|  Fireteam |			|
	|-----------|			|
			|				|
			|		|-----------|
			|-------|  Soldier  |
					|-----------|

## User
					
`User` defines the user information - username, login, all that stuff.
	* `User` has a reference to a `Fireteam` document
	* `User` has a reference to a `Barracks` document
	
## Barracks	

`Barracks` stores `Soldier` documents for a user.
	* `Barracks` has a collection of `Soldier` documents
	
## Fireteam

`Fireteam` stores a collection of `Soldiers` as well as statistical information (wins/losses).

## Soldier

`Soldier` stores information for a soldier.

