'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var lxDocument = require('lx-pdf')('testtemplate.json');
var http = require('http');
var nodemon = require('gulp-nodemon');

gulp.task('webserver', function() {

	gulp.src('app')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: false
    }));
});

// This needs to be replaced by dyanmic content
var landlordName = 'Dickhead';
var landlordAddress = landlordName + ' \n 600 Main St \n Brooklyn, NY  11235';


var buildPDF = function() {

	var phone = stupidUser.phone;
	console.log(phone);

	var rawDate = new Date();
	var finalDate = (rawDate.getMonth() + 1) + '/' + (rawDate.getDate()) + '/' + (rawDate.getFullYear());
	var text = 'stringOtext';
	var issuesFormatted;

	lxDocument.addContent('mainBody', text);
	lxDocument.addContent('landlordAddress', landlordAddress);
	lxDocument.addContent('date', finalDate);

	lxDocument.save('testdoc.pdf', function(result) {
		if(result !== null){
			console.log(result);
		} else {
			console.log('success!');
		}
	});
};

gulp.task('pdf', function() {
	buildPDF();
});

gulp.task('express', function() {
  nodemon({
	  script: 'config/init.js',
	  ext: 'js html',
	  env: { 'NODE_ENV': 'development' }
  });
});
