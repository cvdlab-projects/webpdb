// moduli generici
// npm install futures Array.prototype.forEachAsync
require('Array.prototype.forEachAsync');
// Moduli progetto
var fileReader = require('../parser/fileReader');
var fileUtils = require('../parser/fileUtils');
var dirReader = require('../parser/dirReader');
var parsePdb = require('../parser/parserNub');
var insertDB = require('../dbmodule/insert');

var mf_runImport = function(rootDir, isRecursive, username, password, dbname, hostname, port) {
	var m_Database_Name;
	var m_Database_Address;
	var m_Database_Port;
	var m_Database_Username;
	var m_Database_Password;

	var mmf_fileDataInserted = function(status, id) {
		console.log("Insert in DB for document " + id + " " + (( status === true ) ? "SUCCESS" : "FAILED") );
	};

	var mmf_fileDataRead = function(status, data, filename) {
		if ( status === true ) {
			insertDB.insert(filename, parsePdb.parsePDB(status, data, filename), mmf_fileDataInserted, m_Database_Username, m_Database_Password, m_Database_Name, m_Database_Address, m_Database_Port);
		} else {
			console.log("Reading data for protein " + filename + " has failed.");
		}
	};

	var mmf_fileStartRead = function(next, current) {
		fileReader.readPDBData(current, mf_fileDataRead);
		// Go next step
		next();
	};

	var mmf_fileNamesRead = function(fileList) {
		fileList.forEachAsync(mmf_fileStartRead).then(function() {
			console.log("mf_fileNamesRead::forEachAsync::finished");
		});
	};


	m_Database_Address = hostname;
	m_Database_Port = port;
	m_Database_Name = dbname;
	m_Database_Username = username;
	m_Database_Password = password;
	//
	isRecursive = isRecursive || false;
	
	if ( isRecursive ) {
		fileReader.fileExplorerRecursive(mmf_fileNamesRead, rootDir, fileUtils.filterCompressed);
	} else {
		fileReader.fileExplorer(mmf_fileNamesRead, rootDir, fileUtils.filterCompressed);
	}
};

exports.runImport = mf_runImport;