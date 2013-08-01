/*
  Defines the routes for our app
*/

var async = require('async');

module.exports = function (app) {
  // Load our soldier route
  var soldier_ctrl  = require('../app/controllers/soldier_controller'),
      redGod        = require('../app/controllers/red_god'),
      passport      = require('passport');

  // Route to do our battling
  app.get('/battle', ensureAuthenticated, function(req, res) {
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
  app.get('/save', ensureAuthenticated, function(req, res) {
    soldier_ctrl.createSoldier(req, res, 1, "Hank");
    soldier_ctrl.createSoldier(req, res, 2, "Urgramesh the Destroyer");
    res.send("Created two soldiers.\n", 200);
  });

  // Route to show winner history
  app.get('/winners', ensureAuthenticated, function(req, res) {
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

  // Note:
  // Passport code taken from https: //github.com/jaredhanson/passport-github/blob/master/examples/login/app.js
  // All credits go to Jared Hanson for this auth code
  app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  });

  app.get('/login', function(req, res){
    res.render('login', { user: req.user });
  });

  // GET /auth/github
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in GitHub authentication will involve redirecting
  //   the user to github.com.  After authorization, GitHubwill redirect the user
  //   back to this application at /auth/github/callback
  app.get('/auth/github',
    passport.authenticate('github'),
    function(req, res){
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
  });

  // GET /auth/github/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the battle page.
  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/battle');
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  // 404 handler
  app.get('*', function(req, res) {
    res.send('404 - what???', 404);
  });

  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }
}