var frModule = require('./fileReader');
var drModule = require('./dirReader');
var path = require('path');

var funCallFile = function(status, data, filename) {
	console.log(status + " - " + filename);
	// console.log(data.substring(0,50));
	console.log(data);
	console.log("-----------------------");
};

var funCallFileLaunchRead = function(fileList) {
	for (var i = fileList.length - 1; i >= 0; i--) {
		frModule.readPDBData(fileList[i], funCallFile);
	};
};

drModule.dirExplorer(funCallFileLaunchRead, "../testdata");

// console.log(mF_fileName("../testdata/pdb2lgb.ent.gz"));