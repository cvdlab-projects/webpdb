/*
2LGB

0...9 A...Z
      A = 10
      Z = 10 + 27

alfadecimale
*/

const ZEROPOS = "0".charCodeAt(0);
const ARELATIVEZERO = "A".charCodeAt(0) - ZEROPOS;
const NUMBERLENGTH = 36;
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var POW = Math.pow;

var alfaDecimal = function(decimal) {
  var r = decimal % NUMBERLENGTH;
  var result;
  if (decimal-r == 0) 
    result = toChar(r);
  else 
    result = alfaDecimal( (decimal-r)/NUMBERLENGTH ) + toChar(r);
  return result;	
};

var toChar = function(n) {
  return ALPHABET.charAt(n);
};

var decAlfa = function(alfa) {
	alfa = alfa.toUpperCase();
	var returnDec = 0;
	var strLength = alfa.length - 1;

	for(var pos in alfa) {
		var charCode = alfa.charCodeAt(pos) - ZEROPOS;
		if (( charCode >= 0 ) && ( charCode <= 9 )) {
			returnDec += (charCode * POW(NUMBERLENGTH, (strLength - pos)));
		} else {
			returnDec += (charCode - ARELATIVEZERO + 10) * POW(NUMBERLENGTH, (strLength - pos));
		}
	}

	return returnDec;
};

// EXPORTS
exports.alfaToDecimal = decAlfa;
exports.decimalToAlfa = alfaDecimal;