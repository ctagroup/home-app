/**
 * Created by udit on 13/12/15.
 */
//var adminUsers = Meteor.User.findAll();
//console.log(adminUsers);

AdminConfig = {
	name: 'H.O.M.E.',
	adminEmails: [
		'desaiuditd@gmail.com',
	    'kavithamuthu14@gmail.com',
	    'anushagovindan@gmail.com'
	],
	collections: {
		surveys: {
			icon: 'file-text',
			label: 'Surveys',
			tableColumns: [
				{
					name: 'title',
					label: 'Title',
					render: function( value, type, doc ) {
						var path = Router.path( "adminDashboard" + Session.get('admin_collection_name') + "Edit", {_id: doc._id} );
						return '<a href="' + path + '"><strong>' + value + '</strong></a>';
					}
				}
			]
		},
		questions: {
			icon: 'question',
			label: 'Questions'
		},
		users: {
			icon: 'user',
			label: 'Users',
			changeSelector: function( selector, userId ) {
				$or = selector['$or'];
				if ( $or ) {
					selector['$or'] = _.map( $or, function ( exp ) {
						var ref;
						if ( ( ( ref = exp.emails ) != null ? ref['$regex'] : void 0 ) != null ) {
							return {
								emails: {
									$elemMatch: {
										address: exp.emails
									}
								}
							};
						} else {
							return exp;
						}
					} );
				}
				return selector;
			},
			tableColumns: [
				{
					name: '_id',
					label: 'Admin',
					template: 'adminUsersIsAdmin',
					width: '55px'
				},
				{
					name: 'emails',
					label: 'Email',
					render: function( value ) {
						//some users have no email addresses
						if ( value && value.length ) {
							return value[0].address;
						}
						return '';
					},
					searchable: true
				},
				{
					name: 'emails',
					label: 'Mail',
					template: 'adminUsersMailBtn',
					width: '40px'
				},
				{
					name: 'createdAt',
					label: 'Joined'
				}
			]
		}
	}
	//nonAdminRedirectRoute: ''
};
