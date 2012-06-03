var get = require('./get');

get.retrieveByAlmostOneAminoacidSeqResAverage(["GLY","VAL"], function(n,v){console.log(v);}, 'proteins');