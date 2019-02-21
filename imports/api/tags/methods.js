// import Tags from '/imports/api/tags/tags';
// import ClientTags from '/imports/api/tags/clinetTags';
import { logger } from '/imports/utils/logger';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'tags.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: tags.create`, doc);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  'tags.update'(id, doc) {
    logger.info(`METHOD[${Meteor.userId()}]: tags.update`, doc);
    check(id, String);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  'tags.delete'(tagId) {
    logger.info(`METHOD[${Meteor.userId()}]: tags.delete`, tagId);
    check(tagId, String);

    throw new Meteor.Error('Not yet implemented');
    // const hc = HmisClient.create(Meteor.userId());
    // return hc.api('survey').deleteQuestion(groupId, questionId);
  },

  'clientTags.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: clientTags.create`, doc);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  // 'clientTags.update'(id, doc) {
  //   logger.info(`METHOD[${Meteor.userId()}]: clientTags.update`, doc);
  //   check(id, String);
  //   // TODO: permissions check
  //   throw new Meteor.Error('Not yet implemented');
  // },

  'clientTags.delete'(tagId, date) {
    logger.info(`METHOD[${Meteor.userId()}]: clientTags.delete`, tagId, date);
    check(tagId, String);
    check(date, Date);

    throw new Meteor.Error('Not yet implemented');
    // const hc = HmisClient.create(Meteor.userId());
    // return hc.api('survey').deleteQuestion(groupId, questionId);
  },
});
