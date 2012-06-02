/*
require
* express
* http-proxy
* connect-redis (cookies)
*/

var express = require('express');
var app = express.createServer();
// var RedisStore = require('connect-redis')(express);

// Project Modules
var utils = require('./restUtility'); 
var dbmodule = require('../dbmodule/get'); 
var store = require('./store');

// Var application settings
var WEBPORT = 3000;

// Express settings
app.use(express.bodyParser());
app.use(express.cookieParser());
/* Redis is necessary to store cookies in session (ex: user and pass) */
// app.use(express.session({ secret: "s7d8sh7sahd7ah78dsa", store: new RedisStore }))

app.get('/', function(req, res){
	console.log("[200] " + req.method + " to " + req.url);
	res.writeHead(200, "OK", {'Content-Type': 'text/html'});
	res.write('<html><head><title>Search for Protein</title></head><body>');
	res.write('<div align=left><h1>Search a protein by ID or by Name:</h1>');
	res.write('<form enctype="application/x-www-form-urlencoded" action="form/retrieve" method="get">');
	res.write('<div align=left> Enter the Protein\'s <b>Identifier</b>:<input type="text" name="proteinID" value="Protein_ID" />');
	res.write('<input type="submit" value = "Search" />');
	res.write('</form>');

	res.write('<form enctype="application/x-www-form-urlencoded" action="form/retrieve" method="get">');
	res.write('<div align=left>Enter the Protein\'s <b>Name</b>: <input type="text" name="proteinName" value="Protein_Name" />');
	res.write('<input type="submit" value = "Search" /></div>');
	res.write('</form></html>');
	res.write('<div align=left><h1>Log in as Administrator:</h1>');
	res.write('<form enctype="application/x-www-form-urlencoded" action="login" method="post">');
	res.write('<div align=left> <b>Username</b>:<input type="text" name="user" value="Username" />');
	res.write('<b>Password</b>: <input type="password" name="password" value="Password" />');
	res.write('<input type="submit" value = "Login" /></div>');
	res.write('</form></html>');
	res.end();
});

var sendFormError = function(res) {
    res.send({'ERROR' : 'Invalid get request'});
    res.end();
};

// per la form
app.get('/form/retrieve', function(req,res){
	console.log("[200] " + req.method + " to " + req.url);
	
	res.contentType('application/json');
	req.on('end', function() {
	  if ( req.query.hasOwnProperty("proteinID") ) {
		var id = req.query["proteinID"];
		if (utils.checkIdProtein(id)) {
			dbmodule.retrieveByID(id, function(bool,data){
				if (bool) {
					res.send(JSON.stringify(data));
					res.end();
				} else {
					sendFormError(res);
				}
			}, "proteins");
		} else {
		  sendFormError(res);
		}
	  } else if ( req.query.hasOwnProperty("proteinName") ) {
		var name = req.query["proteinName"];
		if (utils.checkName(name)) {
			dbmodule.retrieveByName(name, function(bool,data){
				if (bool) {
					res.send(JSON.stringify(data));
					res.end();
				} else {
					sendFormError(res);
				}
			}, "proteins");
		} else {
		  sendFormError(res);
		}
	  } else {
	    sendFormError(res);
	  }
    }); 
});

// il vero servizio rest
app.get('/rest/protein/id/:id', function(req, res) {
	var id = req.params.id;
	console.log("[200] " + req.method + " to " + req.url);

	res.contentType('application/json');
	if (utils.checkIdProtein(id)) {
		dbmodule.retrieveByID(id, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid protein id "' + id + '" or db error'});
			}
			res.end();
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid protein id "' + id + '"'});
		res.end();
	}
});

app.get('/rest/protein/name/:name', function(req,res){
	var name = req.params.name;
	console.log("[200] " + req.method + " to " + req.url);

	res.contentType('application/json');
	if (utils.checkName(name)) {
		dbmodule.retrieveByName(name, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid protein name "' + name + '" or db error'});
			}
			res.end();
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid protein name "' + name + '"'});
		res.end();
	}

});

app.get('/rest/molecule/id/:id', function(req,res){
	var id = req.params.id;
	console.log("[200] " + req.method + " to " + req.url);
	
	res.contentType('application/json');
	if (utils.checkIdMolecule(id)) {
		dbmodule.retrieveByID(id, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid molecule id "' + id + '" or db error'});
			}
			res.end();
		}, "monomers");
	}
	else {
		res.send({'ERROR' : 'Invalid molecule id "' + id + '"'});
		res.end();
	}
});

app.get('/rest/molecule/name/:name', function(req,res){
  	var name = req.params.name;
	console.log("[200] " + req.method + " to " + req.url);

	res.contentType('application/json');
	if (utils.checkName(name)) {
		dbmodule.retrieveByName(name, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid molecule name "' + name + '" or db error'});
			}
			res.end();
		}, "monomers");
	}
	else {
		res.send({'ERROR' : 'Invalid molecule name "' + name + '"'});
		res.end();
	}
	
});

app.get('/rest/protein/byamino/atleastone/:list', function(req, res) {
	var list = utils.transformToList(req.params.list, ",");
	console.log("[200] " + req.method + " to " + req.url);

	res.contentType('application/json');
	if (utils.checkIdListMolecule(list)) {
		dbmodule.retrieveByAlmostOneAminoacids(list, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'No match found for aminos "' + list + '" or db error'});
			}
			res.end();
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid aminos id "' + list + '"'});
		res.end();
	}
});


app.get('/rest/protein/byamino/all/:list', function(req, res) {
	var list = utils.transformToList(req.params.list, ",");
	console.log("[200] " + req.method + " to " + req.url);

	res.contentType('application/json');
	if (utils.checkIdListMolecule(list)) {
		dbmodule.retrieveByAllAminoacids(list, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'No match found for aminos "' + list + '" or db error'});
			}
			res.end();
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid aminos id "' + list + '"'});
		res.end();
	}
});

// servizio admin
app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user == 'admins' && post.password == 'admins') {
  //if (req.query["user"] == 'admins' && req.query["password"] == 'admins') {
    req.session.authenticated = true;
    res.redirect('./admin_functions');
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
  res.write('<form enctype="application/x-www-form-urlencoded" action="logout" method="post">');
  res.write('<input type="submit" value = "Logout" /></div>');
  res.write('</form></html>');
  res.end();
});

app.post('/logout', function (req, res) {
  delete req.session.authenticated;
  res.redirect('./');
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

app.listen(WEBPORT);