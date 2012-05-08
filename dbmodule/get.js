var cradle = require('cradle');
var queryGen = require('./queryGenerator')
/*
	callbackFunction(success:BOOL, result:JSON);
*/

var retrieveByID = function(id, callbackFunction, userName, password, dbName,  host, port) {
	var host = host || "127.0.0.1";
	var port = port || 5984;

	var c = new(cradle.Connection)(host, port, {
		auth: {username: userName, password: password}
	});

	var db = c.database(dbName);
	db.get(id, function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			delete doc._rev;
			callbackFunction(true, doc);
		}
	});
};

var retrieveByName = function(name, callbackFunction, userName, password, dbName, host, port){
	var host = host || "127.0.0.1";
	var port = port || 5984;

	var c = new(cradle.Connection)(host, port, {
		auth: {username: userName, password: password}
	});

	var db = c.database(dbName);

	db.save('_design/proteinsView', {
		view: {
			map: queryGen.mapContains("name", name);}});
	
	db.view('proteinsview/view', function (err, doc) {
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

