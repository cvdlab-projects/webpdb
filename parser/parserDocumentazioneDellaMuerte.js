var putils = require("./parserUtils");

var LineScanner = putils.LineScanner;

// INPUT: 
//  1 -  6       Record name   "OBSLTE"
//  9 - 10       Continuation  continuation  Allows concatenation of multiple records
// 12 - 20       Date          repDate       Date that this entry was replaced.
// 22 - 25       IDcode        idCode        ID code of this entry.
// 32 - 35       IDcode        rIdCode       ID code of entry that replaced this one.
// 37 - 40       IDcode        rIdCode       ID code of entry that replaced this one.
// 42 - 45       IDcode        rIdCode       ID code of entry  that replaced this one.
// 47 - 50       IDcode        rIdCode       ID code of entry that replaced this one.
// 52 - 55       IDcode        rIdCode       ID code of entry that replaced this one.
// 57 - 60       IDcode        rIdCode       ID code of entry that replaced this one.
// 62 - 65       IDcode        rIdCode       ID code of entry that replaced this one.
// 67 - 70       IDcode        rIdCode       ID code of entry that replaced this one.
// 72 - 75       IDcode        rIdCode       ID code of entry that replaced this one.

//OUTPUT:
//[[1,6,type],[9,19,"continuation"],...]

var parserDellaMuerte = function(string){
	var scanner = new LineScanner (string);
	scanner.nextLine();
	var ars = [];

	while(true){
		try{
			var parsed = parseDocChunk(scanner);
			ars.push(parsed);
		} catch(e){
			console.log(e);
			break;
		}
	}

	stampaBene(ars);
}

var stampaBene = function (arr){
	var linea;
	var a;
	var assocsString = "";

	for (var i=0; i<arr.length;i++){ //singola assocs
		a = arr[i];
		linea = "var "+putils.strim(a[0][2])+"Assocs = [";
		for(var j=1;j<a.length;j++){
			linea = linea+"["+a[j][0]+","+(a[j][1]==""? (Number(a[j][0])+1) : a[j][1] )+",\""+a[j][2]+"\""+"]"+(j==a.length-1? "" : ",");
		}
		linea = linea+"];"

		console.log(linea);

		assocsString = assocsString+"	\""+a[0][2]+"\" : "+putils.strim(a[0][2])+"Assocs,\n"
	}
		console.log(assocsString);

}

var parseDocChunk = function(scanner){

	var metaData = [];

	var cl = scanner.getCurrentLine();

	if(cl == "#"){
		scanner.nextLine();
	} else if (cl.indexOf(" 1 -  6") == 0){
		//ok
	} else {
		console.log(cl);
		throw "bad invocation";
	}

	if(scanner.getCurrentLine() == "EOF"){
		throw "EOF";
	}

	metaData.push(parseDocLine(scanner.getCurrentLine()));

	scanner.nextLine(); //scarto la prima linea del record name


	metaData.push([1,6,"type"]);

	while(true){
		var line = scanner.getCurrentLine();
		if(line === "#"){
			break;
		} else if (line.charAt(0)=="#"){
			//e' un commento, ignoro
		} else {
			metaData.push(parseDocLine(line));
		}
		scanner.nextLine();
	}

	return metaData;

}


var parseDocLine = function (string){
	var i1 = putils.strim(string.substring(0,2));
	var i2 = putils.strim(string.substring(5,7));
	var name = putils.strim(string.substring(28,42));

	if (name.charAt(0)=="\""){
		name = name.substring(1);
	}
	if (name.charAt(name.length-1)=="\""){
		name = name.substring(0,name.length-1);
	}

	return [i1,i2,name];
}



var reader = require("../fileexplore/fileReader");



var cback = function(bool,string,strname){
	parserDellaMuerte(string);
}


reader.readPDBData("./primiRecords.log",cback);

