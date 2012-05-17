// https://github.com/nshah/nodejs-walker
// npm install walker

var walk = require('walker');
var fs = require('fs');
var fileutils = require('./fileUtils')

// Not really OS agnostic but we work on UNIX anyway
var m_DIRECTORYSEPARATOR = "/";

/*
  given a directory this fetches all the files inside it

  params:
  callbackFun FUNCTION a fun to be called with arguments ([string|array], [false|true])
  directory STRING sirectory to walk
  
*/

var mf_RunWalkerFile = function(callbackFun, directory, filterFunction, asyncCall) {
  var listResults = [];
  filterFunction = filterFunction || fileutils.filterAlways;
  asyncCall = asyncCall || false;

  var emitter = walk(directory)
    .filterDir(function(dir, stat) {
      return (dir === directory);
    })
    .on('file', function(file, stat) {
      if ( filterFunction(file) ) {
        listResults.push(file);
	if (asyncCall === true) {
	  callbackFun(file, false);
	}
      }
    })
    .on('end', function() {
      if (asyncCall === true) {
	callbackFun(listResults, true);
      } else {
	callbackFun(listResults);
      }
    });
};

var mf_RunWalkerFileRecursive = function(callbackFun, directory, filterFunction, asyncCall) {
  var listResults = [];
  filterFunction = filterFunction || fileutils.filterAlways;

  var emitter = walk(directory)
    .on('file', function(file, stat) {
      if ( filterFunction(file) ) {
        listResults.push(file);
	if (asyncCall === true) {
	  callbackFun(file, false);
	}	
      }
    })
    .on('end', function() {
      if (asyncCall === true) {
	callbackFun(listResults, true);
      } else {
	callbackFun(listResults);
      }
    });
};

// no self
var mf_RunWalkerDir = function(callbackFun, directory, filterFunction) {
  var listResults = [];
  filterFunction = filterFunction || fileutils.filterAlways;

  var emitter = walk(directory)
    .filterDir(function(dir, stat) {
      var filteredDir = dir.substring(directory.length);
      var retDir = (filteredDir.length <= 0) ? true : (filteredDir.substring(1).indexOf(m_DIRECTORYSEPARATOR) === -1);
      return retDir;
    })
    .on('dir', function(dir, stat) {
      if ( filterFunction(dir) && (directory !== dir) ) {
        listResults.push(dir);
      }
    })
    .on('end', function() {
      callbackFun(listResults);
    });
};

// no self
var mf_RunWalkerDirRecursive = function(callbackFun, directory, filterFunction) {
  var listResults = [];
  filterFunction = filterFunction || fileutils.filterAlways;

  var emitter = walk(directory)
    .on('dir', function(dir, stat) {
      if ( filterFunction(dir) && (directory !== dir) ) {
        listResults.push(dir);
      }
    })
    .on('end', function() {
      callbackFun(listResults);
    });
};

/*** EXPORTS ***/
exports.fileExplorer = mf_RunWalkerFile;
exports.fileExplorerRecursive = mf_RunWalkerFileRecursive;
exports.fileExplorerAsync = function(a,b,c) { mf_RunWalkerFile(a,b,c,true); };
exports.fileExplorerRecursiveAsync = function(a,b,c) { mf_RunWalkerFileRecursive(a,b,c,true); };
// No need for async methods here
exports.directoryExplorer = mf_RunWalkerDir;
exports.directoryExplorerRecursive = mf_RunWalkerDirRecursive;