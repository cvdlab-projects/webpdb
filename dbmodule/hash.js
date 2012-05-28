var createHash = function(input){
var s = "";
for(el in input){
	s+= input[el]; 
}	
//var hash = crypto.createHash('md5');
//shasum.update(input.join);
console.log(s);}
//var hashName = shasum.digest('hex');}

createHash(["ciao", "dolfi", "come", "stai"]);