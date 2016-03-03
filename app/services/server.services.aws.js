// This is gross
var AWS 			 = require('aws-sdk');
var authKeys   = {
	'awsAccessKeyId' : 'AKIAJGIAPUGB3CH62QYA',
	'awsAccessKeyVal': 'ag2n1WlyWMuJiu+TSJNAAXzQ0LKAFcqleo4Gzr2G'
};

AWS.config.update({
	AccessKeyId: authKeys.awsAccessKeyId,
	secretAccessKey: authKeys.awsAccessKeyVal,
  region: 'us-west-2'
});


var s3Deposit = new AWS.S3({params: {Bucket: 'goddamntestbucket'}});

module.exports = {
	saveToS3 : function(streamContent, res) {
		var randomNumber = Math.round(Math.random() * 1000);
		var params = {
			Key : 'pdf-start-' + randomNumber + '.pdf',
			ContentEncoding: 'UTF-8',
			Body: streamContent,
			ContentType: 'application/pdf'
		};
		s3Deposit.upload(params, function(err, data) {
			if(err) {
				res.json(error);
			} else {
				res.json(data.Location);
			}
		});
	},
	getFromS3 : function() {

	}
};