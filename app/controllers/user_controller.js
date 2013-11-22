/**
  Module dependencies
*/
var mongoose = require('mongoose'),
    async    = require('async'),
    passport  = require('passport'),
    User     = mongoose.model('User');
    
/**
  Finds a user
*/
var findID = function findUser(ref_id, callback) {
  // Generate a query
  var query = User
                .findOne()
                .where('_id').equals(ref_id);
  // Now generate the query results and trigger the callback
  query.exec(function findMatchQuery(err, user) {
          if (err || user == null) {
            err = 'No user found!';
            callback(err, null);
          } else {
            callback(err, user);
          }
        });
}

/**
  Export our functions for node
*/
exports.findID = findID;