var fs = require('fs'); //Fylesystem Module, needed to store the Json file. 

var storeJson = exports.storeJson = function(bool, Data){
	if(bool){
		fs.writeFile('Protein.json', Data , function(err) {
    		if(err) {
        	console.log(err);
    		}
    		else {
        	console.log("The file was saved!");
  			}
		});
	}	
	else{console.log(Data);}
}