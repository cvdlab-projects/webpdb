var dbGet = require('./get');
var dbInsert = require('./insert');

var callbackFunction = function(success, s){
	console.log(success);
	console.log(s);
};

var tryGet = function() {
        // dbGet.retrieveByName('INSULIN', callbackFunction, 'proteins');
           dbGet.retrieveByCompound('7P', callbackFunction, 'monomers');

};

 tryGet();
// tryInsert();