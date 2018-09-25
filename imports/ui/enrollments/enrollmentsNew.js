import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Surveys from '/imports/api/surveys/surveys';
import Survey from '/imports/ui/components/surveyForm/Survey';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import './enrollmentsNew.html';

Template.enrollmentsNew.onCreated(function onEnrollmentsNew() {
  this.surveyLoaded = new ReactiveVar(false);
  this.subscribe('surveys.all', () => this.surveyLoaded.set(true));
});
Template.enrollmentsNew.helpers({
  client() {
    return this.client;
  },
  surveyLoaded() {
    return Template.instance().surveyLoaded.get();
  },
  isEnrollment() {
    return true;
  },
  component() {
    return Survey;
  },
  definition() {
    if (!Template.instance().surveyLoaded.get()) return {};
    const survey = Surveys.findOne(this.surveyId);
    const definition = JSON.parse(survey.definition);
    return {
      ...definition,
      title: definition.title || survey.title,
    };
  },
  surveyId() {
    return this.surveyId;
  },
  enrollmentInfo() {
    return this.enrollmentInfo;
  },
  isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
  },
});
