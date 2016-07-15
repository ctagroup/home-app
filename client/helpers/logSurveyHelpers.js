/**
 * Created by Anush-PC on 5/13/2016.
 */
// function getAge(dob) {
//   const date = new Date(dob);
//   const ageDifMs = Date.now() - date.getTime();
//   const ageDate = new Date(ageDifMs); // miliseconds from epoch
//   return (Math.abs(ageDate.getUTCFullYear() - 1970));
// }
// function isHoH(reltohoh) {
//   let status;
//   if (reltohoh === '1') {
//     status = true;
//   } else {
//     status = false;
//   }
//   return status;
// }

function getAudience() {
  return 'everyone';
  /*
  const data = Router.current().data();
  const client = data.client;

  let age;
  let isHead;
  let audience;
  if (client.dob !== '') { age = getAge(parseInt(client.dob, 10)); }
  if (client.relationship !== '') { isHead = isHoH(client.relationship); }
  if (isHead) {
    if (age >= 18) {
      audience = 'bothadultsandhoh';
    } else {
      audience = 'hoh';
    }
  } else {
    if (age >= 18) {
      audience = 'adult';
    } else if (age < 18) {
      audience = 'child';
    } else {
      audience = 'everyone';
    }
  }
  return audience;
  */
}

function isSkipped(sectionID) {
  let status = false;
  const responseCollection = adminCollectionObject('responses');
  const responseSection = responseCollection.findOne({ _id: Router.current().params._id });

  if (responseSection && responseSection.section) {
    for (let i = 0; i < responseSection.section.length; i++) {
      if (responseSection.section[i].sectionID === sectionID) {
        if (responseSection.section[i].skip) {
          status = true;
        }
      }
    }
  }

  return status;
}
function chkAudience(/* content */) {
  // const questionCollection = adminCollectionObject('questions');
  // const question = questionCollection.findOne({ _id: content });

  // return getAudience() === question.audience;
  // TODO : Fix Audience
  return true;
}
function checkSectionAudience(sid, status) {
  const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
  const questionCollection = adminCollectionObject('questions');
  let surveyElements = null;
  if (status === null) {
    surveyElements = surveyQuestionsMasterCollection.find(
      {
        surveyID: Router.current().params.survey_id,
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
      if (question[j].audience === getAudience()) {
        count ++;
      }
    }
  }
  // TODO : Fix Audience
  // return count > 0;
  return true;
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
    isMTV(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'mtv';
    },
    surveyQuesContents() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const surveyElements = surveyQuestionsMasterCollection.find(
        { surveyID: Router.current().params.survey_id },
        { sort: { order: 1 } }
      ).fetch();
      return surveyContents(surveyElements, null);
    },
    clientName() {
      const clientID = Router.current().params._id;

      let client = false;

      if (Router.current().params && Router.current().params.query
          && Router.current().params.query.isHMISClient && Router.current().params.query.link) {
        client = Session.get('currentHMISClient') || false;
      } else {
        const clientCollections = adminCollectionObject('clientInfo');
        client = clientCollections.findOne({ _id: clientID });
      }

      const fn = (client && client.firstName) ? client.firstName.trim() : '';
      const mn = (client && client.middleName) ? client.middleName.trim() : '';
      const ln = (client && client.lastName) ? client.lastName.trim() : '';
      const name = `${fn} ${mn} ${ln}`;
      return name;
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
    wysiwygEditor(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'wysiwyg';
    },
    displayEditor(contentQuesId) {
      setTimeout(() => {
        $(`#${contentQuesId}`).summernote();
      }, 0);
      return;
    },
    isDate(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'date';
    },
    initiatePicker(contentQuesId) {
      setTimeout(() => {
        $(`#${contentQuesId}`).datetimepicker({
          format: 'MM-DD-YYYY',
        });
      }, 0);
      return;
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
    singlePhoto(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'Single Photo';
    },
    getQuesName(getQuesName) {
      return getQName(getQuesName);
    },
    responseExists() {
      let flag = false;

      const responseCollection = adminCollectionObject('responses');
      const responseRecords = responseCollection.find(
        { surveyID: Router.current().params.survey_id }
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

function getText(id) {
  const responseCollection = adminCollectionObject('responses');
  const responseSection = responseCollection.findOne({ _id: Router.current().params._id });
  if (!responseSection || !responseSection.section) {
    return '';
  }
  sections = responseSection.section;
  for (let j = 0; j < sections.length; j++) {
    if (! sections[j].skip) {
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
  }
  return '';
}

Template.LogSurveyView.helpers(
  {
    isMTV(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'mtv';
    },
    checkAudience(content) {
      return chkAudience(content);
    },
    surveyQuesContents() {
      const responseCollection = adminCollectionObject('responses');
      const responseRecord = responseCollection.findOne({ _id: Router.current().params._id });

      let quesContents = [];

      if (responseRecord && responseRecord.surveyID) {
        const surveyid = responseRecord.surveyID;

        const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
        const surveyElements = surveyQuestionsMasterCollection.find(
          { surveyID: surveyid }, { sort: { order: 1 } }
        ).fetch();
        quesContents = surveyContents(surveyElements, surveyid);
      }
      return quesContents;
    },
    surveyTitle(surveyID) {
      const surveyCollection = adminCollectionObject('surveys');
      const survey = surveyCollection.findOne({ _id: surveyID });

      let title = '';
      if (survey && survey.title) {
        title = survey.title;
      }

      return title;
    },
    surveyCompleted() {
      const responseCollection = adminCollectionObject('responses');
      const responseRecord = responseCollection.findOne({ _id: Router.current().params._id });

      let flag = false;

      if (responseRecord && responseRecord.responsestatus) {
        const status = responseRecord.responsestatus;
        if (status === 'Completed') {
          $('.savePaused_survey').hide();
          $('.pausePaused_survey').hide();
          $('.cancelPaused_survey').hide();
          $('#pauseSurvey').hide();
          flag = true;
        }
      }
      return flag;
    },
    paused() {
      const responseCollection = adminCollectionObject('responses');
      const responseRecord = responseCollection.findOne({ _id: Router.current().params._id });

      let flag = false;

      if (responseRecord && responseRecord.responsestatus) {
        const status = responseRecord.responsestatus;
        if (status === 'Paused') {
          $('.savePaused_survey').show();
          $('.pausePaused_survey').show();
          $('.cancelPaused_survey').show();
          $('#pauseSurvey').show();
          flag = true;
        }
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
    wysiwygEditor(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'wysiwyg';
    },
    displayEditor(contentQuesId) {
      setTimeout(() => {
        $(`#${contentQuesId}`).summernote();
      }, 0);
      setTimeout(() => {
        $(`#${contentQuesId}`).summernote('code', getText(contentQuesId));
      }, 0);
      return;
    },
    isDate(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'date';
    },
    initiatePicker(contentQuesId) {
      setTimeout(() => {
        $(`#${contentQuesId}`).datetimepicker({
          format: 'MM-DD-YYYY',
        });
      }, 0);
      setTimeout(() => {
        $(`#${contentQuesId} input`).val(getText(contentQuesId));
      }, 0);
      return;
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
    singlePhoto(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'Single Photo';
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
      return getText(id);
    },
    isChecked(type) {
      const responseCollection = adminCollectionObject('responses');
      const responseSection = responseCollection.findOne({ _id: Router.current().params._id });

      if (!responseSection || !responseSection.section) {
        return '';
      }

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

      if (!responseSection || !responseSection.section) {
        return '';
      }

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

      if (!responseSection || !responseSection.section) {
        return '';
      }

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
