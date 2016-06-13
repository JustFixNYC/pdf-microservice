var q = require('q'), // Shoulda used native promises, but w/e
		phantom = require('phantom');

// NEW CODE
var session;

var createPhantomSession = function(args) {
	var def = q.defer();
  if (session) {
    console.log('session exists LOL');
    def.resolve(renderPdf(session, args));
  } else {
    console.log('new session created');
    phantom.create().then(function(_session){
    	console.log('session created');
    	session = _session;
    	def.resolve(renderPdf(session, args));
    }, function(error) {
    	console.log(error);
    	def.reject(error);
    });
  }

  return def.promise;
};

var renderPdf = function(session, args) {
  var page;
  var deferred = q.defer();
  console.log('renderPDF called');

  try {
    session.createPage().then(function(_page) {
    	console.log('page created')
      page = _page;

			page.on('onError', function(err){
				console.log('error');
				console.log(err);
				deferred.reject(err);
			});

			page.on('onResourceError', function(resourceError) {
			  console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
			  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
			});

      var file = 'temp/file' + Math.floor(Math.random() * 1000) + 1 + '.pdf';

			page.property('content', args);

      page.property('paperSize', {
			  format: 'A4',
			  orientation: 'portrait',
			  margin: '1in'
			});

			page.on('onLoadFinished', function(){
				console.log('loading finished');
	      page.render(file).then(function(){
	      	console.log('finally done building the PDF');
		      page.close();
		      page = null;
		      deferred.resolve(file);
	      });
			})
    }, function(err) {
    	console.log(err);
    });

  } catch(e) {
  	console.log('WHAT');
    try {
      if (page != null) {
        page.close(); // try close the page in case it opened but never rendered a pdf due to other issues
      }
    } catch(e) {
      // ignore as page may not have been initialised
    }
    deferred.reject('Exception rendering pdf: ' + e.toString());
  }

  return deferred.promise;

};

module.exports = {
	render: createPhantomSession
};
