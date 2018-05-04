import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import Surveys from '/imports/api/surveys/surveys';
import Questions from '/imports/api/questions/questions';
import '/imports/ui/surveys/surveysListView';
import '/imports/ui/surveys/surveyForm';
import '/imports/ui/surveys/surveyFormBuilder';
import '/imports/ui/responses/responsesNew';

import FeatureDecisions from '/imports/both/featureDecisions';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
let checkPermissions;
if (featureDecisions.roleManagerEnabled()) {
  checkPermissions = (userId) => ableToAccess(userId, 'accessSurveys');
} else {
  checkPermissions = (userId) => Roles.userIsInRole(userId, DefaultAdminAccessRoles);
}


Router.route('adminDashboardsurveysView', {
  path: '/surveys',
  template: Template.surveysListView,
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    return [
      Meteor.subscribe('surveys.all'),
    ];
  },
  data() {
    return {
      title: 'Surveys',
      subtitle: 'List',
    };
  },
});


Router.route('surveysNew', {
  path: '/surveys/new',
  template: Template.surveyForm,
  controller: AppController,
  waitOn() {
    return [
      Meteor.subscribe('questions.all'),
    ];
  },
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  data() {
    const definition = {
      variables: {},
      items: [],
    };
    return {
      title: 'Surveys',
      subtitle: 'New',
      survey: {
        definition: JSON.stringify(definition),
      },
      questions: Questions.find().fetch(),
    };
  },
});

Router.route('surveysEdit', {
  path: '/surveys/:_id/edit',
  template: Template.surveyForm,
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    const id = Router.current().params._id;
    return [
      Meteor.subscribe('rolePermissions.all'),
      Meteor.subscribe('surveys.one', id),
      Meteor.subscribe('questions.all'),
    ];
  },
  data() {
    const id = Router.current().params._id;
    const survey = Surveys.findOne(id) || {};
    return {
      title: 'Surveys',
      subtitle: survey ? `Edit ${survey.title}` : '',
      survey,
      questions: Questions.find().fetch(),
    };
  },
});

Router.route('surveysEditDefinition', {
  path: '/surveys/:_id/builder',
  template: Template.surveyFormBuilder,
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    const id = Router.current().params._id;
    return [
      Meteor.subscribe('surveys.one', id),
      Meteor.subscribe('questions.all'),
    ];
  },
  data() {
    const id = Router.current().params._id;
    const survey = Surveys.findOne(id) || {};
    return {
      title: 'Surveys',
      subtitle: survey ? `Edit ${survey.title}` : '',
      survey,
      questions: Questions.find().fetch(),
    };
  },
});

Router.route('surveysPreview', {
  path: '/surveys/:_id/preview',
  template: Template.responsesNew,
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    const id = Router.current().params._id;
    return [
      Meteor.subscribe('surveys.one', id),
    ];
  },
  data() {
    const id = Router.current().params._id;
    const survey = Surveys.findOne(id) || {};
    return {
      title: 'Surveys',
      subtitle: survey ? `Preview ${survey.title}` : '',
      survey,
    };
  },
});
