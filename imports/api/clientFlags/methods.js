import { ClientFlags } from './clientFlags';
import { logger } from '/imports/utils/logger';


Meteor.methods({
  'clientFlags.create'(clientId, key, value) {
    // TODO: check permissions
    // TODO: check schema
    logger.info(`METHOD[${Meteor.userId()}]: clientFlags.create`, clientId, key, value);
    const data = {
      dedupClientId: clientId,
      dateSet: new Date,
      userCreatorId: this.userId,
      key,
      value,
    };
    return ClientFlags.insert(data);
  },

  'clientFlags.delete'(clientId) {
    logger.info(`METHOD[${Meteor.userId()}]: removePendingClient`, clientId);
    // TODO: check permissions
    if (!ClientFlags.findOne(clientId)) {
      throw new Meteor.Error('404', 'Pending client not found');
    }
    ClientFlags.remove({ _id: clientId });
  },
});
