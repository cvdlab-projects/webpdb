var cradle = require('cradle');
var queryGen = require('./queryGenerator');
var db = require('./db');
var options = {};
var hash = require('./hash');

var retrieveByName = function(name, callbackFunction, keyDB, start, end){
	var input = ["retrieveByName", keyDB, name];
	var hashName = hash.createHash(input);
	start = start || 0;
	end = end || 50;
	options.keyDB = keyDB;
	database = db.setup(options);
	
	console.log("GET" + "::" + "retrieveByName" + "::" + name);
	
	
	database.view(hashName + 'View/view', function (err, doc) {
		if ( err !== null ) {
			database.save('_design/'+ hashName +'View', {
			view: {
				map: queryGen.mapContains("name", name)
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

retrieveByName("rote", function(n,d){console.log(d)}, "starwars");