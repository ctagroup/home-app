/**
 * Created by udit on 27/07/16.
 */

Template.AdminHeader.events({
  'click .btn-sign-out'() {
    Meteor.logout(() => {
      Router.go('/');
    });
  },
});
