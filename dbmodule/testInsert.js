var ins = require('./insertWithAttachments');
var json = require('/Users/dario/Desktop/Git/webpdb/docs/jsons/2CRK-pretty-print.json');
var get = require('./getWithAttachments');
//ins.insert(json['ID'], '/Users/dario/Desktop/Git/webpdb/docs/jsons/2CRK-pretty-print.json', function(n,v){console.log(v);console.log(n);}, 'starwars');
var t = get.retrieveByName('prot',function(n,v){console.log(n);console.log(v);}, 'starwars');
console.log(t);