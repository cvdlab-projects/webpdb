var dbmodel = require('./insert');

var f = function(success, s){
	console.log(success);
	console.log(s);
}

dbmodel.insert('ssss', {name: "fabrizio"},f, '', '', 'starwars');
