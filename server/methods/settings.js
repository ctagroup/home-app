/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    saveAdminSettings(settings) {
      check(settings, Schemas.adminSettings);

      logger.info(JSON.stringify(settings));

      const optionsCollection = adminCollectionObject('options');

      let value = '';

      if (settings.preClientProfileQuestions
          && settings.preClientProfileQuestions.dvQuestion
          && settings.preClientProfileQuestions.dvQuestion.question) {
        value = settings.preClientProfileQuestions.dvQuestion.question;
      }

      optionsCollection.upsert(
        { option_name: 'preClientProfileQuestions.dvQuestion.question' }, {
          $set: {
            option_name: 'preClientProfileQuestions.dvQuestion.question',
            option_value: value,
          },
        }
      );

      value = '';
      if (settings.preClientProfileQuestions
          && settings.preClientProfileQuestions.dvQuestion
          && settings.preClientProfileQuestions.dvQuestion.skip) {
        value = settings.preClientProfileQuestions.dvQuestion.skip;
      }

      optionsCollection.upsert(
        { option_name: 'preClientProfileQuestions.dvQuestion.skip' }, {
          $set: {
            option_name: 'preClientProfileQuestions.dvQuestion.skip',
            option_value: value,
          },
        }
      );

      value = '';
      if (settings.preClientProfileQuestions
          && settings.preClientProfileQuestions.dvQuestion
          && settings.preClientProfileQuestions.dvQuestion.hotlineInfo) {
        value = settings.preClientProfileQuestions.dvQuestion.hotlineInfo;
      }

      optionsCollection.upsert(
        { option_name: 'preClientProfileQuestions.dvQuestion.hotlineInfo' }, {
          $set: {
            option_name: 'preClientProfileQuestions.dvQuestion.hotlineInfo',
            option_value: value,
          },
        }
      );

      value = '';
      if (settings.preClientProfileQuestions
          && settings.preClientProfileQuestions.housingServiceQuestion
          && settings.preClientProfileQuestions.housingServiceQuestion.question) {
        value = settings.preClientProfileQuestions.housingServiceQuestion.question;
      }

      optionsCollection.upsert(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.question' }, {
          $set: {
            option_name: 'preClientProfileQuestions.housingServiceQuestion.question',
            option_value: value,
          },
        }
      );

      value = '';
      if (settings.preClientProfileQuestions
          && settings.preClientProfileQuestions.housingServiceQuestion
          && settings.preClientProfileQuestions.housingServiceQuestion.skip) {
        value = settings.preClientProfileQuestions.housingServiceQuestion.skip;
      }

      optionsCollection.upsert(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.skip' }, {
          $set: {
            option_name: 'preClientProfileQuestions.housingServiceQuestion.skip',
            option_value: value,
          },
        }
      );

      value = '';
      if (settings.preClientProfileQuestions
          && settings.preClientProfileQuestions.releaseOfInformation
          && settings.preClientProfileQuestions.releaseOfInformation.info) {
        value = settings.preClientProfileQuestions.releaseOfInformation.info;
      }

      optionsCollection.upsert(
        { option_name: 'preClientProfileQuestions.releaseOfInformation.info' }, {
          $set: {
            option_name: 'preClientProfileQuestions.releaseOfInformation.info',
            option_value: value,
          },
        }
      );

      value = '';
      if (settings.preClientProfileQuestions
          && settings.preClientProfileQuestions.releaseOfInformation
          && settings.preClientProfileQuestions.releaseOfInformation.skip) {
        value = settings.preClientProfileQuestions.releaseOfInformation.skip;
      }

      optionsCollection.upsert(
        { option_name: 'preClientProfileQuestions.releaseOfInformation.skip' }, {
          $set: {
            option_name: 'preClientProfileQuestions.releaseOfInformation.skip',
            option_value: value,
          },
        }
      );
    },
  }
);
