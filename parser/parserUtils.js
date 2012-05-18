var mdata = require('./parserMetaData');
var parsingInfo = mdata.parsingInfo;
var getParsingInfo = mdata.getParsingInfo;

// oggetto scanner
// da istanziare come oggetto, TODO aggiungere il magheggio per controllare che sia stato costruito come oggetto
var LineScanner = function(string,startIndex) { 
	this.scannedString = string;
	this.scannedStringLength = this.scannedString.length;

	this.ind = startIndex || 0;
	this.endOfLine;

	this.currentLine;

	this.previousLineIndex;

};

LineScanner.prototype.setIndex = function(newIndex) {
	this.ind = newIndex;
};
	
LineScanner.prototype.getIndex = function() {
	return this.ind;
};

LineScanner.prototype.getCurrentLine = function(){
	return this.currentLine;
}

LineScanner.prototype.updateCurrentLine = function(){
	this.endOfLine = this.scannedString.indexOf("\n", this.ind);
	if (this.endOfLine == -1) {
		this.endOfLine = this.scannedStringLength
	};

	this.currentLine = this.scannedString.substring(this.ind, this.endOfLine);
}

LineScanner.prototype.goBack1 = function(){ // nota: NON puo' essere usata piu' volte di seguito.
	this.ind = this.previousLineIndex;
	this.updateCurrentLine();
}

LineScanner.prototype.nextLine = function() {

	if(this.ind >= this.scannedStringLength){
		throw "EOF";
	}

	this.previousLineIndex = this.ind;

	this.updateCurrentLine();

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

	if (type != "MODEL ") { //fake model, succede se i record ATOM ecc non sono racchiusi in un model.
		var parsedModel = {"type" : "MODEL", serial : "1"}; //TODO init fake model info
		isFakeModel = true;
		scanner.goBack1();
	} else {
		var parsedModel = parseLineContent(type,line,scanner); //type e serial, e allo stesso json aggiungo gli atomi come R_1, R_2 ecc..
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
			parsedModel["r_"+i] = parseLineContent(modelLineType,modelLine);
			i++;
		} else {
			return parsedModel;
		}
	}
};

var objectParsingFunctions = {

	"MODEL " : parseModel,
	"HELIX " : parseLineContent, //variare qui le funzioni per stabilire se fare cutSpaces o no
	"SHEET " : parseLineContent,
	"ATOM  " : parseLineContent,
	"HETATM" : parseLineContent,
	"ANISOU" : parseLineContent,
	"TER   " : parseLineContent,

	//...

	"REMARK" : parseLineSimple, //migliorabile
	"default": parseLineContent //TODO (semplice, schiaffa la stringa intera apparte il type, da usare per i 1 line 1 time da non interpretare)
};
	
var getObjectParsingFunction = function (type) { //ritorna una function(line,scanner) relativa al tipo di oggetto desiderato
	return objectParsingFunctions[type] || objectParsingFunctions["default"];
};

// ------------- EXPORTS ------------------

exports.LineScanner = LineScanner;
exports.parseLineContent = parseLineContent;
exports.getObjectParsingFunction = getObjectParsingFunction;
exports.strim = strim;