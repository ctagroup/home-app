import './projectSelect.html';
import Agencies from '/imports/api/agencies/agencies';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import Alert from '/imports/ui/alert';

const NO_PROJECT_SELECTED = '--- No project selected ---';

function projectOptions() {
  const allProjects = Agencies.find().fetch()
  .reduce((all, agency) => {
    const projectsIds = agency.projectsOfUser(Meteor.userId());
    const agencyProjects = projectsIds.map(projectId => ({
      agency,
      project: GlobalProjects.findOne(projectId) || { _id: projectId },
    }));
    return [...all, ...agencyProjects];
  }, []);

  const user = Meteor.user();
  const options = allProjects.map(({ agency, project }) => ({
    value: project._id,
    label: `${agency.agencyName}: ${project.projectName || project._id}`,
    selected: user ? user.activeProject === project._id : false,
  }));

  return [{
    value: null,
    label: NO_PROJECT_SELECTED,
  }, ...options];
}

Template.projectSelect.helpers({
  currentProject() {
    const selected = projectOptions().filter(p => p.selected);
    if (selected.length > 0) {
      return selected[0].label;
    }
    const user = Meteor.user() || {};
    return user.activeProject || NO_PROJECT_SELECTED;
  },
  options() {
    return projectOptions();
  },
});

Template.projectSelect.events({
  'click .projectItem'() {
    const projectId = this.value;
    const project = GlobalProjects.findOne(projectId);
    Meteor.call('users.setActiveProject', projectId, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        if (projectId) {
          Alert.success(`Switched to ${project.projectName}`);
        } else {
          Alert.warn('No project selected');
        }
      }
    });
  },
});
