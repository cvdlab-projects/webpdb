var cradle = require('cradle');

var insert = function(id, json, userName, password, dbName, host, port){

var host = host || "127.0.0.1";
var port = port || 5984;

var c = new(cradle.Connection)(host, port, {
	auth: {username: userName, password: password}
	});

  var db = c.database(dbName);

  db.save(id, json, function (err, res){
  	console.log(res);
  });

}

exports.insert = insert;
