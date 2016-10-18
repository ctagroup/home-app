/**
 * Created by udit on 02/08/16.
 */

Template.responseForm.helpers(
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
      const surveyID = (Router.current().route.getName() === 'previewSurvey')
        ? Router.current().params._id
        : Template.instance().data.survey._id;
      const sections = surveyFormatHelpers.getSections(surveyID);
      const surveyElements = [];
      for (let i = 0; i < sections.length; i += 1) {
        surveyElements.push(sections[i]);
        Array.prototype.push.apply(surveyElements,
          surveyFormatHelpers.getQuestionsPerSection(sections[i]._id)
        );
      }
      return ResponseHelpers.surveyContents(surveyElements, null);
    },
    clientName() {
      if (Router.current().route.getName() === 'previewSurvey') {
        return 'Dummy Client';
      }

      const client = Template.instance().data.client;

      const fn = (client && client.firstName) ? client.firstName.trim() : '';
      const mn = (client && client.middleName) ? client.middleName.trim() : '';
      const ln = (client && client.lastName) ? client.lastName.trim() : '';
      const name = `${fn} ${mn} ${ln}`;
      return name;
    },
    surveyCompleted() {
      return ResponseHelpers.isSurveyCompleted(Router.current().params._id);
    },
    sectionSkipped(sectionID) {
      return ResponseHelpers.isSkipped(sectionID);
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
      return ResponseHelpers.checkAudience(content);
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

      for (let i = 0; i < questionsList.length; i += 1) {
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

      for (let i = 0; i < questionsList.length; i += 1) {
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

      for (let i = 0; i < questionsList.length; i += 1) {
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

      for (let i = 0; i < questionsList.length; i += 1) {
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

      for (let i = 0; i < questionsList.length; i += 1) {
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
    checkSkipped(sectionID) {
      let skipVal = '';
      if (ResponseHelpers.isSkipped(sectionID)) {
        skipVal = 'checked';
      }
      return skipVal;
    },
    surveyTextResponse(id) {
      return ResponseHelpers.getText(id);
    },
    responseExists() {
      let flag = false;

      const responseRecords = responses.find(
        { surveyID: Router.current().params.survey_id }
      ).fetch();
      for (let i = 0; i < responseRecords.length; i += 1) {
        const sectionz = responseRecords[i].section;
        for (let j = 0; j < sectionz.length; j += 1) {
          const responsesList = sectionz[j].response;
          for (let k = 0; k < responsesList.length; k += 1) {
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
      for (let i = 0; i < responseSections.length; i += 1) {
        const sectionz = responseSections[i].section;
        for (let j = 0; j < sectionz.length; j += 1) {
          const responsesList = sectionz[j].response;
          for (let k = 0; k < responsesList.length; k += 1) {
            const answers = responsesList[k].answer;
            return answers;
          }
        }
      }
      return [];
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
    isChecked(type) {
      if (Router.current().route.getName() === 'adminDashboardresponsesEdit') {
        const responseSection = responses.findOne({ _id: Router.current().params._id });

        if (!responseSection || !responseSection.section) {
          return '';
        }

        const sections = responseSection.section;
        for (let j = 0; j < sections.length; j += 1) {
          const response = sections[j].response;
          for (let k = 0; k < response.length; k += 1) {
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

            for (let i = 0; i < questionsList.length; i += 1) {
              const dataType = questionsList[i].dataType;

              if (dataType === 'Boolean') {
                return (responseVal === type) ? 'checked' : '';
              }
            }
          }
        }
      }

      return '';
    },
    isSelected(value) {
      if (Router.current().route.getName() === 'adminDashboardresponsesEdit') {
        const responseSection = responses.findOne({ _id: Router.current().params._id });

        if (!responseSection || !responseSection.section) {
          return '';
        }

        const sections = responseSection.section;

        for (let j = 0; j < sections.length; j += 1) {
          const response = sections[j].response;
          for (let k = 0; k < response.length; k += 1) {
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

            for (let i = 0; i < questionsList.length; i += 1) {
              const dataType = questionsList[i].dataType;
              if (dataType === 'Single Select') {
                return (responseVal === value) ? 'checked' : '';
              }
            }
          }
        }
      }
      return '';
    },
    isSelectedMultiple(value) {
      if (Router.current().route.getName() === 'adminDashboardresponsesEdit') {
        const responseSection = responses.findOne({ _id: Router.current().params._id });

        if (!responseSection || !responseSection.section) {
          return '';
        }

        const sections = responseSection.section;
        for (let j = 0; j < sections.length; j += 1) {
          const response = sections[j].response;
          for (let k = 0; k < response.length; k += 1) {
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

            for (let i = 0; i < questionsList.length; i += 1) {
              const dataType = questionsList[i].dataType;

              if (dataType === 'Multiple Select') {
                for (let l = 0; l < responseVal.length; l += 1) {
                  if (value === responseVal[i]) {
                    return 'checked';
                  }
                }
                return '';
              }
            }
          }
        }
      }
      return '';
    },
    populateOptions(question) {
      setTimeout(() => {
        $(`#aoptions${question}`).empty();
        ResponseHelpers.addOptions(question);
      }, 0);
    },
  }
);
