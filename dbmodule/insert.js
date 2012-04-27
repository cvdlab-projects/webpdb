var cradle = require('cradle');

var insert = function(host, port, dbName, id, json){

var c = new(cradle.Connection)(host, port);

  var db = c.database(dbName);

  db.save(id, json, function (err, res){
  	console.log(res);
  });

}

exports.insert = insert;
