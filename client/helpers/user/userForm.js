/**
 * Created by udit on 04/09/16.
 */

Template.userForm.helpers(
  {
    getProjectGroups() {
      return projectGroups.find({}).fetch();
    },
    getUserProfiles() {
      return userProfiles.find({}).fetch();
    },
  }
);
