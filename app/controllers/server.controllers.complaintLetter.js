'use strict';

var complaint = require('lx-pdf')('./app/pdf_templates/complaint.template.json');
var public = {}; // This is our exported module
var private = {}; // Internal helper functions

private.buildPDF = function(fullObj) {

};



exported.get = function(req, res) {

	var rawDate = new Date();
	var finalDate = (rawDate.getMonth() + 1) + '/' + (rawDate.getDate()) + '/' + (rawDate.getFullYear());
	var text = 'stringOtext';
	var issuesFormatted;
	
	// This needs to be replaced by dyanmic content
	var landlordName = 'Dickhead';
	var landlordAddress = landlordName + ' \n 600 Main St \n Brooklyn, NY  11235';

	complaint.addContent('mainBody', text);
	complaint.addContent('landlordAddress', landlordAddress);
	complaint.addContent('date', finalDate);

	complaint.print(function(data, error) {

		if(error == false){
			res.json(error);
		}

		res.json(data); 	

	});

};

module.exports = exported;
