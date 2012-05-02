var frModule = require('./fileReader');
var drModule = require('./dirReader');
var parserNub = require('./parserNub');

var path = require('path');

var funCallFile = function(status, data, filename) {
	// console.log(status + " - " + filename);
	// console.log(data.substring(0,50));
	// console.log(data);
	// console.log("-----------------------");
	var ret = parserNub.parsePDB(status, data, filename);
	console.log(ret);
};

var funCallFileLaunchRead = function(fileList) {
	for (var i = fileList.length - 1; i >= 0; i--) {
		// console.log(fileList[i]);
		if (fileList[i].indexOf("2lgb.pdb1.gz") !== -1 ){
			frModule.readPDBData(fileList[i], funCallFile);
		}
		
		
		// frModule.readPDBData(fileList[i], funCallFile);
	};
};

drModule.fileExplorer(funCallFileLaunchRead, "../testdata");