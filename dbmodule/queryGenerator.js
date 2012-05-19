var maxPos = 100;

var mapContains = exports.mapContains = function(field, string){
	return "function(doc){if(doc."+field+".match(\'.*"+string+"\') !== null) emit(doc."+field+", doc)}";
}

var mapEqual = function(field, string){
	return "function(doc){if(doc."+field+"==="+string+") emit(doc."+field+", doc)}";
}

var mapDisEqual = function(field, string){
	return "function(doc){if(doc."+field+"!=="+string+") emit(doc."+field+", doc)}";
}

var mapGreaterThan = function(field, minVal){
	return "function(doc){if(doc."+field+">"+minVal+") emit(doc."+field+", doc)}";
};

var mapLessThan = function(field, maxVal){
	return "function(doc){if(doc."+field+"<"+maxVal+") emit(doc."+field+", doc)}";
};

var mapBetween = function(field, minVal, maxVal){
	return "function(doc){if(doc."+field+">"+minVal+" && doc."+field+"<"+maxVal+") emit(doc."+field+", doc)}";
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
	return query + temp + ") emit(doc._id, doc)}";
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
	return query + temp + ") emit(doc._id, doc)}";
};