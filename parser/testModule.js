var frModule = require('./fileReader');
var path = require('path');

var funCall = function(status, data, filename) {
	console.log(data + "-" + status + " - " + filename);
};

frModule.readPDBData("../testdata/pdb2lgb.ent.gz", funCall);

// console.log(mF_fileName("../testdata/pdb2lgb.ent.gz"));