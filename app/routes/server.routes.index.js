// Figure out when to break out into services (IE AWS)
// call the packages we need
var express    = require('express'),        // call express
		app        = express(),					        // define our app using express
		router 		 = express.Router();

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api


// ROUTES FOR OUR API
// =============================================================================

// middleware to use for all requests
router.use(function(req, res, next) {
	// get CORS to work correctly
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // do logging
  
  next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
	res.send('Our server is running correctly');
});
// more routes for our API will happen here
module.exports = router;