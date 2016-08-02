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

Template.typeDefinition.rendered = function () {
  this.$('.sortable').nestedSortable({
    listType: 'div.question-list',
    toleranceElement: '> .row',
    items: '.sortable-item',
    handle: '.sortable-handle',
    maxLevels: 2,
    protectRoot: true,
    doNotClear: true,
    opacity: 0.2,
    update(event, ui) {
      // Details of element after it has been dropped.
      const movedElement = ui.item.get(0);
      const movedElementDetails = Blaze.getData(movedElement);
      const newIndex = ui.item.index() + 1;
      const oldIndex = movedElementDetails.order;
      let incField;
      // Checking if section is being moved or question and setting selector accordingly.
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      const selector = {};
      if (movedElementDetails.contentType === 'section') {
        selector['contentType'] = 'section';      // eslint-disable-line
        if (newIndex < oldIndex) {
          incField = 1;
          selector['order'] = { $gte: newIndex, $lt: oldIndex };      // eslint-disable-line
        } else {
          incField = -1;
          selector['order'] = { $gt: oldIndex, $lte: newIndex };    // eslint-disable-line
        }
        Meteor.call(
          'updateOrder', selector, incField, (error, result) => {
            if (error) {
              logger.log(error);
            } else {
              logger.log(result);
            }
          }
        );
      } else {
        selector['contentType'] = 'question';     // eslint-disable-line
        // Getting new sectionID.
        const parentElement = ui.item.parent().get(0);
        const parentElementDetails = Blaze.getData(parentElement);
        if (parentElementDetails._id !== movedElementDetails.sectionID) {
          // Get last question in this section to get last order.
          let newOrder;
          const lastQuestion = surveyQuestionsMasterCollection.findOne(
            { $and: [
              { surveyID: parentElementDetails.surveyID },
              { sectionID: parentElementDetails._id },
            ] },
            { sort: { order: -1 } }
          );
          if (lastQuestion) {
            newOrder = lastQuestion.order + 1;
          } else {
            newOrder = 1;
          }
          // Element has been moved to a new section. Change it's section and order to end.
          Meteor.call(
            'updateQuestionSection', movedElementDetails._id,
            parentElementDetails._id, newOrder, (error, result) => {
              if (error) {
                logger.log(error);
              } else {
                logger.log(result);
              }
            }
          );
          // Decrement all subsequent entries by 1 in oldSection. From oldIndex.
          incField = -1;
          selector['sectionID'] = { $eq: movedElementDetails.sectionID };   // eslint-disable-line
          selector['order'] = { $gte: oldIndex };   // eslint-disable-line
          Meteor.call(
            'updateOrder', selector, incField, (error, result) => {
              if (error) {
                logger.log(error);
              } else {
                logger.log(result);
              }
            }
          );
          // Increment all subsequent entries by 1 in newSection. From newIndex.
          incField = 1;
          selector['sectionID'] = { $eq: parentElementDetails._id };    // eslint-disable-line
          selector['order'] = { $gte: newIndex };     // eslint-disable-line
          Meteor.call(
            'updateOrder', selector, incField, (error, result) => {
              if (error) {
                logger.log(error);
              } else {
                logger.log(result);
              }
            }
          );
        } else {
          selector['sectionID'] = movedElementDetails.sectionID;      // eslint-disable-line
          if (newIndex < oldIndex) {
            // Element moved up in the list. The dropped element has a next sibling for sure.
            // Make the current element order to newIndex + 1.
            incField = 1;
            selector['order'] = { $gte: newIndex, $lt: oldIndex };      // eslint-disable-line
          } else {
            // Element moved down in the list. The dropped element has a previous sibling for sure.
            // Update index.
            incField = -1;
            selector['order'] = { $gt: oldIndex, $lte: newIndex };    // eslint-disable-line
          }
          Meteor.call(
            'updateOrder', selector, incField, (error, result) => {
              if (error) {
                logger.log(error);
              } else {
                logger.log(result);
              }
            }
          );
        }
      }
      // Changing order.
      surveyQuestionsMasterCollection.update(
        { _id: movedElementDetails._id },
        { $set: { order: newIndex } }
      );
      logger.log(`Q$ #${oldIndex} #${newIndex}`);
    },
  });
};

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
  }
);

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
  }
);
