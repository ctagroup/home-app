/**
 * Created by udit on 12/12/15.
 */
Meteor.startup( function() {
	process.env.MAIL_URL = 'smtp://postmaster%40sandbox99bfa58d2ea34f7893748e31be4823e8.mailgun.org:e9efb86cb5eeb210c6bdc66775bcf3ca@smtp.mailgun.org:587';
} );
