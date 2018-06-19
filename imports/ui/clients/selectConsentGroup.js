import { ReactiveVar } from 'meteor/reactive-var';
import './selectConsentGroup.html';
import Agencies from '/imports/api/agencies/agencies';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
// import Alert from '/imports/ui/alert';

const NO_CONSENT_GROUP_SELECTED = '--- No Consent Group selected ---';
const getAgencyConsentGroups = (user) => {
  if (!user.activeProject) {
    throw new Meteor.Error(400, 'No project selected');
  }
  const agency = Agencies.oneWhereUserHasActiveProject(user._id, user.activeProject);
  return ConsentGroups.find({ agencies: agency._id }).fetch();
};

function consentGroupOptions(selectedId) {
  const user = Meteor.user();
  const allConsentGroups = getAgencyConsentGroups(user);
  const options = allConsentGroups.map((consentGroup) => ({
    value: consentGroup._id,
    label: consentGroup.name,
    selected: selectedId === consentGroup._id,
  }));

  return [{
    value: null,
    label: NO_CONSENT_GROUP_SELECTED,
  }, ...options];
}

Template.selectConsentGroup.onCreated(function selectConsentGroupOnCreated() {
  this.subscribe('consentGroups.all');
  this.selectedConsentGroup = new ReactiveVar();
});

Template.selectConsentGroup.helpers({
  currentConsentGroup() {
    if (!(Template.instance() && Template.instance().selectedConsentGroup)) {
      return NO_CONSENT_GROUP_SELECTED;
    }
    const selectedId = Template.instance().selectedConsentGroup.get();
    const selected = consentGroupOptions(selectedId).filter(p => p.selected);
    if (selected.length > 0) return selected[0].label;
    const selectedConsentGroup = Template.instance().selectedConsentGroup;
    return selectedConsentGroup && selectedConsentGroup.get() || NO_CONSENT_GROUP_SELECTED;
  },
  options() {
    let selectedId = null;
    if (Template.instance()
      && Template.instance().selectedConsentGroup
      && Template.instance().selectedConsentGroup.get()) {
      selectedId = Template.instance().selectedConsentGroup.get();
    }
    return consentGroupOptions(selectedId);
  },
});

Template.selectConsentGroup.events({
  'click .consentGroupItem'(e, tmpl) {
    const consentGroupId = this.value;
    // const consentGroup = ConsentGroups.findOne(consentGroupId);
    // console.log('consentGroupId', consentGroupId, consentGroup);
    if (tmpl.selectedConsentGroup) tmpl.selectedConsentGroup.set(consentGroupId);
    console.log('consentGroupId', consentGroupId);
    // Router.current().params.consentGroupId = consentGroupId;
    // $('.selectConsentGroupValue').val(consentGroupId;
    $('.selectConsentGroupValue').val(consentGroupId);
    // Meteor.call('users.setActiveConsentGroup', consentGroupId, (err) => {
    //   if (err) {
    //     Alert.error(err);
    //   } else {
    //     if (consentGroupId) {
    //       Alert.success(`Switched to ${consentGroup.consentGroupName}`);
    //       location.reload();
    //     } else {
    //       Alert.warn('No consentGroup selected');
    //     }
    //   }
    // });
  },
});
