// This defines our basic server structure
// We load some modules here, and do some routing.
function start() {
	var express 	= require('express'),
		app 		= express(),
		// Defines our soldier module
		soldier	= require('./soldier'),
		// Create a red god module
		redGod 		= require('./red_god');
		
	// Here we're going to confgure our app
	app.use(express.static(__dirname));
	app
		// Route to do our battling
		.get('/battle', function(req, res) {
			// Create 2 soldiers for us
			var soldier1 = new soldier("Harry"),
				soldier2 = new soldier("Urrgramash the Destroyer");

			res.send(redGod.startBattle(soldier1, soldier2) + " has won!\n\n", 200);
		})
		// Route to show winner history
		.get('/winners', function(req, res) {
			res.send(redGod.showWinners(), 200);
		})
		// 404 handler
		.get('*', function(req, res) {
			res.send('what???', 404);
		})
		.listen(3000, '127.0.0.1');
		
	console.log('Listening on port 3000');
}
exports.start = start;


 