/* 
  This generates random names for our little soldier buddies
*/
var fs = require('fs'),
    file = '/names.txt';

var NameGenerator = (function() {
  // Loads names from a file into an array (splits on \n and ,)
  function NameGenerator() {
    this.names = fs.readFileSync(__dirname + file).toString().split(/[\n,]+/);
  }
  // Starts the battle between the two passed soldiers
  NameGenerator.prototype.getName = function() {
    // Generate a name at random
    var name =  this.names[Math.floor(Math.random() * this.names.length)];
    console.log(name);
    return name;
  }
  // Return the object
  return new NameGenerator();
})();
// Export the name generator
module.exports = NameGenerator;
