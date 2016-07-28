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
            Router.path('roleManager'),
            { icon: 'user-secret' }
          );
          AdminDashboard.addSidebarItem(
            'Opening Script',
            Router.path('openingScript'),
            { icon: 'comment' }
          );
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
