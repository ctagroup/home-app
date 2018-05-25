import { Meteor } from 'meteor/meteor';
import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'consents.create'(globalClientId) {
    logger.info(`METHOD[${this.userId}]: consents.create`, globalClientId);

    const hc = HmisClient.create(this.userId);
    let globalProjectId;
    try {
      globalProjectId = Users.findOne(this.userId).services.HMIS.activeProjectId;
    } catch (err) {
      throw new Meteor.Error(400, 'Active project is not selected');
    }

    if (!globalProjectId) {
      throw new Meteor.Error(400, 'Active project is not selected');
    }


    const consentId = hc.api('global').createClientConsent(globalClientId, globalProjectId);
    console.log(consentId);
  },
});
