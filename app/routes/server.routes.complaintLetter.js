// Figure out when to break out into services (IE AWS)
// call the packages we need
var express    = require('express'),        // call express
		app        = express(),					        // define our app using express
		router 		 = express.Router(),          // get an instance of the express Router
		complaints = require('../controllers/server.controllers.complaintLetter');

router.get('/', function(req, res) {
	complaints.get(req, res);
});

router.post('/', function(req, res) {
	console.log('are we hitting the right spot?');  

  // complaints.save(req, res);
	res.send('correct CORS req');
});

// Export to 
module.exports = router;
