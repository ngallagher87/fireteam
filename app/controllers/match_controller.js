/**
  Module dependencies
*/
var mongoose = require('mongoose'),
    async    = require('async'),
    Fireteam = mongoose.model('Fireteam');
    
/**
  Finds an opponent!
*/
var findMatch = function findMatch(ref_id, callback) {
  // Generate a query
  var query = Fireteam
                .findOne()
                .where('_id').ne(ref_id);
  // Now generate the query results and trigger the callback
  query.select('_id')
       .exec(function findMatchQuery(err, fireteam) {
         if (err) console.log(err);
         callback(err, fireteam._id);
       });
}

/**
  Export our functions for node
*/
exports.findMatch = findMatch;