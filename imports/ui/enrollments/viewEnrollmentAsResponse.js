import EnrollmentAsSurvey from '/imports/ui/components/surveyForm/EnrollmentAsSurvey';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { mapEnrollmentToSurveyInitialValues } from '/imports/api/enrollments/helpers';

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
    return this.survey._id;
  },
  isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
  },
  initialValues() {
    const definition = JSON.parse(this.survey.definition);
    console.log(this.enrollment);
    return mapEnrollmentToSurveyInitialValues(this.enrollment, definition);
  },
});
