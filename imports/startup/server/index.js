import { logger } from '/imports/utils/logger';

import AppSettings from '/imports/api/appSettings/appSettings';
import '/imports/api/appSettings/methods';
import '/imports/api/appSettings/server/publications';

import '/imports/api/collectionsCount/server/publications';

import '/imports/api/clients/methods';
import '/imports/api/clients/server/publications';

import '/imports/api/pendingClients/methods';
import '/imports/api/pendingClients/server/publications';

import '/imports/api/eligibleClients/methods';
import '/imports/api/eligibleClients/server/publications';

import '/imports/api/files/methods';
import '/imports/api/files/server/publications';

import '/imports/api/submissionUploader/methods';
import '/imports/api/submissionUploader/server/publications';

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

import '/imports/api/agencies/methods';
import '/imports/api/agencies/server/publications';

import '/imports/api/openingScript/methods';
import '/imports/api/logger/methods';
import '/imports/api/aws/server/aws';

import '/imports/startup/server/migrations';
import '/imports/startup/server/accounts';
import '/imports/startup/server/admins';
import '/imports/startup/server/mergeAccountsPatch';

import '/imports/api/mc211/methods';


Meteor.startup(() => {
  /* eslint-disable */
	process.env.MAIL_URL = 'smtp://postmaster%40sandbox99bfa58d2ea34f7893748e31be4823e8.mailgun.org:e9efb86cb5eeb210c6bdc66775bcf3ca@smtp.mailgun.org:587';
  /* eslint-enable */

  Meteor.settings = _.extend({
    connectionLimit: 10,
  }, Meteor.settings);

  const { GIT_BRANCH, GIT_TAG, GIT_COMMIT } = process.env;
  const buildStr = (GIT_BRANCH || GIT_TAG || GIT_COMMIT) ?
    `${GIT_TAG || 'tag'} (${(GIT_COMMIT || 'c').substr(0, 4)}/${GIT_BRANCH || 'b'})` : '';
  logger.info(`Starting ${buildStr} with settings`, Meteor.settings);

  AppSettings.set('buildInfo', buildStr);

  if (Meteor.settings.s3config) {
    // const { key, secret, bucket, region } = Meteor.settings.s3config;
  } else {
    logger.warn('S3 config is missing');
  }
});
