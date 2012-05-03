var fs = require('fs');
var path = require('path');

var m_GZ_EXTENSION = ".gz";

var mF_fileName = function(fileName) {
	var parsedName = path.basename(fileName);

	while (parsedName.indexOf(".") != -1) {
		parsedName = path.basename(parsedName, path.extname(parsedName));
	}

	return parsedName;
};

var mf_filterAlways = function() {
  return true;
};

var mf_filterNever = function() {
  return false;
};

var mf_filterNoextension = function(filename) {
  return path.extname(filename).length() === 0;
};

var mf_filterCompressed = function(filename) {
	return path.extname(filename) ===  m_GZ_EXTENSION;
};

var mf_genearateFilterforExtension = function(ext) {
	return (function(filename) {  return path.extname(filename) ===  ext; });
}

// Get file name
exports.fileName = mF_fileName;
// Filters
exports.filterAlways = mf_filterAlways;
exports.filterNever = mf_filterNever;
exports.filterNoextension = mf_filterNoextension;
exports.filterCompressed = mf_filterCompressed;
exports.filterExtension = mf_genearateFilterforExtension;
// Alias
exports.isFileCompressed = mf_filterCompressed;