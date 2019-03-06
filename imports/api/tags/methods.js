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

  'tags.delete'(groupId, questionId) {
    logger.info(`METHOD[${Meteor.userId()}]: tags.delete`, groupId, questionId);
    check(groupId, String);
    check(questionId, String);

    throw new Meteor.Error('Not yet implemented');
    // const hc = HmisClient.create(Meteor.userId());
    // return hc.api('survey').deleteQuestion(groupId, questionId);
  },

  'clientTags.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: tags.create`, doc);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  'clientTags.update'(id, doc) {
    logger.info(`METHOD[${Meteor.userId()}]: tags.update`, doc);
    check(id, String);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  'clientTags.delete'(groupId, questionId) {
    logger.info(`METHOD[${Meteor.userId()}]: tags.delete`, groupId, questionId);
    check(groupId, String);
    check(questionId, String);

    throw new Meteor.Error('Not yet implemented');
    // const hc = HmisClient.create(Meteor.userId());
    // return hc.api('survey').deleteQuestion(groupId, questionId);
  },
});
