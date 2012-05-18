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

var mmf_fileStartRead = function(item, callback) {
  
  // Packetize the callback
  var mmf_fileDataRead = function(cbDone) {
    // Signatire for read file function
    return (function(status, data, filename) {
      
      // Creator of the write file function
      var mmf_fileDataWriteFun = function(cbEndEach) {  
	// Signature of a write file
	return (function(name, newdata) {
	  fs.writeFile(PATH_OUT + "/" + name + JSON_EXTENSION, JSON.stringify( newdata ), function(err) {
	      if(err) {
		  console.log("ERROR: Writing " + name + " - " + err);
	      }
	      cbEndEach();
	  });       
	});
      };
  
      if ( status === true ) {
	// Create the write file
	var newFun = mmf_fileDataWriteFun(cbDone);
	// Run it
	newFun(filename, pdbparser.parsePDB(status, data, filename));
      }
      
    });
  };
  
  // Start reading the file
  frModule.readPDBData(item, mmf_fileDataRead(callback));
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

translateAmminoFiles("../../monomers/in", "../../monomers/out");

var testingConvert = function() {
  frModule.readPDBData("../testdata/monomers/000.pdb", function(status, data, filename) {
	if ( status === true ) {
	  console.log( JSON.stringify( pdbparser.parsePDB(status, data, filename) ) );
	}
  });
};

// testingConvert();