import { logger } from '/imports/utils/logger';

import '/imports/api/appSettings/methods';
import '/imports/api/appSettings/server/publications';

import '/imports/api/collectionsCount/server/publications';

import '/imports/api/clients/methods';
import '/imports/api/clients/server/publications';

import '/imports/api/pendingClients/methods';
import '/imports/api/pendingClients/server/publications';

import '/imports/api/eligibleClients/methods';
import '/imports/api/eligibleClients/server/publications';

import '/imports/api/questions/methods';
import '/imports/api/questions/server/publications';

import '/imports/api/surveys/methods';
import '/imports/api/surveys/server/publications';

import '/imports/api/responses/methods';
import '/imports/api/responses/server/publications';

import '/imports/api/housingUnits/methods';
import '/imports/api/housingUnits/server/publications';

import '/imports/api/housingMatch/methods';
import '/imports/api/housingMatch/server/publications';

import '/imports/api/globalHouseholds/methods';
import '/imports/api/globalHouseholds/server/publications';

import '/imports/api/users/methods';
import '/imports/api/users/server/publications';

import '/imports/api/projects/methods';
import '/imports/api/projects/server/publications';

import '/imports/api/openingScript/methods';

import '/imports/startup/server/migrations';


Meteor.startup(() => {
  Meteor.settings = _.extend({
    connectionLimit: 10,
  }, Meteor.settings);
  logger.info('Starting with settings', Meteor.settings);
});
