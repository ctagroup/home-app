import './agencySelect.html';
import Agencies from '/imports/api/agencies/agencies';
import Alert from '/imports/ui/alert';

const NO_AGENCY_SELECTED = '--- No agency selected ---';

function agencyOptions() {
  const allItems = Agencies.find().fetch()
  .reduce((all, agency) => {
    const consentGroups = agency.consentGroups || [];
    const items = consentGroups.map(groupId => ({
      agency,
      consentGroup: { _id: groupId },
    }));
    return [...all, ...items];
  }, []);

  const user = Meteor.user();
  const options = allItems.map(({ agency, consentGroup }) => ({
    value: JSON.stringify({ agencyId: agency._id, consentGroupId: consentGroup._id }),
    label: `${consentGroup._id}/{agency.agencyName}`,
    selected: user ? (user.activeConsentGroupId === consentGroup._id) : false,
  }));

  return [{
    value: null,
    label: NO_AGENCY_SELECTED,
  }, ...options];
}

Template.agencySelect.helpers({
  currentAgency() {
    const selected = agencyOptions().filter(p => p.selected);
    if (selected.length > 0) {
      return selected[0].label;
    }
    const user = Meteor.user() || {};
    return user.activeAgencyId || NO_AGENCY_SELECTED;
  },
  options() {
    return agencyOptions();
  },
});

Template.agencySelect.events({
  'click .agencyItem'() {
    let consentGroupId;
    let agencyId;
    try {
      const value = JSON.parse(this.value);
      consentGroupId = value.projectId;
      agencyId = value.agencyId;
    } catch (err) {
      consentGroupId = null;
      agencyId = null;
    }
    const agency = Agencies.findOne(agencyId) || {};
    Meteor.call('users.setActiveConsentGroupAgency', consentGroupId, agency._id, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        if (consentGroupId) {
          Alert.success(`Switched to ${consentGroupId}/${agency.agencyName}`);
        } else {
          Alert.warn('No agency selected');
        }
      }
    });
  },
});
