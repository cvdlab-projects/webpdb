var maxPos = 100;

var mapContains = exports.mapContains = function(field, string){
	return "function(doc){if(doc."+field+".match(\'.*"+string+".*\') !== null) emit(null)}";
}

var mapEqual = function(field, string){
	return "function(doc){if(doc."+field+"==="+string+") emit(null)}";
}

var mapDisEqual = function(field, string){
	return "function(doc){if(doc."+field+"!=="+string+") emit(null)}";
}

var mapGreaterThan = function(field, minVal){
	return "function(doc){if(doc."+field+">"+minVal+") emit(null)}";
};

var mapLessThan = function(field, maxVal){
	return "function(doc){if(doc."+field+"<"+maxVal+") emit(null)}";
};

var mapBetween = function(field, minVal, maxVal){
	return "function(doc){if(doc."+field+">"+minVal+" && doc."+field+"<"+maxVal+") emit(null)}";
};

var mapElementAtGreaterPositionThan =function(pos, elems){
	var query = "function(doc){if(";
	var temp = "";
	for (var i = pos; i <= maxPos; i++) {
		for(var el in elems) {
			temp = temp + "doc.pos" + i +"==="+elems[el]+" || ";
		}
	}
	temp = temp.substring(0, temp.length - 4);
	return query + temp + ") emit(null)}";
};

var mapElementAtLessPositionThan =function(pos, elems){
	var query = "function(doc){if(";
	var temp = "";
	
	for (var i = pos; i >= 0; i--) {
		for(var el in elems) {
			temp = temp + "doc.pos" + i +"==="+elems[el]+" || ";
		}
	}
	temp = temp.substring(0, temp.length - 4);
	return query + temp + ") emit(null)}";
}; 

var almostOneAminoacidCountValue = function(aminoacids){
	var query = "function(doc){ if(doc.hasOwnProperty('SEQRES')){var numeSeq = doc['SEQRES']; for(var i=1; i<=numeSeq['_count'];i++){if(";
	for(a in aminoacids){
		query+= " numeSeq[i].resName == '" + aminoacids[a] + "'";
		for(var j=1; j<=12; j++){
			query+=" || numeSeq[i].resName_" + j + " == '" + aminoacids[a] + "'";
		}
		query+=" || "
	}
	query+=" false) emit(doc._id, numeSeq['_count'])}}}";
return query;
}

var almostOneAminoacid = function(aminoacids){
	var query = "function(doc){ if(doc.hasOwnProperty('SEQRES')){var numeSeq = doc['SEQRES']; var ams = []; for(var i=1; i<=numeSeq['_count'];i++){";
		query+= "ams.push(numeSeq[i].resName);";
		for(var j=1; j<=12; j++){
			query+="ams.push(numeSeq[i].resName_" + j + ");";
		}
		query+="}if(";
		for(a in aminoacids){
		query+="ams.indexOf('"+ aminoacids[a] +"') != -1 || "};
		query+= "true){emit(null);}}}"
return query;
}

var allAminoacids = function(aminoacids){
	var query = "function(doc){ if(doc.hasOwnProperty('SEQRES')){var numeSeq = doc['SEQRES']; var ams = []; for(var i=1; i<=numeSeq['_count'];i++){";
		query+= "ams.push(numeSeq[i].resName);";
		for(var j=1; j<=12; j++){
			query+="ams.push(numeSeq[i].resName_" + j + ");";
		}
		query+="}if(";
		for(a in aminoacids){
		query+="ams.indexOf('"+ aminoacids[a] +"') != -1 && "};
		query+= "true){emit(null);}}}"

return query;
}

var hasID = function(){
	var query = "function(doc){if(doc._id){emit(null)}}"
	return query;
}

var hasNameID = function(){
	var query = "function(doc){if(doc._id && doc.TITLE.title){emit(doc.TITLE.title,doc._id)}}"
	return query;
}

var allAminoacids1 = function(aminoacids){
	var query = "function(doc){ if(doc.hasOwnProperty('SEQRES')){"
	query += "var numeSeq = doc['SEQRES']; var ams = [];"
	query += " for(var i=1; i<=numeSeq['_count'];i++){";
	query+= "var curreSeq = numeSeq[i];";
		query+= "ams.push(curreSeq['resname']);";
		for(var j=1; j<=12; j++){
			query+="ams.push(curreSeq['resname_" + j + "']); emit(null);";
		}
		query+="}";
		query+= "}}"

return query;
}

var almostOneAminoacid1 = function(aminoacids){
	var query = "function(doc){ if(doc.hasOwnProperty('SEQRES')) emit(null)}";
return query;
}

exports.hasNameID = hasNameID;
exports.mapContains = mapContains;
exports.almostOneAminoacid = almostOneAminoacid;
exports.allAminoacids = allAminoacids;
exports.almostOneAminoacidCountValue = almostOneAminoacidCountValue;
exports.hasID = hasID;