var fs = require('fs');
var frUtils = require('../fileexplore/fileUtils');
var frModule = require('../fileexplore/fileReader');
var drModule = require('../fileexplore/dirReader');
var pdbparser = require('../parser/fileParser');
// From https://github.com/caolan/asyncMod
var asyncMod = require('async');

// Adjust this in regards to ulimit -n
var BATCH_LIMIT = 300;
var PATH_IN;
var PATH_OUT;
var PDB_EXTENSION = ".pdb";
var JSON_EXTENSION = ".json";

var mmf_gen_fileDataWriteFun = function(cbDone) {
	return (function(name, newdata) {
		fs.writeFile(PATH_OUT + "/" + name + JSON_EXTENSION, JSON.stringify( newdata ), function(err) {
			if(err) {
				console.log("ERROR: Writing " + name + " - " + err);
			}
			cbDone();
		});       
	});
};

var mmf_gen_fileDataRead = function(cbDone) {
	return (function(status, data, filename) {
		if ( status === true ) {
			// Create the write file
			var doWriteFile = mmf_gen_fileDataWriteFun(cbDone);
			// Run it
			doWriteFile(filename, pdbparser.parsePDB(status, data, filename));
		}
	});	
};

var mmf_fileStartRead = function(item, callback) {
  // Start reading the file
  frModule.readPDBData(item, mmf_gen_fileDataRead(callback));
};
	
var mf_fileNamesRead = function(fileList) {
	asyncMod.forEachLimit(fileList, BATCH_LIMIT, mmf_fileStartRead, function(err) {
		console.log("Iterated through " + fileList.length + " in batches of " + BATCH_LIMIT );
		if (typeof err !== "undefined") {
			console.log("With errors: " + err);
		}
	});
};

// complete with input/output dir xD
var translateAmminoFiles = function(pathIn, pathOut) {
	PATH_IN = pathIn;
	PATH_OUT = pathOut;	
	drModule.fileExplorer(mf_fileNamesRead, PATH_IN, frUtils.filterExtension(PDB_EXTENSION));
};

translateAmminoFiles("C:/Android/biopythonTest/in", "C:/Android/biopythonTest/out");

var testingConvert = function() {
  frModule.readPDBData("../testdata/monomers/000.pdb", function(status, data, filename) {
	if ( status === true ) {
	  console.log( JSON.stringify( pdbparser.parsePDB(status, data, filename) ) );
	}
  });
};

// testingConvert();