/**
 * Created by udit on 20/09/16.
 */

Template.defaultWidgets.helpers(
  {
    showCollectionWidget(caps) {
      return Roles.userIsInRole(Meteor.user(), caps);
    },
  }
);
