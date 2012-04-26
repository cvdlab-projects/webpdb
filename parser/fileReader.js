/*
	requires modules:
	* fs
	* zlib
	* path
*/

var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

var GZ_EXTENSION = "gz";

var m_fileName;
var m_fileNameOnly;
var m_callbackFun;
var m_isCompressed;

/*
	function: readFile
	fileName: a string containing a fully qualified pathname to the file to read
	compressed: 
	callback: a function (statusRead:BOOL, data:STRING, fileName:STRING) to be called once the file is read
*/
var readFile = function(fileName, callbackFun) {
	m_fileName = fileName;
	m_fileNameOnly = mF_fileName(fileName);
	//
	m_callbackFun = callbackFun;
	m_isCompressed = (path.extname(fileName).indexOf(GZ_EXTENSION) != -1);

	if ( !path.existsSync(fileName) ) {
		m_callbackFun(false, "file not found", m_fileNameOnly);
	} else {
		mF_startRead();
	}
};

var mF_fileName = function(fileName) {
	var parsedName = path.basename(fileName);

	while (parsedName.indexOf(".") != -1) {
		parsedName = path.basename(parsedName, path.extname(parsedName));
	}

	return parsedName;
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
exports.readPDBData = readFile;