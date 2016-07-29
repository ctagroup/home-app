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
  const responseSection = responses.findOne({ _id: Router.current().params._id });

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
  // const question = questions.findOne({ _id: content });

  // return getAudience() === question.audience;
  // TODO : Fix Audience
  return true;
}
function checkSectionAudience(sid, status) {
  let surveyElements = null;
  if (status === null) {
    surveyElements = surveyQuestionsMaster.find(
      {
        surveyID: Router.current().params.survey_id,
        sectionID: sid,
        contentType: 'question',
      }
    ).fetch();
  } else {
    surveyElements = surveyQuestionsMaster.find(
      {
        surveyID: status,
        sectionID: sid,
        contentType: 'question',
      }
    ).fetch();
  }

  let count = 0;
  for (let i = 0; i < surveyElements.length; i++) {
    const question = questions.find({ _id: surveyElements[i].content }).fetch();
    for (let j = 0; j < question.length; j++) {
      if (question[j].audience === getAudience()) {
        count ++;
      }
    }
  }
  // TODO : Fix Audience

  if (count > 0) {
    return true;
  }

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
  const question = questions.findOne({ _id: qID });
  return question.name;
}

let sections;

Template.LogSurvey.helpers(
  {
    getCreatedSurvey() {
      return surveys.find({ created: true }).fetch();
    },
    getSurveyedClient() {
      return clients.find().fetch();
    },
  }
);

Template.LogSurveyResponse.helpers(
  {
    isMTV(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'mtv';
    },
    surveyQuesContents() {
      const surveyElements = surveyQuestionsMaster.find(
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
        client = clients.findOne({ _id: clientID });
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
      const question = questions.findOne({ _id: contentQuesId });
      return question.question;
    },
    checkAudience(content) {
      return chkAudience(content);
    },
    wysiwygLabel(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'label';
    },
    textboxString(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Textbox(String)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    wysiwygEditor(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });
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
      const question = questions.findOne({ _id: contentQuesId });
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
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Textbox(Integer)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    booleanTF(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Boolean') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleSelect(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Single Select') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleOptions(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      return questionsList[0].options;
    },
    multipleSelect(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Multiple Select') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singlePhoto(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });

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

      const responseRecords = responses.find(
        { surveyID: Router.current().params.survey_id }
      ).fetch();
      for (let i = 0; i < responseRecords.length; i++) {
        const sectionz = responseRecords[i].section;
        for (let j = 0; j < sectionz.length; j++) {
          const responsesList = sectionz[j].response;
          for (let k = 0; k < responsesList.length; k++) {
            const answers = responsesList[k].answer;
            flag = answers != null;
            break;
          }
        }
      }
      return flag;
    },
    surveyContents() {
      const responseSections = responses.find(
        { surveyID: Router.current().params._id }
      ).fetch();
      for (let i = 0; i < responseSections.length; i++) {
        const sectionz = responseSections[i].section;
        for (let j = 0; j < sectionz.length; j++) {
          const responsesList = sectionz[j].response;
          for (let k = 0; k < responsesList.length; k++) {
            const answers = responsesList[k].answer;
            return answers;
          }
        }
      }
      return [];
    },
  }
);

function getText(id) {
  const responseSection = responses.findOne({ _id: Router.current().params._id });
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
          const questionsList = questions.find(
            { _id: quesIDs }, { dataType: 1, _id: 0 }
          ).fetch();
          for (let i = 0; i < questionsList.length; i++) {
            const dataType = questionsList[i].dataType;
            if (dataType === 'Single Select') {
              const options = questionsList[i].options;
              for (let l = 0; l < options.length; l++) {
                responseVal = options[l].description;
                return responseVal;
              }
            } else if (dataType === 'Multiple Select') {
              const options = questionsList[i].options;
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
function addOptions(question) {
  let optionsTag;
  const response = getText(question);
  if (response !== '') {
    const resp = response.split('|');
    for (let i = 0; i < resp.length; i++) {
      const deleteID = `${question}${i}`;
      optionsTag = `<tr  id='${deleteID}' class='questionRow'>`;
      optionsTag += `<td><textarea rows='1' cols='40' id='${question}.description' 
        class='description'>${resp[i]} </textarea></td>`;
      optionsTag += `<td><a id='delete.${deleteID}' class='btn btn-primary optionremove' >
      <span class='fa fa-remove'></span></a></td></tr>`;
      $(`#aoptions${question}`).append(optionsTag);
      $(`#aoptions${question}`).on(
        'click', 'a.optionremove', function remove() {
          const rowId = $(this).attr('id');
          const j = rowId.split('.');
          const i1 = `${j[1]}`;
          $(`#${i1}`).remove();
        }
      );
    }
  }
}
Template.LogSurveyView.helpers(
  {
    isMTV(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });
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
      const responseRecord = responses.findOne({ _id: Router.current().params._id });

      let quesContents = [];

      if (responseRecord && responseRecord.surveyID) {
        const surveyid = responseRecord.surveyID;

        const surveyElements = surveyQuestionsMaster.find(
          { surveyID: surveyid }, { sort: { order: 1 } }
        ).fetch();
        quesContents = surveyContents(surveyElements, surveyid);
      }
      return quesContents;
    },
    populateOptions(question) {
      setTimeout(() => {
        $(`#aoptions${question}`).empty();
        addOptions(question);
      }, 0);
    },
    surveyTitle(surveyID) {
      const survey = surveys.findOne({ _id: surveyID });

      let title = '';
      if (survey && survey.title) {
        title = survey.title;
      }

      return title;
    },
    surveyCompleted() {
      const responseRecord = responses.findOne({ _id: Router.current().params._id });

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
      const responseRecord = responses.findOne({ _id: Router.current().params._id });

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
      const question = questions.findOne({ _id: contentQuesId });

      return question.question;
    },
    wysiwygLabel(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'label';
    },
    textboxString(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Textbox(String)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    wysiwygEditor(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });
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
      const question = questions.findOne({ _id: contentQuesId });
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
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Textbox(Integer)') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    booleanTF(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Boolean') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleSelect(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const type = questionsList[i].dataType;
        if (type === 'Single Select') {
          flag = true;
          break;
        }
      }
      return flag;
    },
    singleOptions(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      return questionsList[0].options;
    },
    multipleSelect(contentQuesId) {
      const questionsList = questions.find(
        { _id: contentQuesId }, { dataType: 1, _id: 0 }
      ).fetch();

      let flag = false;

      for (let i = 0; i < questionsList.length; i++) {
        const multipleSelect = questionsList[i].dataType;
        if (multipleSelect === 'Multiple Select') {
          flag = true;
          break;
        }
      }

      return flag;
    },
    singlePhoto(contentQuesId) {
      const question = questions.findOne({ _id: contentQuesId });

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
      return getText(id).split('|').join('<br/>');
    },
    isChecked(type) {
      const responseSection = responses.findOne({ _id: Router.current().params._id });

      if (!responseSection || !responseSection.section) {
        return '';
      }

      sections = responseSection.section;
      for (let j = 0; j < sections.length; j++) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k++) {
          const quesIDs = response[k].questionID;
          const responseVal = response[k].answer;
          const questionsList = questions.find(
            {
              _id: quesIDs,
            }, {
              dataType: 1,
              _id: 0,
            }
          ).fetch();

          for (let i = 0; i < questionsList.length; i++) {
            const dataType = questionsList[i].dataType;

            if (dataType === 'Boolean') {
              return (responseVal === type) ? 'checked' : '';
            }
          }
        }
      }
      return '';
    },
    isSelected(value) {
      const responseSection = responses.findOne({ _id: Router.current().params._id });

      if (!responseSection || !responseSection.section) {
        return '';
      }

      sections = responseSection.section;

      for (let j = 0; j < sections.length; j++) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k++) {
          const quesIDs = response[k].questionID;
          const responseVal = response[k].answer;
          const questionsList = questions.find(
            {
              _id: quesIDs,
            }, {
              dataType: 1,
              _id: 0,
            }
          ).fetch();

          for (let i = 0; i < questionsList.length; i++) {
            const dataType = questionsList[i].dataType;
            if (dataType === 'Single Select') {
              return (responseVal === value) ? 'checked' : '';
            }
          }
        }
      }
      return '';
    },
    isSelectedMultiple(value) {
      const responseSection = responses.findOne({ _id: Router.current().params._id });

      if (!responseSection || !responseSection.section) {
        return '';
      }

      sections = responseSection.section;
      for (let j = 0; j < sections.length; j++) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k++) {
          const quesIDs = response[k].questionID;

          const responseVal = response[k].answer.split('|');

          const questionsList = questions.find(
            {
              _id: quesIDs,
            }, {
              dataType: 1,
              _id: 0,
            }
          ).fetch();

          for (let i = 0; i < questionsList.length; i++) {
            const dataType = questionsList[i].dataType;

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
