var username = 'webpdb';
var password = 'w3bpdb';
var dbName = 'pdbimporttest';
var host = '127.0.0.1';
var port = '5984';

exports.getParameters = function() {
	return [username,password,dbName,host,port];
}