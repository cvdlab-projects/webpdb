var cradle = require('cradle');


var retrieveByID = function(id, userName, password, dbName, fun,host, port){

  var host = host || "127.0.0.1";
  var port = port || 5984;

  var c = new(cradle.Connection)(host, port, {
  auth: {username: userName, password: password}
  });

  var db = c.database(dbName);
    db.get(id, function (err, doc) {
      console.log(err);
  		fun(doc);
  	  });
};

exports.retrieveByID = retrieveByID;


var retrieveByName = function(name, userName, password, dbName, fun,host, port){

var host = host || "127.0.0.1";
var port = port || 5984;

var c = new(cradle.Connection)(host, port, {
  auth: {username: userName, password: password}
  });

  var db = c.database(dbName);

  db.save('_design/proteinsByName', {
      byName: {
        map: function (doc) { if (doc.name) { emit(doc.name, doc); } }}
  });
  db.view('proteinsByName/byName', {key: name}, function (err, doc) {
	fun(doc);
 });
};

exports.retrieveByName = retrieveByName;