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
		phantomService = require('../services/server.services.phantom'), // Phantom service
		fs = require('fs'), // Node file system
		q = require('q'), // Shoulda used native promises, but w/e
		dateFormat = require('dateformat'); // god I hate formatting dates

// Build our Template out using Handlebars, passes on populated HTML template as a string
priv.assembleTemplate = function(receivedRequest) {
	var now = new Date();
	var oneMonthLater = new Date(now.getFullYear(), now.getMonth()+1, 1);

	// Assuming we get nothin' on the call
	if(!receivedRequest) {
		receivedRequest = {};
	}

	// Handle textifying all our date formats, IMMEDIATELY INVOKED
	var dateFormatting = function() {
		receivedRequest.currentDate = dateFormat(now, 'mmmm dS, yyyy');
		receivedRequest.oneMonthLater = dateFormat(oneMonthLater, 'mmmm dS, yyyy');

		// Check to make sure we can build the issues dateformats
		if(receivedRequest.issues){

			for (var i = 0; i < receivedRequest.issues.length; i++) {
				if(receivedRequest.issues[i].startDate) {
					receivedRequest.issues[i].startDate = dateFormat(receivedRequest.issues[i].startDate, 'mmmm dS, yyyy');
				}
			}
		}

		// Check for access dates
		if(receivedRequest.accessDates){

			for (var i = 0; i < receivedRequest.accessDates.length; i++) {
				receivedRequest.accessDates[i] = dateFormat(receivedRequest.accessDates[i], 'mmmm dS, yyyy');
			}

		}
	}();

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

	// Checks that the value returns false
	Handlebars.registerHelper('if_neq', function(a, b, opts) {
    if (a !== b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
	});

	// Replace any line breaks in other formats (IE \n) with correctly formatted HTML 
	Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
	});

	var complaintTemplate = fs.readFileSync('app/templates/complaint.html', 'UTF8');
	var template = Handlebars.compile(complaintTemplate);

	return template(receivedRequest);

}

pub.get = function(req, res) {
	res.send('Please use correct REST command');
	/*This should probably return the user's already registered url...;*/

};

// Init save function
pub.save = function(req, res) {
	var data = req.body;
	data.url = req.headers.host;

	var argToPassToPhantomJS = priv.assembleTemplate(data);
	
	phantomService.render(argToPassToPhantomJS).then(
		function successCreate(localUrl) {
			
			// Read file, execute service call to save file depending on if file is executable
			fs.readFile(localUrl, function fsRead(err, dataStream) {
				if(err) {
					console.log('error occured: ' + err);
					res.send('404: Cannot create file', 404);
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
