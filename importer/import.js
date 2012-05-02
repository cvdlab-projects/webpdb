// moduli generici
// npm install futures Array.prototype.forEachAsync
require('Array.prototype.forEachAsync');
// Moduli progetto
var fileReader = require('../parser/fileReader');
var fileUtils = require('../parser/fileUtils');
var dirReader = require('../parser/dirReader');
var parsePdb = require('../parser/parserNub');
var insertDB = require('../dbmodule/insert');

// These variables doesnot change during script execution, so they can be shared
var m_Database_Name;
var m_Database_Address;
var m_Database_Port;
var m_Database_Username;
var m_Database_Password;

var mf_fileDataRead = function(status, data, filename) {
	console.log(status + " - " + filename);
	// console.log(data.substring(0,50));
	// console.log(data);
	// console.log("-----------------------");
	var ret = parsePdb.parsePDB(status, data, filename);
	// console.log(ret);

	insertDB.insert('127.0.0.1', 5984, 'pdbimporttest', filename, ret);
	console.log("-----------------------");
};

var mf_fileStartRead = function(next, current) {
	fileReader.readPDBData(current, mf_fileDataRead);
};

var mf_fileNamesRead = function(fileList) {
	fileList.forEachAsync(mf_fileStartRead).then(function() {
		console.log("mf_fileNamesRead::forEachAsync::finished");
	});
};

var mf_runImport = function(rootDir, isRecursive, username, password, dbname, hostname, port) {
	m_Database_Address = hostname;
	m_Database_Port = port;
	m_Database_Name = dbname;
	m_Database_Username = username;
	m_Database_Password = password;
	//
	isRecursive = isRecursive || false;
	
	if ( isRecursive ) {
		fileReader.fileExplorerRecursive(mf_fileNamesRead, rootDir, fileUtils.filterCompressed);
	} else {
		fileReader.fileExplorer(mf_fileNamesRead, rootDir, fileUtils.filterCompressed);
	}
};

// dirReader.fileExplorer(funCallFileLaunchRead, "./testdata/lg");