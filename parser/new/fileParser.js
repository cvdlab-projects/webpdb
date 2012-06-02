// ----------------------require-----------------

var utils = require('./parserUtils');
var rp = require ("./recordParser");
var pm = require ("./parseModes");

var parseLineContent = rp.parseLineContent;
var LineScanner = utils.LineScanner;
var getRecordParsingFunction = utils.getRecordParsingFunction;
var strim = utils.strim;

var getParsingMode = pm.getParsingMode;

// ---------------------------------funzione da esportare:---------------------------------

var parsePDB = function (allGoingWell,pdbString,proteinID) {
	if (!allGoingWell){
		throw "Read unsuccesful";
	}

	//-------init json-------
	var protein = {
		"ID" : proteinID
	};

	//-------VARIABILI "globali" di parsing-------
	var scanner = new LineScanner(pdbString,0);



	// -------funzioni che hanno bisogno di questo scope:-------



	//---------------------------------------------------parsing:------------------------------------------------

//	var line = nextLine(); (sostituito dallo scanner)
	var line;

	while (scanner.hasNextLine()) {
		line = scanner.nextLine();
		var type = line.substring(0,6);
		if(type == "END   "){
			break;
		}
		var parsingFunction = getParsingMode(type);
		parsingFunction(protein,type,line,scanner); 

		//	la linea corrente puo' anche essere ottenuta dallo scanner (scanner.currentLine());
		//	NOTA: la parsingFunction puo' fare uso della funzione scanner.nextLine(),
		//	quindi la nuova line non e' necessariamente quella che seguiva la vecchia.

	}
	

	var printRemarks = function(protein){
		var rmks = protein["REMARK"];

		for(var rmk in rmks){
			console.log("Remark n° "+rmk);
			console.log(rmks[rmk]);
		}
	}
	var printModels = function(protein){
		var mdls = protein["MODEL"];

		for(var mdl in mdls){
			console.log("Model n° "+mdl);
			console.log(mdls[mdl]);
		}
	}
	var printModeln = function(protein,n){
		n = n || 1;
		
		console.log("Model n° "+n);
		console.log(protein["MODEL"][n]);
		
	}

	//printRemarks(protein);
	//printModeln(protein);
	return protein;
};


/// Exports
exports.parsePDB = parsePDB;