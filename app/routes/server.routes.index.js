// Figure out when to break out into services (IE AWS)
// call the packages we need
var express    = require('express'),        // call express
		app        = express(),					        // define our app using express
		router 		 = express.Router();

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api


// ROUTES FOR OUR API
// =============================================================================


router.get('/', function(req, res) {
	res.send(res.headers);
});
// more routes for our API will happen here
module.exports = router;