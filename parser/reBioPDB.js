/* ponte ra python e js con node qui */

var util  = require('util'),
    spawn = require('child_process').spawn;
    fileutils = require('../fileExplore/fileUtils');

/*
	callbackFun: function(status, data, filename) {
*/
var grepPythonData = function(proteinId, proteinFile, callbackFun) {
  var pyRun = spawn('./reBioPDB.py', [proteinId, proteinFile]);
  // var pyRun = spawn('ls');

  var hasErrorHappened = false;
  var finalData = "";

  pyRun.stdout.on('data', function (data) {
    // Qui data e' un Buffer
    finalData += data;
  });

  pyRun.stderr.on('data', function (data) {
    hasErrorHappened = true;
  });

  pyRun.on('exit', function (code) {
    var exitStatus = ((code !== 0) || (hasErrorHappened === true));
    callbackFun(exitStatus, fileutils.fileName(proteinFile), proteinId);
  });
};

exports.translatePyPDB = grepPythonData;