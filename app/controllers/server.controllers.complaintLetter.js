'use strict';

var complaint = require('lx-pdf')('./app/pdf_templates/complaint.template.json');
var pub = {}; // This is our exported module
var priv = {}; // Internal helper functions
var rawDate = new Date();
var aws = require('../services/server.services.aws');

// PHANTOM JS introduction
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
 
var childArgs = [
  path.join(__dirname, '../services/server.services.phantom.js'),
  'some other argument (passed to phantomjs script)'
]

childProcess.execFile(binPath, childArgs, function phantomComplaint (err, stdout, stderr) {
	if(err !== null) {
		console.log('err: ' + err);
	} else if(stderr !== '') {
		console.log('standard error: ' + stderr);
	}

	console.log(stdout);
});


// Regularly scheduled programming...
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

priv.buildPDF = function(data) {
	var _this = this;
	var housingInfo = data;

	var tenantInfo = housingInfo.tenantInfo;

	var landlordInfo = housingInfo.landlordInfo;

	var firstSentence = 'Dear ' + landlordInfo.name + ', \n \n     I need the following repairs in my apartment referenced below and/or in the public areas of the building:\n\n';

	var roomLoop = function() {
		return housingInfo.issuesList;
	}

	var CYA = ' I have already contacted the person responsible for making repairs on [date of contacting super], but the issue has not been resolved. In the meantime, I have recorded evidence of the violation[s] should legal action be necessary.' +
		'\n\n If these repairs are not made by ' + priv.getDate.oneMonthLater() + ' I will have no choice but to use my legal remedies to get the repairs done.' +
		'\n\n Pursuant to NYC Admin Code § 27-2115 an order of civil penalties for all existing violations for which the time to correct has expired is as follows:' +
		'\n\n C violation:\n$50 per day per violation (if 1-5 units)\n $50-$150 one-time penalty per violation plus $125 per day (5 or more units)' +
		'\n\n “B” Violation: \n$25-$100 one-time penalty per violation plus $10 per day' +
		'\n\n “A” Violation: \n$10-$50 one-time penalty per violation' +
		'\n\n Please be advised that NYC Admin Code § 27-2115 provides a civil penalty where a person willfully makes a false certification of correction of a violation per violation falsely certified.' + 
		'\n Please contact me as soon as possible to arrange a time to have these repairs made at the number provided below.';

	var footer = ' \n\n Regards, \n' + tenantInfo.name + '\n ' + tenantInfo.address + '\n ' + tenantInfo.phone;

	complaint.addContent('main', firstSentence);
	complaint.addContent('main', roomLoop());
	complaint.addContent('main', CYA);
	complaint.addContent('main', footer);
	complaint.addContent('landlordAddress', landlordInfo.landlordAddress);
	complaint.addContent('date', priv.getDate.current());

};

pub.get = function(req, res) {

	complaint.print(function(data, error) {

		if(error == false){
			res.json(error);
		}

		res.json(data); 	

	});
	complaint.clear();

};

pub.save = function(req, res) {
	priv.buildPDF(req.body);
	complaint.print(function(data, error){
		if(error == false){
			res.json(error);
		}

		aws.saveToS3(data, res); 
	});
	complaint.clear();
}

module.exports = pub;
