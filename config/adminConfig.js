/**
 * Created by udit on 13/12/15.
 */

AdminConfig = {
	name: 'H.O.M.E.',
	adminEmails: [
		'desaiuditd@gmail.com',
	    'kavithamuthu14@gmail.com',
	    'anushagovindan@gmail.com'
	],
	defaultHomeRoles: [
		"Developer",
	    "System Admin",
	    "Admin",
	    "Program Manager",
	    "Case Manager",
	    "Surveyor"
	],
	defaultPermissions: [
		"Developer",
		"System Admin",
		"Admin",
		"Program Manager",
		"Case Manager",
		"Surveyor",
		"view_admin",
		"view_organization",
		"create_organization",
		"edit_organization",
		"delete_organization",
		"update_referral",
		"view_user",
		"create_user",
		"edit_user",
		"delete_user",
		"manage_user_role",
		"manage_user_status",
		"reset_user_password",
		"view_reports",
		"view_survey",
		"create_survey",
		"edit_survey",
		"delete_survey",
		"view_project",
		"create_project",
		"edit_project",
		"delete_project",
		"view_inventory",
		"create_inventory",
		"edit_inventory",
		"delete_inventory",
		"view_intake",
		"create_intake",
		"edit_intake",
		"delete_intake",
		"manage_settings"
	],
	defaultRolePermissions: {
		"Developer": [
			"Developer",
			"view_admin",
			"view_organization",
			"create_organization",
			"edit_organization",
			"delete_organization",
			"update_referral",
			"view_user",
			"create_user",
			"edit_user",
			"delete_user",
			"manage_user_role",
			"manage_user_status",
			"reset_user_password",
			"view_reports",
			"view_survey",
			"create_survey",
			"edit_survey",
			"delete_survey",
			"view_project",
			"create_project",
			"edit_project",
			"delete_project",
			"view_inventory",
			"create_inventory",
			"edit_inventory",
			"delete_inventory",
			"view_intake",
			"create_intake",
			"edit_intake",
			"delete_intake",
			"manage_settings"
		],
		"System Admin": [
			"System Admin",
			"view_admin",
			"view_organization",
			"create_organization",
			"edit_organization",
			"delete_organization",
			"update_referral",
			"view_user",
			"create_user",
			"edit_user",
			"delete_user",
			"manage_user_role",
			"manage_user_status",
			"reset_user_password",
			"view_reports",
			"view_survey",
			"create_survey",
			"edit_survey",
			"delete_survey",
			"view_project",
			"create_project",
			"edit_project",
			"delete_project",
			"view_inventory",
			"create_inventory",
			"edit_inventory",
			"delete_inventory",
			"view_intake",
			"create_intake",
			"edit_intake",
			"delete_intake",
			"manage_settings"
		],
		"Admin": [
			"Admin",
			"view_admin",
			"view_user",
			"create_user",
			"edit_user",
			"delete_user",
			"reset_user_password",
			"view_reports",
			"view_project",
			"create_project",
			"edit_project",
			"delete_project",
			"view_inventory",
			"create_inventory",
			"edit_inventory",
			"delete_inventory"
		],
		"Program Manager": [
			"Program Manager",
			"view_admin",
			"view_user",
			"view_reports",
			"view_inventory",
			"edit_inventory",
		],
		"Case Manager": [
			"Case Manager",
			"view_admin",
			"update_referral",
			"view_inventory",
			"view_intake",
			"create_intake",
			"edit_intake",
			"delete_intake",
		],
		"Surveyor": [
			"Surveyor",
			"view_admin",
			"view_survey",
			"view_intake",
			"create_intake",
			"edit_intake",
			"delete_intake",
		]
	},
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
			],
			templates: {
				view : {
					name: 'surveyViewTemplate'
				},
				edit: {
					name: 'surveyEditTemplate',
					data: function () {
						return Meteor.isClient && Session.get('admin_doc');
					}
				}
			}
		},
		questions: {
			icon: 'question',
			label: 'Questions',
			templates: {
				view: {
					name: 'questionViewTemplate'
				}
			}
		},
		users: {
			icon: 'user',
			label: 'Users',
			addNewLink: true,
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
