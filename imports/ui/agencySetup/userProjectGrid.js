import Alert from '/imports/ui/alert';
import Projects from '/imports/api/projects/projects';
import Users from '/imports/api/users/users';
import { fullName } from '/imports/api/utils';
import './userProjectGrid.html';


Template.userProjectGrid.helpers({
  projects() {
    return Projects.find().fetch();
  },
  users() {
    return Users.find().map(user => ({
      name: fullName(user.services.HMIS),
      _id: user._id,
    })).sort((a, b) => {
      if (a.name === b.name) return 0;
      return (a.name < b.name) ? -1 : 1;
    });
  },

  hasAccess(userId, projectId) {
    const projectsLinked = Users.findOne(userId).projectsLinked || [];
    return projectsLinked.includes(projectId);
  },
});

Template.userProjectGrid.events({
  'click .access'(event) {
    const userId = $(event.target).attr('rel');
    const projectId = this._id;
    const checked = event.target.checked;

    Meteor.call('agency.setUserProjectAccess', userId, projectId, checked, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success(checked ? 'Access granted' : 'Access revoked');
      }
    });
  }
});
