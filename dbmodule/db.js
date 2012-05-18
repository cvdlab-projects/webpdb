var cradle = require('cradle');
var parsedJSON = require('./config.json');
var JSON = require('./databases.json');
//Reads the .json File with configuration informations, such as db host, port, username and password.

var setup = exports.setup = function (options, callback) {
// Gets info from the config file and set connection configuration. 
var host = parsedJSON.database.host;
var port = parsedJSON.database.port;
var userName = parsedJSON.database.userName;
var password = parsedJSON.database.password;
var proteinsDBName = parsedJSON.database.proteinDBName;
var monomersDBName = parsedJSON.database.monomersDBName;
//Useful if you don't want to change this js file.

	if(typeof options == 'undefined'){
		options = '';
		options.host = host;
		options.port = port;
	}

  cradle.setup({
    host: options.host,
    port: options.port,
  });
  	
  	var c = new(cradle.Connection)(host, port, {
		auth: {username: userName, password: password}
	});
  // Connect to cradle
  
  var db =  c.database(getDB(options.key));
 
  return db; // Returns the istance of the db.     
};

var getDB = function(key){
return JSONDB.key;
}

