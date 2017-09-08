import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Router.route('adminDashboardquestionsView', {
  path: '/questions',
  template: 'questionsListView',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('questions.all');
  },
  data() {
    return {
      title: 'Questions',
      subtitle: 'View',
    };
  },
});

/*
Router.route('adminDashboardquestionsNew', {
  path: '/questions/new',
  template: 'AdminDashboardNew',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  data() {
    return {};
  },
});

Router.route('adminDashboardquestionsEdit', {
  path: '/questions/edit',
  template: 'AdminDashboardEdit',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  data() {
    return {};
  },
});
*/
