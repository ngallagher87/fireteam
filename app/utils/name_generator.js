/* 
	This generates random names for our little soldier buddies
*/
var NameGenerator = (function() {
	// Creates a red god
	function NameGenerator() {
		// Init names here
		this.names =  [
			'Periwinkle','Zeus','Perry','Ched','Archie','Chocolate',
			'Bruce','Adam','Nathan','Andrew','Chester','Orange',
			'Ichigo','Ember','Jeff','Paul','Ester','Helga',
			'James','M','Eric','Archer','Comet','Blitzen','Daze','Doze','Fuzzer',
			'Cal','Whatz','Buzzer','Aaron','Sarah','Burner',
			'Sir Davos','Joffrey','Arthur','Xerneas','Epitaph','Gee',
			'Opinicus','Periclese','Jo Ann','Sir Black','Bumble','Link',
			'Mario','Gooda','Timber','Seraph','Phil','Philipe',
			'Jose','Zeus','Esperanza','Jorge','Cuddler','Huggers',
			'Aya','Robert','Tyrion','Walter','Salma','Espion',
			'Peekachew','Chareyzard','Bulbasour','Stan','Kyle','Hankey',
			'Cupid','Odin','Periguin','Steff','Nathan','Than',
			'Pearus','Typhlo','Mag','X','N','Darksoul',
			'Nightmare','Rainbow Sparkle','Solidblade',
			'Inferno','Urgramash','Hank','Tommy','Timmy','Isablel',
			'Troy','Sigil','Balrog','Gundam','Begi','Yogi',
			'Golem','Tuffer','Darner','Zu','Snaz','Empros',
			'Darth','Vader','Luke','Obiwhan','Quelthalas','Julien',
			'Duliost','W','Baraque','Chopin','Bahn','Bach',
			'Debuss','Busser','Perry','Red','Blue','Tera',
			'Backus','Bruiser','Chili','Sage','Pan','Trunks',
			'Ukog','Vegeter','Jimbo','Remus','Archer','Empirius',
			'Hermes','Busser','Perry','Red','Blue','Tera',
			'Venus','Neptune','Broadblade','Spears','Star','Gerrard',
			'Ryan','Imiguru','Kagome','Tifa','Xercex','Cerce',
			'Sansa','Lady Grey','Saisha','Aisha','Tremor','Cuddles',
			'Glisten','Sparkle','Sasha','Kryton','Obsidian','Doom',
			'Optimus','Beeker','Carton','Ego','Aregon','Phrodo',
			'Smog','Slither','Temo','P2','X','Tepid',
			'Ponder','Triton','Naomi','Mandi','Trip','Stubbs',
		];
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
