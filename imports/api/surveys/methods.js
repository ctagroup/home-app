import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import { getScoringVariables } from '/imports/api/surveys/computations';
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
      logger.error(`Failed to upload survey ${e}`, e.stack);
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
    const definition = JSON.parse(survey.definition);
    let hmis;
    let surveyId;

    // upload survey
    if (survey.hmis && survey.hmis.surveyId) {
      surveyId = survey.hmis.surveyId;
      logger.info(`Uploading existing survey ${survey.title} (${id})`);
      hc.api('survey2').updateSurvey(surveyId, survey);
      hmis = survey.hmis;
    } else {
      logger.info(`Uploading survey ${survey.title} (${id}) for the first time`);
      surveyId = hc.api('survey2').createSurvey(survey).surveyId;
      hmis = Object.assign({}, survey.hmis, {
        surveyId,
      });
    }

    // create survey section for each scoring variable
    console.log('sssvvv', getScoringVariables(definition));


    const sections = hc.api('survey').getSurveySections(surveyId);
    if (sections.length === 0) {
      const section = hc.api('survey').createSurveySection(surveyId, {
        sectionText: survey.title,
        sectionDetail: 'default section',
        sectionWeight: 1,
        order: 1,
      });
      hmis.defaultSectionId = section.surveySectionId;
    } else {
      hmis.defaultSectionId = sections[0].surveySectionId;
    }
    hmis.status = 'uploaded';
    logger.debug('updating survey HMIS data', hmis);
    Surveys.update(id, { $set: { hmis } });
  },
});
