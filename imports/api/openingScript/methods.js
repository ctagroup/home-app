import { logger } from '/imports/utils/logger';
import OpeningScript from '/imports/api/openingScript/openingScript';

Meteor.methods({
  'openingScript.save'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: openingScript.save`, doc);
    check(doc, OpeningScript.schema);
    // TODO: permission check
    OpeningScript.save(doc);
  },
});
