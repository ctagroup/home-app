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
    getHMISRoles() {
      return hmisRoles.find({}).fetch();
    },
    isProjectGroupSelected(projectGroupOptionId, currentProjectGroupId) {
      return (projectGroupOptionId === currentProjectGroupId) ? 'selected' : '';
    },
    isProfileSelected(profileOptionId, currentProfileId) {
      return (profileOptionId === currentProfileId) ? 'selected' : '';
    },
    isRoleSelected(roleOptionId, currentRoles) {
      if (currentRoles) {
        for (let i = 0; i < currentRoles.length; i++) {
          if (roleOptionId === currentRoles[i].id) {
            return 'selected';
          }
        }
      }
      return '';
    },
  }
);
