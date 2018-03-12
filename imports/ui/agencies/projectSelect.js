import './projectSelect.html';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import Projects from '/imports/api/projects/projects';
import Alert from '/imports/ui/alert';

const NO_PROJECT_SELECTED = '--- No project selected ---';

function projectOptions() {
  const allProjects = GlobalProjects.find().fetch()
  .reduce((all, agency) => {
    const projectsIds = agency.projectsWithUser(Meteor.userId());
    const agencyProjects = projectsIds.map(projectId => ({
      agency,
      project: Projects.findOne(projectId) || { _id: projectId },
    }));
    return [...all, ...agencyProjects];
  }, []);

  const options = allProjects.map(({ agency, project }) => ({
    value: project._id,
    label: `${agency.agencyName}/${project.projectName || project._id}`,
    selected: Meteor.user().activeProjectId === project._id,
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
    return Meteor.user().activeProjectId || NO_PROJECT_SELECTED;
  },
  options() {
    return projectOptions();
  },
});

Template.projectSelect.events({
  'change #project-select'(event) {
    const projectId = event.target.value;
    const project = Projects.findOne(projectId) || {};
    Meteor.call('users.projects.setActive', projectId, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        if (projectId) {
          Alert.success(`Switched to ${project.projectName}`);
        } else {
          Alert.warning('No project selected');
        }
      }
    });
  },
  'click .projectItem'() {
    const projectId = this.value;
    const project = Projects.findOne(projectId) || {};
    Meteor.call('users.projects.setActive', projectId, (err) => {
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
  }
});
