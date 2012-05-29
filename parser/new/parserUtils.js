

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

var isWhitespace = function (char){
	return char == ' ';
}


function ltrim(str) { 
	for(var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++);
	return str.substring(k, str.length);
}
function rtrim(str) {
	for(var j=str.length-1; j>=0 && isWhitespace(str.charAt(j)) ; j--) ;
	return str.substring(0,j+1);
}

var strim = function(string){
	return ltrim(rtrim(string));
}

var insertNested = function (container,type,parsedRecord,index){
	if(  (typeof container[strim(type)]) === "undefined" ){ //e' il primo record di questo tipo, creo la struttura
			container[strim(type)] = {
				"_count" : 0 		//il numero di record di questo tipo presenti nella collezione
			};
		}

		//i record vengono inseriti in questo modo
		// 1 : parsedRecord
		// 2 : parsedRecord
		// ecc.. dove la chiave è anche il numero seriale del record.

		var thisRecordNumber = ++container[strim(type)]["_count"];  //calcolo il numero seriale di questo record, e aggiorno il "size"

		var useRecordIndex = function(tname){
			return (tname === "ATOM" || tname === "CONECT" || tname === "HETATM");
		}


		if(useRecordIndex(type)){
			thisRecordNumber = index;
		}


		container[strim(type)][thisRecordNumber] = parsedRecord;
}

var printJsonRecursive = function (json){

//come console.log
//console.dir(json);

//--------------------------------
	//console.log("log");
	//console.log(json);

//  buono, ma non mette le newline
//	console.log(JSON.stringify(json));

var replacer = undefined;
var space = '\t';

console.log(JSON.stringify(json,replacer,space));
	
//--------------------------------

	// console.log("{");

	// for (var key in json){

	// }

	// console.log("}");
}

// ------------- EXPORTS ------------------

exports.LineScanner = LineScanner;
exports.strim = strim;
exports.insertNested = insertNested;
exports.printJsonRecursive = printJsonRecursive;