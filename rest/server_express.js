/*
require
* express
* http-proxy
* connect-redis (cookies)
*/

var express = require('express');
var app = express.createServer();
var RedisStore = require('connect-redis')(express);

// Project Modules
var utils = require('./restUtility'); 
var dbmodule = require('../dbmodule/get'); 
var store = require('./store');

// Var application settings
var WEBPORT = 3000;
var ADMIN_PREFIX = 'admin/';
var ADMIN_USERS = require('./adminusers.json');
// Admin connection
var dblistJSON = require('../dbmodule/databases.json');
var dbadmin = require('../dbmodule/db'); 

app.configure(function(){
	// Express settings
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	/* Redis is necessary to store cookies in session (ex: user and pass) */
	app.use(express.session({ secret: "s7d8sh7sahd7ah78dsa", store: new RedisStore }));
	app.use(app.router);
});

function fakeAuth(req, res, next) {
	console.log("[COOKIE] FAKE:" + req.method + " to " + req.url);
    next();
};

app.get('/', function(req, res){
	console.log("[200] " + req.method + " to " + req.url);
	// res.writeHead(200, "OK", {'Content-Type': 'text/html'});
	res.contentType('text/html');
	res.write('<html><head><title>Search for Protein</title></head><body>');
	res.write('<div align=left><h1>Search a protein by ID or by Name:</h1>');
	res.write('<form enctype="application/x-www-form-urlencoded" action="form/retrieve" method="get">');
	res.write('<div align=left> Enter the Protein\'s <b>Identifier</b>:<input type="text" name="proteinID" value="Protein_ID" />');
	res.write('<input type="submit" value = "Search" />');
	res.write('</form>');

	res.write('<form enctype="application/x-www-form-urlencoded" action="form/retrieve" method="get">');
	res.write('<div align=left>Enter the Protein\'s <b>Name</b>: <input type="text" name="proteinName" value="Protein_Name" />');
	res.write('<input type="submit" value = "Search" /></div>');
	res.write('</form>');

    res.write('<div align=left><h1>Log in as Administrator:</h1>');
  res.write('<form enctype="application/x-www-form-urlencoded" action="./'+ADMIN_PREFIX+'login" method="post">');
   res.write('<div align=left> <b>Username</b>:<input type="text" name="user" value="Username" />');
    res.write('<b>Password</b>: <input type="password" name="password" value="Password" />');
  res.write('<input type="submit" value = "Login" /></div>');
  res.write('</form>');

	res.write('</html>');
	res.end();
});

var sendFormError = function(res, extra) {
    extra = extra || "";
    res.write( JSON.stringify({'ERROR' : 'Invalid get request. Specific error: ' + extra}) );
    res.end();
};

// per la form
app.get('/form/retrieve', fakeAuth, function(req,res){
	console.log("[200] " + req.method + " to " + req.url);
	
	res.contentType('application/json');
	// req.on('end', function() {
	  if ( req.query.hasOwnProperty("proteinID") ) {
		var id = req.query["proteinID"];
		if (utils.checkIdProtein(id)) {
			dbmodule.retrieveByID(id, function(bool,data){
				if (bool) {
					res.write(JSON.stringify(data));
					res.end();
				} else {
					sendFormError(res, "Error while searching in database");
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
					res.write(JSON.stringify(data));
					res.end();
					console.log("B")
				} else {
					sendFormError(res, "Error while searching in database");
				}
			}, "proteins");
		} else {
		  sendFormError(res);
		}
	  } else {
	    sendFormError(res);
	  }
    // }); 
});

// ========================================
// ========================================

// il vero servizio rest
var setResponseReastHeader = function(res) {
	res.contentType('application/json');
	res.header('Access-Control-Allow-Origin', '*');  
};

app.get('/rest/protein/all/:how', function(req, res) {
	var id = req.params.how;
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);

	if ( how === "id" ) {
		dbmodule.retrieveAllIDs(id, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid protein list request "' + how  + '" or db error'});
			}
		}, "proteins");
	} else if ( how === "name" ) {
		dbmodule.retrieveAllNameID(id, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid protein list request "' + how  + '" or db error'});
			}
		}, "proteins");
	} else {
		res.send({'ERROR' : 'Invalid protein list request "' + how  + '"'});
	}
});

app.get('/rest/protein/id/:id', function(req, res) {
	var id = req.params.id;
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);

	if (utils.checkIdProtein(id)) {
		dbmodule.retrieveByID(id, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid protein id "' + id + '" or db error'});
			}
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid protein id "' + id + '"'});
	}
});

app.get('/rest/protein/name/:name', function(req,res){
	var name = req.params.name;
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);
	
	if (utils.checkName(name)) {
		dbmodule.retrieveByName(name, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid protein name "' + name + '" or db error'});
			}
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid protein name "' + name + '"'});
	}

});

app.get('/rest/protein/byamino/atleastone/:list', function(req, res) {
	var list = utils.transformToList(req.params.list, ",");
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);
	
	if (utils.checkIdListMolecule(list)) {
		dbmodule.retrieveByAlmostOneAminoacids(list, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'No match found for aminos "' + list + '" or db error'});
			}
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid aminos id "' + list + '"'});
	}
});


app.get('/rest/protein/byamino/all/:list', function(req, res) {
	var list = utils.transformToList(req.params.list, ",");
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);
	
	if (utils.checkIdListMolecule(list)) {
		dbmodule.retrieveByAllAminoacids(list, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'No match found for aminos "' + list + '" or db error'});
			}
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid aminos id "' + list + '"'});
	}
});

app.get('/rest/protein/byamino/atleastone_seqaverage/:list', function(req, res) {
	var list = utils.transformToList(req.params.list, ",");
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);
	
	if (utils.checkIdListMolecule(list)) {
		dbmodule.retrieveByAlmostOneAminoacidSeqResAverage(list, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'No match found for aminos "' + list + '" or db error'});
			}
		}, "proteins");
	}
	else {
		res.send({'ERROR' : 'Invalid aminos id "' + list + '"'});
	}
});

app.get('/rest/molecule/all/:how', function(req, res) {
	var id = req.params.how;
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);

	if ( how === "id" ) {
		dbmodule.retrieveAllIDs(id, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid molecule list request "' + how  + '" or db error'});
			}
		}, "monomers");
	} else {
		res.send({'ERROR' : 'Invalid molecule list request "' + how  + '"'});
	}
});

app.get('/rest/molecule/id/:id', function(req,res){
	var id = req.params.id;
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);
	
	if (utils.checkIdMolecule(id)) {
		dbmodule.retrieveByID(id, function(bool,data){
			if (bool) {
				res.send(data);
			} else {
				res.send({'ERROR' : 'Invalid molecule id "' + id + '" or db error'});
			}
		}, "monomers");
	}
	else {
		res.send({'ERROR' : 'Invalid molecule id "' + id + '"'});
	}
});

/*
app.get('/rest/molecule/name/:name', function(req,res){
  	var name = req.params.name;
	console.log("[200] " + req.method + " to " + req.url);
	setResponseReastHeader(res);
	
	if (utils.checkName(name)) {
		dbmodule.retrieveByName(name, function(bool,data){
			if (bool) {
				res.write(data);
			} else {
				res.write({'ERROR' : 'Invalid molecule name "' + name + '" or db error'});
			}
			res.end();
		}, "monomers");
	}
	else {
		res.write({'ERROR' : 'Invalid molecule name "' + name + '"'});
		res.end();
	}
	
});
*/

// ========================================
// ========================================

// servizio admin
app.post('/'+ADMIN_PREFIX+'login', function (req, res) {
  var post = req.body;
  if ((ADMIN_USERS.hasOwnProperty(post.user)) && (ADMIN_USERS[post.user] === post.password)) {
    req.session.authenticated = true;
    res.redirect('../main');
  } else {
    res.redirect('../badCredentials');
    //console.log(req.query["user"] + req.query["password"]);
    console.log(post);
  }
});

app.post('/'+ADMIN_PREFIX+'logout', function (req, res) {
  delete req.session.authenticated;
  res.redirect('/');
});

app.get('/'+ADMIN_PREFIX+'badCredentials', function (req,res){
   res.contentType('text/html');
	res.write('<html><head><title>Admin Control Panel</title></head><body>');
    res.write('<div align =center>Incorrect Username or Password');
    res.write('<form enctype="application/x-www-form-urlencoded" action="/" method="get">');
    res.write('<input type="submit" value = "Try Again" /></div>');
    res.write('</form></body></html>');
    res.end();
});

app.get('/'+ADMIN_PREFIX+'main', checkAuth, function (req, res) {
 console.log("[200] " + req.method + " to " + req.url);
  // res.writeHead(200, "OK", {'Content-Type': 'text/html'});
  res.contentType('text/html');
  res.write('<html><head><title>Admin Control Panel</title></head><body>');
  res.write('<div align=Center><h1>Control Panel:</h1></div>');
  res.write('<div align = center><table border="2" bordercolor="#050505" width="80%" bgcolor="">');
  res.write('<tr>');
  res.write('<td> Get informations about current Database </td>');
  res.write('<td> <div align = center><form enctype="application/x-www-form-urlencoded" action="./dbInfo" method="post">');
  res.write('<input type="submit" value = "INFO" /></div>');
  res.write('</form>');
  res.write('</td>');
  res.write('</tr>');
  res.write('<tr>');
  res.write('<td> Compact database </td>');
  res.write('<td> <div align = center><form enctype="application/x-www-form-urlencoded" action="./dbCompact" method="post">');
  res.write('<input type="submit" value = "COMPACT" /></div>');
   res.write('</form>');
  res.write('</td>');
  res.write('</tr>');
  res.write('<tr>');
  res.write('<td> Cleanup old view data </td>');
  res.write('<td> <div align = center><form enctype="application/x-www-form-urlencoded" action="./dbCleanup" method="post">');
  res.write('<input type="submit" value = "CLEANUP" /></div>');
   res.write('</form>');
  res.write('</td>');
  res.write('</tr>');
  res.write('</table></div>');
  res.write('<div align = center><form enctype="application/x-www-form-urlencoded" action="./logout" method="post">');
  res.write('<input type="submit" value = "LOGOUT" />');
  res.write('</form></div></html>');
  res.end();
});

app.post('/'+ADMIN_PREFIX+'dbCompact', checkAuth, function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
    // req.on('end', function() {
		var countDB = 0;
		for (var keyDBs in dblistJSON) {
			countDB++;
		}
		console.log("Compact count " + countDB);
		for (var keyDBs in dblistJSON) {
			dbadmin.setup({keyDB: keyDBs}).compact(function (_, doc) {
				countDB--;
				console.log("Compact count " + countDB);
				if (countDB == 0) {
					console.log("Compact done");
					res.redirect('../main');
				}
			});
		}
    // }); 
});

app.post('/'+ADMIN_PREFIX+'dbCleanup', checkAuth, function(req,res){
    console.log("[200] " + req.method + " to " + req.url);	
    // req.on('end', function() {
		var countDB = 0;
		for (var keyDBs in dblistJSON) {
			countDB++;
		}
		console.log("Cleanup count " + countDB);
		for (var keyDBs in dblistJSON) {
			dbadmin.setup({keyDB: keyDBs}).viewCleanup(function (_, doc) {
				countDB--;
				console.log("Cleanup count " + countDB);
				if (countDB == 0) {
					console.log("Cleanup done");
					res.redirect('../main');
				}
			});
		}
    // }); 
});

app.post('/'+ADMIN_PREFIX+'dbInfo', checkAuth, function(req,res){
    console.log("[200] " + req.method + " to " + req.url);
	res.contentType('text/html');
	res.write('<html><head><title>Admin Control Panel</title></head><body>');
    res.write('<div align=center>DBs infos: <br />');
	for (var keyDBB in dblistJSON) {
		res.write( dblistJSON[keyDBB] + '<br />');
	}
	res.write('<br />');
    res.write('<form enctype="application/x-www-form-urlencoded" action="./main" method="get">');
    res.write('<input type="submit" value = "Go Back" /></div>');
    res.write('</form></body></html>');
    res.end();
});

function checkAuth(req, res, next) {
	console.log("[COOKIE] " + req.method + " to " + req.url);
  if (!req.session.authenticated) {
	if (req.url.indexOf(ADMIN_PREFIX) == -1) {
		console.log("Non admin");
		next();
	} else {
		console.log("Admin");
		res.redirect('/'+ADMIN_PREFIX+'badCredentials');
		// res.send('You are not authorized to view this page');
	}
  } else {
    next();
  }
};

// ========================================
// ========================================

// Run service
app.listen(WEBPORT);
