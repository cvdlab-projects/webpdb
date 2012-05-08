
// ---------------------------------dati:---------------------------------

var helixAssocs = [[1,6,"type"],[8,10,"serNum"],[12,14,"helixID"],[16,18,"initResName"],[20,20,"initChainID"],[22,25,"initSeqNum"],[26,26,"initICode"],[28,30,"endResName"],[32,32,"endChainID"],[34,37,"endSeqNum"],[38,38,"endICode"],[39,40,"helixClass"],[41,70,"comment"],[72,76,"length"]];
var sheetAssocs = [[1,6,"type"],[8,10,"strand"],[12,14,"sheetID"],[15,16,"numStrands"],[18,20,"initResName"],[22,22,"initChainID"],[23,26,"initSeqNum"],[27,27,"initICode"],[29,31,"endResName"],[33,33,"endChainID"],[34,37,"endSeqNum"],[38,38,"endICode"],[39,40,"sense"],[42,45,"curAtom"],[46,48,"curResName"],[50,50,"curChainId"],[51,54,"curResSeq"],[55,55,"curICode"],[57,60,"prevAtom"]];


var modelAssocs = [[1,6,"type"],[11,14,"serial"]];
var atomAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
var hetatmAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
var anisouAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[29,35,"u[0][0]"],[36,42,"u[1][1]"],[43,49,"u[2][2]"],[50,56,"u[0][1]"],[57,63,"u[0][2]"],[64,70,"u[1][2]"],[77,78,"element"]];
var terAssocs = [[1,6,"type"],[7,11,"serial"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"]];


var parsingInfo = { // la chiave e' di 6 caratteri, comprende gli spazi finali
	"HELIX " : helixAssocs,
	"SHEET " : sheetAssocs,
	"MODEL " : modelAssocs,
	"ATOM  " : atomAssocs,
	"HETATM" : hetatmAssocs,
	"TER   " : terAssocs,
	"ANISOU" : anisouAssocs
};


exports.parsingInfo = parsingInfo;