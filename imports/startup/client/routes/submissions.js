import { AppController } from './controllers';
import '/imports/ui/submissions/submissionsListView';
import {
  ResponsesAccessRoles,
} from '/imports/config/permissions';

Router.route('submissions', {
  path: '/submissions',
  template: Template.submissionsListView,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ResponsesAccessRoles);
    },
    data() {
      return {
        title: 'Submissions',
        subtitle: 'all submissions',
      };
    },
  },
});

Router.route('editSubmission', {
  path: '/submissions/edit/:clientId/:surveyId/:submissionId',
  template: Template.submissionsListView,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ResponsesAccessRoles);
    },
    data() {
      return {
        title: 'Submissions',
        subtitle: 'view',
      };
    },
  },
});
