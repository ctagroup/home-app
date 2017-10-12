import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Surveys from '/imports/api/surveys/surveys';
import '/imports/ui/surveys/surveysListView';
import '/imports/ui/surveys/surveyEdit';


Router.route('adminDashboardsurveysView', {
  path: '/surveys',
  template: Template.surveysListView,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('surveys.all');
  },
  data() {
    return {
      title: 'Surveys',
      subtitle: 'List',
    };
  },
});


Router.route('adminDashboardsurveysNew', {
  path: '/surveys/new',
  template: 'AdminDashboardNew',
  controller: AppController,
  waitOn() {
    /*
      Meteor.subscribe('collectionDoc', collectionName, HomeUtils.parseID(this.params._id));
      if (collection.templates && collection.templates.edit && collection.templates.edit.waitOn) {
        collection.templates.edit.waitOn();
      }
    */
    return [];
  },
});

Router.route('surveysEdit', {
  path: '/surveys/:_id/edit',
  template: Template.surveyEdit,
  controller: AppController,
  waitOn() {
    const id = Router.current().params._id;
    return Meteor.subscribe('surveys.one', id);
  },
  data() {
    const id = Router.current().params._id;
    const survey = Surveys.findOne(id) || {};
    return {
      title: 'Surveys',
      subtitle: survey ? `Edit ${survey.title}` : '',
      survey,
    };
  },
});

Router.route('surveysPreview', {
  path: '/surveys/:_id/preview',
  template: Template.surveyPreview,
  controller: AppController,
});
