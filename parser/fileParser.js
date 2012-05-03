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

/// Exports


exports.parsePDB = parsePDB;

/// Testing

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