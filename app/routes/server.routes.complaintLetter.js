// Figure out when to break out into services (IE AWS)
// call the packages we need
var express    = require('express'),        // call express
		app        = express(),					        // define our app using express
		router 		 = express.Router(),          // get an instance of the express Router
		complaints = require('../controllers/server.controllers.complaintLetter'),
		aws 			 = require('../services/server.services.aws');

// middleware to use for all requests
router.use(function(req, res, next) {
	// get CORS to work correctly
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  next(); // make sure we go to the next routes and don't stop here
});

// Complaint route (accessed at GET http://localhost:8080/complaint-letter)
router.get('/', function(req, res) {
	complaints.get(req, res);
});

router.post('/', function(req, res) {
  complaints.save(req, res);
});

// more routes for our API will happen here
module.exports = router;
