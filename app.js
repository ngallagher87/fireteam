// Program entry point

// Load libraries
var express   = require('express'),
    app       = express(),
    async     = require('async'),
    mongoose  = require('mongoose'),
    fs        = require('fs'),
    passport  = require('passport'),
    ghStrat   = require('passport-github').Strategy,
    engine    = require('ejs-locals');

// Bootstrap models
var models_path = __dirname + '/app/models',
    model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
    require(models_path+'/'+file);
});

var user_ctrl = require('./app/controllers/user_controller');

// Load the github client ID and client secret values
// NOTE: These must exist for the app to work.
// They are not in source so ensure you create them or get them from someone!
try {
  var github_auth = JSON.parse(fs.readFileSync('github_auth.json'));
} catch (e) {
  console.log(e);
  console.log('ERROR! GitHub auth file missing: cannot continue. '+
        'Supply a github auth file that has client id and secret id to allow user login. '+
        '\n\nIf you ask super nice, ngallagher87 will give them to you.');
  process.exit(1);
}

var GITHUB_CLIENT_ID = github_auth.client_id,
    GITHUB_CLIENT_SECRET = github_auth.client_secret;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user_ctrl.findID(id, function(err, user) {
    done(err, user);
  })
});

// Use the ghStrat within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new ghStrat({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
      process.nextTick(function () {
      User = mongoose.model('User');
      // Here we recieved the GitHub profile of the user.
      // Now we need to check if there is a user record tied to this email address
      // If there is, return the user profile
      // If not, create a user profile and return that
      User.findOne({ email: profile.emails[0].value  }, function (err, foundUser) {
          if (err || foundUser === null) {
            console.log('creating new user/fireteam');
          
          console.log(profile);
          // Generate a display name
          var displayName = profile.displayName;
          if (typeof displayName === 'undefined')
            displayName = profile.name + '\'s';
          // This user doesn't exist, so create them
          newUser = new User({
            email: profile.emails[0].value,
            name: profile.name,
            displayName: displayName,
            profile: profile
          });
          // Create a fireteam for the new user
          Fireteam = mongoose.model('Fireteam');
          var newFire = new Fireteam({
            name: newUser.displayName + '\'s Battalion',
            stats: {
              wins: 0,
              losses: 0
            }
          });
          newFire.generateDefaultTeam(function(err, soldiers){
            // Wait til we generate the team until we save the user
            console.log(soldiers);
            newUser.fireteam = newFire._id;
            newFire.soldiers = soldiers;
            newFire.save();
            newUser.save();
            return done(null, newUser);
          });
        }  else {
          console.log('return found user');
          // This user exists already so return them
          return done(null, foundUser);
        }
      });
    });
  }
));

// Configure express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('.html', engine);
app.use(express.logger());
app.use(express.cookieParser('nuclear goat'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session());
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname));

var server = require("./server");
server.start(app);