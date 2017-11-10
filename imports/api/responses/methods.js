import { HmisClient } from '/imports/api/hmisApi';
import Surveys from '/imports/api/surveys/surveys';
import { mapUploadedSurveySections } from '/imports/api/surveys/helpers';
import { computeFormState, findItem } from '/imports/api/surveys/computations';
import { logger } from '/imports/utils/logger';
import { escapeKeys } from '/imports/api/utils';
import Responses, { ResponseStatus } from '/imports/api/responses/responses';

function getResponsesToUpload(values, definition, defaultSectionId) {
  const questionIds = Object.keys(values);
  return questionIds.map(id => {
    const question = findItem(id, definition);
    return {
      questionId: question.hmisId,
      responseText: values[id],
      sectionId: defaultSectionId,
    };
  });
}

function getScoresToUpload(variables) {
  const scores = Object.keys(variables).filter(v => v.indexOf('score') === 0);
  return scores.map(name => ({
    name,
    value: variables[name],
  }));
}

Meteor.methods({
  'responses.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.create`, doc);
    check(doc, Object);
    const surveyorId = Meteor.users.findOne(Meteor.userId()).services.HMIS.id;
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
    check(id, String);
    Responses.update(id, { $set: { status: ResponseStatus.UPLOADIND } });

    const response = Responses.findOne(id);
    const { clientId, surveyId, values } = response;
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
    const formState = computeFormState(definition, response.values, {}, { client });
    const scores = getScoresToUpload(formState.variables);

    try {
      const responses = getResponsesToUpload(values, definition, survey.hmis.defaultSectionId);

      if (!response.submissionId) {
        logger.info(`Submitted response ${id} for the first time`);
        const { submissionId } = hc.api('survey').createResponse(
          clientId, survey.hmis.surveyId, responses
        );
        Responses.update(id, { $set: {
          submissionId,
          submittedAt: new Date(),
        } });
      } else {
        logger.info(`Resubmitting response ${id}`, responses);
        hc.api('survey').updateResponse(
          clientId, survey.hmis.surveyId, response.submissionId, responses
        );
        Responses.update(id, { $set: {
          submittedAt: new Date(),
        } });
      }
    } catch (e) {
      logger.error(`Response upload ${e}`, e.stack);
      throw new Meteor.Error('responses', e);
    }

    try {
      const sectionsResponse = hc.api('survey').getSurveySections(survey.hmis.surveyId);
      const existingSections = mapUploadedSurveySections(sectionsResponse);
      scores.forEach(score => {
        logger.info('submitting score', score);
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
      throw new Meteor.Error('responses', `Response submitted, failed to upload scores: ${e}`);
    }
  },
});
