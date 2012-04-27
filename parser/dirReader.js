// https://github.com/coolaj86/node-walk 

var walk = require('walk');
var fs = require('fs');
var fileutils = require('./fileUtils')

var mf_Sortfile = function(a,b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

/*
  params:
  callbackFun FUNCTION a fun to be called with argument
  directory STRING sirectory to walk
  
*/
var mf_RunWalker = function(callbackFun, directory, filterFunction) {
  var emitter = walk.walk(directory);
  var listResults = [];
  filterFunction = filterFunction || fileutils.filterAlways;

  emitter.on('file', function (path, stat, next) {
    var currFile = [path, '/', file].join('');
    console.log(currFile);

    if ( filterFunction(file) ) {
      listResults.push(currFile);
    }

    next();
  });

  // The end of all things
  emitter.on('end', function () {
    callbackFun(listResults);
  });
};

exports.dirExplorer = mf_RunWalker;