var cradle = require('cradle');


var retrieveByID = function(host, port, dbName, id, fun){
  var c = new(cradle.Connection)(host, port);
  var db = c.database(dbName);
    db.get(id, function (err, doc) {
  		fun(doc);
  	  });
};

exports.retrieveByID = retrieveByID;


var retrieveByName = function(host, port, dbName, pname, fun){

var c = new(cradle.Connection)(host, port);

  var db = c.database(dbName);

  db.save('_design/proteinsByName', {
      byName: {
        map: function (doc) { if (doc.name) { emit(doc.name, doc); } }}
  });
  db.view('proteinsByName/byName', {key: pname}, function (err, doc) {
	fun(doc);
 });
};

exports.retrieveByName = retrieveByName;