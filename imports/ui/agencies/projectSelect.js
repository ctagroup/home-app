import './projectSelect.html';
import Agencies from '/imports/api/agencies/agencies';
import Alert from '/imports/ui/alert';

const NO_GROUP_SELECTED = '--- No group selected ---';

function projectOptions() {
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

  console.log(options, user.activeConsentGroupId);

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
    const consentGroup = this.value;
    Meteor.call('users.setActiveConsentGroup', consentGroup, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        if (consentGroup) {
          Alert.success(`Switched to consent group: ${consentGroup}`);
        } else {
          Alert.warning('No consent group selected');
        }
      }
    });
  },
});
