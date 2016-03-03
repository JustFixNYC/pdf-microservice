var system = require('system');
var args = system.args;
var page = require('webpage').create();

// Determine if accompanying info was sent correctly
if(args.length === 1) {
	throw new Error('no args passed! Please make sure the submission was sent correctly');
} else {
	page.content = args[1];
}

//Main build block
page.paperSize = {
  format: 'A4',
  orientation: 'portrait',
  margin: '1cm'
};

// Our main callback
page.onLoadFinished = function () {
	var title = 'temp/file' + Math.floor(Math.random() * 1000) + 1 + '.pdf';
	console.log(title);
	page.render(title);
	system.stdout = title;
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
};