var cradle = require('cradle');
var parsedJSON = require('./config.json');
var JSONDB = require('./databases.json');

//Reads the .json File with configuration informations, such as db host, port, username and password.
var setup = exports.setup = function (options, callback) {

// Gets info from the config file and set connection configuration. 
var host = parsedJSON.database.host;
var port = parsedJSON.database.port;
var userName = parsedJSON.database.userName;
var password = parsedJSON.database.password;

	//Useful if you don't want to change this js file.

		options.host = host;
		options.port = port;
	
	cradle.setup({
		host: options.host,
		port: options.port,
	});
  	
  	var c = new(cradle.Connection)(host, port, {
		auth: {username: userName, password: password}
	});
  var db =  c.database(getDB(options.keyDB));
  return db; // Returns the istance of the
};

var getDB = function(key){
return JSONDB[key];
}

