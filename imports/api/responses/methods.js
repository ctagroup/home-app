import { HmisClient } from '/imports/api/hmisApi';
import Surveys from '/imports/api/surveys/surveys';
import { mapUploadedSurveySections } from '/imports/api/surveys/helpers';
import { computeFormState, findItem, getScoringVariables } from '/imports/api/surveys/computations';
import { logger } from '/imports/utils/logger';
import { escapeKeys, unescapeKeys } from '/imports/api/utils';
import Responses, { ResponseStatus } from '/imports/api/responses/responses';

function getResponsesToUpload(values, definition, defaultSectionId) {
  const questionIds = Object.keys(values);
  logger.debug(values);
  return questionIds.map(id => {
    const question = findItem(id, definition);
    return {
      id,
      questionId: question.hmisId,
      responseText: values[id],
      sectionId: defaultSectionId,
    };
  });
}

Meteor.methods({
  'responses.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.create`, doc);
    check(doc, Object);
    const surveyorId = Meteor.users.findOne(Meteor.userId()).services.HMIS.accountId;
    const response = Object.assign({}, doc, {
      surveyorId,
      status: ResponseStatus.COMPLETED,
      submissionId: null,
      values: escapeKeys(doc.values),
    });

    // TODO: check permissions
    check(response, Responses.schema);
    return Responses.insert(response);
  },

  'responses.update'(id, doc) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.update`, id, doc);
    check(id, String);
    check(doc, Object);

    const oldResponse = Responses.findOne(id);

    const response = Object.assign({}, doc, {
      status: ResponseStatus.COMPLETED,
      values: escapeKeys(doc.values),
      surveyorId: oldResponse.surveyorId,
    });
    check(response, Responses.schema);
    // TODO: check permissions
    return Responses.update(id, { $set: response });
  },

  'responses.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.delete`, id);
    // TODO: check permissions
    check(id, String);
    return Responses.remove(id);
  },

  'responses.uploadToHmis'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.uploadToHmis`, id);
    check(id, String);

    // TODO: check permissions

    Responses.update(id, { $set: { status: ResponseStatus.UPLOADIND } });

    const response = Responses.findOne(id);
    const { clientId, surveyId } = response;
    const values = unescapeKeys(response.values);
    const survey = Surveys.findOne(surveyId);

    if (!survey) {
      throw new Meteor.Error('404', 'Survey does not exist');
    }

    if (!survey.hmis) {
      throw new Meteor.Error('error', 'Survey not uploaded');
    }

    const definition = JSON.parse(survey.definition);

    const hc = HmisClient.create(Meteor.userId());

    const client = hc.api('client').getClient(response.clientId, response.clientSchema);
    const formState = computeFormState(definition, values, {}, { client });
    const scores = getScoringVariables(formState);
    logger.debug('scores to upload', scores);

    const sectionsResponse = hc.api('survey').getSurveySections(survey.hmis.surveyId);
    const existingSections = mapUploadedSurveySections(sectionsResponse);
    logger.debug('existing sections', existingSections);

    const defaultSectionId = existingSections.find(s => s.type === 'default').hmisId;
    const responses = getResponsesToUpload(values, definition, defaultSectionId);

    try {
      const validResponses = responses.filter(r => r.questionId);

      if (response.submissionId) {
        logger.info(`Deleting old responses ${id}`);
        hc.api('survey')
          .getResponses(clientId, survey.hmis.surveyId)
          .map(r => hc.api('survey').deleteResponse(
            clientId, survey.hmis.surveyId, r.responseId)
          );
      }

      logger.info(`Submitting response ${id}`);
      const { submissionId } = hc.api('survey').createResponse(
        clientId, survey.hmis.surveyId, validResponses
      );
      Responses.update(id, { $set: {
        submissionId,
        submittedAt: new Date(),
      } });
    } catch (e) {
      logger.error(`Response upload ${e}`, e.stack);
      throw new Meteor.Error('responses', `${e}`);
    }

    try {
      scores.forEach(score => {
        logger.info('Submitting score', score);
        const scoreSection = existingSections.filter(s => s.id === score.name)[0];
        if (!scoreSection) {
          throw new Meteor.Error('responses',
            `Score ${score.name} has no section in HMIS. Re-upload the survey`
          );
        }
        hc.api('survey').createSectionScores(clientId, survey.hmis.surveyId, scoreSection.hmisId, {
          sectionScore: score.value,
        });
      });
    } catch (e) {
      logger.error(`Score upload ${e}`, e.stack);
      throw new Meteor.Error('responses', `Response submitted but failed to upload scores: ${e}`);
    }

    const invalidResponses = responses.filter(r => !r.questionId);
    return invalidResponses;
  },
});
