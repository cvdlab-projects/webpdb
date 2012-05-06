var mdata = require('./parserMetaData');
var parsingInfo = mdata.parsingInfo;

// oggetto scanner
// da istanziare come oggetto, TODO aggiungere il magheggio per controllare che sia stato costruito come oggetto
var LineScanner = function(string,startIndex) { 
	this.scannedString = string;
	this.scannedStringLength = this.scannedString.length;

	this.ind = startIndex || 0;
	this.endOfLine;

	this.currentLine;
};

LineScanner.prototype.setIndex = function(newIndex) {
	this.ind = newIndex;
};
	
LineScanner.prototype.getIndex = function() {
	return this.ind;
};

LineScanner.prototype.nextLine = function() {
	this.endOfLine = this.scannedString.indexOf("\n", this.ind);
	if (this.endOfLine == -1) {
		this.endOfLine = this.scannedStringLength
	};

	this.currentLine = this.scannedString.substring(this.ind, this.endOfLine);
	this.ind = this.endOfLine+1;

	return this.currentLine;
};

LineScanner.prototype.hasNextLine = function() {
	return (this.ind < this.scannedStringLength);
};

var strim = function(string){
	if(string.trimLeft != undefined || string.trimRight != undefined){
		return string.trimRight().trimLeft();
	} else if (string.ltrim != undefined || string.rtrim != undefined){
		return string.ltrim().strim();
	}
}

// ---------------------------------funzioni per il parsing:---------------------------------

var parseLineSimple = function(type,line,scanner) {
	var simpleParsedLine = {
		"type" : strim(type),
		"content" : line.substring(6)
	};

	return simpleParsedLine;
};

//scanner non usato, questa funzione guarda solo il contenuto di questa linea.
var parseLineContent = function (type,line,scanner) { 

	
	if (type == undefined || type == null || type == "") {
		throw "Type undefined";
	}
	
	var assocs = parsingInfo[type];

	var parsedLine = {
		"type" : strim(type)
	};

	assocs.forEach(function(fieldInfo,index,array) {
		// finfo[0]: start column
		// finfo[1]: end column
		// finfo[2]: fname
		parsedLine[fieldInfo[2]] = strim(line.substring(fieldInfo[0]-1,fieldInfo[1]));
	});
	
	return parsedLine;
}


var parseModel = function(type,line,scanner) {
	if (type != "MODEL ") {
		throw "this is not a model.";
	};

	var parsedModel = parseLineContent(type,line,scanner); //type e serial, e allo stesso json aggiungo gli atomi come R_1, R_2 ecc..

	var endModel = false;
	var i = 1;
	var modelLine;
	var modelLineType;

	while (!endModel) {
		modelLine = scanner.nextLine();
		modelLineType = modelLine.substring(0,6);
		
		if ( modelLineType != "ENDMDL" ) {
			parsedModel["r_"+i] = parseLineContent(modelLineType,modelLine);
			i++;
		} else {
			endModel = true;
		}
	}

	return parsedModel;
};

var objectParsingFunctions = {
	"MODEL " : parseModel, //TODO
	"HELIX " : parseLineContent, //variare qui le funzioni per stabilire se fare cutSpaces o no
	"SHEET " : parseLineContent,
	"ATOM  " : parseLineContent,
	"HETATM" : parseLineContent,
	"ANISOU" : parseLineContent,
	"TER   " : parseLineContent,

	//...

	"REMARK" : parseLineSimple, //migliorabile
	"default": parseLineSimple //TODO (semplice, schiaffa la stringa intera apparte il type, da usare per i 1 line 1 time da non interpretare)
};
	
var getObjectParsingFunction = function (type) { //ritorna una function(line,scanner) relativa al tipo di oggetto desiderato
	return objectParsingFunctions[type] || objectParsingFunctions["default"];
};

// ------------- EXPORTS ------------------

exports.LineScanner = LineScanner;
exports.parseLineContent = parseLineContent;
exports.getObjectParsingFunction = getObjectParsingFunction;
exports.strim = strim;