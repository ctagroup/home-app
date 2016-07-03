/**
 * Created by udit on 02/07/16.
 */

Template.AdminSidebar.events(
  {
    'click .js-logout'() {
      if (Meteor.userId()) {
        AccountsTemplates.logout();
      }
    },
  }
);
