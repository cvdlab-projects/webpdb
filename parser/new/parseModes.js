

var putils = require("./parserUtils");
var rp = require("./recordParser");

var LineScanner = putils.LineScanner;
var strim = putils.strim;
var getRecordParsingFunction = rp.getRecordParsingFunction;
var insertNested = putils.insertNested;



	var parseFakeModel = function (protein,type,line,scanner){
		var parsingMode = getParsingMode("MODEL ");
		parsingMode(protein,"MODEL ",line,scanner);
	}

	var parseNested = function (protein,type,line,scanner){

		var recordParsingFunction = getRecordParsingFunction(type);
		var parsedRecord = recordParsingFunction(type,line,scanner);

		insertNested(protein,type,parsedRecord);

		// if(  (typeof protein[strim(type)]) === "undefined" ){ //e' il primo record di questo tipo, creo la struttura
		// 	protein[strim(type)] = {
		// 		"count" : 0 		//il numero di record di questo tipo presenti nella collezione
		// 	};
		// }

		// //i record vengono inseriti in questo modo
		// // 1 : {json}
		// // 2 : {json}
		// // ecc.. dove la chiave è anche il numero seriale del record.



		// var thisRecordNumber = ++protein[strim(type)]["count"];  //calcolo il numero seriale di questo record, e aggiorno il "size"

		// var recordParsingFunction = getRecordParsingFunction(type);

		// protein[strim(type)][thisRecordNumber] = recordParsingFunction(type,line,scanner);
	}

	var parseRemark = function (protein,type,line,scanner){


		var recordParsingFunction = getRecordParsingFunction(type);
		var parsedRemark = recordParsingFunction(type,line,scanner);

		var remarkName  = parsedRemark["remarkNum"]

		if(  (typeof protein[strim(type)]) === "undefined" ){
			protein[strim(type)] = {};
		}

	if(  (typeof (protein[strim(type)][remarkName]) ) === "undefined" ){
		protein[strim(type)][remarkName] = parsedRemark;
		protein[strim(type)][remarkName]["content"] = [protein[strim(type)][remarkName]["content"]]; //metto il content sotto forma di array di stringhe
	} else {
		protein[strim(type)][remarkName]["content"].push(parsedRemark["content"]);
	}

	}

	var parseUnique = function(protein,type,line,scanner) {
		var recordParsingFunction = getRecordParsingFunction(type);
		protein[strim(type)] = recordParsingFunction(type,line,scanner);
	};
	
	
	var parsingMode = {

//		"ATOM  " : parseIncremental, // questo modo di parsate l'ATOM viene utilizzato SOLO se l'ATOM NON è dentro un MODEL
//		"ANISOU" : parseIncremental, // idem
//		"HETATM" : parseIncremental, // idem
//		"TER   " : parseIncremental, // idem

		"ATOM  " : parseFakeModel, // questo modo di parsate l'ATOM viene utilizzato SOLO se l'ATOM NON è dentro un MODEL
		"ANISOU" : parseFakeModel, // idem
		"HETATM" : parseFakeModel, // idem
		"TER   " : parseFakeModel, // idem


		"MODEL " : parseNested,
		"HELIX " : parseNested,
		"SHEET " : parseNested,
		"REMARK" : parseRemark, //migliorabile

		 //1 line multiple times
		"CISPEP" : parseNested,
		"CONECT" : parseNested,
		"DBREF " : parseNested,
		"HET   " : parseNested,
		"LINK  " : parseNested,
		"MTRIX1" : parseNested,
		"MTRIX2" : parseNested,
		"MTRIX3" : parseNested,		      
		"REVDAT" : parseNested,
		"SEQADV" : parseNested,
		"SSBOND" : parseNested,

		"FORMUL" : parseNested, //multiple lines multiple times
		"HETNAM" : parseNested,
		"HETSYN" : parseNested,
		"SEQRES" : parseNested,
		"SITE  " : parseNested,

		"default" : parseUnique
	};
	
	var getParsingMode = function(type) {
		return (parsingMode[type] || parsingMode["default"]);
	};	




//---------- EXPORTS ------------

exports.getParsingMode = getParsingMode;