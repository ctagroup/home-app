import Projects from '/imports/api/projects/projects';
import './userProjectGrid.js';
import './agencySetup.html';

Template.agencySetup.helpers({
  projects() {
    return Projects.find().fetch();
  },
});

Template.agencySetup.events({
});

