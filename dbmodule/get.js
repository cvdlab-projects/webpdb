var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db');
var options = {};
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
			var docs = {};
			for(d in doc){
				delete doc[d].value._rev;
				docs[d] = doc[d].value;
		}
		callbackFunction(docs);
	});
};

var retrieveByName = function(name, callbackFunction, keyDB){
	options.keyDB = keyDB;
	database = db.setup(options);
	database.save('_design/'+ keyDB +'View', {
		view: {
			map: queryGen.mapContains("name", name)}});
	
	database.view(keyDB + 'View/view', function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			var docs = {};
			for(d in doc){
				delete doc[d].value._rev;
				docs[d] = doc[d].value;
			}
			callbackFunction(docs);
		}
	});
};



exports.retrieveByID = retrieveByID;
exports.retrieveByName = retrieveByName;

