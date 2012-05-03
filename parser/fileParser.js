// ----------------------require-----------------

var utils = require('parserUtils');

var parseLineContent = utils.parseLineContent;
var LineScanner = utils.LineScanner;
var getObjectParsingFunction = utils.getObjectParsingFunction;

// ---------------------------------funzione da esportare:---------------------------------


var parsePDB = function (allGoingWell,pdbString,proteinID){
	if(!allGoingWell){
		throw "Read unsuccesful";
	}

	//-------init json-------
	var protein = {
		"ID" : proteinID
	};

	//-------VARIABILI "globali" di parsing-------
	var scanner = new LineScanner(pdbString,0);

//	var pdbStringLength = pdbString.length; (sostituito dallo scanner)
//	var currentLineStartIndex = 0;
//	var nl = "\n";



	// -------funzioni che hanno bisogno di questo scope:-------

	var parsingFunctions = {
		"MODEL " : parseIncremental,
		"HELIX " : parseIncremental,
		"SHEET " : parseIncremental,
		"REMARK" : parseIncremental, //migliorabile
		"default" : parseUnique
	};
	var getParsingFunction = function(type){
		return (parsingFunctions[type] || parsingFunctions["default"]);
	}


	var parseIncremental = function(protein,type,line,scanner){
		var NOF_fname = "NOF_"+type; // es : NOF_HELIX sta per Number Of Helix(es)

		var quantity = protein[NOF_fname];

		if (quantity == undefined){ //inizializzo il campo
			protein[NOF_fname] = 0;
			quantity = 0;
		}

		protein[NOF_fname] = protein[NOF_fname]+1;
		var thisRecordNumber = quantity +1;

		var objectParsingFunction = getObjectParsingFunction(type);
		protein[type+"_"+thisRecordNumber] = objectParsingFunction(type,line,scanner);// parsa l' "oggetto" del pdb che inizia a quella linea (che puo' essere lungo una o piu' linee)
																	//es: HELIX_1 = helix json parsato
																 	//	 MODEL_1 = model json parsato che contiene tutti i suoi ATOM ecc.. parsati (nota: quindi potrebbe essere utilizzato nextline() dalla funzione)
	}

	var parseUnique = function(protein,type,line,scanner){
		var objectParsingFunction = getObjectParsingFunction(type);
		protein[type] = objectParsingFunction(type,line,scanner);
	}




	//---------------------------------------------------parsing:------------------------------------------------



//	var line = nextLine(); (sostituito dallo scanner)
	var line;

	while(scanner.hasNextLine()){

		line = scanner.nextLine();
		var type = line.substring(0,6);

		var parsingFunction = getParsingFunction(type);

		parsingFunction(protein,type,line,scanner); //la linea corrente puo' anche essere ottenuta dallo scanner (scanner.currentLine());
							//NOTA: la parsingFunction puo' fare uso della funzione scanner.nextLine(),
							//quindi la nuova line non e' necessariamente quella che seguiva la vecchia.
	}


}

// --------------------------------------------------------------exports--------------------------------------------


exports.parsePDB = parsePDB;




//// OLD

/*
	var nextLine = function (){
		if(currentLineStartIndex >= pdbStringLength){
			return "EOF";
		}

		endOfLineIndex = pdbString.indexOf(nl, currentLineStartIndex);

		if(endOfLineIndex == -1){
			endOfLineIndex = pdbStringLength;
		}
		
		var line = pdbString.substring(currentLineStartIndex, endOfLineIndex);
		currentLineStartIndex = endOfLineIndex+1;
		return line;
	}*/