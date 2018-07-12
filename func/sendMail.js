const nodemailer = require('nodemailer');

exports.handler = function(event, context, callback) {
    var mail = require("nodemailer").mail;
    mail({
        from: process.env.MAIL_LOGIN,
        to: process.env.MAIL_TO,
        subject: process.env.SUBJECT + new Date().toLocaleString(),
        text: event.body
    }, function(error, info) {
    	if (error) {
    		callback(error);
    	} else {
    		callback(null, {
			    statusCode: 200,
			    body: "Ok"
	    	});
    	}
    });
}