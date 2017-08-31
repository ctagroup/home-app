import Users from '/imports/api/users/users';
import { AppController } from './controllers';
import '/imports/ui/users/usersListView.js';
import '/imports/ui/users/usersCreateView.js';
import '/imports/ui/users/usersEditView.js';

Router.route('adminDashboardusersView', {
  path: '/users',
  template: Template.usersListView,
  controller: AppController,
  waitOn() {
    return Meteor.subscribe('users.all');
  },
  data() {
    return {
      title: 'Users',
      subtitle: 'List',
    };
  },
});

Router.route('adminDashboardusersNew', {
  path: '/users/new',
  template: Template.usersCreateView,
  controller: AppController,
  data() {
    return {
      title: 'Users',
      subtitle: 'New',
    };
  },
});

Router.route('adminDashboardusersEdit', {
  path: '/users/:_id/edit',
  template: Template.usersEditView,
  controller: AppController,
  waitOn() {
    return Meteor.subscribe('users.one', this.params._id);
  },
  data() {
    const userId = Meteor.userId();
    const user = Users.findOne(this.params._id);
    return {
      title: 'Users',
      subtitle: 'Edit',
      user,
      canUpdateProfile: Roles.userIsInRole(userId, ['Developer', 'System Admin']),
    };
  },
});
