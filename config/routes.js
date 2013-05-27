/*
	Defines the routes for our app
*/

var async = require('async');

module.exports = function (app) {
	// Load our soldier route
	var soldier_ctrl 	= require('../app/controllers/soldier_controller'),
		redGod			= require('../red_god');	 

	// Route to do our battling
	app.get('/battle', function(req, res) {
		// Parallel our call - first make 2 soldiers (requires db connection)
		async.parallel([
			function(callback) {
				var soldier1 = soldier_ctrl.loadSoldier(1, callback);
			},
			function(callback) {
				var soldier2 = soldier_ctrl.loadSoldier(2, callback);
			}
		], 
		function (err, result) {
		   // result now has both our soldiers
		   // If it doesnt, output an error
		   if (err || !result) {
			   res.send(err, 404);
		   } else {
			   res.send(redGod.startBattle(result[0], result[1]) + " has won!\n\n", 200);
		   }
		});
	});
	
	// Create some soldiers
	app.get('/save', function(req, res) {
		soldier_ctrl.createSoldier(req, res, 1, "Hank");
		soldier_ctrl.createSoldier(req, res, 2, "Urgramesh the Destroyer");
		res.send("Created two soldiers.\n", 200);
	});
		
	// Route to show winner history
	app.get('/winners', function(req, res) {
		async.parallel([
			function(callback) {
				var record1 = soldier_ctrl.showRecord(1, callback);
			},
			function(callback) {
				var redord2 = soldier_ctrl.showRecord(2, callback);
			}
		],
		function (err, result) {
			// Respond with the results
			res.send(JSON.stringify(result[0], null, 4) + "\n" + JSON.stringify(result[1], null, 4), 200);
		});
	});
	// 404 handler
	app.get('*', function(req, res) {
		res.send('what???', 404);
	});
}