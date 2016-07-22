Template.surveyEditTemplate.helpers(
  {
    questionList() {
      const questionCollection = adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
    existingSelectedQuestions() {
      const qIds = Session.get('selectedQuestions');
      return qIds != null;
    },
    getSection() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const distinctEntries = _.uniq(
        surveyQuestionsMasterCollection.find(
          {
            contentType: 'section',
            surveyID: Router.current().params._id,
          },
          {
            sort: { content: 1 },
            fields: { content: true },
          }
        ).fetch().reverse()
      );
      return distinctEntries;
    },
  }
);

Template.sortableItemTarget.helpers(
  {
    notQuestion(type) {
      return !(String(type) === String('question'));
    },
    quesName(qId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: qId });

      let val = '';

      if (question && question.name) {
        val = `<strong>Name:</strong> ${question.name}`;
      }

      return val;
    },
    quesLabel(qId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: qId });

      let val = '';

      if (question && question.question) {
        const div = document.createElement('div');
        div.innerHTML = question.question;
        let text = div.textContent || div.innerText || question.question;

        if (text.length > 40) {
          text = text.substr(0, 40);
          text += ' ... ';
        }

        val = `<strong>Label:</strong> ${text}`;
      }

      return val;
    },
  }
);

Template.typeDefinition.helpers(
  {
    showPreview() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      if (
        surveyQuestionsMasterCollection.find(
          { surveyID: Router.current().params._id }
        ).count()
        > 0
      ) {
        return true;
      }
      return false;
    },
    attributes() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      return surveyQuestionsMasterCollection.find(
        { surveyID: Router.current().params._id }, {
          sort: { order: 1 },
        }
      );
    },
    attributesOptions: {
      group: {
        name: 'typeDefinition',
        put: true,
      },
      // event handler for reordering attributes
      onSort(event) {
        logger.log(`Item ${event.data.name} went from #${event.oldIndex} to #${event.newIndex}`);
      },
    },
  }
);
