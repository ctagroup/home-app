/**
 * Created by udit on 22/06/16.
 */

Meteor.startup(
  () => {
    if (Meteor.isClient) {
      Meteor.subscribe('users');
      Meteor.subscribe('roles');
      Meteor.subscribe('homeRoles');
      Meteor.subscribe('rolePermissions');
      Meteor.subscribe('options');
      Meteor.subscribe('surveys');
      Meteor.subscribe('questions');
      Meteor.subscribe('surveyQuestionsMaster');
    }
  }
);
