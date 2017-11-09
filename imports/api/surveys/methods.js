import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';

Meteor.methods({
  'surveys.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.create`, doc);
    check(doc, Surveys.schema);
    // TODO: permissions check
    const id = Surveys.insert(doc);
    try {
      Meteor.call('surveys.upload', id);
    } catch (e) {
      logger.error(`Failed to upload survey ${e}`);
      throw new Meteor.Error('hmis.api', `Survey created, failed to upload! ${e}`);
    }
  },

  'surveys.update'(id, doc) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.update`, id, doc);
    Surveys.schema.clean(doc);
    check(doc, Surveys.schema);
    Surveys.update(id, doc, { bypassCollection2: true });
    try {
      Meteor.call('surveys.upload', id);
    } catch (e) {
      logger.error(`Failed to upload survey ${e}`);
      throw new Meteor.Error('hmis.api', `Survey updated, failed to upload! ${e}`);
    }
  },

  'surveys.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.delete`, id);
    check(id, String);
    // TODO: permissions check
    return Surveys.remove(id);
  },

  'surveys.upload'(id) {
    const hc = HmisClient.create(Meteor.userId());
    const survey = Surveys.findOne(id);
    let hmis;
    if (survey.hmis && survey.hmis.surveyId) {
      logger.info(`Uploading existing survey ${survey.title} (${id})`);
      hc.api('survey2').updateSurvey(survey);
      hmis = survey.hmis;
      Surveys.update(id, { $set: { 'hmis.status': 'uploaded' } });
    } else {
      logger.info(`Uploading survey ${survey.title} (${id}) for the first time`);
      const { surveyId } = hc.api('survey2').createSurvey(survey);
      hmis = Object.assign({}, survey.hmis, {
        surveyId,
      });

      hmis.status = 'uploaded';
      Surveys.update(id, { $set: { hmis } });
    }
  },
});
