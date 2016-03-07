// Figure out when to break out into services (IE AWS)
// call the packages we need
var express    = require('express'),        // call express
		app        = express(),					        // define our app using express
		router 		 = express.Router(),          // get an instance of the express Router
		complaints = require('../controllers/server.controllers.complaintLetter'),
		aws 			 = require('../services/server.services.aws');

// Complaint route (accessed at GET http://localhost:whatever/complaint-letter)
router.get('/', function(req, res) {
	complaints.get(req, res);
});

router.post('/', function(req, res) {
  complaints.save(req, res);
});

// more routes for our API will happen here
module.exports = router;
