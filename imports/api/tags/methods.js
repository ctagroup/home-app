// import Tags from '/imports/api/tags/tags';
// import ClientTags from '/imports/api/tags/clinetTags';
import { logger } from '/imports/utils/logger';
// import { HmisClient } from '/imports/api/hmisApi';

import { getActiveTagsForDate } from './tags';
import { ClientTags } from './clientTags';

Meteor.methods({
  'tags.create'(name, score) {
    logger.info(`METHOD[${this.userId}]: tags.create`, name, score);

    Meteor.call('tagApi', 'createTag', { name, score }, (err/* , res*/) => {
      if (err) {
        // Alert.error(err);
        // template.errors.set(err.details && err.details.data);
      } else {
        // return res;
        // Alert.success('ROI Signed');
        // window.history.back();
      }
    });
    // TODO: permissions check
    // throw new Meteor.Error('Not yet implemented');
  },

  'tags.update'(id, doc) {
    logger.info(`METHOD[${this.userId}]: tags.update`, doc);
    check(id, String);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  'tags.delete'(tagId) {
    logger.info(`METHOD[${this.userId}]: tags.delete`, tagId);
    check(tagId, String);

    // throw new Meteor.Error('Not yet implemented');
    Meteor.call('tagApi', 'deleteTag', tagId, (err) => {
      if (err) console.log('deleteTag error');
      return true;
    });
  },

  'tags.active'(dedupClientId) {
    const clientTags = Meteor.call('tagApi', 'getTagsForClient', dedupClientId);
    return clientTags;
  },

});
