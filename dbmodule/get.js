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

	db.save('_design/proteinsByName', {
		byName: {
			map: function (doc) { if (doc.name) { emit(doc.name, doc); } }}
		});
		
	db.view('proteinsByName/byName', {key: name}, function (err, doc) {
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

	db.save('_design/proteinsByName', {
		byName: {
			map: function (doc) { if (doc.name) { emit(doc.name, doc); } }}
		});
		
	db.view('proteinsByName/byName',  function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			delete doc._rev;
			if(doc.name !== undefined && doc.name.indexOf(0)===('f')){callbackFunction(true, doc);}
			
		}
	});
};




var genQuery = function(string, callbackFunction){
	var host = host || "127.0.0.1";
	var port = port || 5984;
	var dbName = 'starwars'; 
	var userName = '';
	var password = '';
	var c = new(cradle.Connection)(host, port, {
		auth: {username: userName, password: password}
	});

	var db = c.database(dbName);

	db.save('_design/proteinsByBe', {
		byBe: {
			map: string}
		});

	db.view('proteinsByBe/byBe',  function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			delete doc._rev;
			callbackFunction(true, doc);}
			
		});
}

exports.retrieveByID = retrieveByID;
exports.retrieveByName = retrieveByName;
exports.retrieveByName = retrieveByName;
var n = "rizio";

genQuery("function(doc){if(doc.name.match(\'.*"+n+".*\')!==(null)) {emit(doc.name, doc)};}", function(b, f){console.log(f);}, '','','starwars');