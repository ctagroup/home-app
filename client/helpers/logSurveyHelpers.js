/**
 * Created by Anush-PC on 5/13/2016.
 */
Template.LogSurvey.helpers(
	{
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
var sects;
Template.LogSurveyResponse.helpers({
	surveyQuesContents: function(){
		var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
		var surveyElements= surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}, {sort: {order: 1}}).fetch();
		return surveyContents(surveyElements,null);
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
	checkAudience:function(content){
		return chkAudience(content);
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
	},
	responseExists:function(){

		var responseCollection = adminCollectionObject("responses");
		var responseRecords = responseCollection.find({surveyID: Router.current().params._id}).fetch();
		for(var i in responseRecords){
			var sections = responseRecords[i].section;
			for(var j in sections){
				var responses = sections[j].response;
				for(var k in responses){
					var questions_ids = responses[k].questionID;
					var answers = responses[k].answer;
					if(answers!=null){
						return true;
					}else{
						return false;
					}

				}

			}

		}
	},
	surveyContents:function() {
		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({surveyID: Router.current().params._id}).fetch();
		for(var i in responseSections){
			var sections = responseSections[i].section;
			for(var j in sections){
				var responses = sections[j].response;
				for(var k in responses){
					var questions_ids = responses[k].questionID;
					var answers = responses[k].answer;
					return answers;

				}

			}

		}
	}
});

var getQName=function(getQuesName){
	var questionCollection = adminCollectionObject("questions");
	var questions = questionCollection.find({_id:getQuesName},{name:1,_id:0}).fetch();
	for(var i in questions){
		return questions[i].name;
	}

};
var qIDs, sections, survey_id,multiple_responses;
Template.LogSurveyView.helpers({
	checkAudience:function(content){
		return chkAudience(content);
	},
	surveyQuesContents: function (survey_id) {
		var responseCollection = adminCollectionObject("responses");
		var responseRecords = responseCollection.find({_id: Router.current().params._id}).fetch();
		for(var i in responseRecords)
			var surveyid=responseRecords[i].surveyID;
		var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
		var surveyElements=surveyQuestionsMasterCollection.find({surveyID:surveyid}, {sort: {order: 1}}).fetch();
		return surveyContents(surveyElements,surveyid);
	},
	surveyTitle:function(surveyID){
		var surveyCollection = adminCollectionObject("surveys");
		var surveys = surveyCollection.find({_id: surveyID}).fetch();

		for (var i in surveys) {
			survey_id = surveys[i]._id;
			var survey_title = surveys[i].title;
		}
		return survey_title;

	},
	surveyCompleted: function () {


		var responseCollection = adminCollectionObject("responses");
		var responseRecords = responseCollection.find({_id: Router.current().params._id}).fetch();

		for (var i in responseRecords) {

			var status = responseRecords[i].responsestatus;
			if (status == 'Completed') {
				$('.savePaused_survey').hide();
				$('.pausePaused_survey ').hide();
				$('.cancelPaused_survey ').hide();
				$('#pauseSurvey').hide();
				return true;

			}

		}
	},
	paused:function(){
		var responseCollection = adminCollectionObject("responses");
		var responseRecords = responseCollection.find({_id: Router.current().params._id}).fetch();

		for (var i in responseRecords) {

			var status = responseRecords[i].responsestatus;

			if (status == 'Paused') {
				$('.savePaused_survey').show();
				$('.pausePaused_survey ').show();
				$('.cancelPaused_survey ').show();
				$('#pauseSurvey').show();
				return true;

			}

		}

	},
	displaySection: function (content_type) {
		if (content_type == "section") {
			return true;
		}
	},
	displayLabel: function (content_type) {
		if (content_type == "labels") {
			return true;
		}
	},
	displaySkipButton: function (content_type, allow_skip) {
		if (content_type == "section" && allow_skip == "true") {
			return true;
		}
	},
	textboxString: function (data) {

		if (data == "Textbox(String)") {
			return true;
		}

	},
	textboxNumber: function (data) {

		if (data == "Textbox(Integer)") {
			return true;
		}

	},
	booleanYN: function (data) {

		if (data == "Boolean") {
			return true;
		}
	},
	booleanTF: function (data) {
		if (data == "Boolean") {
			return true;
		}
	},
	singleSelect: function (data) {

		if (data == "Single Select") {
			return true;
		}
	},
	multipleSelect: function (data) {

		if (data == "Multiple Select") {
			return true;
		}
	},

	displayQues: function (content_type, content) {
		quesContent = content;
		if (content_type == "question") {
			return true;
		}
	},
	displayQuesContents: function (contentQuesId) {
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id: contentQuesId}).fetch();

		for (var i in questions) {
			var qNames = questions[i].question;
		}
		return qNames;

	},
	textboxString: function (contentQuesId) {
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id: contentQuesId}, {dataType: 1, _id: 0}).fetch();

		for (var i in questions) {
			var textboxString = questions[i].dataType;
			if (textboxString == "Textbox(String)") {
				return true;
			}
		}
	},
	textboxNumber: function (contentQuesId) {
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id: contentQuesId}, {dataType: 1, _id: 0}).fetch();

		for (var i in questions) {
			var textboxNumber = questions[i].dataType;
			if (textboxNumber == "Textbox(Integer)") {
				return true;
			}
		}
	},
	booleanTF: function (contentQuesId) {
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id: contentQuesId}, {dataType: 1, _id: 0}).fetch();

		for (var i in questions) {
			var bool = questions[i].dataType;
			if (bool == "Boolean") {
				return true;
			}
		}
	},
	singleSelect: function (contentQuesId) {
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id: contentQuesId}, {dataType: 1, _id: 0}).fetch();

		for (var i in questions) {
			var singleSelect = questions[i].dataType;
			if (singleSelect == "Single Select") {
				return true;
			}
		}
	},
	singleOptions: function (contentQuesId) {

		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id: contentQuesId}, {dataType: 1, _id: 0}).fetch();

		return questions[0].options;

	},
	multipleSelect: function (contentQuesId) {
		var questionCollection = adminCollectionObject("questions");
		var questions = questionCollection.find({_id: contentQuesId}, {dataType: 1, _id: 0}).fetch();

		for (var i in questions) {
			var multipleSelect = questions[i].dataType;
			if (multipleSelect == "Multiple Select") {
				return true;
			}
		}
	},
	getQuesName: function (getQuesName) {
		return getQName(getQuesName);
	},
	checkSkipped:function(sectionID){
		if(isSkipped(sectionID))
			return "checked";
	},
	hideIfSkipped:function(sectionID){
		if((sectionID!=null)&&(($( '#'+sectionID).length)))	 {
			var toggleSkip = $('#'+sectionID).is(':checked');
			if (toggleSkip)
				return "hidden";
			else
				return "";
		}
	},
	surveyTextResponse: function (id) {

		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({_id: Router.current().params._id}).fetch();
		var responseVal;
		for (var i in responseSections) {

			sections = responseSections[i].section;
			for (var j in sections) {
				var response = sections[j].response;
				for (var k in response) {

					var quesIDs = response[k].questionID;
					if (id == quesIDs) {
						responseVal = response[k].answer;
						var questionCollection = adminCollectionObject("questions");
						var questions = questionCollection.find({_id: quesIDs}, {dataType: 1, _id: 0}).fetch();

						for (var i in questions) {
							var dataType = questions[i].dataType;
							var qid = questions[i]._id;

							if (dataType == "Single Select") {

								var options = questions[i].options;
								for (var s in options) {
									responseVal = options[s].description;
									return responseVal;

								}
							}
							else if (dataType == "Multiple Select") {

								var options = questions[i].options;
								var answer="";
								for(var s in options){
									answer +=  options[s].description + '|';

								}
								return answer.split("|");
							}
							else{
								return responseVal;

							}

						}
					}


				}

			}

		}
	},
	isChecked:function(type){

		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({_id: Router.current().params._id}).fetch();
		var responseVal;
		for (var i in responseSections) {

			sections = responseSections[i].section;
			for (var j in sections) {
				var response = sections[j].response;
				for (var k in response) {

					var quesIDs = response[k].questionID;
						responseVal = response[k].answer;
						var questionCollection = adminCollectionObject("questions");
						var questions = questionCollection.find({_id: quesIDs}, {dataType: 1, _id: 0}).fetch();

						for (var i in questions) {
							var dataType = questions[i].dataType;

								if (dataType == "Boolean") {
									return ( responseVal === type) ? 'checked' : null;

								}



							}


						}



				}

			}

		},
	isSelected:function(value){

		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({_id: Router.current().params._id}).fetch();
		var responseVal;

		for (var i in responseSections) {

			sections = responseSections[i].section;

			for (var j in sections) {
				var response = sections[j].response;
				for (var k in response) {
					var quesIDs = response[k].questionID;
					responseVal = response[k].answer;
					var questionCollection = adminCollectionObject("questions");
					var questions = questionCollection.find({_id: quesIDs}, {dataType: 1, _id: 0}).fetch();

					for (var i in questions) {
						var dataType = questions[i].dataType;
						if (dataType == "Single Select") {
							return ( responseVal == value) ? 'checked' : null;

						}

					}

				}

			}

		}

	},

	isSelectedMultiple:function(value){

		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({_id: Router.current().params._id}).fetch();
		var responseVal;

		for (var i in responseSections) {
			sections = responseSections[i].section;
			for (var j in sections) {
				var response = sections[j].response;
				for (var k in response) {

					var quesIDs = response[k].questionID;

					responseVal = response[k].answer.split("|");

					var questionCollection = adminCollectionObject("questions");
					var questions = questionCollection.find({_id: quesIDs}, {dataType: 1, _id: 0}).fetch();

					for (var i in questions) {
						var dataType = questions[i].dataType;

							if (dataType == "Multiple Select") {

								for(var i=0;i<responseVal.length;i++) {
									if(value==responseVal[i])
										return "checked";

								}
								return;

						}

					}


				}

			}

		}

	},
	sectionSkipped:function(sectionID){
		if(isSkipped(sectionID)){
			return false;
		}else
			return true;

	}

});

var isSkipped=function(sectionID){
	var status=false;
	var responseCollection = adminCollectionObject("responses");
	var responseSections = responseCollection.find({_id: Router.current().params._id}).fetch().map( function( v ) {
		for(var i in v.section){
			if(v.section[i].sectionID==sectionID){
				if(v.section[i].skip)
					status=true;

			}
		}
	} );
	return status;
};
var chkAudience=function(content){
	var questionCollection = adminCollectionObject("questions");
	var questions = questionCollection.find({_id:content}).fetch();
	for(var i in questions){
		if(Router.current().params.query.audience==questions[i].audience)
			return true;
		else
			return false
	}
	return false;
};
var checkSectionAudience=function(sid,status){
	var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
	var questionCollection = adminCollectionObject("questions");
	if(status==null)
		var surveyElements= surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id,sectionID:sid,contentType:"question"}).fetch();
	else{
		var surveyElements= surveyQuestionsMasterCollection.find({surveyID:status,sectionID:sid,contentType:"question"}).fetch();
	}

	var count=0;
	for(var i in surveyElements){
		var question=questionCollection.find({_id:surveyElements[i].content}).fetch();
		for(var j in question)
		if(question[j].audience==Router.current().params.query.audience)
			count++;
	}
	return (count>0)?true:false;

};
var surveyContents=function(surveyElements,status){
	var sectionID=[];
	for(var i in surveyElements){
		if(surveyElements[i].contentType=="section"){
			if(checkSectionAudience(surveyElements[i]._id,status)){
				sectionID.push(surveyElements[i]);
			}
		}else{
			if(checkSectionAudience(surveyElements[i].sectionID,status)){
				sectionID.push(surveyElements[i]);
			}
		}
	}
	return sectionID;
};
