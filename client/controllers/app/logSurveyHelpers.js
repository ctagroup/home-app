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
var sects;
Template.LogSurveyResponse.helpers({
	surveyQuesContents: function(){
		var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
		//console.log(Router.current().params._id);
		//console.log(surveyQuestionsMasterCollection.find({surveyID:Router.current().params._id}, {sort: {order: 1}}).fetch())
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
		//console.log("client name: " + id);
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
	},
	responseExists:function(){

		var responseCollection = adminCollectionObject("responses");
		var responseRecords = responseCollection.find({surveyID: Router.current().params._id}).fetch();
		//console.log("ID123: " + responseSections);
		for(var i in responseRecords){
			var sections = responseRecords[i].section;
			//console.log("SECTIONS: " + sections);
			for(var j in sections){
				var responses = sections[j].response;
				//console.log("RESPONSES: " + responses);
				for(var k in responses){
					var questions_ids = responses[k].questionID;
					var answers = responses[k].answer;
					//console.log("QUES_IDZZZZ: " + questions_ids + "ANS: " + answers);

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
		//console.log("id: " + Router.current().params._id);
		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({surveyID: Router.current().params._id}).fetch();

		//console.log("ID123: " + responseSections);
		for(var i in responseSections){
			var sections = responseSections[i].section;
			//console.log("SECTIONS: " + sections);
			for(var j in sections){
				var responses = sections[j].response;
				//console.log("RESPONSES: " + responses);
				for(var k in responses){
					var questions_ids = responses[k].questionID;
					var answers = responses[k].answer;
					//console.log("QUES_ID: " + questions_ids + "ANS: " + answers);
					
					return answers;
					//$("#" + questions_ids).val("answers");
					//$('input[name="f9MkQxitqNfDxEAeGANS"]').val('ls');

				}

			}

		}
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
var qIDs, sections;
Template.LogSurveyView.helpers({

	surveyQuesContents: function () {
		var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
		//console.log(Router.current().params._id);
		//console.log(surveyQuestionsMasterCollection.find({surveyID: Router.current().params._id}, {sort: {order: 1}}).fetch())
		return surveyQuestionsMasterCollection.find({surveyID: Router.current().params._id}, {sort: {order: 1}}).fetch();
	},
	surveyCompleted: function (status) {
		//console.log("Survey ID: " + status);
		var responseCollection = adminCollectionObject("responses");
		var responseRecords = responseCollection.find({surveyID: status}).fetch();
		var responseVal;
		for (var i in responseRecords) {

			var status = responseRecords[i].responsestatus;
			if (status == 'Completed') {
				//console.log("Stat: " + status);
				$('.savePaused_survey').addClass('hide');
				$('.pausePaused_survey ').addClass('hide');
				$('.cancelPaused_survey ').addClass('hide');
				return true;

			}else{
				$('.savePaused_survey').removeClass('hide');
				$('.pausePaused_survey ').removeClass('hide');
				$('.cancelPaused_survey ').removeClass('hide');
				
			}

		}
	},
	paused:function(status){
		var responseCollection = adminCollectionObject("responses");
		var responseRecords = responseCollection.find({surveyID: status}).fetch();
		var responseVal;
		for (var i in responseRecords) {

			var status = responseRecords[i].responsestatus;
			if (status == 'Paused') {
				//console.log("Stat: " + status);
				$('.savePaused_survey').removeClass('hide');
				$('.pausePaused_survey ').removeClass('hide');
				$('.cancelPaused_survey ').removeClass('hide');

			}else{
				$('.savePaused_survey').addClass('hide');
				$('.pausePaused_survey ').addClass('hide');
				$('.cancelPaused_survey ').addClass('hide');


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
		// for(var i in questions){
		// 	var singleSelect = questions[i].dataType;
		// 	if(singleSelect == "Single Select"){
		// 		console.log("SINGLE: " +questions[i].options.split(","))
		// 		return questions[i].options.split(",");
		// 	}
		// }

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
	surveyTextResponse: function (id) {

		//console.log("id: " + id);
		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({surveyID: Router.current().params._id}).fetch();
		var responseVal;
		//console.log("ID123: " + Router.current().params._id);
		for (var i in responseSections) {

			sections = responseSections[i].section;
			//console.log("Sections: " + sections);
			for (var j in sections) {
				//console.log("Sec: " + sections);
				var response = sections[j].response;
				//console.log("response: " + response);
				for (var k in response) {

					var quesIDs = response[k].questionID;
					//console.log("Ques ID: " + quesIDs);
					//console.log("QID: " + qid + " " + "response: " + responseVal);
					if (id == quesIDs) {
						responseVal = response[k].answer;
						//console.log("ans: " + responseVal);
						var questionCollection = adminCollectionObject("questions");
						var questions = questionCollection.find({_id: quesIDs}, {dataType: 1, _id: 0}).fetch();

						for (var i in questions) {
							var dataType = questions[i].dataType;
							var qid = questions[i]._id;
							// if(dataType == "Boolean"){
							// 	$('#' + id).prop('checked',responseVal);
                            //
							// }
							//console.log(qid + " " + "type: " + dataType + "res: " + responseVal);
							if (dataType == "Single Select") {

								//$('#' + id).prop('checked',responseVal);
								//console.log("QID: " + qid + " " + "response: " + responseVal);
								var options = questions[i].options;
								// //console.log("options: " + options);
								for (var s in options) {

									responseVal = options[s].description;
									//console.log("DESC: " + responseVal);
									// $("label[for='singleSelect']").text(responseVal);
									return responseVal;

								}
							}
							else if (dataType == "Multiple Select") {

								//console.log("QID: " + qid + " " + "response: " + responseVal + "DT: " + dataType);
								var options = questions[i].options;
								//var responseSplit = responseVal.split("|");
								var answer="";
								//var vals ="";
								for(var s in options){
									answer +=  options[s].description + '|';
									//vals = 	options[s].value;
									//console.log("ANSWERS: " + vals);
									//console.log("RES: " + answer);
									//$('#' + id).prop('checked',vals);

								}
								//console.log("AAAAA: " + answer);

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

		//console.log("XYZZZid: " + type);
		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({surveyID: Router.current().params._id}).fetch();
		var responseVal;
		//console.log("ID123: " + Router.current().params._id);
		for (var i in responseSections) {

			sections = responseSections[i].section;
			//console.log("Sections: " + sections);
			for (var j in sections) {
				//console.log("Sec: " + sections);
				var response = sections[j].response;
				//console.log("response: " + response);
				for (var k in response) {

					var quesIDs = response[k].questionID;
					//console.log("Ques ID: " + quesIDs);
					//console.log("QID: " + qid + " " + "response: " + responseVal);

						responseVal = response[k].answer;
						//console.log("ans: " + responseVal);
						var questionCollection = adminCollectionObject("questions");
						var questions = questionCollection.find({_id: quesIDs}, {dataType: 1, _id: 0}).fetch();

						for (var i in questions) {
							var dataType = questions[i].dataType;
							//var qid = questions[i]._id;

								if (dataType == "Boolean") {
									//console.log(responseVal + " " + type);
									//console.log("TRUE_VALUE: " + ( responseVal === type) ? 'checked' : null);
									return ( responseVal === type) ? 'checked' : null;

								}



							}


						}



				}

			}

		},
	isSelected:function(value){
		console.log("VAl: " + value);
		var responseCollection = adminCollectionObject("responses");
		var responseSections = responseCollection.find({surveyID: Router.current().params._id}).fetch();
		var responseVal;
		//console.log("ID123: " + Router.current().params._id);
		for (var i in responseSections) {

			sections = responseSections[i].section;
			//console.log("Sections: " + sections);
			for (var j in sections) {
				//console.log("Sec: " + sections);
				var response = sections[j].response;
				//console.log("response: " + response);
				for (var k in response) {

					var quesIDs = response[k].questionID;
					//console.log("Ques ID: " + quesIDs);
					//console.log("QID: " + qid + " " + "response: " + responseVal);

					responseVal = response[k].answer;
					//console.log("ans: " + responseVal);
					var questionCollection = adminCollectionObject("questions");
					var questions = questionCollection.find({_id: quesIDs}, {dataType: 1, _id: 0}).fetch();

					for (var i in questions) {
						var dataType = questions[i].dataType;
						//var qid = questions[i]._id;

						if (dataType == "Single Select") {
							console.log("res:  " + responseVal + " " + "val: " + value);
							//console.log("TRUE_VALUE: " + ( responseVal === value) ? 'checked' : null);
							return ( responseVal == value) ? 'checked' : null;

						}
						else if (dataType == "Multiple Select") {
							console.log("res:  " + responseVal + " " + "val: " + value);
							console.log("TRUE_VALUE: " + ( responseVal === value) ? 'checked' : null);
							return ( responseVal == value) ? 'checked' : null;

						}



					}


				}



			}

		}

	}


	
});
