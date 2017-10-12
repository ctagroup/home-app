import { Template } from 'meteor/templating';
import Survey from '/imports/ui/components/surveyForm/Survey';
import './responsesNew.html';


Template.responsesNew.helpers({
  component() {
    return Survey;
  },
  definition() {
    return JSON.parse(this.survey.definition);
  },
});
