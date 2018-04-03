// import Responses from '/imports/api/responses/responses';
import Survey from '/imports/ui/components/surveyForm/Survey';
import { unescapeKeys } from '/imports/api/utils';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import './responsesEdit.html';

Template.responsesEdit.helpers({
  component() {
    return Survey;
  },
  definition() {
    const definition = JSON.parse(this.survey.definition);
    return {
      ...definition,
      title: definition.title || this.survey.title,
    };
  },
  surveyId() {
    return this.survey._id;
  },
  isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
  },
  initialValues() {
    return unescapeKeys(this.response.values);
  },
});
