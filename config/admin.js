/**
 * Created by udit on 22/06/16.
 */

Meteor.startup(
  () => {
    if (Meteor.isClient) {
      Meteor.subscribe(
        'users', () => {
          AdminDashboard.addSidebarItem(
            'Role Manager',
            AdminDashboard.path('/roles'),
            { icon: 'user-secret' }
          );
          if (Roles.userIsInRole(Meteor.user(), 'manage_settings')) {
            AdminDashboard.addSidebarItem(
              'Settings',
              AdminDashboard.path('/settings'),
              { icon: 'cogs' }
            );
          }
        }
      );

      Meteor.subscribe('roles');
      Meteor.subscribe('homeRoles');
      Meteor.subscribe('rolePermissions');
      Meteor.subscribe('options');
      Meteor.subscribe('surveys');
      Meteor.subscribe('questions');
      Meteor.subscribe('surveyQuestionsMaster');
      Meteor.subscribe('clientInfo');
      Meteor.subscribe('responses');
    }
  }
);
