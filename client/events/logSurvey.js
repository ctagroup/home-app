/**
 * Created by Anush-PC on 5/13/2016.
 */
Template.LogSurvey.events(
  {
    'click .nextLogSurvey': (evt, tmpl) => {
      const surveyID = tmpl.find('.surveyList').value;
      const clientID = tmpl.find('.clientList').value;
      Router.go(
        'LogSurveyResponse', { _id: surveyID }, {
          query: {
            clientID,
            audience: tmpl.find('#q_audience').value,
          },
        }
      );
    },
  }
);
let responseId;

function getQuestionName(getQuesName) {
  const questionCollection = adminCollectionObject('questions');
  const questions = questionCollection.findOne({ _id: getQuesName }, { name: 1, _id: 0 }).fetch();
  let name = '';
  for (let k = 0; k < questions.length; k ++) {
    name = questions[k];
    break;
  }
  return name;
}
function checkAudience(qid) {
  const questionCollection = adminCollectionObject('questions');
  const questions = questionCollection.find({ _id: qid }, { audience: 1, _id: 0 }).fetch();

  let flag = false;

  for (let k = 0; k < questions.length; k ++) {
    flag = questions[k].audience === Router.current().params.query.audience;
    break;
  }

  return flag;
}

function saveSurvey(status, tmpl) {
  const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
  const surveyDocument = surveyQuestionsMasterCollection.find({ surveyID: tmpl.data._id }).fetch();
  const mainSectionObject = [];
  for (let i = 0; i < surveyDocument.length; i ++) {
    const type = surveyDocument[i].contentType;
    if (type === 'section') {
      const sectionObject = {};
      const answerObject = [];
      const sectionQuestions = surveyQuestionsMasterCollection.find(
        { sectionID: surveyDocument[i]._id }
      ).fetch();
      if ($(`#${surveyDocument[i]._id}`).is(':checked')) {
        sectionObject.sectionID = surveyDocument[i]._id;
        sectionObject.name = surveyDocument[i].content;
        sectionObject.skip = true;
        mainSectionObject.push(sectionObject);
        continue;
      } else {
        for (let j = 0; j < sectionQuestions.length; j ++) {
          const stype = sectionQuestions[j].contentType;
          if (stype !== 'labels') {
            if (checkAudience(sectionQuestions[j].content)) {
              const question = getQuestionName(sectionQuestions[j].content);
              const questionObject = {};
              let answer = '';
              if ((question.dataType === 'Single Select') || (question.dataType === 'Boolean')) {
                answer = $(`input:radio[name=${question._id}]:checked`).val();
              } else if (question.dataType === 'Multiple Select') {
                $(`input:checkbox[name=${question._id}]:checked`).each(
                  () => {
                    answer += `${$(this).val()}|`;
                  }
                );
                answer = answer.substr(0, answer.length - 1);
              } else {
                answer = tmpl.find(`#${question._id}`).value;
              }
              if ((answer === null) || (answer === '')) {
                if (status === 'Submit') {
                  if ($(`#${sectionQuestions[j].sectionID}`).is(':checked')) {
                    questionObject.questionID = question._id;
                    questionObject.answer = answer;
                    answerObject.push(questionObject);
                  } else {
                    alert(
                      /* eslint-disable */
                      `${surveyDocument[i].content} section is incomplete.Please fill all the fields in this section`
                      /* eslint-enable */
                    );
                    return;
                  }
                }
              } else {
                questionObject.questionID = question._id;
                questionObject.answer = answer;
                answerObject.push(questionObject);
              }
            }
          }
        }
        if (answerObject.length !== 0) {
          sectionObject.sectionID = surveyDocument[i]._id;
          sectionObject.name = surveyDocument[i].content;
          sectionObject.skip = false;
          sectionObject.response = answerObject;
          mainSectionObject.push(sectionObject);
        }
      }
    }
  }
  if (status === 'Submit') {
    Meteor.call(
      'addSurveyResponse',
      tmpl.data._id,
      Router.current().params.query.clientID,
      Router.current().params.query.audience,
      Meteor.userId(),
      mainSectionObject,
      'Completed',
      (error, result) => {
        if (error) {
          logger.log(error);
        } else {
          logger.log(result);
        }
      }
    );
    alert('Survey Saved!');
  } else if (status === 'Paused') {
    Meteor.call(
      'addSurveyResponse',
      tmpl.data._id,
      Router.current().params.query.clientID,
      Router.current().params.query.audience,
      Meteor.userId(),
      mainSectionObject,
      'Paused',
      (error, result) => {
        if (error) {
          logger.log(error);
        } else {
          logger.log(result);
          responseId = result;
          logger.log(`RID: ${responseId}`);
        }
      }
    );
    alert('Survey Paused!');
  }
  Router.go('surveyStatus');
}

function savePausedSurvey(status, tmpl) {
  const responsesCollection = adminCollectionObject('responses');
  const responseDocument = responsesCollection.find({ _id: tmpl.data._id }).fetch();
  for (var i in responseDocument) {

    var survey_id = responseDocument[i].surveyID;
    var client_id = responseDocument[i].clientID;
  }

  var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
  var surveyDocument = surveyQuestionsMasterCollection.find({ surveyID: survey_id }).fetch();
  var mainSectionObject = [];
  var mainSectionObject = [];
  for (var i in surveyDocument) {
    var type = surveyDocument[i].contentType;
    if (type == "section") {
      var sectionObject = {};
      var answerObject = [];
      var sectionQuestions = surveyQuestionsMasterCollection.find({ sectionID: surveyDocument[i]._id }).fetch();
      if ($('#' + surveyDocument[i]._id).is(':checked')) {
        sectionObject["sectionID"] = surveyDocument[i]._id;
        sectionObject["name"] = surveyDocument[i].content;
        sectionObject['skip'] = true;
        mainSectionObject.push(sectionObject);
        continue;
      }
      else {
        for (var j in sectionQuestions) {
          var stype = sectionQuestions[j].contentType;
          if (stype != "labels") {
            if (checkAudience(sectionQuestions[j].content)) {
              var question = getQuestionName(sectionQuestions[j].content);
              var questionObject = {};
              var answer = "";
              if ((
                    question.dataType == "Single Select"
                  ) ||
                  (
                    question.dataType == "Boolean"
                  )) {
                answer = $('input:radio[name=' + question._id + ']:checked').val();
              }
              else if (question.dataType == "Multiple Select") {
                $("input:checkbox[name=" + question._id + "]:checked").each(
                  function () {
                    answer += $(this).val() + '|';
                  }
                );
                answer = answer.substr(0, answer.length - 1);
              } else {
                answer = tmpl.find('#' + question._id).value;
              }

              if ((
                    answer == null
                  ) ||
                  (
                    answer == ""
                  )) {
                if (status == "Pause_Submit") {
                  if ($('#' + sectionQuestions[j].sectionID).is(':checked')) {
                    questionObject["questionID"] = question._id;
                    questionObject["answer"] = answer;
                    answerObject.push(questionObject);
                  }
                  else {
                    alert(
                      surveyDocument[i].content +
                      " section is incomplete.Please fill all the fields in this section"
                    );
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
        }
        if (answerObject.length != 0) {

          sectionObject["sectionID"] = surveyDocument[i]._id;
          sectionObject["name"] = surveyDocument[i].content;
          sectionObject['skip'] = false;
          sectionObject["response"] = answerObject;
          mainSectionObject.push(sectionObject);
        }
      }
    }
  }
  if (status == "Pause_Submit") {

    Meteor.call(
      "updateSurveyResponse",
      tmpl.data._id,
      survey_id,
      client_id,
      Meteor.userId(),
      mainSectionObject,
      "Completed",
      function (error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log(result);

        }
      }
    );
    alert("Survey Saved!");
  } else if (status == "Pause_Paused") {

    Meteor.call(
      "updateSurveyResponse",
      tmpl.data._id,
      survey_id,
      client_id,
      Meteor.userId(),
      mainSectionObject,
      "Paused",
      function (error, result) {

        if (error) {
          console.log(error);
        } else {
          console.log(result);

        }
      }
    );
    alert("Survey Paused!");
  }
  Router.go('surveyStatus');
};

Template.LogSurveyResponse.events(
  {
    'change .hideWhenSkipped': (evt) => {
      const toggleSkip = $(`#${evt.target.id}`).is(':checked');
      if (toggleSkip) {
        $(`.${evt.target.id}`).hide();
      } else {
        $(`.${evt.target.id}`).show();
      }
    },
    'change .singleSelect': (evt, tmpl) => {
      const element = tmpl.find('input:radio[name=singleSelect]:checked');
      const optionValue = $(element).val();

      if (optionValue === 'others' || optionValue === 'Others') {
        $('.othersSpecify_single').removeClass('hide');
      } else {
        $('.othersSpecify_single').addClass('hide');
      }
    },
    'change .multipleSelect': (evt, tmpl) => {
      const element = tmpl.find('input:checkbox[name=multipleSelect]:checked');
      const optionValue = $(element).val();

      if (optionValue === 'others' || optionValue === 'Others') {
        $('.othersSpecify_multiple').removeClass('hide');
      } else {
        $('.othersSpecify_multiple').addClass('hide');
      }
    },
    'click .pause_survey': (evt, tmpl) => {
      saveSurvey('Paused', tmpl);
    },
    'click .save_survey': (evt, tmpl) => {
      saveSurvey('Submit', tmpl);
    },
  }
);

Template.LogSurveyView.events(
  {
    'change .hideWhenSkipped': (evt, tmpl) => {
      const toggleSkip = $(`#${evt.target.id}`).is(':checked');
      if (toggleSkip) {
        $(`.${evt.target.id}`).hide();
      } else {
        $(`.${evt.target.id}`).show();
      }
    },

    'click .savePaused_survey': (evt, tmpl) => {
      savePausedSurvey('Pause_Submit', tmpl);
    },
    'click .pausePaused_survey': function (evt, tmpl) {
      //alert("Paused Survey Paused !");
      savePausedSurvey("Pause_Paused", tmpl);
    },

  }
);
