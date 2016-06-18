// Set environment configs w/ AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
var AWS 			 = require('aws-sdk'),
		fs 				 = require('fs');

// AWS bucket goes here
var s3Deposit = new AWS.S3({params: {Bucket: 'pdfbucket001'}});

var randomStringBuilder = function (){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = {
	saveToS3 : function(streamContent, res, urlToDelete) {
		var randomString = randomStringBuilder();
		var params = {
			Key : 'pdf-start-' + randomString + '.pdf',
			// ContentEncoding: 'UTF-8',
			Body: streamContent,
			ContentType: 'application/pdf'
		};
		s3Deposit.upload(params, function(err, data) {
			if(err) {
				console.log(err);
				res.json(error);
			} else {
				res.json(data.Location);
				fs.unlink(urlToDelete);
			}
		});
		// res.json(urlToDelete);
	},
	getFromS3 : function() {

	}
};