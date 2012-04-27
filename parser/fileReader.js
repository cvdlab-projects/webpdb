/*
	requires modules:
	* fs
	* zlib
	* path
*/

var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var fileutils = require('./fileUtils')

var m_fileName;
var m_fileNameOnly;
var m_callbackFun;
var m_isCompressed;

/*
	function: readFile
	filename: a string containing a fully qualified pathname to the file to read
	compressed: 
	callback: a function (statusRead:BOOL, data:STRING, filename:STRING) to be called once the file is read
*/
var mF_readFile = function(filename, callbackFun) {
	m_fileName = filename;
	m_fileNameOnly = fileutils.fileName(m_fileName);
	//
	m_callbackFun = callbackFun;
	m_isCompressed = fileutils.isFileCompressed(m_fileName);

	if ( !path.existsSync(m_fileName) ) {
		m_callbackFun(false, "file not found", m_fileNameOnly);
	} else {
		mF_startRead();
	}
};

var mF_startRead = function() {
	fs.readFile(m_fileName, function (err, data) {
		if (err) { 
			m_callbackFun(false, err, m_fileNameOnly);
		} else {
			if (m_isCompressed) {
				zlib.unzip(new Buffer(data), mf_readCompressedBuffer);
			} else {
				m_callbackFun(true, data, m_fileNameOnly);
			}
		}
	});
};

var mf_readCompressedBuffer = function(err, buffer) {
	if (err) { 
		m_callbackFun(false, err, m_fileNameOnly);
	} else {
		m_callbackFun(true, buffer.toString('ascii'), m_fileNameOnly);
	}
};

// Exports
exports.readPDBData = mF_readFile;