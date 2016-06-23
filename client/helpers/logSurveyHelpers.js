/**
 * Created by Anush-PC on 5/13/2016.
 */

function isSkipped(sectionID) {
  let status = false;
  const responseCollection = adminCollectionObject('responses');
  const responseSection = responseCollection.findOne({ _id: Router.current().params._id });

  for (let i = 0; i < responseSection.section.length; i++) {
    if (responseSection.section[i].sectionID === sectionID) {
      if (responseSection.section[i].skip) {
        status = true;
      }
    }
  }

  return status;
}
function chkAudience(content) {
  const questionCollection = adminCollectionObject('questions');
  const question = questionCollection.findOne({ _id: content });

  return Router.current().params.query.audience === question.audience;
}
function checkSectionAudience(sid, status) {
  const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
  const questionCollection = adminCollectionObject('questions');
  let surveyElements = null;
  if (status === null) {
    surveyElements = surveyQuestionsMasterCollection.find(
      {
        surveyID: Router.current().params._id,
        sectionID: sid,
        contentType: 'question',
      }
    ).fetch();
  } else {
    surveyElements = surveyQuestionsMasterCollection.find(
      {
        surveyID: status,
        sectionID: sid,
        contentType: 'question',
      }
    ).fetch();
  }

  let count = 0;
  for (let i = 0; i < surveyElements.length; i++) {
    const question = questionCollection.find({ _id: surveyElements[i].content }).fetch();
    for (let j = 0; j < question.length; j++) {
      if (question[j].audience === Router.current().params.query.audience) {
        count ++;
      }
    }
  }
  return count > 0;
}
function surveyContents(surveyElements, status) {
  const sectionID = [];
  for (let i = 0; i < surveyElements.length; i++) {
    if (surveyElements[i].contentType === 'section') {
      if (checkSectionAudience(surveyElements[i]._id, status)) {
        sectionID.push(surveyElements[i]);
      }
    } else {
      if (checkSectionAudience(surveyElements[i].sectionID, status)) {
        sectionID.push(surveyElements[i]);
      }
    }
  }
  return sectionID;
}

function getQName(getQuesName) {
  var questionCollection = adminCollectionObject("questions");
  var questions = questionCollection.find({ _id: getQuesName }, { name: 1, _id: 0 }).fetch();
  for (var i in questions) {
    return questions[i].name;
  }

}

var qIDs, sections, survey_id, multiple_responses;
var sects;

Template.LogSurvey.helpers(
  {
    getCreatedSurvey: function () {
      var surveyCollections = adminCollectionObject('surveys');
      return surveyCollections.find({ 'created': true }).fetch();
    },
    getSurveyedClient: function () {
      var clientCollections = adminCollectionObject('clientInfo');
      return clientCollections.find().fetch();
    }
  }
);

Template.LogSurveyResponse.helpers(
  {
    surveyQuesContents: function () {
      var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
      var surveyElements = surveyQuestionsMasterCollection.find(
        { surveyID: Router.current().params._id },
        { sort: { order: 1 } }
      ).fetch();
      return surveyContents(surveyElements, null);
    },
    clientName: function () {
      var clientCollections = adminCollectionObject('clientInfo');
      var id = Router.current().params.query.clientID;
      var client_name = clientCollections.find({ _id: id }).fetch();
      for (var i in client_name) {
        var first_name = client_name[i].firstName;
        var middle_name = client_name[i].middleName;
        var last_name = client_name[i].lastName;
      }
      return first_name + " " + middle_name + " " + last_name;


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
      var questions = questionCollection.find({ _id: contentQuesId }).fetch();

      for (var i in questions) {
        var qNames = questions[i].question;
      }
      return qNames;

    },
    checkAudience: function (content) {
      return chkAudience(content);
    },
    textboxString: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var textboxString = questions[i].dataType;
        if (textboxString == "Textbox(String)") {
          return true;
        }
      }
    },
    textboxNumber: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var textboxNumber = questions[i].dataType;
        if (textboxNumber == "Textbox(Integer)") {
          return true;
        }
      }
    },
    booleanTF: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var bool = questions[i].dataType;
        if (bool == "Boolean") {
          return true;
        }
      }
    },
    singleSelect: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var singleSelect = questions[i].dataType;
        if (singleSelect == "Single Select") {
          return true;
        }
      }
    },
    singleOptions: function (contentQuesId) {

      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      return questions[0].options;

    },
    multipleSelect: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

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
    responseExists: function () {

      var responseCollection = adminCollectionObject("responses");
      var responseRecords = responseCollection.find({ surveyID: Router.current().params._id }).fetch();
      for (var i in responseRecords) {
        var sections = responseRecords[i].section;
        for (var j in sections) {
          var responses = sections[j].response;
          for (var k in responses) {
            var questions_ids = responses[k].questionID;
            var answers = responses[k].answer;
            if (answers != null) {
              return true;
            } else {
              return false;
            }

          }

        }

      }
    },
    surveyContents: function () {
      var responseCollection = adminCollectionObject("responses");
      var responseSections = responseCollection.find({ surveyID: Router.current().params._id }).fetch();
      for (var i in responseSections) {
        var sections = responseSections[i].section;
        for (var j in sections) {
          var responses = sections[j].response;
          for (var k in responses) {
            var questions_ids = responses[k].questionID;
            var answers = responses[k].answer;
            return answers;

          }

        }

      }
    }
  }
);

Template.LogSurveyView.helpers(
  {
    checkAudience: function (content) {
      return chkAudience(content);
    },
    surveyQuesContents: function (survey_id) {
      var responseCollection = adminCollectionObject("responses");
      var responseRecords = responseCollection.find({ _id: Router.current().params._id }).fetch();
      for (var i in responseRecords) {
        var surveyid = responseRecords[i].surveyID;
      }
      var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
      var surveyElements = surveyQuestionsMasterCollection.find({ surveyID: surveyid }, { sort: { order: 1 } }).fetch();
      return surveyContents(surveyElements, surveyid);
    },
    surveyTitle: function (surveyID) {
      var surveyCollection = adminCollectionObject("surveys");
      var surveys = surveyCollection.find({ _id: surveyID }).fetch();

      for (var i in surveys) {
        survey_id = surveys[i]._id;
        var survey_title = surveys[i].title;
      }
      return survey_title;

    },
    surveyCompleted: function () {
      var responseCollection = adminCollectionObject("responses");
      var responseRecords = responseCollection.find({ _id: Router.current().params._id }).fetch();

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
    paused: function () {
      var responseCollection = adminCollectionObject("responses");
      var responseRecords = responseCollection.find({ _id: Router.current().params._id }).fetch();

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
      var questions = questionCollection.find({ _id: contentQuesId }).fetch();

      for (var i in questions) {
        var qNames = questions[i].question;
      }
      return qNames;

    },
    textboxString: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var textboxString = questions[i].dataType;
        if (textboxString == "Textbox(String)") {
          return true;
        }
      }
    },
    textboxNumber: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var textboxNumber = questions[i].dataType;
        if (textboxNumber == "Textbox(Integer)") {
          return true;
        }
      }
    },
    booleanTF: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var bool = questions[i].dataType;
        if (bool == "Boolean") {
          return true;
        }
      }
    },
    singleSelect: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      for (var i in questions) {
        var singleSelect = questions[i].dataType;
        if (singleSelect == "Single Select") {
          return true;
        }
      }
    },
    singleOptions: function (contentQuesId) {

      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

      return questions[0].options;

    },
    multipleSelect: function (contentQuesId) {
      var questionCollection = adminCollectionObject("questions");
      var questions = questionCollection.find({ _id: contentQuesId }, { dataType: 1, _id: 0 }).fetch();

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
    checkSkipped: function (sectionID) {
      if (isSkipped(sectionID)) {
        return "checked";
      }
    },
    hideIfSkipped: function (sectionID) {
      if ((
            sectionID != null
          ) &&
          (
            (
              $('#' + sectionID).length
            )
          )) {
        var toggleSkip = $('#' + sectionID).is(':checked');
        if (toggleSkip) {
          return "hidden";
        } else {
          return "";
        }
      }
    },
    surveyTextResponse(id) {
      var responseCollection = adminCollectionObject("responses");
      var responseSections = responseCollection.find({ _id: Router.current().params._id }).fetch();
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
              var questions = questionCollection.find({ _id: quesIDs }, { dataType: 1, _id: 0 }).fetch();

              for (var i in questions) {
                var dataType = questions[i].dataType;
                var qid = questions[i]._id;

                if (dataType == "Single Select") {
                  var options = questions[i].options;
                  for (var s in options) {
                    responseVal = options[s].description;
                    return responseVal;
                  }
                } else if (dataType == "Multiple Select") {
                  var options = questions[i].options;
                  var answer = "";
                  for (var s in options) {
                    answer += options[s].description + '|';
                  }
                  return answer.split("|");
                } else {
                  return responseVal;
                }
              }
            }
          }
        }
      }
    },
    isChecked(type) {
      const responseCollection = adminCollectionObject('responses');
      const responseSection = responseCollection.findOne({ _id: Router.current().params._id });

      sections = responseSection.section;
      for (let j = 0; j < sections.length; j++) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k++) {
          const quesIDs = response[k].questionID;
          const responseVal = response[k].answer;
          const questionCollection = adminCollectionObject('questions');
          const questions = questionCollection.find(
            {
              _id: quesIDs,
            }, {
              dataType: 1,
              _id: 0,
            }
          ).fetch();

          for (let i = 0; i < questions.length; i++) {
            const dataType = questions[i].dataType;

            if (dataType === 'Boolean') {
              return (responseVal === type) ? 'checked' : '';
            }
          }
        }
      }
      return '';
    },
    isSelected(value) {
      const responseCollection = adminCollectionObject('responses');
      const responseSection = responseCollection.findOne({ _id: Router.current().params._id });

      sections = responseSection.section;

      for (let j = 0; j < sections.length; j++) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k++) {
          const quesIDs = response[k].questionID;
          const responseVal = response[k].answer;
          const questionCollection = adminCollectionObject('questions');
          const questions = questionCollection.find(
            {
              _id: quesIDs,
            }, {
              dataType: 1,
              _id: 0,
            }
          ).fetch();

          for (let i = 0; i < questions.length; i++) {
            const dataType = questions[i].dataType;
            if (dataType === 'Single Select') {
              return (responseVal === value) ? 'checked' : '';
            }
          }
        }
      }
      return '';
    },
    isSelectedMultiple(value) {
      const responseCollection = adminCollectionObject('responses');
      const responseSection = responseCollection.findOne({ _id: Router.current().params._id });

      sections = responseSection.section;
      for (let j = 0; j < sections.length; j++) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k++) {
          const quesIDs = response[k].questionID;

          const responseVal = response[k].answer.split('|');

          const questionCollection = adminCollectionObject('questions');
          const questions = questionCollection.find(
            {
              _id: quesIDs,
            }, {
              dataType: 1,
              _id: 0,
            }
          ).fetch();

          for (let i = 0; i < questions.length; i++) {
            const dataType = questions[i].dataType;

            if (dataType === 'Multiple Select') {
              for (let l = 0; l < responseVal.length; l++) {
                if (value === responseVal[i]) {
                  return 'checked';
                }
              }
              return '';
            }
          }
        }
      }
      return '';
    },
    sectionSkipped(sectionID) {
      return ! isSkipped(sectionID);
    },
  }
);
