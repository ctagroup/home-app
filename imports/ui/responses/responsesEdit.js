// import Responses from '/imports/api/responses/responses';
import Survey from '/imports/ui/components/surveyForm/Survey';
import { unescapeKeys } from '/imports/api/utils';
import './responsesEdit.html';

Template.responsesEdit.helpers({
  component() {
    return Survey;
  },
  definition() {
    return JSON.parse(this.survey.definition);
  },
  surveyId() {
    return this.survey._id;
  },
  isDebugEnabled() {
    return true;
  },
  initialValues() {
    return unescapeKeys(this.response.values);
  },
});
