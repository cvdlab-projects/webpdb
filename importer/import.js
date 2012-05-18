// moduli generici
var asyncMod = require('async');
// Moduli progetto
var fileReader = require('../fileexplore/fileReader');
var fileUtils = require('../fileexplore/fileUtils');
var dirReader = require('../fileexplore/dirReader');
var parsePdb = require('../parser/parserNub');
var insertDB = require('../dbmodule/insert');

var BATCH_LIMIT = 300;

var mf_runImport = function(rootDir, isRecursive, dbname) {
	var m_Database_Name;
	
	var mmf_gen_fileDataInserted = function(cbDone) {
		return (function (status, id){
			if ( status !== true ) {
				console.log("ERROR: Insert in DB for document " + id);
			}
			// Call callback
			cbDone();
		});
	};

	var mmf_gen_fileDataRead = function(cbDone) {
		return (function(status, data, filename) {
			if ( status === true ) {
				insertDB.insert(filename, parsePdb.parsePDB(status, data, filename), mmf_gen_fileDataInserted(cbDone));
			} else {
				console.log("Reading data for protein " + filename + " has failed.");
			}
		});	
	};
	
	var mmf_fileStartRead = function(item, callback) {
		fileReader.readPDBData(current, mmf_gen_fileDataRead(cbDone));
	};

	var mmf_fileNamesRead = function(fileList) {
		asyncMod.forEachLimit(fileList, BATCH_LIMIT, mmf_fileStartRead, function(err) {
			console.log("Iterated through " + fileList.length + " in batches of " + BATCH_LIMIT );
			if (typeof err !== "undefined") {
				console.log("With errors: " + err);
			}
		});
	};

	m_Database_Name = dbname;
	//
	isRecursive = isRecursive || false;
	
	if ( isRecursive ) {
		dirReader.fileExplorerRecursive(mmf_fileNamesRead, rootDir, fileUtils.filterCompressed);
	} else {
		dirReader.fileExplorer(mmf_fileNamesRead, rootDir, fileUtils.filterCompressed);
	}
};

exports.runImport = mf_runImport;