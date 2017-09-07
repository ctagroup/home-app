import { logger } from '/imports/utils/logger';
import OpeningScript from '/imports/api/openingScript/openingScript';

Meteor.methods({
  'openingScript.save'(doc) {
    check(doc, OpeningScript.schema);
    // TODO: permission check
    logger.info('saving opening script', doc);
    OpeningScript.save(doc);
  },
});
