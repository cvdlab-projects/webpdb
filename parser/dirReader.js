// https://github.com/coolaj86/node-walk 

var walk = require('walk');
var fs = require('fs');

var options = {
    followLinks: false,
};

  function sort(a,b) {
    a= a.toLowerCase();
    b= b.toLowerCase();
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  }

var emitter = walk.walk("../testdata/multiple");

  // Non-`stat`ed Nodes
      emitter.on('name', function (path, file, stat) {
        // saneCount += 1;
        //console.log( ["[", count, "] ", path, '/', file].join('') )
        console.log( [path, '/', file].join('') )
      });

      emitter.on('names', function (path, files, stats) {
        files.sort(sort);
        //console.log('sort: ' + files.join(' ; '));
      });



  // Single `stat`ed Nodes
      emitter.on('error', function (path, err, next) {
        next()
        // ignore
      });
      emitter.on('directoryError', function (path, stats, next) {
        next();
      });
      emitter.on('nodeError', function (path, stats, next) {
        next();
      });

      emitter.on('file', function (path, stat, next) {
        // count += 1;
        console.log( [path, '/', stat.name].join('') )
        //console.log( ["[", count, "] ", path, '/', stat.name].join('') )
        next();
      });

      emitter.on('directory', function (path, stat, next) {
        // count += 1;
        console.log( [path, '/', stat.name].join('') )
        next();
      });


    // Grouped `stat`ed Nodes
      emitter.on('errors', function (path, stats, next) {
        next();
      });

      emitter.on('files', function (path, stats, next) {
        next();
      });
      emitter.on('directories', function (path, stats, next) {
        //delete stats[1];
        next();
      });
      emitter.on('symbolicLinks', function (path, stats, next) {
        next();
      });


    // The end of all things
      emitter.on('end', function () {
        console.log("The eagle has landed");
      });