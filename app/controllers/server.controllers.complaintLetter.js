'use strict';

var pub = {}; // This is our exported module
var priv = {}; // Internal helper functions
var rawDate = new Date();
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var Handlebars = require('handlebars');
var aws = require('../services/server.services.aws');
var fs = require('fs');
var q = require('q');

priv.assembleTemplate = function(receivedRequest) {

	receivedRequest.currentDate = priv.getDate.current();
	receivedRequest.oneMonthLater = priv.getDate.oneMonthLater();

	// Handlebar helper for repeating for loops, essentially. I dunno, it works okay?
	Handlebars.registerHelper('lister', function(items, options){

		var out = '';
		for(var i = 0; i < items.length; i++) {
			out = out + options.fn(items[i]);
		}

		return out;

	});

	var complaintTemplate = fs.readFileSync('app/templates/complaint.html', 'UTF8');
	var template = Handlebars.compile(complaintTemplate);

	return template(receivedRequest);

}

priv.buildPDFPhantomJS = function(data) {

	var deferred = q.defer();

	var argToPassToPhantomJS = priv.assembleTemplate(data);

	// Begin actual PhantomJS work
	var childArgs = [
	  path.join(__dirname, '../services/server.services.phantom.js'),
	  argToPassToPhantomJS
	];

	childProcess.execFile(binPath, childArgs, function phantomComplaint (err, stdout, stderr) {
		if(err !== null) {
			console.log('err: ' + err);
			deferred.reject(err);
		} else if(stderr !== '') {
			console.log('std error: ' + stderr);
			deferred.reject(stderr);
		} else {
			deferred.resolve(stdout);
		}
	});

	return deferred.promise;

}


// back to our regularly scheduled programming...
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
	}

}

pub.get = function(req, res) {
	res.send(res.headersSent);
	/*This should probably return the user's already registered url...;*/

};

pub.save = function(req, res) {

	priv.buildPDFPhantomJS(req.body).then(
		function successCreate(data) {
			// UGH I DO NOT LIKE THIS
			console.log('orig: ' + data);
			var dataFile = data.replace(/(\r\n|\n|\r)/gm, '');
			console.log('new: ' + dataFile);
			fs.readFile(dataFile, function fsRead(err, dataStream) {
				if(err) {
					console.log('error occured: ' + err);
				}
				aws.saveToS3(dataStream, res, fs.unlink(data));
			});
		},

		function failCreate(err) {
			res.json(err);
		}
	);
}

module.exports = pub;
