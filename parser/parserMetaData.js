var putils = require("./parserUtils");
var strim = putils.strim;

// ---------------------------------dati:---------------------------------
var maxPDBLineLength = 80;


var helixAssocs = [[1,6,"type"],[8,10,"serNum"],[12,14,"helixID"],[16,18,"initResName"],[20,20,"initChainID"],[22,25,"initSeqNum"],[26,26,"initICode"],[28,30,"endResName"],[32,32,"endChainID"],[34,37,"endSeqNum"],[38,38,"endICode"],[39,40,"helixClass"],[41,70,"comment"],[72,76,"length"]];
var sheetAssocs = [[1,6,"type"],[8,10,"strand"],[12,14,"sheetID"],[15,16,"numStrands"],[18,20,"initResName"],[22,22,"initChainID"],[23,26,"initSeqNum"],[27,27,"initICode"],[29,31,"endResName"],[33,33,"endChainID"],[34,37,"endSeqNum"],[38,38,"endICode"],[39,40,"sense"],[42,45,"curAtom"],[46,48,"curResName"],[50,50,"curChainId"],[51,54,"curResSeq"],[55,55,"curICode"],[57,60,"prevAtom"]];


//OLD
// var modelAssocs = [[1,6,"type"],[11,14,"serial"]];
// var atomAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
// var hetatmAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
// var anisouAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,17,"altLoc"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"],[29,35,"u[0][0]"],[36,42,"u[1][1]"],[43,49,"u[2][2]"],[50,56,"u[0][1]"],[57,63,"u[0][2]"],[64,70,"u[1][2]"],[77,78,"element"]];
// var terAssocs = [[1,6,"type"],[7,11,"serial"],[18,20,"resName"],[22,22,"chainID"],[23,26,"resSeq"],[27,27,"iCode"]];

//title section

var HEADERAssocs = [[1,6,"type"],[11,50,"classificatio"],[51,59,"depDate"],[63,66,"idCode"]];
var OBSLTEAssocs = [[1,6,"type"],[9,10,"continuation"],[12,20,"repDate"],[22,25,"idCode"],[32,35,"rIdCode"],[37,40,"rIdCode"],[42,45,"rIdCode"],[47,50,"rIdCode"],[52,55,"rIdCode"],[57,60,"rIdCode"],[62,65,"rIdCode"],[67,70,"rIdCode"],[72,75,"rIdCode"]];
var TITLEAssocs = [[1,6,"type"],[9,10,"continuation"],[11,80,"title"]];
var SPLITAssocs = [[1,6,"type"],[9,10,"continuation"],[12,15,"idCode"],[17,20,"idCode"],[22,25,"idCode"],[27,30,"idCode"],[32,35,"idCode"],[37,40,"idCode"],[42,45,"idCode"],[47,50,"idCode"],[52,55,"idCode"],[57,60,"idCode"],[62,65,"idCode"],[67,70,"idCode"],[72,75,"idCode"],[77,80,"idCode"]];
var CAVEATAssocs = [[1,6,"type"],[9,10,"continuation"],[12,15,"idCode"],[20,79,"comment"]];
var COMPNDAssocs = [[1,6,"type"],[8,10,"continuation"],[11,80,"compound"]];
var SOURCEAssocs = [[1,6,"type"],[8,10,"continuation"],[11,79,"srcName"]];
var KEYWDSAssocs = [[1,6,"type"],[9,10,"continuation"],[11,79,"keywds"]];
var EXPDTAAssocs = [[1,6,"type"],[9,10,"continuation"],[11,79,"technique"]];
var NUMMDLAssocs = [[1,6,"type"],[11,14,"modelNumber"]];
var MDLTYPAssocs = [[1,6,"type"],[9,10,"continuation"],[11,80,"comment"]];
var AUTHORAssocs = [[1,6,"type"],[9,10,"continuation"],[11,79,"authorList"]];
var REVDATAssocs = [[1,6,"type"],[8,10,"modNum"],[11,12,"continuation"],[14,22,"modDate"],[24,27,"modId"],[32,33,"modType"],[40,45,"record"],[47,52,"record"],[54,59,"record"],[61,66,"record"]];
var SPRSDEAssocs = [[1,6,"type"],[9,10,"continuation"],[12,20,"sprsdeDate"],[22,25,"idCode"],[32,35,"sIdCode"],[37,40,"sIdCode"],[42,45,"sIdCode"],[47,50,"sIdCode"],[52,55,"sIdCode"],[57,60,"sIdCode"],[62,65,"sIdCode"],[67,70,"sIdCode"],[72,75,"sIdCode"]];

//primary - heterogeneous
var DBREFAssocs = [[1,6,"type"],[8,11,"idCode"],[13,14,"chainID"],[15,18,"seqBegin"],[19,20,"insertBegin"],[21,24,"seqEnd"],[25,26,"insertEnd"],[27,32,"database"],[34,41,"dbAccession"],[43,54,"dbIdCode"],[56,60,"dbseqBegin"],[61,62,"idbnsBeg"],[63,67,"dbseqEnd"],[68,69,"dbinsEnd"]];
var DBREF1Assocs = [[1,6,"type"],[8,11,"idCode"],[13,14,"chainID"],[15,18,"seqBegin"],[19,20,"insertBegin"],[21,24,"seqEnd"],[25,26,"insertEnd"],[27,32,"database"],[48,67,"dbIdCode"]];
var DBREF2Assocs = [[1,6,"type"],[8,11,"idCode"],[13,14,"chainID"],[19,40,"dbAccession"],[46,55,"seqBegin"],[58,67,"seqEnd"]];
var SEQADVAssocs = [[1,6,"type"],[8,11,"idCode"],[13,15,"resName"],[17,18,"chainID"],[19,22,"seqNum"],[23,24,"iCode"],[25,28,"database"],[30,38,"dbIdCode"],[40,42,"dbRes"],[44,48,"dbSeq"],[50,70,"conflict"]];
var SEQRESAssocs = [[1,6,"type"],[8,10,"serNum"],[12,13,"chainID"],[14,17,"numRes"],[20,22,"resName"],[24,26,"resName"],[28,30,"resName"],[32,34,"resName"],[36,38,"resName"],[40,42,"resName"],[44,46,"resName"],[48,50,"resName"],[52,54,"resName"],[56,58,"resName"],[60,62,"resName"],[64,66,"resName"],[68,70,"resName"]];
var MODRESAssocs = [[1,6,"type"],[8,11,"idCode"],[13,15,"resName"],[17,18,"chainID"],[19,22,"seqNum"],[23,24,"iCode"],[25,27,"stdRes"],[30,70,"comment"]];
var HETAssocs = [[1,6,"type"],[8,10,"hetID"],[13,14,"ChainID"],[14,17,"seqNum"],[18,19,"iCode"],[21,25,"numHetAtoms"],[31,70,"text"]];
var HETNAMAssocs = [[1,6,"type"],[9,10,"continuation"],[9,10,"compNum"],[13,15,"hetID"],[17,18,"continuation"],[19,20,"asterisk"],[20,70,"text"],[12,14,"hetID"],[16,70,"text"]];
var HETSYNAssocs = [[1,6,"type"],[9,10,"continuation"],[12,14,"hetID"],[16,70,"hetSynonyms"]];
var FORMULAssocs = [[1,6,"type"],[9,10,"compNum"],[13,15,"hetID"],[17,18,"continuation"],[19,20,"asterisk"],[20,70,"text"]];


//connectivity annotation to crystal sections
var SSBONDAssocs = [[1,6,"type"],[8,10,"serNum"],[12,14,"CYS"],[16,17,"chainID1"],[18,21,"seqNum1"],[22,23,"icode1"],[26,28,"CYS"],[30,31,"chainID2"],[32,35,"seqNum2"],[36,37,"icode2"],[60,65,"sym1"],[67,72,"sym2"],[74,78,"Length"]];
var LINKAssocs = [[1,6,"type"],[13,16,"name1"],[17,18,"altLoc1"],[18,20,"resName1"],[22,23,"chainID1"],[23,26,"resSeq1"],[27,28,"iCode1"],[43,46,"name2"],[47,48,"altLoc2"],[48,50,"resName2"],[52,53,"chainID2"],[53,56,"resSeq2"],[57,58,"iCode2"],[60,65,"sym1"],[67,72,"sym2"],[74,78,"Length"]];
var CISPEPAssocs = [[1,6,"type"],[8,10,"serNum"],[12,14,"pep1"],[16,17,"chainID1"],[18,21,"seqNum1"],[22,23,"icode1"],[26,28,"pep2"],[30,31,"chainID2"],[32,35,"seqNum2"],[36,37,"icode2"],[44,46,"modNum"],[54,59,"measure"]];
var SITEAssocs = [[1,6,"type"],[8,10,"seqNum"],[12,14,"siteID"],[16,17,"numRes"],[19,21,"resName1"],[23,24,"chainID1"],[24,27,"seq1"],[28,29,"iCode1"],[30,32,"resName2"],[34,35,"chainID2"],[35,38,"seq2"],[39,40,"iCode2"],[41,43,"resName3"],[45,46,"chainID3"],[46,49,"seq3"],[50,51,"iCode3"],[52,54,"resName4"],[56,57,"chainID4"],[57,60,"seq4"],[61,62,"iCode4"]];
var CRYST1Assocs = [[1,6,"type"],[7,15,"a"],[16,24,"b"],[25,33,"c"],[34,40,"alpha"],[41,47,"beta"],[48,54,"gamma"],[56,66,"sGroup"],[67,70,"z"]];
var ORIGX1Assocs = [[1,6,"type"],[11,20,"o[1][1]"],[21,30,"o[1][2]"],[31,40,"o[1][3]"],[46,55,"t[1]"]];
var ORIGX2Assocs = [[1,6,"type"],[11,20,"o[2][1]"],[21,30,"o[2][2]"],[31,40,"o[2][3]"],[46,55,"t[2]"]];
var ORIGX3Assocs = [[1,6,"type"],[11,20,"o[3][1]"],[21,30,"o[3][2]"],[31,40,"o[3][3]"],[46,55,"t[3]"]];
var SCALE1Assocs = [[1,6,"type"],[11,20,"s[1][1]"],[21,30,"s[1][2]"],[31,40,"s[1][3]"],[46,55,"u[1]"]];
var SCALE2Assocs = [[1,6,"type"],[11,20,"s[2][1]"],[21,30,"s[2][2]"],[31,40,"s[2][3]"],[46,55,"u[2]"]];
var SCALE3Assocs = [[1,6,"type"],[11,20,"s[3][1]"],[21,30,"s[3][2]"],[31,40,"s[3][3]"],[46,55,"u[3]"]];
var MTRIX1Assocs = [[1,6,"type"],[8,10,"serial"],[11,20,"m[1][1]"],[21,30,"m[1][2]"],[31,40,"m[1][3]"],[46,55,"v[1]"],[60,61,"iGiven"]];
var MTRIX2Assocs = [[1,6,"type"],[8,10,"serial"],[11,20,"m[2][1]"],[21,30,"m[2][2]"],[31,40,"m[2][3]"],[46,55,"v[2]"],[60,61,"iGiven"]];
var MTRIX3Assocs = [[1,6,"type"],[8,10,"serial"],[11,20,"m[3][1]"],[21,30,"m[3][2]"],[31,40,"m[3][3]"],[46,55,"v[3]"],[60,61,"iGiven"]];

//Coordinate section
var MODELAssocs = [[1,6,"type"],[11,14,"serial"]];
var ATOMAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,18,"altLoc"],[18,20,"resName"],[22,23,"chainID"],[23,26,"resSeq"],[27,28,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
var ANISOUAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,18,"altLoc"],[18,20,"resName"],[22,23,"chainID"],[23,26,"resSeq"],[27,28,"iCode"],[29,35,"u[0][0]"],[36,42,"u[1][1]"],[43,49,"u[2][2]"],[50,56,"u[0][1]"],[57,63,"u[0][2]"],[64,70,"u[1][2]"],[77,78,"element"],[79,80,"charge"]];
var TERAssocs = [[1,6,"type"],[7,11,"serial"],[18,20,"resName"],[22,23,"chainID"],[23,26,"resSeq"],[27,28,"iCode"]];
var HETATMAssocs = [[1,6,"type"],[7,11,"serial"],[13,16,"name"],[17,18,"altLoc"],[18,20,"resName"],[22,23,"chainID"],[23,26,"resSeq"],[27,28,"iCode"],[31,38,"x"],[39,46,"y"],[47,54,"z"],[55,60,"occupancy"],[61,66,"tempFactor"],[77,78,"element"],[79,80,"charge"]];
var ENDMDLAssocs = [[1,6,"type"]];

//connectivity to end
var CONECTAssocs = [[1,6,"type"],[7,11,"serial"],[12,16,"serial"],[17,21,"serial"],[22,26,"serial"],[27,31,"serial"]];
var MASTERAssocs = [[1,6,"type"],[11,15,"numRemark"],[16,20,"0"],[21,25,"numHet"],[26,30,"numHelix"],[31,35,"numSheet"],[36,40,"numTurn"],[41,45,"numSite"],[46,50,"numXform"],[,1,""],[51,55,"numCoord"],[,1,""],[56,60,"numTer"],[61,65,"numConect"],[66,70,"numSeq"]];
var ENDAssocs = [[1,6,"type"]];

//default
var defaultAssocs = [[1,6,"type"],[7,maxPDBLineLength,"content"]];

var parsingInfo = { // la chiave e' di 6 caratteri, comprende gli spazi finali
	"HELIX " : helixAssocs,
	"SHEET " : sheetAssocs,

	// "MODEL " : modelAssocs, old
	// "ATOM  " : atomAssocs,
	// "ANISOU" : anisouAssocs,
	// "TER   " : terAssocs,
	// "HETATM" : hetatmAssocs,

	"HEADER" : HEADERAssocs, //title section
	"OBSLTE" : OBSLTEAssocs,
	"TITLE " : TITLEAssocs ,
	"SPLIT " : SPLITAssocs ,
	"CAVEAT" : CAVEATAssocs,
	"COMPND" : COMPNDAssocs,
	"SOURCE" : SOURCEAssocs,
	"KEYWDS" : KEYWDSAssocs,
	"EXPDTA" : EXPDTAAssocs,
	"NUMMDL" : NUMMDLAssocs,
	"MDLTYP" : MDLTYPAssocs,
	"AUTHOR" : AUTHORAssocs,
	"REVDAT" : REVDATAssocs,
	"SPRSDE" : SPRSDEAssocs,

	"DBREF " : DBREFAssocs, // primary - heterogenous
	"DBREF1" : DBREF1Assocs,
	"DBREF2" : DBREF2Assocs,
	"SEQADV" : SEQADVAssocs,
	"SEQRES" : SEQRESAssocs,
	"MODRES" : MODRESAssocs,
	"HET   " : HETAssocs,
	"HETNAM" : HETNAMAssocs,
	"HETSYN" : HETSYNAssocs,
	"FORMUL" : FORMULAssocs,

	"SSBOND" : SSBONDAssocs,//connectivity annotation to crystal
	"LINK  " : LINKAssocs, 
	"CISPEP" : CISPEPAssocs,
	"SITE  " : SITEAssocs,
	"CRYST1" : CRYST1Assocs,
	"ORIGX1" : ORIGX1Assocs,
	"ORIGX2" : ORIGX2Assocs,
	"ORIGX3" : ORIGX3Assocs,
	"SCALE1" : SCALE1Assocs,
	"SCALE2" : SCALE2Assocs,
	"SCALE3" : SCALE3Assocs,
	"MTRIX1" : MTRIX1Assocs,
	"MTRIX2" : MTRIX2Assocs,
	"MTRIX3" : MTRIX3Assocs,

	"MODEL " : MODELAssocs, //coordinate section
	"ATOM  " : ATOMAssocs,
	"ANISOU" : ANISOUAssocs,
	"TER   " : TERAssocs,
	"HETATM" : HETATMAssocs,
	"ENDMDL" : ENDMDLAssocs,


	"CONECT" : CONECTAssocs, //connectivity to end
	"MASTER" : MASTERAssocs,
	"END   " : ENDAssocs,

	"default" : defaultAssocs
};

var getParsingInfo = function(type){
	return parsingInfo[type] || parsingInfo[putils.strim(type)] || parsingInfo["default"];
}

exports.parsingInfo = parsingInfo;
exports.getParsingInfo = getParsingInfo;
