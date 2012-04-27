/*
	requires modules:
	* fs
	* zlib
	* path
*/

var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var fileutils = require('./fileUtils');

var m_PDBENCODING = 'ascii';
var m_FILENOTFOUND = "File not found";

/*
	function: readFile
	filename: a string containing a fully qualified pathname to the file to read
	compressed: 
	callback: a function (statusRead:BOOL, data:STRING, filename:STRING) to be called once the file is read
*/
var mF_readFile = function(fileName, callbackFun) {
	var fileNameOnly;
	var isCompressed;

	// console.log("==" + fileName);
	fileNameOnly = fileutils.fileName(fileName);
	//
	isCompressed = fileutils.isFileCompressed(fileName);

	if ( !path.existsSync(fileName) ) {
		callbackFun(false, m_FILENOTFOUND, fileNameOnly);
	} else {
		mF_startRead(fileName, fileNameOnly, callbackFun, isCompressed);
	}
};

var mF_startRead = function(fileName, fileNameOnly, callbackFun, isCompressed) {
	fs.readFile(fileName, function (err, data) {
		if (err) { 
			callbackFun(false, err, fileNameOnly);
		} else {
			if (isCompressed) {
				// console.log(fileName + "||" + fileNameOnly + "||" + isCompressed);
				zlib.unzip(data, mf_readCompressedBuffer(fileNameOnly, callbackFun));
			} else {
				callbackFun(true, data.toString(m_PDBENCODING), fileNameOnly);
			}
		}
	});
};

var mf_readCompressedBuffer = function(fileNameOnly, callbackFun) {
	return (function(err, buffer) {
				if (err) { 
					callbackFun(false, err, fileNameOnly);
				} else {
					callbackFun(true, buffer.toString(m_PDBENCODING), fileNameOnly);
				}
			});
};

// Exports
exports.readPDBData = mF_readFile;