/**
 * Created by udit on 01/07/16.
 */

Template.AdminSidebar.helpers(
  {
    isMyProfilePath() {
      return Router.current().route.getName() === 'adminDashboardusersEdit'
             && Router.current().params._id === Meteor.userId() ? 'active' : '';
    },
  }
);
