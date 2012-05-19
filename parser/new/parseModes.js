

var putils = require("./parserUtils");
var rp = require("./recordParser");

var LineScanner = putils.LineScanner;
var strim = putils.strim;
var getRecordParsingFunction = rp.getRecordParsingFunction;


	var parseIncremental = function(protein,type,line,scanner) {
		var NOF_fname = "NOF_"+strim(type); // es : NOF_HELIX sta per Number Of Helix(es)

		var quantity = protein[NOF_fname];

		if (quantity == undefined){ //inizializzo il campo
			protein[NOF_fname] = 0;
			quantity = 0;
		}

		protein[NOF_fname] = protein[NOF_fname]+1;
		var thisRecordNumber = quantity +1;

		var recordParsingFunction = getRecordParsingFunction(type);
		protein[strim(type)+"_"+thisRecordNumber] = recordParsingFunction(type,line,scanner); 
		
		//	parsa l' "oggetto" del pdb che inizia a quella linea (che puo' essere lungo una o piu' linee)
		//	es: HELIX_1 = helix json parsato
		//		MODEL_1 = model json parsato che contiene tutti i suoi ATOM ecc.. parsati 
		//	(nota: quindi potrebbe essere utilizzato nextline() dalla funzione)
		
	};

	var parseFakeModel = function (protein,type,line,scanner){
		protein['NOF_MODEL'] = 1;
		protein['MODEL_1'] = getRecordParsingFunction("MODEL ")(type,line,scanner);
	}

	var parseNested = function (protein,type,line,scanner){

		if(  (typeof protein[type]) === "undefined" ){ //e' il primo record di questo tipo, creo la struttura
			protein[type] = {
				"size" : 0 		//il numero di record di questo tipo presenti nella collezione
			};
		}

		//i record vengono inseriti in questo modo
		// 1 : {json}
		// 2 : {json}
		// ecc.. dove la chiave è anche il numero seriale del record.

		//TODO


	}

	var parseUnique = function(protein,type,line,scanner) {
		var recordParsingFunction = getRecordParsingFunction(type);
		protein[strim(type)] = recordParsingFunction(type,line,scanner);
	};
	
	// NdFurio: Prima le funzioni, poi l'array di funzioni o impazzisce.
	
	var parsingMode = {

//		"ATOM  " : parseIncremental, // questo modo di parsate l'ATOM viene utilizzato SOLO se l'ATOM NON è dentro un MODEL
//		"ANISOU" : parseIncremental, // idem
//		"HETATM" : parseIncremental, // idem
//		"TER   " : parseIncremental, // idem

		"ATOM  " : parseFakeModel, // questo modo di parsate l'ATOM viene utilizzato SOLO se l'ATOM NON è dentro un MODEL
		"ANISOU" : parseFakeModel, // idem
		"HETATM" : parseFakeModel, // idem
		"TER   " : parseFakeModel, // idem


		"MODEL " : parseIncremental,
		"HELIX " : parseIncremental,
		"SHEET " : parseIncremental,
		"REMARK" : parseIncremental, //migliorabile

		 //1 line multiple times
		"CISPEP" : parseIncremental,
		"CONECT" : parseIncremental,
		"DBREF " : parseIncremental,
		"HET   " : parseIncremental,
		"LINK  " : parseIncremental,
		"MTRIX1" : parseIncremental,
		"MTRIX2" : parseIncremental,
		"MTRIX3" : parseIncremental,		      
		"REVDAT" : parseIncremental,
		"SEQADV" : parseIncremental,
		"SSBOND" : parseIncremental,

		"FORMUL" : parseIncremental, //multiple lines multiple times
		"HETNAM" : parseIncremental,
		"HETSYN" : parseIncremental,
		"SEQRES" : parseIncremental,
		"SITE  " : parseIncremental,

		"default" : parseUnique
	};
	
	var getParsingMode = function(type) {
		return (parsingMode[type] || parsingMode["default"]);
	};	




//---------- EXPORTS ------------

exports.getParsingMode = getParsingMode;