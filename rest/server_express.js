var express = require('express');
var app = require('express').createServer();
var dbmodule = require('../dbmodule/DBLuca/getLuca'); 
var store = require('./store');
var RedisStore = require('connect-redis')(express);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "keyboard cat", store: new RedisStore }))

/* Redis is necessary to store cookies in session (ex: user and pass) */

app.get('/', function(req, res){
  console.log("[200] " + req.method + " to " + req.url);
  res.writeHead(200, "OK", {'Content-Type': 'text/html'});
  res.write('<html><head><title>Search for Protein</title></head><body>');
  res.write('<div align=left><h1>Search a protein by ID or by Name:</h1>');
  res.write('<form enctype="application/x-www-form-urlencoded" action="/retrieveById" method="get">');
  res.write('<div align=left> Enter the Protein\'s <b>Identifier</b>:<input type="text" name="proteinID" value="Protein_ID" />');
  res.write('<input type="submit" value = "Search" />');
  res.write('</form>');

  res.write('<form enctype="application/x-www-form-urlencoded" action="/retrieveByName" method="get">');
  res.write('<div align=left>Enter the Protein\'s <b>Name</b>: <input type="text" name="proteinName" value="Protein_Name" />');
  res.write('<input type="submit" value = "Search" /></div>');
  res.write('</form></html>');
    res.write('<div align=left><h1>Log in as Administrator:</h1>');
  res.write('<form enctype="application/x-www-form-urlencoded" action="/login" method="post">');
   res.write('<div align=left> <b>Username</b>:<input type="text" name="user" value="Username" />');
    res.write('<b>Password</b>: <input type="password" name="password" value="Password" />');
  res.write('<input type="submit" value = "Login" /></div>');
  res.write('</form></html>');
  res.end();

});

app.get('/retrieveById', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    req.on('end', function() {
     id = req.query["proteinID"]; //Returns the value stored in the get request
     //dbmodule.retrieveByID(id, store.storeJson, userName, password, dbName,  host, port);
      dbmodule.retrieveByID(id, store.storeJson);
    }); 
});

app.get('/retrieveByName', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    req.on('end', function() {
     name = req.query["proteinName"]; //Returns the value stored in the get request
     //dbmodule.retrieveByName(name, store.storeJson, userName, password, dbName,  host, port);
     dbmodule.retrieveByName(name, store.storeJson);
    }); 
});

app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user == 'admins' && post.password == 'admins') {
  //if (req.query["user"] == 'admins' && req.query["password"] == 'admins') {
    req.session.authenticated = true;
    res.redirect('/admin_functions');
  } else {
    res.send('Bad user/pass');
    //console.log(req.query["user"] + req.query["password"]);
    console.log(post);
  }
});
app.get('/admin_functions', checkAuth, function (req, res) {
 console.log("[200] " + req.method + " to " + req.url);
  res.writeHead(200, "OK", {'Content-Type': 'text/html'});
  res.write('<html><head><title>Admin Control Panel</title></head><body>');
  res.write('<div align=Center><h1>Control Panel:</h1></div>');
  res.write('<form enctype="application/x-www-form-urlencoded" action="/logout" method="post">');
  res.write('<input type="submit" value = "Logout" /></div>');
  res.write('</form></html>');
  res.end();
});

app.post('/logout', function (req, res) {
  delete req.session.authenticated;
  res.redirect('/');
});

function checkAuth(req, res, next) {
  if (!req.session.authenticated) {
    res.send('You are not authorized to view this page');
    
  } else {
    next();
  }
}




app.listen(3000);