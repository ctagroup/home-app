import QuestionEditForm from '/imports/ui/components/QuestionEditForm';
import './questionForm.html';

Template.questionForm.helpers({
  component() {
    return QuestionEditForm;
  },
  question() {
    return this.question || {};
  },
});
