
var fs = require('fs');
var db = require('./server');
var app = require('express').createServer();
var express = require('express');
//var querystring = require('querystring');
//var utils = require('util');
var cradle = require('cradle');
//app.use(express.bodyParser());
//app.use(express.methodOverride());

app.get('/', function(req, res){
  console.log("[200] " + req.method + " to " + req.url);
  res.writeHead(200, "OK", {'Content-Type': 'text/html'});
  res.write('<html><head><title>Search for Protein</title></head><body>');
  res.write('<div align=center><h1>Immetti il nome della Proteina:</h1></div>');
  res.write('<form enctype="application/x-www-form-urlencoded" action="/formhandler" method="get">');
  res.write('<div align=center>Name: <input type="text" name="username" value="Nome Proteina" /><br /></div>');
  //res.write('Age: <input type="text" name="userage" value="99" /><br />');
  res.write('<div align=center><input type="submit" /></div>');
  res.write('</form></body></html>');
  res.end();

});

app.get('/formhandler', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    //var fullBody = '';
    
    req.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
    });
    
    req.on('end', function() {

     /* // request ended -> do something with the data
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      
      // parse the received body data
      var decodedBody = querystring.parse(fullBody);

      // output the decoded data to the HTTP response          
      res.write('<html><head><title>Post data</title></head><body><pre>');
      res.write(utils.inspect(decodedBody));
      //res.write(req.params.username + req.params.userage);
      res.write('</pre></body></html>');*/
     var option = {port:3000};
     db.setup(option,function(){});
     var conn = new (cradle.Connection);
     couch = conn.database('prova');
     id = req.query["username"];
     	couch.get(id, function(error, doc) {
	if(error) {
	    res.write(JSON.stringify(error));
	}
	else {

		// in poche parole se entra nel db, trova l'id passato come parametro, inserisce un nuovo dato nel db. 
  /*couch.save({
      force: 'dark', name: 'Darth'
  }, function (err, res) {
      if(err) //handle error
        else //handle success
  });*/
  fs.writeFile(id + '.json', doc , function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 

	
}
     res.end();
    }); 
    });
});


app.listen(3000);