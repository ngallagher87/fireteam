/*
  Defines the routes for our app
*/
var async = require('async');

module.exports = function (app) {
  // Load our soldier route
  var soldier_ctrl  = require('../app/controllers/soldier_controller'),
      battle_ctrl   = require('../app/controllers/battle_controller'),
      match_ctrl    = require('../app/controllers/match_controller'),
      user_ctrl     = require('../app/controllers/user_controller'),
      passport      = require('passport');

  // Route to do our battling
  app.get('/battle', ensureAuthenticated, function startBattle(req, res) {
    // Find a fireteam to fight using our matchmaking controller
    match_ctrl.findMatch(req.user.fireteam, function foundMatch(err, id) {
  	  if (err || typeof id === 'undefined') {
  		  res.send('Couldn\'t find a match...', 200);
  	  } else {
  	    // Now send those ID's to the battle controller and get a victor
        battle_ctrl.startBattle(req.user.fireteam, id, function displayBattle(err, victor) {
           if (err || !victor) {
             res.send('Crap', 400);
           } else {
             res.render('battle', { winner: victor });
           }
        });
      }
    });
  });
  
  app.get('/team', ensureAuthenticated, function(rew, res) {
    res.redirect('/team/first');
  });

  // Route to show winner history
  app.get(/team\/([^\/.]+)$/, ensureAuthenticated, function (req, res) {
    var name = req.params[0];
    // Load a fireteam
    battle_ctrl.loadSoldiers(req.user.fireteam, function showTeam(err, team) {
      if (err || !team) {
        res.send('Crap', 400);
      } else {
        // Find the soldier and return his index
        var index = team.map(function(soldier, i) {
          return (soldier.name.toLowerCase() === name.toLowerCase()) ? i : null;
        });
        // Remove all null entries (purify array to have only the valid soldier name
        index = index.filter(function(n){return n});
        res.render('team', { soldiers: team, soldierIndex: index[0]});
      }
    });	  
  });

  // Note:
  // Passport code taken from https: //github.com/jaredhanson/passport-github/blob/master/examples/login/app.js
  // All credits go to Jared Hanson for this auth code
  app.get('/account', ensureAuthenticated, function getAccount(req, res) {
    res.render('account', { user: req.user });
  });
  
  // POST /account
  // Updates a user account
  app.post('/account', ensureAuthenticated, function postAccount(req, res) {
    var body = req.body;
    
    user_ctrl.findID(req.user._id, function accountUser(err, user) {
      if (err || !user) {
        res.send('Crap', 400);
      }
      user.displayName = body.displayName;
      user.profile.username = body.profile.username;
      user.email = body.email;
      user.save();
      res.redirect('/account');
    });
  });

  app.get('/login', function getLogin(req, res){
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
      res.redirect('/account');
  });

  app.get('/logout', function getLogout(req, res){
    req.logout();
    res.redirect('/login');
  });

  // 404 handler
  app.get('*', function what404(req, res) {
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