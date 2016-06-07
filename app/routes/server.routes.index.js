// Quick visual test for our Heroku server
var express    = require('express'),        
		app        = express(),					        
		router 		 = express.Router(),
		path			 = require('path');

router.get('/', function(req, res) {
	res.send('Server is up and running!');
});

router.get('/template', function(req, res) {
	res.sendfile(path.resolve('./app/templates/complaint.html'));
});

// Export this whole router, our express app will use it in init.js
module.exports = router;