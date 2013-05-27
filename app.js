// Program entry point

// Load libraries
var express 	= require('express'),
	app 		= express(),
	// load async
	async 		= require('async'),
	// Load mongoose
	mongoose 	= require('mongoose'),
	// Load fs
	fs 			= require('fs');

// Bootstrap models
var models_path = __dirname + '/app/models',
  	model_files = fs.readdirSync(models_path);
 
model_files.forEach(function (file) {
    require(models_path+'/'+file);
});

// Here we're going to confgure our app
app.use(express.static(__dirname));

var server = require("./server");
server.start(app);