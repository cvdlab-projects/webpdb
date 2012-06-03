var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db');
var options = {};
var hash = require('./hash');

/*
	callbackFunction(success:BOOL, result:JSON);
*/

//Returns the protein (or monomer) with the specified id
var retrieveByID = function(id, callbackFunction, keyDB) {
	options.keyDB = keyDB;
	database = db.setup(options);
	
	database.get(id, function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			console.log("GET" + "::" + "retrieveByID" + "::" + id + "::" + "DONE");
			delete doc._id;
			delete doc._rev;
			callbackFunction(true, doc);
		}
		
	
	});
};

//Returns the proteins (or monomers) with the specified string "name" in the field 'TITLE.content', 
//as a JSON formatted as a list {1: protein1, 2: protein2, 3: protein3, ...}
var retrieveByName = function(name, callbackFunction, keyDB, start, end){
	var input = ["retrieveByName", keyDB, name];
	var hashName = hash.createHash(input);
	start = start || 0;
	end = end || 50;
	options.keyDB = keyDB;
	database = db.setup(options);
	database.save('_design/'+ hashName +'View', {
		view: {
			map: queryGen.mapContains("TITLE.title", name)
			}});
	
	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			console.log("GET" + "::" + "retrieveByName" + "::" + name + "::" + "DONE");
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

var retrieveByAlmostOneAminoacids = function(aminoacids, callbackFunction, keyDB, start, end){
	var input = ["retrieveByAlmostOneAminoacids", keyDB, aminoacids];
	var hashName = hash.createHash(input);
	start = start || 0;
	end = end || 50;
	options.keyDB = keyDB;
	database = db.setup(options);
	
	database.save('_design/'+ hashName +'View', {
		view: {
			map: queryGen.almostOneAminoacid(aminoacids)}});

	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			console.log("GET" + "::" + "retrieveByAlmostOneAminoacids" + "::" + aminoacids + "::" + "DONE");
			var docs = {};
			for(var d = start; d < doc.length && d < end; d++){
				delete doc[d].value._id;
				delete doc[d].value._rev;
				docs[d] = doc[d].value;
			}
			callbackFunction(true, docs);
		}
	});
}

var retrieveByAllAminoacids = function(aminoacids, callbackFunction, keyDB, start, end){
	var input = ["retrieveByAllAminoacids", keyDB, aminoacids];
	var hashName = hash.createHash(input);
	start = start || 0;
	end = end || 50;
	options.keyDB = keyDB;
	database = db.setup(options);
	
	database.save('_design/'+ hashName +'View', {
		view: {
			map: queryGen.allAminoacids(aminoacids)}});

	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			console.log("GET" + "::" + "retrieveByAllAminoacids" + "::" + aminoacids + "::" + "ERROR" + JSON.stringify(err));
			callbackFunction(false, err);
		} else {
			console.log("GET" + "::" + "retrieveByAllAminoacids" + "::" + aminoacids + "::" + "DONE");
			var docs = {};
			for(var d = start; d < doc.length && d < end; d++){
				delete doc[d].value._id;
				delete doc[d].value._rev;
				docs[d] = doc[d].value;
			}
			callbackFunction(true, docs);
		}
	});
}

var retrieveByAlmostOneAminoacidSeqResAverage = function(aminoacids, callbackFunction, keyDB, start, end){
	var input = ["retrieveByAlmostOneAminoacidSeqResAverage", keyDB, aminoacids];
	var hashName = hash.createHash(input);
	start = start || 0;
	end = end || 50;
	options.keyDB = keyDB;
	database = db.setup(options);
	
	console.log("GET" + "::" + "retrieveByAlmostOneAminoacidSeqResAverage" + "::" + aminoacids);
	database.save('_design/'+ hashName +'View', {
		view: {
			map: queryGen.almostOneAminoacidCountValue(aminoacids),
			reduce: 'function(key, values,rereduce){var tot=0;var num=0; return sum(values)/values.length ;}'}});

	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			console.log("GET" + "::" + "retrieveByAlmostOneAminoacidSeqResAverage" + "::" + aminoacids + "::" + "ERROR" + JSON.stringify(err));
			callbackFunction(false, err);
		} else {
			console.log("GET" + "::" + "retrieveByAlmostOneAminoacidSeqResAverage" + "::" + aminoacids + "::" + "DONE");
			var docs = {average: doc[0].value};
			callbackFunction(true, docs);
		}
	});
}

var retrieveAllIDs = function(callbackFunction, keyDB){
	var input = ["retrieveAllIDs", keyDB];
	var hashName = hash.createHash(input);
	options.keyDB = keyDB;
	database = db.setup(options);
	
	database.save('_design/'+ hashName +'View', {
		view: {
			map: queryGen.hasID()
		}});

	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			var ids = [];
			for(d in doc){
				ids.push(doc[d].value);
			}
			callbackFunction(true, ids);
		}
	});
}

var retrieveAllNameID = function(callbackFunction, keyDB){
	var input = ["retrieveAllNameID", keyDB];
	var hashName = hash.createHash(input);
	options.keyDB = keyDB;
	database = db.setup(options);
	
	database.save('_design/'+ hashName +'View', {
		view: {
			map: queryGen.hasNameID()
		}});

	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			callbackFunction(false, err);
		} else {
			var ids = [];
			for(d in doc){
				ids.push({name: doc[d].key, id: doc[d].value});
			}
			callbackFunction(true, ids);
		}
	});
}

exports.retrieveAllNameID = retrieveAllNameID;
exports.retrieveAllIDs = retrieveAllIDs;
exports.retrieveByID = retrieveByID;
exports.retrieveByName = retrieveByName;
exports.retrieveByAlmostOneAminoacids = retrieveByAlmostOneAminoacids;
exports.retrieveByAllAminoacids = retrieveByAllAminoacids;
exports.retrieveByAlmostOneAminoacidSeqResAverage = retrieveByAlmostOneAminoacidSeqResAverage;