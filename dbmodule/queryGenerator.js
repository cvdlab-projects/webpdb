
var mapContains = function(field, string){
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
}

var mapLessThan = function(field, maxVal){
	return "function(doc){if(doc."+field+"<"+maxVal+") emit(doc."+field+", doc)}";
}

var mapBetween = function(field, minVal, maxVal){
	return "function(doc){if(doc."+field+">"+minVal+" && doc."+field+"<"+maxVal") emit(doc."+field+", doc)}";
}