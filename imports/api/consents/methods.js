import { Meteor } from 'meteor/meteor';
import Agencies from '/imports/api/agencies/agencies';
import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
import { HmisClient } from '/imports/api/hmisApi';


function createClientConsentForConsentGroup(hc, globalClientId, consentGroupId) {
  const query = {
    consentGroups: consentGroupId,
  };
  const agencies = Agencies.find(query).fetch();
  console.log('matched agen', agencies);
  const globalProjectIds = agencies.reduce((all, agency) => [...all, ...agency.projects], []);
  console.log('all proj', globalProjectIds);
  const consentId = hc.api('global').createClientConsent(globalClientId, globalProjectIds);
  return consentId;
}


Meteor.methods({
  'consents.create'(globalClientId) {
    logger.info(`METHOD[${this.userId}]: consents.create`, globalClientId);

    let activeConsentGroupId;
    try {
      activeConsentGroupId = Users.findOne(this.userId).services.HMIS.activeConsentGroupId;
    } catch (err) {
      throw new Meteor.Error(400, 'Consent group is not selected');
    }

    if (!activeConsentGroupId) {
      throw new Meteor.Error(400, 'Consent group is not selected');
    }

    const hc = HmisClient.create(this.userId);
    const consentId = createClientConsentForConsentGroup(hc, globalClientId, activeConsentGroupId);
    return consentId;
  },
});
