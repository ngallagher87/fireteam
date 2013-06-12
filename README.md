# Fireteam

:fire: :two_men_holding_hands:
> Thats two emojis for fireteam… obviously

Ideally this will become a decent game where you control a small team of soldiers to fight other soldiers, but the cool part is that the user will program the soldier AI.

To install this you need node/npm.

To install dependencies, use this:

	npm install
	
To start the app, use this:

	node app.js
	
## Module summary

Fireteam runs on `Express`. It uses `Passport` for auth (currently github is our only provider), and it uses `ejs` for templating.

`MongoDB` drives the database, and `Mongoose` is used as middleware. Fireteam also utilize `async` to help with code flow.
	
## Current routes:

If you're running this local, server = `127.0.0.1`

	http://SERVER:3000/login
	
> Authenticates a user thru GitHub (currently our only auth provider)

	http://SERVER:3000/account
	
> Renders a simple account page

	http://SERVER:3000/battle
	
> Does a small battle between Harry and Urrgramash _(spelling?)_ the Destroyer.

	http://SERVER:3000/winners
	
> Lists the current stats for each warrior

	http://SERVER:3000/save
	
> Saves 2 warriors, Hank and Urrgramash to the database. Calling this twice saves multiples of the same soldier, so I advise you to only run this once (don't worry I'll change this later to be nicer).




