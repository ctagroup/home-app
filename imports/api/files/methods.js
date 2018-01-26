import Files from '/imports/api/files/files';
import { logger } from '/imports/utils/logger';

Meteor.methods({
  'files.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: files.create`, doc);
    check(doc, Files.schema);
    // TODO: permissions
    return Files.insert(doc);
  },
  'files.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: files.delete`, id);
    check(id, String);
    // TODO: permissions
    throw new Meteor.Error('Not Yet implemented');
  },
});
