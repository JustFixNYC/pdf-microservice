var q = require('q'), // Shoulda used native promises, but w/e
		phantom = require('phantom');
/*
// Determine if accompanying info was sent from controller correctly
if(args.length === 1) {
	throw new Error('no args passed! Please make sure the submission was sent correctly');
} else {
	page.content = args[1];
}

// Format paper so PDF comes out purrty
page.paperSize = {
  format: 'A4',
  orientation: 'portrait',
  margin: '1in'
};

// Once we correctly load our PDF as a webview, then this fires
page.onLoadFinished = function () {
	var title = 'temp/file' + Math.floor(Math.random() * 1000) + 1 + '.pdf';
	page.render(title);
	system.stdout.write(title);
	phantom.exit();
}

// Error tracking
page.onResourceError = function(resourceError) {
    system.stderr.writeLine('= onResourceError()');
    system.stderr.writeLine('  - unable to load url: "' + resourceError.url + '"');
    system.stderr.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
};

page.onError = function(msg, trace) {
    system.stderr.writeLine('= onError()');
    var msgStack = ['  ERROR: ' + msg];
    if (trace) {
        msgStack.push('  TRACE:');
        trace.forEach(function(t) {
            msgStack.push('    -> ' + t.file + ': ' + t.line );
        });
    }
    system.stderr.writeLine(msgStack.join('\n'));
};*/

// NEW CODE
var session;

var createPhantomSession = function(args) {
	var def = q.defer();
  if (session) {
    // console.log('session exists LOL');
    def.resolve(renderPdf(session, args));
  } else {
    // console.log('new session');
    session = phantom.create().then(function(_session){
    	session = _session;
    	def.resolve(renderPdf(session, args));
    });
  }

  return def.promise;
};

var renderPdf = function(session, args) {
  var page;
  var deferred = q.defer();

  try {

    session.createPage().then(function(_page) {
      page = _page;

      var file = 'temp/file' + Math.floor(Math.random() * 1000) + 1 + '.pdf';

			page.on('onError', function(err){
				console.log('error');
				console.log(err);
				deferred.reject(err);
			});
			page.on('onLoadFinished', function(){
				console.log('finished')
	      page.render(file).then(function(){
		      page.close();
		      page = null;
		      deferred.resolve(file);
	      });
			})

			page.property('content', args);

      page.property('paperSize', {
			  format: 'A4',
			  orientation: 'portrait',
			  margin: '1in'
			});
    });

  } catch(e) {
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
