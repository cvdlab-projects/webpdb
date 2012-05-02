var cradle = require('cradle');

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
			delete doc._rev;
			callbackFunction(true, doc);
		} else {
			callbackFunction(false, err);
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

	db.save('_design/proteinsByName', {
		byName: {
			map: function (doc) { if (doc.name) { emit(doc.name, doc); } }}
		});
		
	db.view('proteinsByName/byName', {key: name}, function (err, doc) {
		if ( err !== null ) {
			delete doc._rev;
			callbackFunction(true, doc);
		} else {
			callbackFunction(false, err);
		}
	});
};

exports.retrieveByID = retrieveByID;
exports.retrieveByName = retrieveByName;