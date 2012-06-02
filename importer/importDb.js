// moduli generici
var asyncMod = require('async');
// Moduli progetto
var fileReader = require('../fileexplore/fileReader');
var fileUtils = require('../fileexplore/fileUtils');
var dirReader = require('../fileexplore/dirReader');
var parsePdb = require('../parser/new/fileParser');
var insertDB = require('../dbmodule/insert');

// Default Value
var BATCH_LIMIT = 512;

// rootDir: [string] root directory
// isRecursive: [boolean] recursive explore rootDir
// dbName: [string] a string representing the type (check db/databases.json)
// fileFilter: [filter] to grab files
var mf_runImport = function(rootDir, isRecursive, dbName, fileFilter) {
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
				insertDB.insert(filename, parsePdb.parsePDB(status, data, filename), mmf_gen_fileDataInserted(cbDone), m_Database_Name);
			} else {
				console.log("Reading data for fileID " + filename + " has failed.");
			}
		});	
	};
	
	var mmf_fileStartRead = function(item, callback) {
		fileReader.readPDBData(item, mmf_gen_fileDataRead(callback));
	};

	var mmf_fileNamesRead = function(fileList) {
		asyncMod.forEachLimit(fileList, BATCH_LIMIT, mmf_fileStartRead, function(err) {
			console.log("Iterated through " + fileList.length + " in batches of " + BATCH_LIMIT );
			if (typeof err !== "undefined") {
				console.log("With errors: " + err);
			}
		});
	};

	m_Database_Name = dbName;
	//
	isRecursive = isRecursive || false;
	fileFilter = fileFilter || fileUtils.filterCompressed;
	
	if ( isRecursive ) {
		dirReader.fileExplorerRecursive(mmf_fileNamesRead, rootDir, fileFilter);
	} else {
		dirReader.fileExplorer(mmf_fileNamesRead, rootDir, fileFilter);
	}
};

// callbackFun: [function] a function to call with the value of result
var mf_extractUlimit = function(callbackFun) {
	var defaultSafeLimit = 128;
	if ( require("os").platform().indexOf("win") != -1 ) {
		// Fixed value
		callbackFun(defaultSafeLimit*2);
	} else {
		var ulimitProcess = require('child_process').exec('ulimit -n',
		  function(error, stdout, stderr) {
		    if (error !== null) {
		      callbackFun(defaultSafeLimit);
		    } else {
		      var newLimit = parseInt( stdout.replace(/^\s\s*/, '').replace(/\s\s*$/, '') );
		      callbackFun( isNaN(newLimit) ? defaultSafeLimit : (newLimit/3) );
		    }
		  });
	}
};

var mf_startImport = function(rootDir, isRecursive, dbName, fileFilter) {
	mf_extractUlimit(function(value) {
		BATCH_LIMIT = value;
		mf_runImport(rootDir, isRecursive, dbName, fileFilter);
	});
};

exports.runImport = mf_startImport;
