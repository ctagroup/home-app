/**
 * Created by udit on 02/08/16.
 */

Template.createResponse.helpers(
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
      return ResponseHelpers.surveyContents(surveyElements, null);
    },
    clientName() {
      const clientID = Router.current().params.query.client_id;

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
