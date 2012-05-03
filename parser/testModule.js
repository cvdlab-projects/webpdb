var frModule = require('../fileexplore/fileReader');
var drModule = require('../fileexplore/dirReader');
var parserNub = require('./parserNub');

var funCallFile = function(status, data, filename) {
	// console.log(status + " - " + filename);
	// console.log(data.substring(0,50));
	// console.log(data);
	// console.log("-----------------------");
	var ret = parserNub.parsePDB(status, data, filename);
	console.log(ret);
};

var funCallFileLaunchRead = function(fileList) {
	for (var i = fileList.length - 1; i >= 0; i--) {
		// console.log(fileList[i]);
		if (fileList[i].indexOf("2lgb.pdb1.gz") !== -1 ){
			frModule.readPDBData(fileList[i], funCallFile);
		}
		
		
		// frModule.readPDBData(fileList[i], funCallFile);
	};
};

var testParserNUB = function() {
	drModule.fileExplorer(funCallFileLaunchRead, "../testdata");
};

// --------------------------------------------------------------test-----------------------------------------------
vat testParserPro = function(what){
	if(what.contains("l")){
		var parsedLine = parseLine("ATOM     50  CG  GLU A   4      18.057  25.754   8.986  1.00  0.00           C  ","ATOM");
		console.log(parsedLine);
	}

	if(what.contains("p")){
		var parsedPDB = parsePDB(true,"ATOM     20  HB  ILE A   2      13.785  20.261   7.251  1.00  0.00           H  \n"+
	"ATOM     21 HG12 ILE A   2      15.413  18.675   9.268  1.00  0.00           H  \n"+
	"ATOM     22 HG13 ILE A   2      14.148  19.823   9.685  1.00  0.00           H  \n"+
	"ATOM     23 HG21 ILE A   2      14.694  18.138   6.339  1.00  0.00           H  \n"+
	"ATOM     24 HG22 ILE A   2      15.334  19.567   5.556  1.00  0.00           H  \n"+
	"ATOM     25 HG23 ILE A   2      16.335  18.705   6.742  1.00  0.00           H  \n"+
	"ATOM     26 HD11 ILE A   2      13.251  17.579   9.795  1.00  0.00           H  \n"+
	"ATOM     27 HD12 ILE A   2      12.479  18.463   8.464  1.00  0.00           H  \n"+
	"ATOM     28 HD13 ILE A   2      13.730  17.236   8.128  1.00  0.00           H  \n"+
	"ATOM     29  N   VAL A   3      16.211  22.340   5.886  1.00  0.00           N  \n"+
	"ATOM     30  CA  VAL A   3      17.082  22.712   4.752  1.00  0.00           C  \n"+
	"ATOM     31  C   VAL A   3      18.304  23.505   5.233  1.00  0.00           C  \n"+
	"ATOM     32  O   VAL A   3      19.430  23.215   4.828  1.00  0.00           O  \n"+
	"ATOM     33  CB  VAL A   3      16.301  23.473   3.660  1.00  0.00           C  ","Spezzone2LGB");
		console.log(parsedPDB);
	}
};