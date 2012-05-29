var mdata = require('./parserMetaData');
var parsingInfo = mdata.parsingInfo;
var getParsingInfo = mdata.getParsingInfo;

var putils = require("./parserUtils");
var LineScanner = putils.LineScanner;
var strim = putils.strim;
var insertNested = putils.insertNested;


var parseLineSimple = function(type,line,scanner) {
	var simpleParsedLine = {
		"type" : strim(type),
		"content" : strim(line.substring(6))
	};

	return simpleParsedLine;
};

//scanner non usato, questa funzione guarda solo il contenuto di questa linea.
var parseLineContent = function (type,line,scanner) { 

	
	if (type == undefined || type == null || type == "") {
		throw "Type undefined";
	}
	
	var assocs = getParsingInfo(type);

	var parsedLine = {
		//"type" : strim(type)
	};

	assocs.forEach(function(fieldInfo,index,array) {
		// finfo[0]: start column
		// finfo[1]: end column
		// finfo[2]: fname

		var fname = fieldInfo[2];

		// console.log("fname: "+fname);

		var fnameFixed = fname;
		var i=0;

		while(! ((typeof parsedLine[fnameFixed]) === "undefined")){
			// console.log("ff1 :"+parsedLine[fnameFixed]);
			i++;
			fnameFixed = fname+"_"+i;
			// console.log("ff2 :"+parsedLine[fnameFixed]);
		}

		// console.log("fnameFixed: "+fnameFixed)



		parsedLine[fnameFixed] = strim(line.substring(fieldInfo[0]-1,fieldInfo[1]));
	});
	
	return parsedLine;
}


var parseModel = function(type,line,scanner) {
	var isFakeModel = false;

	var lineType = line.substring(0,6);

	var parsedModel;

	if (lineType != "MODEL ") { //fake model, succede se i record ATOM ecc non sono racchiusi in un model.
		parsedModel = {"type" : "MODEL", serial : 1}; //init fake model info
		isFakeModel = true;
		scanner.goBack1();
	} else {
		parsedModel = parseLineContent(type,line,scanner); //type e serial, e allo stesso json aggiungo gli atomi come R_1, R_2 ecc..
	}

	var endModel = false;
	var i = 1;
	var modelLine;
	var modelLineType;

	while (true) {
		modelLine = scanner.nextLine();
		modelLineType = modelLine.substring(0,6);

		if(isFakeModel){
			var keepon = (modelLineType == "ATOM  ") || (modelLineType == "HETATM") || (modelLineType == "ANISOU") || (modelLineType == "TER   ");
			if(!keepon){
				scanner.goBack1();
				return parsedModel;
			}
		}

		if ( modelLineType != "ENDMDL" ) {

			var parsedLine = parseLineContent(modelLineType,modelLine);

			insertNested(parsedModel,parsedLine["type"],parsedLine,i);

			i++;
			
		} else {
			return parsedModel;
		}
	}
};


var recordParsingFunctions = {

	"MODEL " : parseModel,
	"HELIX " : parseLineContent,
	"SHEET " : parseLineContent,
	"ATOM  " : parseLineContent,
	"HETATM" : parseLineContent,
	"ANISOU" : parseLineContent,
	"TER   " : parseLineContent,
	"REMARK" : parseLineContent,
	
	//...

	"default": parseLineContent //TODO (semplice, schiaffa la stringa intera apparte il type, da usare per i 1 line 1 time da non interpretare)
};
	
var getRecordParsingFunction = function (type) { //ritorna una function(line,scanner) relativa al tipo di oggetto desiderato
	return recordParsingFunctions[type] || recordParsingFunctions["default"];
};


// ----- exports ----


exports.parseLineContent = parseLineContent;
exports.getRecordParsingFunction = getRecordParsingFunction;