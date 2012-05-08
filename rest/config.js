var params = require('./config.json');

/* Returns the json with all the initial settings */
var getParameters = function() {
	return params;
}


exports.parameters = getParameters;