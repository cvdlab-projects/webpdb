var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db.js');
var idConverter = require('./idConverter');
var options = {};

/*
	callbackFunction(success:BOOL, id:STRING);
*/

var insert = function(id, json, callbackFunction, keyDB){
	options.keyDB = keyDB;
	database = db.setup(options);
	id = idConverter.alfaToDecimal(id);
	database.save(id, json, function (err, res) {
		callbackFunction(err === null, id);
	});
}

exports.insert = insert;