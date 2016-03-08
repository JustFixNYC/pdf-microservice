// Quick visual test for our Heroku server
var express    = require('express'),        
		app        = express(),					        
		router 		 = express.Router();

router.get('/', function(req, res) {
	res.send('Server is up and running!');
});

// Export this whole router, our express app will use it in init.js
module.exports = router;