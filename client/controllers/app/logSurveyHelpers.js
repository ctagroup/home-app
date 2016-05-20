/**
 * Created by Anush-PC on 5/13/2016.
 */
Template.LogSurvey.helpers(
	{
		clientSearch: function ( query, sync, callback ) {
			Meteor.call('clientSearch', query, {}, function(err, res) {
				if (err) {
					console.log(err);
					return;
				}
				callback( res.map( function( v ) {
					return { value: v.name };
				} ) );
			});
		},
		getCreatedSurvey:function () {
			var surveyCollections=adminCollectionObject('surveys');
			return surveyCollections.find({'created':true}).fetch();
		},
		getSurveyedClient:function () {
			var clientCollections=adminCollectionObject('clientInfo');
			return clientCollections.find().fetch();
		}
	}
);

Template.LogSurveyResponse.helpers({
	surveyQuesContents: function(){
		var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
		console.log(Router.current().params._id);
		console.log(surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}, {sort: {order: 1}}).fetch())
		return surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}, {sort: {order: 1}}).fetch();
	},
	clientName:function(){
		var clientCollections=adminCollectionObject('clientInfo');
		var id = Router.current().params.query.clientID;
		var client_name = clientCollections.find({_id:id}).fetch();
		for(var i in client_name){
			var first_name = client_name[i].firstName;
			var middle_name = client_name[i].middleName;
			var last_name = client_name[i].lastName;
		}
		console.log("client name: " + id);
		return first_name + " " + middle_name + " " + last_name;


	},
	displaySection: function(content_type){
		if(content_type == "section"){
			return true;
		}
	},
	displayLabel: function(content_type){
		if(content_type == "labels"){
			return true;
		}
	},
	displaySkipButton:function(content_type, allow_skip){
		if(content_type == "section" && allow_skip == "true"){
			return true;
		}
	},
	textboxString: function(data){

		if(data == "Textbox(String)"){
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
			var textboxString = questions[i].dataType;
			if(textboxString == "Textbox(String)"){
				return true;
			}
		}
	},
	textboxNumber: function(contentQuesId){
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

		for(var i in questions){
			var textboxNumber = questions[i].dataType;
			if(textboxNumber == "Textbox(Integer)"){
				return true;
			}
		}
	},
	booleanTF: function(contentQuesId){
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

		for(var i in questions){
			var bool = questions[i].dataType;
			if(bool == "Boolean"){
				return true;
			}
		}
	},
	singleSelect: function(contentQuesId){
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

		for(var i in questions){
			var singleSelect = questions[i].dataType;
			if(singleSelect == "Single Select"){
				return true;
			}
		}
	},
	singleOptions: function(contentQuesId){

		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

		return questions[0].options;
		// for(var i in questions){
		// 	var singleSelect = questions[i].dataType;
		// 	if(singleSelect == "Single Select"){
		// 		console.log("SINGLE: " +questions[i].options.split(","))
		// 		return questions[i].options.split(",");
		// 	}
		// }

	},
	multipleSelect: function(contentQuesId){
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id:contentQuesId},{dataType:1,_id:0}).fetch();

		for(var i in questions){
			var multipleSelect = questions[i].dataType;
			if(multipleSelect == "Multiple Select"){
				return true;
			}
		}
	},
	getQuesName:function(getQuesName){
		return getQName(getQuesName);
	}

});

var getQName=function(getQuesName){
	console.log("from loggin events");
	var questionCollection = adminCollectionObject("questions");
	var questions = questionCollection.find({_id:getQuesName},{name:1,_id:0}).fetch();
	for(var i in questions){
		return questions[i].name;
	}
};
