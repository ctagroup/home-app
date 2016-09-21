/**
 * Created by udit on 20/09/16.
 */

Template.AppSidebar.helpers(
  {
    showSidebarMenuItem(caps) {
      return Roles.userIsInRole(Meteor.user(), caps);
    },
  }
);
