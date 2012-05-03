
var fs = require('fs'); //Fylesystem Module, needed to store the Json file. 
var app = require('express').createServer();
var dbmodule = require(‘./get’); 

app.get('/', function(req, res){
  console.log("[200] " + req.method + " to " + req.url);
  res.writeHead(200, "OK", {'Content-Type': 'text/html'});
  res.write('<html><head><title>Search for Protein</title></head><body>');
  res.write('<div align=center><h1>Search a protein by ID:</h1></div>');
  res.write('<form enctype="application/x-www-form-urlencoded" action="/retrieveById" method="get">');
  res.write('<div align=center>Name: <input type="text" name="proteinID" value="Protein_ID" /><br /></div>');
  res.write('<div align=center><input type="submit" /></div>');
  res.write('</form>');
  res.write('<div align=center><h1>Search a protein by Name:</h1></div>');
  res.write('<form enctype="application/x-www-form-urlencoded" action="/retrieveByName" method="get">');
  res.write('<div align=center>Name: <input type="text" name="proteinName" value="Protein_Name" /><br /></div>');
  res.write('<div align=center><input type="submit" /></div>');
  res.write('</form></html>');
  res.end();

});

app.get('/retrieveById', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    req.on('data', function(chunk) {
      fullBody += chunk.toString();
    });
    
    req.on('end', function() {
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

app.get('/retrieveByName', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    
    req.on('data', function(chunk) {
      fullBody += chunk.toString();
    });1
    req.on('end', function() {
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