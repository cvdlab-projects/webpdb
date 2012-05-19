var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db.js');
var options = '';
/*
	callbackFunction(success:BOOL, result:JSON);
*/

var retrieveByID = function(id, callbackFunction, keyDB) {
	options.keyDB = keyDB;
	database = db.setup(options);
	database.get(id, function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			delete doc._rev;
			callbackFunction(true, doc);
		}
	});
};

var retrieveByName = function(name, callbackFunction, keyDB){
	options.keyDB = keyDB;
	database = db.setup(options);
	database.save('_design/'+ keyDB +'View', {
		view: {
			map: queryGen.mapContains("TITLE.content", name);}});
	
	database.view(keyDB + 'View/view', function (err, doc) {
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

