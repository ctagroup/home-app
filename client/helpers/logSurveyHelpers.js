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

function getQName(qID) {
  const questionCollection = adminCollectionObject('questions');
  const question = questionCollection.findOne({ _id: qID });
  return question.name;
}

let sections;

Template.LogSurvey.helpers(
  {
    getCreatedSurvey() {
      const surveyCollections = adminCollectionObject('surveys');
      return surveyCollections.find({ created: true }).fetch();
    },
    getSurveyedClient() {
      const clientCollections = adminCollectionObject('clientInfo');
      return clientCollections.find().fetch();
    },
  }
);

Template.LogSurveyResponse.helpers(
  {
    surveyQuesContents() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const surveyElements = surveyQuestionsMasterCollection.find(
        { surveyID: Router.current().params._id },
        { sort: { order: 1 } }
      ).fetch();
      return surveyContents(surveyElements, null);
    },
    clientName() {
      const clientCollections = adminCollectionObject('clientInfo');
      const id = Router.current().params.query.clientID;
      const client = clientCollections.findOne({ _id: id });

      return `${client.firstName} ${client.middleName} ${client.lastName}`;
    },
    displaySection(contentType) {
      return contentType === 'section';
    },
    displayLabel(contentType) {
      return contentType === 'labels';
    },
    displaySkipButton(contentType, allowSkip) {
      return contentType === 'section' && allowSkip === 'true';
    },
    displayQues(contentType) {
      // quesContent = content;
      return contentType === 'question';
    },
    displayQuesContents(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      return question.question;
    },
    checkAudience(content) {
      return chkAudience(content);
    },
    textboxString(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Textbox(String)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    textboxNumber(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Textbox(Integer)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    booleanTF(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Boolean') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Single Select') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleOptions(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      return questions[0].options;
    },
    multipleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Multiple Select') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    getQuesName(getQuesName) {
      return getQName(getQuesName);
    },
    responseExists() {
      let flag = false;

      const responseCollection = adminCollectionObject('responses');
      const responseRecords = responseCollection.find(
        { surveyID: Router.current().params._id }
      ).fetch();
      for (let i = 0; i < responseRecords.length; i++) {
        const sectionz = responseRecords[i].section;
        for (let j = 0; j < sectionz.length; j++) {
          const responses = sectionz[j].response;
          for (let k = 0; k < responses.length; k++) {
            const answers = responses[k].answer;
            flag = answers != null;
            break;
          }
        }
      }
      return flag;
    },
    surveyContents() {
      const responseCollection = adminCollectionObject('responses');
      const responseSections = responseCollection.find(
        { surveyID: Router.current().params._id }
      ).fetch();
      for (let i = 0; i < responseSections.length; i++) {
        const sectionz = responseSections[i].section;
        for (let j = 0; j < sectionz.length; j++) {
          const responses = sectionz[j].response;
          for (let k = 0; k < responses.length; k++) {
            const answers = responses[k].answer;
            return answers;
          }
        }
      }
      return [];
    },
  }
);

Template.LogSurveyView.helpers(
  {
    checkAudience(content) {
      return chkAudience(content);
    },
    surveyQuesContents() {
      const responseCollection = adminCollectionObject('responses');
      const responseRecord = responseCollection.findOne({ _id: Router.current().params._id });

      const surveyid = responseRecord.surveyID;

      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const surveyElements = surveyQuestionsMasterCollection.find(
        { surveyID: surveyid }, { sort: { order: 1 } }
      ).fetch();
      return surveyContents(surveyElements, surveyid);
    },
    surveyTitle(surveyID) {
      const surveyCollection = adminCollectionObject('surveys');
      const survey = surveyCollection.findOne({ _id: surveyID });

      // surveyId = survey._id;
      return survey.title;
    },
    surveyCompleted() {
      const responseCollection = adminCollectionObject('responses');
      const responseRecord = responseCollection.findOne({ _id: Router.current().params._id });

      let flag = false;

      const status = responseRecord.responsestatus;
      if (status === 'Completed') {
        $('.savePaused_survey').hide();
        $('.pausePaused_survey').hide();
        $('.cancelPaused_survey').hide();
        $('#pauseSurvey').hide();
        flag = true;
      }
      return flag;
    },
    paused() {
      const responseCollection = adminCollectionObject('responses');
      const responseRecord = responseCollection.findOne({ _id: Router.current().params._id });

      const status = responseRecord.responsestatus;

      let flag = false;

      if (status === 'Paused') {
        $('.savePaused_survey').show();
        $('.pausePaused_survey').show();
        $('.cancelPaused_survey').show();
        $('#pauseSurvey').show();
        flag = true;
      }
      return flag;
    },
    displaySection(contentType) {
      return contentType === 'section';
    },
    displayLabel(contentType) {
      return contentType === 'labels';
    },
    displaySkipButton(contentType, allowSkip) {
      return contentType === 'section' && allowSkip === 'true';
    },
    displayQues(contentType) {
      // quesContent = content;
      return contentType === 'question';
    },
    displayQuesContents(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.question;
    },
    textboxString(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Textbox(String)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    textboxNumber(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Textbox(Integer)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    booleanTF(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Boolean') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const type = questions[i].dataType;
        if (type === 'Single Select') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleOptions(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      return questions[0].options;
    },
    multipleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const questions = questionCollection.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questions.length; i++) {
        const multipleSelect = questions[i].dataType;
        if (multipleSelect === 'Multiple Select') {
          flag = true;
          break;
        }
      }

      return flag;
    },
    getQuesName(getQuesName) {
      return getQName(getQuesName);
    },
    checkSkipped(sectionID) {
      let skipVal = '';
      if (isSkipped(sectionID)) {
        skipVal = 'checked';
      }
      return skipVal;
    },
    hideIfSkipped(sectionID) {
      let toggleVal = '';
      if ((sectionID != null) && (($(`#${sectionID}`).length))) {
        const toggleSkip = $(`#${sectionID}`).is(':checked');
        if (toggleSkip) {
          toggleVal = 'hidden';
        }
      }
      return toggleVal;
    },
    surveyTextResponse(id) {
      const responseCollection = adminCollectionObject('responses');
      const responseSection = responseCollection.findOne({ _id: Router.current().params._id });

      sections = responseSection.section;
      for (let j = 0; j < sections.length; j++) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k++) {
          const quesIDs = response[k].questionID;
          if (id === quesIDs) {
            let responseVal = response[k].answer;
            const questionCollection = adminCollectionObject('questions');
            const questions = questionCollection.find(
              { _id: quesIDs }, { dataType: 1, _id: 0 }
            ).fetch();

            for (let i = 0; i < questions.length; i++) {
              const dataType = questions[i].dataType;

              if (dataType === 'Single Select') {
                const options = questions[i].options;
                for (let l = 0; l < options.length; l++) {
                  responseVal = options[l].description;
                  return responseVal;
                }
              } else if (dataType === 'Multiple Select') {
                const options = questions[i].options;
                let answer = '';
                for (let l = 0; l < options.length; l++) {
                  answer += `${options[l].description}|`;
                }
                return answer.split('|');
              } else {
                return responseVal;
              }
            }
          }
        }
      }
      return '';
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
