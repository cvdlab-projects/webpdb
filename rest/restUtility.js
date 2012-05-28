/* Check if id is made by 4 characters in the range A-Z or 0-9 */
var checkIdProtein = function(id) {

	if (!id && id.length != 4) {
		console.log('Wrong ID! It must have 4 characters (numbers and/or capital letters)');
		return false;
	}

	var i = 0;
	var c = id.charAt(i);


	while (c && i<4) {
		c = id.charAt(i);

		if((c>='A' && c<='Z') || (c>='a' && c<='z') || (c>='0' && c<='9')) {
			//console.log('char '+i+': '+c+' matched');
		}
		else {
			console.log(c+': wrong character! it must be a number or a capital letter');
			return false;
		}
		i= i+1;;
	}
	return true;
}


/* Check if id is made by 1 to 3 characters in the range A-Z or 0-9 */
var checkIdMolecule = function(id) {

	if (!id || id.length>3) {
		console.log('Wrong ID! It must have 1 to 3 characters (numbers and/or capital letters)');
		return false;
	}

	var i = 0;
	var c = id.charAt(i);


	while (c && i<3) {
		c = id.charAt(i);

		// if empty string -> ID ended
		if (c=='') {
			return true;
		}

		if((c>='A' && c<='Z') || (c>='a' && c<='z') || (c>='0' && c<='9')) {
			//console.log('char '+i+': '+c+' matched');
		}
		else {
			console.log(c+': wrong character! it must be a number or a capital letter');
			return false;
		}
		i= i+1;;
	}
	return true;
}


var checkName = function(name) {
	if (!name) {
		console.log('invalid name');
		return false;
	}

	var length = name.length;
	var i=0;
	var c = name.charAt(i);

	while (c && i<length) {
		c = name.charAt(i);

		if((c>='A' && c<='Z') || (c>='a' && c<='z') || (c>='0' && c<='9') || c=='_' || c=='-' ) {
			//console.log('char '+i+': '+c+' matched');
		}
		else {
			console.log(c+': invalid character! ( valid characters: A-Z,0-9,_,- )');
			return false;
		}
		i = i+1;
	}
	return true;
}


var checkIdListMolecule = function(list) {
	var arr = list.split(",");
	arr.map(function(item,position,array) {
		if(!checkIdMolecule(item)) {
			console.log('Invalid id for amino "'+item+'"');
			return false;
		}
	});
	return true;
}



exports.checkIdMolecule = checkIdMolecule;
exports.checkIdProtein = checkIdProtein;
exports.checkName = checkName;
exports.checkIdListMolecule = checkIdListMolecule;