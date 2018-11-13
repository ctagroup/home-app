import EnrollmentAsSurvey from '/imports/ui/components/surveyForm/EnrollmentAsSurvey';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';

import './viewEnrollmentAsResponse.html';

Template.viewEnrollmentAsResponse.onRendered(function () {
  this.enrollment = new ReactiveVar();
  //Meteor.call('')
  //console.log(this, Template.instance)
});


Template.viewEnrollmentAsResponse.helpers({
  component() {
    return EnrollmentAsSurvey;
  },
  definition() {
    const definition = JSON.parse(this.survey.definition);
    const title = definition.title || this.survey.title;
    return {
      ...definition,
      title: `[Enrollment] ${title}`,
    };
  },
  surveyId() {
    console.log(this.client);
    return this.survey._id;
  },
  isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
  },
  initialValues() {
    return {
      'enrollment-1': 1,
      'enrollment-2': 99,
    };
  },
});
