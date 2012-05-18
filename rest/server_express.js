/*
require
* express
* connect-redis (cookies)
*/

var express = require('express');
var app = express.createServer();
var utils = require('./restUtility'); 
var dbmodule = require('../dbmodule/get'); 
var store = require('./store');
// var RedisStore = require('connect-redis')(express);

// Express settings
app.use(express.bodyParser());
app.use(express.cookieParser());
// app.use(express.session({ secret: "s7d8sh7sahd7ah78dsa", store: new RedisStore }))

/* Redis is necessary to store cookies in session (ex: user and pass) */

app.get('/', function(req, res){
	console.log("[200] " + req.method + " to " + req.url);
	res.writeHead(200, "OK", {'Content-Type': 'text/html'});
	res.write('<html><head><title>Search for Protein</title></head><body>');
	res.write('<div align=left><h1>Search a protein by ID or by Name:</h1>');
	res.write('<form enctype="application/x-www-form-urlencoded" action="/form/retrieve" method="get">');
	res.write('<div align=left> Enter the Protein\'s <b>Identifier</b>:<input type="text" name="proteinID" value="Protein_ID" />');
	res.write('<input type="submit" value = "Search" />');
	res.write('</form>');

	res.write('<form enctype="application/x-www-form-urlencoded" action="/form/retrieve" method="get">');
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

// per la form
app.get('/form/retrieve', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    req.on('end', function() {
     id = req.query["proteinID"]; //Returns the value stored in the get request
	 name = req.query["proteinName"]; //Returns the value stored in the get request
	 
     //dbmodule.retrieveByID(id, store.storeJson, userName, password, dbName,  host, port);
      dbmodule.retrieveByID(id, store.storeJson);
	  // dbmodule.retrieveByName(name, store.storeJson);
    }); 
});

// il vero servizio rest
app.get('/rest/protein/id/:id', function(req, res) {
	var id = req.params.id;

    console.log("[200] " + req.method + " to " + req.url);
	console.log(id);
	//
	// writeHeaderOk(res, 'text/html');
	// res.write('Viewing protein id ' + req.params.id);
	// res.header('Content-Type', 'text/plain');
	// res.send('text', { 'Content-Type': 'text/plain' }, 201);
	
	res.contentType('application/json');
	
	if (utils.checkIdProtein(id)) {
		res.send('Viewing protein id ' + req.params.id);
	}
	else {
		res.send({'ERROR':id+': Invalid protein id'});
	}

	res.end();
});

app.get('/rest/protein/name/:name', function(req,res){
    var name = req.params.name;

    console.log("[200] " + req.method + " to " + req.url);

	res.contentType('application/json');
	res.send('Viewing protein name ' + name);
	
	res.end();
});

app.get('/rest/molecule/id/:id', function(req,res){
    var id = req.params.id;

    console.log("[200] " + req.method + " to " + req.url);
	
	res.contentType('application/json');
	
	if (utils.checkIdMolecule(id)) {
		res.send('Viewing molecule id ' + id);
	}
	else {
		res.send({'ERROR':id+': Invalid molecule id'});
	}

	res.end();
});

app.get('/rest/molecule/name/:name', function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
	console.log(req.params.name);
});

// servizio admin
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
};

var writeHeaderOk = function(response, contentType) {
	response.writeHead(200, "OK", {'Content-Type': contentType});
};

app.listen(3000);