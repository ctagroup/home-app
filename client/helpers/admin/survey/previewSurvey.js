Template.previewSurvey.helpers(
  {
    editSurveyPath(id) {
      return Router.path('adminDashboardsurveysEdit', { _id: id });
    },
    surveyQuesContents() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      logger.log(Router.current().params._id);
      logger.log(
        surveyQuestionsMasterCollection.find(
          { surveyID: Router.current().params._id },
          { sort: { order: 1 } }
        ).fetch()
      );
      const questions = surveyQuestionsMasterCollection.find(
        { surveyID: Router.current().params._id },
        { sort: { order: 1 } }
      ).fetch();

      return questions || [];
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
    booleanYN(data) {
      return data === 'Boolean';
    },
    displayQues(contentType) {
      return contentType === 'question';
    },
    displayQuesContents(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let label = '';

      if (question && question.question) {
        label = question.question;
      }

      return label;
    },
    textboxString(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'Textbox(String)';
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
    isMTV(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });
      let dataType = '';
      if (question && question.dataType) {
        dataType = question.dataType;
      }
      return dataType === 'mtv';
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
      const question = questionCollection.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'Textbox(Integer)';
    },
    booleanTF(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'Boolean';
    },
    singleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'Single Select';
    },
    singleOptions(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let options = [];

      if (question && question.options) {
        options = question.options;
      }

      return options;
    },
    multipleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      let dataType = '';

      if (question && question.dataType) {
        dataType = question.dataType;
      }

      return dataType === 'Multiple Select';
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
  }
);
