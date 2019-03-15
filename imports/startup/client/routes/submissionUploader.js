import FeatureDecisions from '/imports/both/featureDecisions';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
// import { ContentController } from './controllers';
import '/imports/ui/submissionUploader/submissionUploaderList';
import '/imports/ui/submissionUploader/submissionUploaderNew';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
if (featureDecisions.isSubmissionUploader()) {
  Router.route('submissionUploaderList', {
    path: '/submissionUploader/list',
    template: Template.submissionUploaderList,
    // controller: ContentController,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('submissionUploader.all'),
        Meteor.subscribe('submissionUploader.jobs'),
      ];
    },
    data() {
      return {
        title: 'Submission Uploader',
        subtitle: 'List',
      };
    },
  });

  Router.route('submissionUploaderNew', {
    path: '/submissionUploader/new',
    template: Template.submissionUploaderNew,
    // controller: ContentController,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('surveyConfigs.all'),
        Meteor.subscribe('surveys.all', true),
      ];
    },
    data() {
      return {
        title: 'Submission Uploader',
        subtitle: 'New',
      };
    },
  });
}
