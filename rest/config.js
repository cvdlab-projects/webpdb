
var params = {
	'username': 'webpdb',
 	'password': 'w3bpdb',
	'dbName': 'pdbimporttest',
	'host': '127.0.0.1',
	'port': '5984'
}

/* Returns the json with all the initial settings */
var getParameters = function() {
	return params;
}


exports.parameters = getParameters;