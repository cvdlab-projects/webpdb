
var cradle = require('cradle');

  var createDB = function(host, port, dbName){
  	

  var c = new(cradle.Connection)(host, port);

  var db = c.database(dbName);
  db.create();
  }

exports.createDB = createDB;

     

