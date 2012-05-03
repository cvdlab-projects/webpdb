var frModule = require('../fileexplore/fileReader');
var drModule = require('../fileexplore/dirReader');
var parserNub = require('./parserNub');
var parserNew = require('./parserNub');

var parserType;

var funCallFile = function(status, data, filename) {
	// console.log(status + " - " + filename);
	// console.log(data.substring(0,50));
	// console.log(data);
	// console.log("-----------------------");
	var ret = parserType.parsePDB(status, data, filename);
	console.log(ret);
};

var funCallFileLaunchRead = function(fileList) {
	for (var i = fileList.length - 1; i >= 0; i--) {
		// console.log(fileList[i]);
		if (fileList[i].indexOf("2lgb.pdb1.gz") !== -1 ){
			frModule.readPDBData(fileList[i], funCallFile);
		}
	};
};

var testParserNUB = function() {
	parserType = parserNub;
	drModule.fileExplorer(funCallFileLaunchRead, "../testdata");
};

var testParserNEW = function() {
	parserType = parserNew;
	drModule.fileExplorer(funCallFileLaunchRead, "../testdata");
};

testParserNEW();