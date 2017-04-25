/**
 * Created by udit on 16/11/16.
 */
import { logger } from '/imports/utils/logger';

Template.eligibleClientsListView.events(
  {
    'click .postHousingMatchScores': () => {
      Meteor.call(
        'postHousingMatchScores', (error, result) => {
          if (error) {
            logger.error(`postHousingMatchScores - ${error}`);
          } else {
            logger.info(`postHousingMatchScores - ${result}`);
          }
        }
      );
    },
  }
);
