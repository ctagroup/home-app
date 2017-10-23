import Questions from '/imports/api/questions/questions';
// import HomeConfig from '/imports/config/homeConfig';
// import { logger } from '/imports/utils/logger';
// import { populateOptions, resetQuestionModal, setFields } from '/imports/ui/questions/helpers';
import './questionForm.html';

Template.questionForm.helpers({
  doc() {
    return this.question || {};
  },

  schema() {
    return Questions.schema;
  },

  currentCategory() {
    const category = AutoForm.getFieldValue('category');
    return category;
  },

  currentQuestionCategory() {
    const questionCategory = AutoForm.getFieldValue('questionCategory');
    return { questionCategory };
  },
});


AutoForm.hooks({
  questionForm: {
    onSubmit: function onSubmit(insertDoc, updateDoc, currentDoc) {
      console.log(currentDoc);
      if (currentDoc._id) {
        Meteor.call('questions.update', currentDoc._id, updateDoc, (err) => {
          if (err) {
            Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Question updated', 'success', 'growl-top-right');
          }
          this.done(err);
        });
      } else {
        Meteor.call('questions.create', insertDoc, (err, res) => {
          if (err) {
            Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Question created', 'success', 'growl-top-right');
            Router.go('questionsEdit', { _id: res });
          }
          this.done(err);
        });
      }
      return false;
    },
  },
});
