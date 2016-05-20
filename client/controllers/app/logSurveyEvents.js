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
var sec_id;
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
	'click .save_survey': function (evt, tmpl) {
		alert("save clicked: " + tmpl.data._id);
		var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
		var surveyDocument = surveyQuestionsMasterCollection.find({surveyID: tmpl.data._id}).fetch();
		var mainSectionObject = [];
		for (var i in surveyDocument) {
			var type = surveyDocument[i].contentType;
			if (type == "section") {
				var sectionObject = {};
				sectionObject["name"] = surveyDocument[i].content;
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
							questionObject["questionID"] = question._id;
							if ((question.dataType == "Single Select") || (question.dataType == "Boolean")) {
								questionObject["answer"] = $('input:radio[name=' + question._id + ']:checked').val();

							}
							else if (question.dataType == "Multiple Select") {
								var answer = "";
								$("input:checkbox[name=" + question._id + "]:checked").each(function () {
									answer += $(this).val() + '|';
								});
								answer = answer.substr(0, answer.length - 1);
								questionObject["answer"] = answer;
							} else {
								questionObject["answer"] = tmpl.find('#' + question._id).value;
							}
							if ((questionObject["answer"] == null) || (questionObject["answer"] == "")) {
								console.log("null identified in this section" + sectionQuestions[j].sectionID);
								if ($('#' + sectionQuestions[j].sectionID).is(':checked'))
									answerObject.push(questionObject);
								else
									return;
							} else
								answerObject.push(questionObject);
						}
					}
					sectionObject["response"] = answerObject;
					mainSectionObject.push(sectionObject);
				}
			}
		}
		console.log("hi dont print");
		Meteor.call("addSurveyResponse", tmpl.data._id, Router.current().params.query.clientID, Meteor.userId(), mainSectionObject,"Completed", function (error, result) {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
			}
		});

	},
	'click .save_survey': function (evt, tmpl) {
		alert("save clicked: " + tmpl.data._id);
		var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
		var surveyDocument = surveyQuestionsMasterCollection.find({surveyID: tmpl.data._id}).fetch();
		var mainSectionObject = [];
		for (var i in surveyDocument) {
			var type = surveyDocument[i].contentType;
			if (type == "section") {
				var sectionObject = {};
				sectionObject["name"] = surveyDocument[i].content;
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
							questionObject["questionID"] = question._id;
							if ((question.dataType == "Single Select") || (question.dataType == "Boolean")) {
								questionObject["answer"] = $('input:radio[name=' + question._id + ']:checked').val();

							}
							else if (question.dataType == "Multiple Select") {
								var answer = "";
								$("input:checkbox[name=" + question._id + "]:checked").each(function () {
									answer += $(this).val() + '|';
								});
								answer = answer.substr(0, answer.length - 1);
								questionObject["answer"] = answer;
							} else {
								questionObject["answer"] = tmpl.find('#' + question._id).value;
							}
							if ((questionObject["answer"] == null) || (questionObject["answer"] == "")) {
								console.log("null identified in this section" + sectionQuestions[j].sectionID);
								if ($('#' + sectionQuestions[j].sectionID).is(':checked'))
									answerObject.push(questionObject);
								else{
									alert(surveyDocument[i].content+" section is incomplete.Please fill all the fields in this section");
									return;
								}
							} else
								answerObject.push(questionObject);
						}
					}
					sectionObject["response"] = answerObject;
					mainSectionObject.push(sectionObject);
				}
			}
		}
		console.log("hi dont print");
		Meteor.call("addSurveyResponse", tmpl.data._id, Router.current().params.query.clientID, Meteor.userId(), mainSectionObject,"Completed", function (error, result) {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
			}
		});

	}

});

var getQuestionName = function (getQuesName) {
	var questionCollection = adminCollectionObject("questions");
	var questions = questionCollection.find({_id: getQuesName}, {name: 1, _id: 0}).fetch();
	for (var k in questions) {
		return questions[k];
	}
};

