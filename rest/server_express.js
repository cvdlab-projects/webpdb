
var app = require('express').createServer();
var dbmodule = require('../dbmodule/get'); 
var store = require('./store');
var config = require('./config');

var params = config.parameters();
var userName = params.username;
var password = params.password;
var dbName = params.dbName;
var host = params.host;
var port = params.port;

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
    req.on('end', function() {
     id = req.query["proteinID"]; //Returns the value stored in the get request
     dbmodule.retrieveByID(id, store.storeJson, userName, password, dbName,  host, port);
    }); 
    });

app.get('/retrieveByName', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    req.on('end', function() {
     name = req.query["proteinName"]; //Returns the value stored in the get request
     dbmodule.retrieveByName(name, store.storeJson, userName, password, dbName,  host, port);
    }); 
    });

app.listen(3000);