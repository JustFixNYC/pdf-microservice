// Figure out when to break out into services (IE AWS)
// call the packages we need
var express    = require('express'),        // call express
		app        = express(),					        // define our app using express
		router 		 = express.Router(),          // get an instance of the express Router
		complaints = require('../controllers/server.controllers.complaintLetter'),
		aws 			 = require('../services/server.services.aws');

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api


// ROUTES FOR OUR API
// =============================================================================

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/complaint-letter)
router.get('/', function(req, res) {
	complaints.get(req, res);
});

router.post('/', function(req, res) {
  // complaints.save(req, res);
  complaints.save(req, res);
});

// more routes for our API will happen here
module.exports = router;
