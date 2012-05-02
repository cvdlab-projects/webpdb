var cradle = require('cradle');

/*
	callbackFunction(success:BOOL, id:STRING);
*/

var insert = function(id, json, callbackFunction, userName, password, dbName, host, port){
	var host = host || "127.0.0.1";
	var port = port || 5984;

	var c = new(cradle.Connection)(host, port, {
		auth: {username: userName, password: password}
	});

	var db = c.database(dbName);

	db.save(id, json, function (err, res) {
		callbackFunction(err === null, id);
	});
}

exports.insert = insert;
