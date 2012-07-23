var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db');
var idConverter = require('./idConverter');
var options = {};

var getEssentials = function(json){
	var json = {'ID': json['ID'], 'HEADER': json['HEADER'], 'REMARK': json['REMARK'], 'SEQRES': json['SEQRES']}
	return json;
}
/*
	callbackFunction(success:BOOL, id:STRING);
*/

var insert = function(id, json, callbackFunction, keyDB){
	options.keyDB = keyDB;
	database = db.setup(options);
	jsonO = require(json);
	id = idConverter.decimalToAlfa(id);
	database.save(id, getEssentials(jsonO), function (err, res) {
		callbackFunction(err === null, id);
	});
	database.saveAttachment(id,json,function (err, res) {
		console.log(json);
		callbackFunction(err === null, id);
	});
}


exports.insert = insert;
