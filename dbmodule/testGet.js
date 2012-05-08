var dbmodule = require('./get');

var f = function(success, s){
	console.log(success);
	console.log(s);
}

dbmodule.retrieveByID('ssss', f, '', '', 'starwars');