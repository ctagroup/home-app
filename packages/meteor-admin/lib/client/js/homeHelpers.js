/**
 * Created by udit on 10/02/16.
 */
Template.AdminRoleManager.helpers( {
	getHomeRoles: function() {
		return homeRoles.find({}).fetch();
	},
	getPermissions: function() {
		var permissions = Roles.getAllRoles().fetch();
		var roles = homeRoles.find({}).fetch();
		roles = $.map(roles, function(role, i) {
			return role.title;
		});
		permissions = $.grep(permissions, function(p) {
			return $.inArray( p.name, roles) < 0;
		});
		return permissions;
	},
	isPermissionInRole: function(permission) {
		var rolePermissionsCollection = adminCollectionObject("rolePermissions");
		var result = rolePermissionsCollection.find({role:this.title,permission:permission, value:true} ).fetch();
		if ( result.length > 0 ) {
			return 'checked';
		}
		return "";
	}
} );

Template.AdminSettings.helpers( {
	getAdminSettings: function() {
		var settings = {};

		settings.hmisAPI = {};

		var optionsCollection = adminCollectionObject("options");
		var trustedAppID = optionsCollection.find({option_name:"trustedAppID"} ).fetch();
		if(trustedAppID.length > 0 && typeof trustedAppID[0].option_value != 'undefined') {
			settings.hmisAPI.trustedAppID = trustedAppID[0].option_value;
		} else {
			settings.hmisAPI.trustedAppID = "";
		}

		return settings;

	}
} );

UI.registerHelper("currentUserCan", function(cap) {
	return Roles.userIsInRole(Meteor.user(), cap);
});

Template.registerHelper('formatDate', function(date) {
	return moment(date).format('YYYY-MM-DD HH:mm:ss');
});

Template.registerHelper('my_console_log', function(data) {
	console.log(data);
});

Template.surveyViewTemplate.helpers(
	{
		surveyList: function() {
			var surveyCollection = adminCollectionObject("surveys");
			return surveyCollection.find({}).fetch();
		}
	}
);
Template.surveyForm.helpers(
	{
		surveyList: function() {
			var surveyCollection = adminCollectionObject("surveys");
			return surveyCollection.find({}).fetch();
		}			
	}
	
);
Template.surveyEditTemplate.helpers(
	{
		questionList: function() {
			var questionCollection = adminCollectionObject("questions");
			return questionCollection.find({}).fetch();
		},
		existingSelectedQuestions: function(){
			q_ids=Session.get('selectedQuestions');

			if(q_ids!=null)
				return true;
			else
				return false;
		}
	}
);

Template.questionViewTemplate.helpers(
	{
		questionList: function() {
			var questionCollection = adminCollectionObject("questions");
			return questionCollection.find({}).fetch();
		}
	}
);

Template.questionForm.helpers(
	{
		questionList: function() {
			var questionCollection = adminCollectionObject("questions");
			return questionCollection.find({}).fetch();
		}
	}
);

Template.surveyRow.helpers(
	{
		editSurveyPath: function(id) {
			var path = Router.path( "adminDashboard" + Session.get('admin_collection_name') + "Edit", {_id: id} );
			return path;
		}
	}
);

Template.sortableItemTarget.helpers(
	{
		notQuestion: function(type){

			if(type == "question")
				return false
			else
				return true;
		},
		quesNames: function(content){

			var questionCollection = adminCollectionObject("questions");
			var questionName = questionCollection.find({_id:content},{name:1,_id:0}).fetch();

			var qNames = '';
			for(var i in questionName){
				qNames = questionName[i].name;
			}
			return qNames;
		}
	}
);

Template.typeDefinition.helpers(
	{
		showPreview: function(){
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			if(surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}).count()>0){
				return true;
			}
			return false;
		},

		attributes: function () {
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			return surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}, {
				sort: { order: 1 }
			} );
		},
		attributesOptions: {
			group: {
				name: 'typeDefinition',
				put: true
			},
			// event handler for reordering attributes
			onSort: function (event) {
				console.log('Item %s went from #%d to #%d',
				            event.data.name, event.oldIndex, event.newIndex
				);
			}
		}
	}
);

Session.setDefault('selectedQuestions',null);

Template.selectQuestions.helpers(
	{
		questionList : function(){
			var questionCollection = adminCollectionObject("questions");
			return questionCollection.find({}).fetch();
		}
	}
);

var quesContent;
Template.previewSurvey.helpers(
	{
		surveyQuesContents: function(){
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			console.log(Router.current().params._id);
			console.log(surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}, {sort: {order: 1}}).fetch())
			return surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}, {sort: {order: 1}}).fetch();
		},
		textboxString: function(data){

			if(data == "Textbox(String)"){
				return true;
			}

		},
		displaySection: function(content_type){
			if(content_type == "section"){
				return true;
			}
		},
		displayLabel: function(content_type){
			if(content_type == "label"){
				return true;
			}
		},
		textboxNumber: function(data){
			if(data == "Textbox(Integer)"){
				return true;
			}

		},
		booleanYN: function(data){
			if(data == "Boolean"){
				return true;
			}
		},
		booleanTF: function(data){
			if(data == "Boolean"){
				return true;
			}
		},
		singleSelect: function(data){

			if(data == "Single Select"){
				return true;
			}
		},
		multipleSelect: function(data){

			if(data == "Multiple Select"){
				return true;
			}
		},
		displayQues: function(content_type,content){
			quesContent = content;

			if(content_type == "question"){
				return true;
			}
		},
		displayQuesContents: function(contentQuesId){

			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId}).fetch();

			for(var i in questions){
				var qNames = questions[i].question;
			}
			return qNames;

		},
		textboxString: function(contentQuesId){
			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

			for(var i in questions){
				var textboxString = questions[i].q_dataType;
				if(textboxString == "Textbox(String)"){
					return true;
				}
			}
		},
		textboxNumber: function(contentQuesId){
			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

			for(var i in questions){
				var textboxNumber = questions[i].q_dataType;
				if(textboxNumber == "Textbox(Integer)"){
					return true;
				}
			}
		},
		booleanTF: function(contentQuesId){
			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

			for(var i in questions){
				var bool = questions[i].q_dataType;
				if(bool == "Boolean"){
					return true;
				}
			}
		},
		singleSelect: function(contentQuesId){
			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

			for(var i in questions){
				var singleSelect = questions[i].q_dataType;
				if(singleSelect == "Single Select"){
					return true;
				}
			}
		},
		singleOptions: function(contentQuesId){

			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

			for(var i in questions){
				var singleSelect = questions[i].q_dataType;
				if(singleSelect == "Single Select"){
					console.log("SINGLE: " +questions[i].options.split(","))
					return questions[i].options.split(",");
				}
			}

		},
		multipleSelect: function(contentQuesId){
			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

			for(var i in questions){
				var multipleSelect = questions[i].q_dataType;
				if(multipleSelect == "Multiple Select"){
					return true;
				}
			}
		},
		multipleOptions: function(contentQuesId){

			var questionCollection = adminCollectionObject("questions");
			var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

			for(var i in questions){
				var multipleSelect = questions[i].q_dataType;
				if(multipleSelect == "Multiple Select"){
					console.log("MULTIPLE: " + questions[i].options.split(","));
					return questions[i].options.split(",");
				}
			}

		}
	}
);
