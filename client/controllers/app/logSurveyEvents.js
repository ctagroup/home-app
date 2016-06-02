/**
 * Created by Anush-PC on 5/13/2016.
 */
Template.LogSurvey.events({
	'click .nextLogSurvey': function (evt, tmpl) {
		var surveyID = tmpl.find('.surveyList').value;
		var clientID = tmpl.find('.clientList').value;
		Router.go('LogSurveyResponse', {_id: surveyID}, {query: 'clientID=' + clientID});
	}
});
var sec_id,response_id;
Template.LogSurveyResponse.events({
	'change .hideWhenSkipped': function (evt, tmpl) {

		var toggleSkip = $('.hideWhenSkipped').is(':checked');
		if (toggleSkip) {

			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			var masterSectionID = surveyQuestionsMasterCollection.findOne({_id: this._id}, {allowSkip: 1, _id: 0});
			var masterSkip_val = masterSectionID.allowSkip;

			var skipValForSection = surveyQuestionsMasterCollection.find({sectionID: this._id}).fetch();
			for (var i in skipValForSection) {

				sec_id = skipValForSection[i].sectionID;

			}
			console.log("masterSkip_val: " + masterSkip_val);
			if (masterSkip_val == "true") {

				$('.' + sec_id).hide();
			}
		} else {
			$('.' + sec_id).show();
		}
	},
	'change .singleSelect': function (evt, tmpl) {

		var element = tmpl.find('input:radio[name=singleSelect]:checked');
		var optionValue = $(element).val();
		console.log("value: " + optionValue);

		if (optionValue == 'others' || optionValue == 'Others') {
			console.log("Others, please specify");
			$('.othersSpecify_single').removeClass('hide');
		} else {
			$('.othersSpecify_single').addClass('hide');
		}
	},
	'change .multipleSelect': function (evt, tmpl) {

		var element = tmpl.find('input:checkbox[name=multipleSelect]:checked');
		var optionValue = $(element).val();
		console.log("value: " + optionValue);

		if (optionValue == 'others' || optionValue == 'Others') {
			console.log("Others, please specify");
			$('.othersSpecify_multiple').removeClass('hide');
		} else {
			$('.othersSpecify_multiple').addClass('hide');
		}
	},
	'click .pause_survey': function (evt, tmpl) {
		saveSurvey("Paused",tmpl)
	},
	'click .save_survey': function (evt, tmpl) {
		saveSurvey("Submit",tmpl);
	}


});

var saveSurvey=function(status,tmpl){
	var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
	var surveyDocument = surveyQuestionsMasterCollection.find({surveyID:tmpl.data._id }).fetch();
	var mainSectionObject = [];
	for (var i in surveyDocument) {
		var type = surveyDocument[i].contentType;
		if (type == "section") {
			var sectionObject = {};
			var answerObject = [];
			var sectionQuestions = surveyQuestionsMasterCollection.find({sectionID: surveyDocument[i]._id}).fetch();
			if($('#'+surveyDocument[i]._id).is(':checked'))
				continue;
			else {
				for (var j in sectionQuestions) {
					var stype = sectionQuestions[j].contentType;
					if (stype != "labels") {
						var question = getQuestionName(sectionQuestions[j].content);
						var questionObject = {};
						var answer = "";
						if ((question.dataType == "Single Select") || (question.dataType == "Boolean")) {
							answer = $('input:radio[name=' + question._id + ']:checked').val();
						}
						else if (question.dataType == "Multiple Select") {
							$("input:checkbox[name=" + question._id + "]:checked").each(function () {
								answer += $(this).val() + '|';
							});
							answer = answer.substr(0, answer.length - 1);
						} else {
							answer= tmpl.find('#' + question._id).value;
						}

						if ((answer == null) || (answer == "")) {
							if(status=="Submit") {
								if ($('#' + sectionQuestions[j].sectionID).is(':checked')) {
									questionObject["questionID"] = question._id;
									questionObject["answer"] = answer;
									answerObject.push(questionObject);
								}
								else {
									alert(surveyDocument[i].content + " section is incomplete.Please fill all the fields in this section");
									return;
								}
							}
						} else {
							questionObject["questionID"] = question._id;
							questionObject["answer"] = answer;
							answerObject.push(questionObject);
						}
					}
				}
				if(answerObject.length!=0) {
					sectionObject["name"] = surveyDocument[i].content;

					sectionObject["response"] = answerObject;
					mainSectionObject.push(sectionObject);
				}
			}
		}
	}
	if(status=="Submit") {
		Meteor.call("addSurveyResponse", tmpl.data._id, Router.current().params.query.clientID, Meteor.userId(), mainSectionObject, "Completed", function (error, result) {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
				//response_id = result;
				//console.log("RID: " + response_id);

			}
		});
		alert("Survey Saved!");
	}else if(status=="Paused"){
		Meteor.call("addSurveyResponse", tmpl.data._id, Router.current().params.query.clientID, Meteor.userId(), mainSectionObject, "Paused", function (error, result) {

			if (error) {
				console.log(error);
			} else {
				console.log(result);
				response_id = result;
				console.log("RID: " + response_id);

			}
		});
		alert("Survey Paused!");
	}
};
var getQuestionName = function (getQuesName) {
	var questionCollection = adminCollectionObject("questions");
	var questions = questionCollection.find({_id: getQuesName}, {name: 1, _id: 0}).fetch();
	for (var k in questions) {
		return questions[k];
	}
};

Template.LogSurveyView.events({

	'click .savePaused_survey':function(evt,tmpl){
		console.log("1");
		savePausedSurvey("Pause_Submit",tmpl);

	},
	'click .pausePaused_survey':function(evt,tmpl){
		//alert("Paused Survey Paused !");
		console.log("2");
		savePausedSurvey("Pause_Paused",tmpl);
	},

});
var savePausedSurvey=function(status,tmpl){

	console.log("Pause status: " + status);
	var responsesCollection = adminCollectionObject("responses");
	var responseDocument = responsesCollection.find({_id:tmpl.data._id }).fetch();
	for(var i in responseDocument){

		var survey_id = responseDocument[i].surveyID;
		var client_id = responseDocument[i].clientID;
		console.log("Survey ID: " + survey_id + " " + "Client ID: " + client_id);
	}

	var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
	var surveyDocument = surveyQuestionsMasterCollection.find({surveyID:survey_id }).fetch();
	var mainSectionObject = [];
	for (var i in surveyDocument) {
		var type = surveyDocument[i].contentType;
		if (type == "section") {
			var sectionObject = {};
			var answerObject = [];
			var sectionQuestions = surveyQuestionsMasterCollection.find({sectionID: surveyDocument[i]._id}).fetch();
			if($('#'+surveyDocument[i]._id).is(':checked'))
				continue;
			else {
				for (var j in sectionQuestions) {
					var stype = sectionQuestions[j].contentType;
					if (stype != "labels") {
						var question = getQuestionName(sectionQuestions[j].content);
						var questionObject = {};
						var answer = "";
						if ((question.dataType == "Single Select") || (question.dataType == "Boolean")) {
							answer = $('input:radio[name=' + question._id + ']:checked').val();
						}
						else if (question.dataType == "Multiple Select") {
							$("input:checkbox[name=" + question._id + "]:checked").each(function () {
								answer += $(this).val() + '|';
							});
							answer = answer.substr(0, answer.length - 1);
						} else {
							answer= tmpl.find('#' + question._id).value;
						}

						if ((answer == null) || (answer == "")) {
							if(status=="Submit") {
								if ($('#' + sectionQuestions[j].sectionID).is(':checked')) {
									questionObject["questionID"] = question._id;
									questionObject["answer"] = answer;
									answerObject.push(questionObject);
								}
								else {
									alert(surveyDocument[i].content + " section is incomplete.Please fill all the fields in this section");
									return;
								}
							}
						} else {
							questionObject["questionID"] = question._id;
							questionObject["answer"] = answer;
							answerObject.push(questionObject);
						}
					}
				}
				if(answerObject.length!=0) {
					sectionObject["name"] = surveyDocument[i].content;

					sectionObject["response"] = answerObject;
					mainSectionObject.push(sectionObject);
				}
			}
		}
	}
	if(status=="Pause_Submit") {

		Meteor.call("updateSurveyResponse",tmpl.data._id,survey_id ,client_id, Meteor.userId(), mainSectionObject, "Completed", function (error, result) {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
        
			}
		});
		alert("Survey Saved!");
	}else if(status=="Pause_Paused"){

		Meteor.call("updateSurveyResponse",tmpl.data._id,survey_id, client_id, Meteor.userId(), mainSectionObject, "Paused", function (error, result) {
        
			if (error) {
				console.log(error);
			} else {
				console.log(result);
        
			}
		});
		alert("Survey Paused!");
	}
};