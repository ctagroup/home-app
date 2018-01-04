import AppSettings from '/imports/api/appSettings/appSettings';
import { logger } from '/imports/utils/logger';

import Questions from '/imports/api/questions/questions';
import Responses from '/imports/api/responses/responses';
import Surveys from '/imports/api/surveys/surveys';
import Users from '/imports/api/users/users';
import viSpdatFamily2 from '/imports/config/surveys/viSpdatFamily2';
import viSpdatSinge201 from '/imports/config/surveys/viSpdatSingle2.0.1';
import viSpdatTay1 from '/imports/config/surveys/viSpdatTay1';
import testSurvey from '/imports/config/surveys/testSurvey';

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
    version++;
    logger.info('upserting surveys');
    const surveys = {};
    [viSpdatFamily2, viSpdatSinge201, viSpdatTay1, testSurvey].forEach(s => (surveys[s.id] = s));
    Object.keys(surveys).forEach((id) => {
      logger.debug(id);
      const definition = surveys[id];
      const survey = {
        title: definition.title,
        version: 2,
        active: true,
        editable: true,
        definition: JSON.stringify(definition),
      };
      check(survey, Surveys.schema);
      Surveys.upsert(id, { $set: { ...survey } }, { bypassCollection2: true });
      AppSettings.set('version', version);
    });
  }

  if (version === 13) {
    version++;
    let count = 0;
    Responses.find().fetch()
      .filter(response => !response.version)
      .forEach(oldResponse => {
        const surveyor = Users.findOne(oldResponse.userID);
        let surveyorId;
        try {
          surveyorId = surveyor.services.HMIS.accountId;
        } catch (e) {
          logger.warn(`No HMIS accountId for user ${oldResponse.userID}, exists? ${!!surveyor}`);
          surveyorId = null;
        }
        // console.log(oldResponse.userID, surveyor);
        // throw new Error();
        const newResponse = {
          ...oldResponse,
          clientId: oldResponse.clientID,
          surveyId: oldResponse.surveyID,
          status: oldResponse.responsestatus,
          surveyorId,
          createdAt: oldResponse.timestamp,
          version: 1,
        };
        delete newResponse.clientID;
        delete newResponse.surveyID;
        delete newResponse.userID;
        delete newResponse.responsestatus;
        Responses.update(newResponse._id, newResponse, { bypassCollection2: true });
        count++;
      });
    logger.info(`Updated ${count} v1 responses`);

    count = 0;
    Questions.find().fetch()
    .filter(question => !question.version)
    .forEach(question => {
      Questions.update(question._id, { $set: { version: 1 } }, { bypassCollection2: true });
      count++;
    });
    logger.info(`Updated ${count} v1 questions`);

    count = 0;
    Surveys.find().fetch()
    .filter(survey => !survey.version)
    .forEach(survey => {
      Surveys.update(survey._id, { $set: { version: 1 } }, { bypassCollection2: true });
      count++;
    });
    logger.info(`Updated ${count} v1 surveys`);

    count = 0;
    Users.find().fetch()
      .filter(user => user._id.length === 17)
      .forEach(user => {
        try {
          const newUser = {
            ...user,
            _id: user.services.HMIS.accountId,
            previousId: user._id,
          };
          count++;
          Users.remove(user._id);
          Users.insert(newUser);
        } catch (e) {
          logger.warn(`Failed to update user ${user._id}: ${e}`);
        }
      });
    logger.info(`Updated ${count} v1 users`);
    // TODO: bump migration version when old site is closed
  }

  logger.info(`Migrations complete. Version: ${AppSettings.get('version')}`);
});
