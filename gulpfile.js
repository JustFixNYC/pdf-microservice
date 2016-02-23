'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var lxDocument = require('lx-pdf')('./pdf_templates/complaint.template.json');
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

gulp.task('express', function() {
  nodemon({
	  script: 'config/init.js',
	  ext: 'js html',
	  env: { 'NODE_ENV': 'development' }
  });
});
