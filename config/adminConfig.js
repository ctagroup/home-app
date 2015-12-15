/**
 * Created by udit on 13/12/15.
 */
//var adminUsers = Meteor.User.findAll();
//console.log(adminUsers);

AdminConfig = {
	name: 'H.O.M.E.',
	adminEmails: [
		'desaiuditd@gmail.com'
	],
	collections: {
		surveys: {
			icon: 'file-text',
			label: 'Surveys'
		},
		questions: {
			icon: 'question',
			label: 'Questions'
		}
	}
};
