var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db.js');

database = db.setup();
/*
	callbackFunction(success:BOOL, id:STRING);
*/

var insert = function(id, json, callbackFunction){
	database.save(id, json, function (err, res) {
		callbackFunction(err === null, id);
	});
}

exports.insert = insert;
