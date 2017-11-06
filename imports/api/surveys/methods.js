import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';

Meteor.methods({
  'surveys.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.create`, doc);
    check(doc, Surveys.schema);
    // TODO: permissions check
    return Surveys.insert(doc);
  },

  'surveys.update'(id, doc) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.update`, id, doc);
    check(doc, Surveys.schema);
    // TODO: permissions check
    return Surveys.update(id, doc, { bypassCollection2: true });
  },

  'surveys.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.delete`, id);
    check(id, String);
    // TODO: permissions check
    return Surveys.remove(id);
  },
});
