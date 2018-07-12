const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

exports.handler = function(event, context, callback) {
    var transporter = nodemailer.createTransport(mg({
        auth: {
            user: process.env.DOMAIN,
            api_key: process.env.ACCESS_TOKEN
        }
    }));
    transporter.sendMail({
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