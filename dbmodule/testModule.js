var dbGet = require('./get');
var dbInsert = require('./insert');

var callbackFunction = function(success, s){
	console.log(success);
	console.log(s);
};

var tryGet = function() {
	dbGet.retrieveByName('0', callbackFunction, 'starwars');
};

 tryGet();
// tryInsert();