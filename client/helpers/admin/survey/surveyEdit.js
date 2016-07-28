Template.surveyEditTemplate.helpers(
  {
    questionList() {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
    existingSelectedQuestions() {
      const qIds = Session.get('selectedQuestions');
      return qIds != null;
    },
    getSection() {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
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
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: qId });

      let val = '';

      if (question && question.name) {
        val = `<strong>Name:</strong> ${question.name}`;
      }

      return val;
    },
    quesLabel(qId) {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
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
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      return surveyQuestionsMasterCollection.find(
          { surveyID: Router.current().params._id }
        ).count()
        > 0;
    },
    attributes() {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      return surveyQuestionsMasterCollection.find(
        { $and: [
          { surveyID: Router.current().params._id },
          { contentType: { $eq: 'section' } },
        ] }, {
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
        logger.log(`Section Item ${event.data.content}: #${event.oldIndex} to #${event.newIndex}`);
      },
      onEnd(event) {
        const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
          'surveyQuestionsMaster'
        );
        let start = event.oldIndex;
        let sectionId;
        let questionCount;
        let end = event.newIndex;
        if (start < end) {
          const temp = start;
          start = end;
          end = temp;
        }
        // if (start > end) {
        if (start !== end) {
          for (let i = end; i <= start; i++) {
            sectionId = surveyQuestionsMasterCollection.findOne({
              $and: [
                { surveyID: event.data.surveyID },
                { contentType: { $eq: 'section' } },
                { order: { $eq: i + 1 } },
              ],
            })._id;
            const questions = surveyQuestionsMasterCollection.find({ sectionID: sectionId },
              { sort: { order: 1 } }).fetch();
            // Changing the order of sub-questions according to the section Order.
            questionCount = ((i + 1) * 1000) + 1;
            for (let j = 0; j < questions.length; j++) {
              surveyQuestionsMasterCollection.update(
                { _id: questions[j]._id },
                { $set: { order: questionCount++ } }
              );
            }
          }
          // }
        }
      },
      sort: true,
      selector: { contentType: 'section' },
    },
  }
);
let oldID;
Template.sortableSectionItem.helpers(
  {
    sectionQuestions() {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      return surveyQuestionsMasterCollection.find(
        { sectionID: Template.parentData(0)._id },
        { sort: { order: 1 },
        } // section ID retrieved from parent Data elements.
      );
    },
    questionOptions: {
      group: {
        name: 'questionOrder',
        put: true,
      },
      onAdd(event) {
        const obj = $(event.item).parent().attr('id');
        const secID = $(event.item).parents(':eq(1)').attr('data-id');
        const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
          'surveyQuestionsMaster'
        );
        const secLen = surveyQuestionsMasterCollection.find({ sectionID: obj }).count();
        event.data.order = (secID * 1000) + secLen + 1;   // eslint-disable-line no-param-reassign
        event.data.sectionID = obj;  // eslint-disable-line no-param-reassign
        oldID = event.data._id;
        delete event.data._id;  // eslint-disable-line no-param-reassign
        logger.log(`Item ${event.data._id} went from #${event.oldIndex} to #${event.newIndex}.`);
      },
      onRemove(event) {
        logger.log(`${event.data._id} and ${event.data.order}`);
        event.data._id = oldID;   // eslint-disable-line no-param-reassign
        // Will have to provide back the Old ID. Otherwise it will remove the newest entry.
      },
      onSort(event) {
        logger.log(`Item ${event.data._id} went from #${event.oldIndex} to #${event.newIndex}.`);
      },
      selector: { $or: [{ contentType: 'question' }, { contentType: 'label' }] },
      sort: true,
    },
  }
);
