const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

exports.handler = function(event, context, callback) {
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_LOGIN,
            pass: process.env.MAIL_PASS
        }
    }));

    transporter.sendMail({
        from: process.env.MAIL_LOGIN,
        to: process.env.MAIL_TO,
        subject: process.env.SUBJECT,
        text: event.body
    }, function(error, info) {
    	if (error) {
    		callback(error);
    	} else {
    		callback(null, {
			    statusCode: 200,
			    body: "Mail sent! " + info.response
	    	});
    	}
    });
}