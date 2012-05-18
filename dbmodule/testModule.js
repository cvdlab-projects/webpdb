var dbGet = require('./get');
var dbInsert = require('./insert');

var callbackFunction = function(success, s){
	console.log(success);
	console.log(s);
};

var tryInsert = function() {
	dbInsert.insert('ssss', {name: "fabrizio"}, callbackFunction, '', '', 'starwars');
};

var tryGet = function() {
	dbGet.retrieveByID('ssss', callbackFunction, '', '', 'starwars');
};

// tryGet();
// tryInsert();