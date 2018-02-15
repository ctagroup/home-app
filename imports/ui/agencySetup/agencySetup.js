import { fullName } from '/imports/api/utils';
import Projects from '/imports/api/projects/projects';
import './userProjectGrid.js';
import './agencySetup.html';

Template.agencySetup.helpers({
  usersList() {
    return this.users.map(user => ({
      name: fullName(user.services.HMIS),
      _id: user._id,
    })).sort((a, b) => {
      if (a.name === b.name) return 0;
      return (a.name < b.name) ? -1 : 1;
    });
  },
});

Template.agencySetup.events({
});

