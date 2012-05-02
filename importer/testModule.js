var fileReader = require('./parser/fileReader');
var dirReader = require('./parser/dirReader');
var parsePdb = require('./parser/parserNub');
var insertDB = require('./dbmodule/insert');

var funCallFile = function(status, data, filename) {
	console.log(status + " - " + filename);
	// console.log(data.substring(0,50));
	// console.log(data);
	// console.log("-----------------------");
	var ret = parsePdb.parsePDB(status, data, filename);
	// console.log(ret);

	insertDB.insert('127.0.0.1', 5984, 'pdbimporttest', filename, ret);
	console.log("-----------------------");
};

var funCallFileLaunchRead = function(fileList) {
	for (var i = fileList.length - 1; i >= 0; i--) {
		// console.log(fileList[i]);
		fileReader.readPDBData(fileList[i], funCallFile);
	};
};

dirReader.fileExplorer(funCallFileLaunchRead, "./testdata/lg");
