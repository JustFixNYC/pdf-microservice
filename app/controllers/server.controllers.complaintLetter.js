'use strict';

// This is our main controller for the complaint letter
var pub = {}, // This is our exported module
		priv = {}, // Internal helper functions
		rawDate = new Date();

// This is what's required to get childProcess and phantomJS run as a BASH command within node
var	path = require('path'),
		childProcess = require('child_process'),
		phantomjs = require('phantomjs-prebuilt'),
		binPath = phantomjs.path;

// This is everything else
var	Handlebars = require('handlebars'), // Templating engine
		aws = require('../services/server.services.aws'), // Our service for AWS data push
		fs = require('fs'), // Node file system
		q = require('q'); // Shoulda used native promises, but w/e

// Build our Template out using Handlebars, passes on populated HTML template as a string
priv.assembleTemplate = function(receivedRequest) {

	console.log(priv.getDate.formatDate(receivedRequest.issues[0].startDate))

	receivedRequest.currentDate = priv.getDate.current();
	receivedRequest.oneMonthLater = priv.getDate.oneMonthLater();

	// Handlebar for each loop, essentially. Works with incoming arrays 
	Handlebars.registerHelper('lister', function(items, options){

		var out = '';
		if(items){
			for(var i = 0; i < items.length; i++) {
				out = out + options.fn(items[i]);
			}

			return out;
		}

	});

	var complaintTemplate = fs.readFileSync('app/templates/complaint.html', 'UTF8');
	var template = Handlebars.compile(complaintTemplate);

	return template(receivedRequest);

}

// This is the final data transformations before sending our template out to the PhantomJS bash command
priv.buildPDFPhantomJS = function(data) {

	var deferred = q.defer();

	var argToPassToPhantomJS = priv.assembleTemplate(data);

	// Prep files for PhantomJS
	var childArgs = [
	  path.join(__dirname, '../services/server.services.phantom.js'), // THIS IS THE PHANTOMJS SERVICE/SCRIPT
	  argToPassToPhantomJS
	];

	// Execute PhantomJS command line script
	childProcess.execFile(binPath, childArgs, function phantomComplaint (err, stdout, stderr) {
		if(err !== null) {
			console.log('err: ' + err);
			deferred.reject(err);
		} else if(stderr !== '') {
			console.log('std error: ' + stderr);
			deferred.reject(stderr);
		} else {
			console.log(stdout);
			deferred.resolve(stdout);
		}
	});

	// finally, pass on the returned response from the PhantomJS script
	return deferred.promise;

}


// Modifying date to make human readable
priv.getDate = {

	monthsArray: [
		'January',
		'Febuary',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	],

	current: function () {
		var finalDate = this.monthsArray[rawDate.getMonth()] + ' ' + rawDate.getDate() + ', ' + rawDate.getFullYear();
		return finalDate;
	},

	oneMonthLater: function() {
		var futureMonth = rawDate.getMonth() + 1;
		var year = rawDate.getFullYear();
		if (futureMonth == 12) {
			futureMonth = 0;
			year++;
		}
		var futureDate = this.monthsArray[futureMonth] + ' ' + rawDate.getDate() + ', ' + year;
		return futureDate;
	},

	formatDate: function(raw) {
		var newDate = new Date(raw);
	}

}

pub.get = function(req, res) {
	res.send('Please use correct REST command');
	/*This should probably return the user's already registered url...;*/

};

// Init save function
pub.save = function(req, res) {

	priv.buildPDFPhantomJS(req.body).then(
		function successCreate(localUrl) {
			
			// Read file, execute service call to save file depending on if file is executable
			fs.readFile(localUrl, function fsRead(err, dataStream) {
				if(err) {
					console.log('error occured: ' + err);
				}
				aws.saveToS3(dataStream, res, localUrl);
			});
		},

		function failCreate(err) {
			console.log('ERROR IN CREATION: ' + err);
			res.json(err);
		}
	);
}

module.exports = pub;
