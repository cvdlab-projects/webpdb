// EXPORT :




// INFO:

var helixAssocs = [[1,6,"type"],[8,10,"serNum"],[12,14,"helixID"],[16,18,"initResName"],[20,20,"initChainID"],[22,25,"initSeqNum"],[26,26,"initICode"],[28,30,"endResName"],[32,32,"endChainID"],[34,37,"endSeqNum"],[38,38,"endICode"],[39,40,"helixClass"],[41,70,"comment"],[72,76,"length"]];
var sheetAssocs = [[1,6,"type"],[8,10,"strand"],[12,14,"sheetID"],[15,16,"numStrands"],[18,20,"initResName"],[22,22,"initChainID"],[23,26,"initSeqNum"],[27,27,"initICode"],[29,31,"endResName"],[33,33,"endChainID"],[34,37,"endSeqNum"],[38,38,"endICode"],[39,40,"sense"],[42,45,"curAtom"],[46,48,"curResName"],[50,50,"curChainId"],[51,54,"curResSeq"],[55,55,"curICode"],[57,60,"prevAtom"]];


var modelAssocs = [[1,6,"type"],[11,14,"serial"]];
var atomAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
var hetatmAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
var anisouAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[29,35,"u[0][0]"],[36,42,"u[1][1]"],[43,49,"u[2][2]"],[50,56,"u[0][1]"],[57,63,"u[0][2]"],[64,70,"u[1][2]"],[77,78,"element"]];
var terAssocs = [[1,6,"type"],[7,11,"serial"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"]];


var parsingInfo = {
	"HELIX" : helixAssocs,
	"SHEET" : sheetAssocs,
	"MODEL" : modelAssocs,
	"ATOM" : atomAssocs,
	"HETATM" : hetatmAssocs,
	"TER" : terAssocs,
	"ANISOU" : anisouAssocs
};


// PARSING :

var currentLineIndex;


var parseLineOLD = function (line,type) {

	if(type == undefined || type == null || type == ""){
		return null;
	}
	var assocs = parsingInfo[type];


	var parsedLine = {};
	var fieldInfoIndex;
	var fieldInfo;
	for(fieldInfoIndex in assocs){
		// finfo[0]: start column
		// finfo[1]: end column
		// finfo[2]: fname
		fieldInfo = assocs[fieldInfoIndex];
		parsedLine[fieldInfo[2]] = line.substring(fieldInfo[0],fieldInfo[1]+1);
		// NON RIMUOVE GLI SPAZI SUPERFLUI!!!
	}
	return parsedLine;
}
var parseLine = function (line,type) {

	if(type == undefined || type == null || type == ""){
		return null;
	}
	var assocs = parsingInfo[type] || [];

	// console.log(line + "-" + type);
	var parsedLine = {};

	assocs.forEach(function(fieldInfo,index,array){
		// finfo[0]: start column
		// finfo[1]: end column
		// finfo[2]: fname
		parsedLine[fieldInfo[2]] = line.substring(fieldInfo[0]-1,fieldInfo[1]);
		// NON RIMUOVE GLI SPAZI SUPERFLUI!!!
	});
	return parsedLine;
}


var ppdbnub = function(pdb){return parsePDB(true,pdb,"lol");};

var parsePDB = function (allGoingWell,pdbString,proteinID){
	if(!allGoingWell){
		throw "Read unsuccesful";
	}


	var lastNLInd = 0;
	var newNLInd;
	var nl = "\n";

	var pdb = {};
	var line;

	var i = 0;

	while(true){
		newNLInd = pdbString.indexOf(nl, lastNLInd);
		if(newNLInd == lastNLInd || newNLInd == -1 || newNLInd == pdbString.length){break;}
		line = pdbString.substring(lastNLInd, newNLInd);
		
		// if(line == null || line == undefined || line == ""){
		// 	break;
		// }

		var type = line.split(" ")[0];
		pdb["r_"+i]=parseLine(line,type);

		lastNLInd = newNLInd+1;
		i++;

	}

	return pdb;

}



//TEST:

 var parsedLine = parseLine("ATOM     50  CG  GLU A   4      18.057  25.754   8.986  1.00  0.00           C  ","ATOM");


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
"ATOM     33  CB  VAL A   3      16.301  23.473   3.660  1.00  0.00           C  ","lol");


exports.parsePDB = parsePDB;