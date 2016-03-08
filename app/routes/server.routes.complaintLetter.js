// Figure out when to break out into services (IE AWS)
// call the packages we need
var express    = require('express'),        // call express
		app        = express(),					        // define our app using express
		router 		 = express.Router(),          // get an instance of the express Router
		complaints = require('../controllers/server.controllers.complaintLetter');

// Handle requests to the /complaint-letter route
router.get('/', function(req, res) {
	complaints.get(req, res);
});

router.post('/', function(req, res) {
  complaints.save(req, res);
});

// Export to 
module.exports = router;
