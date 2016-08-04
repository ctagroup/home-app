/**
 * Created by Anush-PC on 5/13/2016.
 */

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

function getQName(qID) {
  const question = questions.findOne({ _id: qID });
  return question.name;
}

let sections;

function addOptions(question) {
  let optionsTag;
  const response = ResponseHelpers.getText(question);
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
      return ResponseHelpers.checkAudience(content);
    },
    surveyQuesContents() {
      const responseRecord = responses.findOne({ _id: Router.current().params._id });

      let quesContents = [];

      if (responseRecord && responseRecord.surveyID) {
        const surveyid = responseRecord.surveyID;

        const surveyElements = surveyQuestionsMaster.find(
          { surveyID: surveyid }, { sort: { order: 1 } }
        ).fetch();
        quesContents = ResponseHelpers.surveyContents(surveyElements, surveyid);
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
        $(`#${contentQuesId}`).summernote('code', ResponseHelpers.getText(contentQuesId));
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
      return ResponseHelpers.getText(id).split('|').join('<br/>');
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
