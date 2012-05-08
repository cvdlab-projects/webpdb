var cradle = require('cradle');
var db = require('./createDBLuca.js');

database = db.setup(); //Gets the DB, accessing it with the info retrieved from the config file.
/*
	callbackFunction(success:BOOL, result:JSON);
*/

var retrieveByID = function(id, callbackFunction) {
	database.get(id, function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			delete doc._rev;
			callbackFunction(true, doc);
		}
	});
};

var retrieveByName = function(name, callbackFunction){

	database.save('_design/proteinsByName', {
		byName: {
			map: function (doc) { if (doc.name) { emit(doc.name, doc); } }}
		});
		
	database.view('proteinsByName/byName', {key: name}, function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			delete doc._rev;
			callbackFunction(true, doc);
		}
	});
};

exports.retrieveByID = retrieveByID;
exports.retrieveByName = retrieveByName;