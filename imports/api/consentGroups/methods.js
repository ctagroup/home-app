import { logger } from '/imports/utils/logger';
import ConsentGroups, { ConsentGroupStatus } from './consentGroups';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'consentGroups.create'(doc) {
    logger.info(`METHOD[${this.userId}]: consentGroups.create`, doc);
    const group = {
      ...doc,
      status: ConsentGroupStatus.NEW,
    };
    check(group, ConsentGroups.schema);
    return ConsentGroups.insert(group);
  },

  'consentGroups.update'(doc, id) {
    logger.info(`METHOD[${this.userId}]: consentGroups.update`, doc, id);
    const currentStatus = ConsentGroups.findOne(id).status;
    if (currentStatus !== ConsentGroupStatus.NEW) {
      throw new Meteor.Error(400, `Cannot edit ${currentStatus} consent group`);
    }
    check(doc, ConsentGroups.schema);
    return ConsentGroups.update(id, doc);
  },

  'consentGroups.updateStatus'(id) {
    // TODO: make call to global consents, search for this consent group
    // if consents exist, change status to active
    logger.info(`METHOD[${this.userId}]: consentGroups.update`, id);
  },

});
