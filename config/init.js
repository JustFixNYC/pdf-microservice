
'use strict';

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'),
		app        = express(),
		bodyParser = require('body-parser'),
		index			 = require('../app/routes/server.routes.index'),
		complaints = require('../app/routes/server.routes.complaintLetter');


// Establish global CORS settings here (will cascade to the rest of our app)
app.use(function CorsEnabled (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Content-Type, Origin, X-Requested-With, Accept");  

  next();

});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define raw app routes here, links them to routers in /routes (used in require() headers above)
app.use('/', index);
app.use(express.static('public'));
app.use('/complaint-letter', complaints);

var port = process.env.PORT || 5000;        // set our port

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);