/**
 * Created by udit on 12/12/15.
 */

/**
 * Application Routes
 */

/**
 * Public Routes without login
 */
var publicRoutes = [
	'root',
	'home',
	'changePwd',
	'enrollAccount',
	'forgotPwd',
	'resetPwd',
	'signIn',
	'signUp',
	'verifyEmail',
	'resendVerificationEmail',
	'privacy',
	'termsOfUse',
    'notEnoughPermission'
];

/**
 * Route Controller to check on users.
 */
HomeAppController = RouteController.extend(
	{
		onBeforeAction: function() {
			if ( Meteor.userId() && ! Roles.userIsInRole( Meteor.userId(), 'view_admin' ) ) {
				Meteor.call( 'adminCheckAdmin' );
			}
			this.next();
		}
	}
);

HomeAppSurveyorController = HomeAppController.extend(
	{
		onBeforeAction: function () {
			if ( Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'Surveyor') ) {
				// Allow Route for Surveyors
			} else {
				Router.go('notEnoughPermission');
				return;
			}
			this.next();
		}
	}
);

/**
 * Home Routes
 */
Router.route( '/', {
	name: 'root',
	template: 'home',
	controller: 'HomeAppController'
} );
Router.route( '/home', {
	name: 'home',
	template: 'home',
	controller: 'HomeAppController'
} );

/**
 * Accounts Routes
 */
AccountsTemplates.configureRoute( 'signIn', {
	name: 'signIn',
	path: '/login',
	template: 'login',
	redirect: '/app',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'signUp', {
	name: 'signUp',
	path: '/register',
	template: 'login',
	controller: 'HomeAppController'
} );

/**
 * App Routes
 */
Router.route( '/app', {
	name: 'appRoot',
	template: 'appDashboard',
	controller: 'HomeAppController'
});
Router.route( '/app/dashboard', {
	name: 'appDashboard',
	template: 'appDashboard',
	controller: 'HomeAppController'
});

Router.route('/not-enough-permission', {
	name: 'notEnoughPermission',
	template: 'notEnoughPermission',
	controller: 'HomeAppController'
} );
/**
 * Client Routes
 */
Router.route( '/app/clients', {
	name: 'searchClient',
	template: 'searchClient',
	controller: 'HomeAppController',
} );
Router.route('/app/clients/new',{
	name:'createClient',
	template: 'createClient',
	controller: 'HomeAppController',
});
Router.route('/app/clients/:_id',{
	name: 'viewClient',
	template: 'viewClient',
	controller: 'HomeAppController',
	data: function(){
		var clientInfoID = this.params._id;
		var clientInfoCollection = adminCollectionObject("clientInfo");
		return clientInfoCollection.findOne({_id:clientInfoID});

	}
});
Router.onBeforeAction(function () {
	var recentClients = Session.get("recentClients") || [];
	var clientInfoCollection = adminCollectionObject("clientInfo");
	var clientInfo = clientInfoCollection.findOne({_id:this.params._id});

	if ( clientInfo && clientInfo._id ) {
		var recentClientsIDs = recentClients.map(function (client) {
			return client._id;
		});

		if ( recentClientsIDs.indexOf(this.params._id) == -1 ) {
			var route = Router.routes["viewClient"];
			var data = {
				_id: this.params._id,
				name: clientInfo.firstName.trim() + ' ' + clientInfo.lastName.trim(),
				url: route.path({_id: this.params._id})
			};
			recentClients.push(data);
			recentClients = $.unique(recentClients);
			Session.set("recentClients", recentClients);
		}
	} else {
		this.render('clientNotFound');
		return;
	}

	this.next();
}, {
	only: ['viewClient', 'editClient']
});
Router.route('/app/clients/:_id/edit',{
	name:'editClient',
	template: 'editClient',
	controller: 'HomeAppController',
	data: function(){
		var clientInfoID = this.params._id;
		var clientInfoCollection = adminCollectionObject("clientInfo");
		return clientInfoCollection.findOne({_id:clientInfoID});

	}
});

Router.route('/app/LogSurvey/',{
	name:'LogSurvey',
	template: 'LogSurvey',
	controller: 'HomeAppController'
});
Router.route('/app/LogSurvey/:_id',{
	name:'LogSurveyResponse',
	template: 'LogSurveyResponse',
	controller: 'HomeAppController',
	data: function(){
		var surveyID = this.params._id;
		console.log("suvey"+surveyID);
		var surveysCollection = adminCollectionObject("surveys");
		return surveysCollection.findOne({_id:surveyID});

	}
});
Router.route('/app/LogSurveyView/:_id',{
	name:'LogSurveyView',
	template: 'LogSurveyView',
	controller: 'HomeAppController',
	data: function(){
		var responseID = this.params._id;
		var responsesCollection = adminCollectionObject("responses");
		return responsesCollection.findOne({_id:responseID});

	}
});
/**
 * Survey status Routes
 */
Router.route( '/app/surveyStatus/', {
	name: 'surveyStatus',
	template: 'surveyStatus',
	controller: 'HomeAppController',
} );
/**
 * Ensure User Login for templates
 */
Router.plugin( 'ensureSignedIn', {
	except: publicRoutes
} );

/**
 * Misc Routes
 * */
Router.route( '/privacy', {
	name: 'privacy',
	template: 'privacy',
	controller: 'HomeAppController'
} );
Router.route( '/terms-of-use', {
	name: 'termsOfUse',
	template: 'termsOfUse',
	controller: 'HomeAppController'
} );

/**
 * Chat Routes
 */

 Router.route( '/app/chat/', {
	name: 'chat',
	template: 'chat',
	controller: 'HomeAppController'
} );
