var fs = require('fs'); //Filesystem Module, needed to store the Json file. 

/*
bool: TRUE if success, false otherwise
*/
var storeJson = exports.storeJson = function(bool, Data){
	if(bool){
		console.log(Data);
		fs.writeFile('Protein.json', Data , function(err) {
    		if(err) {
        	console.log(err);
    		}
    		else {
        	console.log("The file was saved!");
  			}
		});
	}	
	else{
		console.log('error in storeJson');
	}
}