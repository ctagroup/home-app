import './projectSelect.html';
import Agencies from '/imports/api/agencies/agencies';
import Projects from '/imports/api/projects/projects';
import Alert from '/imports/ui/alert';

const NO_GROUP_SELECTED = '--- No group selected ---';

function projectOptions() {
  /*
  const allProjects = Agencies.find().fetch()
  .reduce((all, agency) => {
    const projectsIds = agency.projectsOfUser(Meteor.userId());
    const agencyProjects = projectsIds.map(projectId => ({
      agency,
      project: Projects.findOne(projectId) || { _id: projectId },
    }));
    return [...all, ...agencyProjects];
  }, []);

  const user = Meteor.user();
  const options = allProjects.map(({ agency, project }) => ({
    value: JSON.stringify({ agencyId: agency._id, projectId: project._id }),
    label: `${agency.agencyName}/${project.projectName || project._id}`,
    selected: user ? user.activeProjectId === project._id : false,
  }));
  */
  const user = Meteor.user();
  const agencies = Agencies.find({ members: Meteor.userId() }).fetch();

  const uniqueGroups = agencies.reduce((unique, agency) => {
    const consentGroups = agency.consentGroups || [];
    consentGroups.forEach(group => unique.add(group));
    return unique;
  }, new Set());

  const options = Array.from(uniqueGroups).map(x => ({
    value: x,
    label: x,
    selected: user ? user.activeConsentGroupId === x : false,
  }));

  const allOptions = [{
    value: null,
    label: NO_GROUP_SELECTED,
  }, ...options];
  return allOptions;
}

Template.projectSelect.helpers({
  currentProject() {
    const selected = projectOptions().filter(p => p.selected);
    if (selected.length > 0) {
      return selected[0].label;
    }
    const user = Meteor.user() || {};
    return user.activeConsentGroupId || NO_GROUP_SELECTED;
  },
  options() {
    return projectOptions();
  },
});

Template.projectSelect.events({
  'click .projectItem'() {
    let agencyId;
    let projectId;
    try {
      const value = JSON.parse(this.value);
      agencyId = value.agencyId;
      projectId = value.projectId;
    } catch (err) {
      agencyId = null;
      projectId = null;
    }
    const project = Projects.findOne(projectId) || {};
    const agency = Agencies.findOne(agencyId) || {};
    Meteor.call('users.setActiveAgencyAndProject', agency._id, projectId, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        if (projectId) {
          Alert.success(`Switched to ${agency.agencyName}/${project.projectName}`);
        } else {
          Alert.warn('No agency/project selected');
        }
      }
    });
  },
});
