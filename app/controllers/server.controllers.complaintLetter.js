'use strict';

var complaint = require('lx-pdf')('./app/pdf_templates/complaint.template.json');
var exported = {}; // This is our exported module


exported.promise = function() {

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
	console.log('start of printing');

	complaint.print(function(data, error) {

		console.log('data is supposed: ' + 'fuck');
		return data; 	

		if(error == false){
			return error;
		}

	});

	console.log("I should never be seen");

};

exported.get = function() {
	return exported.promise();
};

module.exports = exported;
