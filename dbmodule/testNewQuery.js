var get = require('./get');

// get.retrieveAllNameID(function(n,v){console.log(v);}, 'starwars');
get.retrieveByAlmostOneAminoacidSeqResAverage(["GLY","VAL"], function(n,v){console.log(v);}, 'proteins');
