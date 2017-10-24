import AppSettings from '/imports/api/appSettings/appSettings';
import { logger } from '/imports/utils/logger';

import Surveys from '/imports/api/surveys/surveys';
import viSpdatFamily2 from '/imports/config/surveys/viSpdatFamily2';
import viSpdatSinge201 from '/imports/config/surveys/viSpdatSingle2.0.1';
import viSpdatTay1 from '/imports/config/surveys/viSpdatTay1';

Meteor.startup(() => {
  let version = AppSettings.get('version', 10);

  if (version === 10) {
    // Reorganize options keys
    version++;
    logger.info(`Updating to version ${version}`);
    AppSettings.find({ option_name: { $exists: true } }).fetch().forEach((entry) => {
      AppSettings.set({
        _id: entry.option_name,
        value: entry.option_value,
      });
      AppSettings.remove(entry._id);
    });
    AppSettings.set('version', version);
  }

  if (version === 11) {
    // Reorganize opening script
    version++;
    logger.info(`Updating to version ${version}`);
    const openingScript = {
      dv: {
        question: AppSettings.get('preClientProfileQuestions.dvQuestion.question', ''),
        hotlineInfo: AppSettings.get('preClientProfileQuestions.dvQuestion.hotlineInfo', ''),
        skip: AppSettings.get('preClientProfileQuestions.dvQuestion.skip', false),
      },
      housingService: {
        question: AppSettings.get('preClientProfileQuestions.housingServiceQuestion.question', ''),
        skip: AppSettings.get('preClientProfileQuestions.housingServiceQuestion.skip', false),
      },
      releaseOfInformation: {
        info: AppSettings.get('preClientProfileQuestions.releaseOfInformation.info', ''),
        skip: AppSettings.get('preClientProfileQuestions.releaseOfInformation.skip', false),
      },
    };

    AppSettings.set('openingScript', { openingScript });

    AppSettings.remove('preClientProfileQuestions.dvQuestion.question');
    AppSettings.remove('preClientProfileQuestions.dvQuestion.hotlineInfo');
    AppSettings.remove('preClientProfileQuestions.dvQuestion.skip');
    AppSettings.remove('preClientProfileQuestions.releaseOfInformation.info');
    AppSettings.remove('preClientProfileQuestions.releaseOfInformation.skip');
    AppSettings.remove('preClientProfileQuestions.housingServiceQuestion.question');
    AppSettings.remove('preClientProfileQuestions.housingServiceQuestion.skip');
    AppSettings.set('version', version);
  }

  if (version === 12) {
    const surveys = {};
    [viSpdatFamily2, viSpdatSinge201, viSpdatTay1].forEach(s => (surveys[s.id] = s));
    Object.keys(surveys).forEach((id) => {
      const definition = surveys[id];
      const survey = {
        title: definition.title,
        version: 2,
        active: true,
        editable: true,
        definition: JSON.stringify(definition),
      };
      check(survey, Surveys.schema);
      Surveys.upsert(id, survey, { bypassCollection2: true });
    });
  }

  logger.info(`Migrations complete. Version: ${AppSettings.get('version')}`);
});
