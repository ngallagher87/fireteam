// Program entry point

// Load libraries
var express 		= require('express'),
	app 			= express(),
	async 			= require('async'),
	mongoose 		= require('mongoose'),
	fs 				= require('fs'),
	passport		= require('passport'),
	GitHubStrategy 	= require('passport-github').Strategy,
	User			= mongoose.model('User');

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

var GITHUB_CLIENT_ID = github_auth.client_id
	GITHUB_CLIENT_SECRET = github_auth.client_secret;


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(function(obj, done) {
    done(err, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log(profile);
      // Here we recieved the GitHub profile of the user.
      // Now we need to check if there is a user record tied to this email address
      // If there is, return the user profile
      // If not, create a user profile and return that
      User.findOne({ email: profile.email }, function (err, user) {
      		if (err || user === null) {
				// This user doesn't exist, so create them
				newUser = new User({
					email: profile.email,
					name: profile.name,
					displayName: profile.displayName,
					profile: profile
				});
				newUser.save();
				return done(null, newUser);
			}  else {
				// This user exists already so return them
				return done(null, user);
			}
		}
    });
  }
));

// Bootstrap models
var models_path = __dirname + '/app/models',
  	model_files = fs.readdirSync(models_path);
 
model_files.forEach(function (file) {
    require(models_path+'/'+file);
});

// Configure express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'nuclear goat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname));

var server = require("./server");
server.start(app);