var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db');
var options = {};
var crypto = require('crypto');
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
			delete doc._id;
			delete doc._rev;
			callbackFunction(true, doc);
		}
		
	
	});
};

var retrieveByName = function(name, callbackFunction, keyDB, start, end){
	var hash = crypto.createHash('md5');
	shasum.update("retrieveByName"+keyDB+name);
	var hashName = shasum.digest('hex');
	start = start || 0;
	end = end || 50;
	options.keyDB = keyDB;
	database = db.setup(options);
	database.save('_design/'+ hashName +'View', {
		view: {
			map: queryGen.mapContains("TITLE.content", name)}});
	
	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			var docs = {};
			for(var d = start; d < doc.length && d < end; d++){
				delete doc[d].value._id;
				delete doc[d].value._rev;
				docs[d] = doc[d].value;
			}
			callbackFunction(true, docs);
		}
	});
};


exports.retrieveByID = retrieveByID;
exports.retrieveByName = retrieveByName;