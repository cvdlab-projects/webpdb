var crypto = require('crypto');

var createHash = function(input){
  var s = "";
  for(el in input){
	  s += input[el].toString(); 
  }	
  var hash = crypto.createHash('md5');
  hash.update(s);
  return hash.digest('hex');
};

exports.createHash = createHash;