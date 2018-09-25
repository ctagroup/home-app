import { HmisClient } from '/imports/api/hmisApi';
import Surveys from '/imports/api/surveys/surveys';
import Questions from '/imports/api/questions/questions';
import { mapUploadedSurveySections } from '/imports/api/surveys/helpers';
import { computeFormState, findItem, getScoringVariables } from '/imports/api/surveys/computations';
import { logger } from '/imports/utils/logger';
import { escapeKeys, unescapeKeys } from '/imports/api/utils';
import Responses, { ResponseStatus } from '/imports/api/responses/responses';
import { prepareEmails } from '../surveys/computations';
import { EnrollmentUploader } from './helpers';
import Users from '/imports/api/users/users';

function prepareValuesToUpload(values, definition, defaultSectionId) {
  const questionIds = Object.keys(values);
  logger.debug('prepareValuesToUpload', values);
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
      status: ResponseStatus.PAUSED,
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
      status: ResponseStatus.PAUSED,
      values: escapeKeys(doc.values),
      surveyorId: oldResponse.surveyorId,
    });
    check(response, Responses.schema);
    // TODO: check permissions
    return Responses.update(id, { $set: response });
  },

  'responses.delete'(id) {
    logger.info(`METHOD[${this.userId}]: responses.delete`, id);
    // TODO: check permissions
    check(id, String);

    try {
      const { clientId, surveyId, submissionId } = Responses.findOne(id);
      const hc = HmisClient.create(this.userId);
      hc.api('survey').deleteSubmission(clientId, surveyId, submissionId);
    } catch (err) {
      logger.warn('Failed to delete response', err);
    } finally {
      Responses.remove(id);
    }
  },

  'responses.sendEmails'(responseId) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.emails`, responseId);
    // TODO: check permissions
    check(responseId, String);

    const response = Responses.findOne(responseId);
    const { clientId, clientSchema, surveyId } = response;
    const values = unescapeKeys(response.values);
    const survey = Surveys.findOne(surveyId);

    // FIXME: survey may not be in Mongo but in HSLYNK
    // TODO: fetch survey from HSLYNK as a fallback

    const definition = JSON.parse(survey.definition);

    const hc = HmisClient.create(Meteor.userId());

    const client = hc.api('client').getClient(clientId, clientSchema);
    const formState = computeFormState(definition, values, {}, { client });
    const emails = prepareEmails(definition, formState);

    logger.debug(`sending ${emails.length} emails`);
    emails.forEach(email => {
      try {
        const additionalInfo = {
          messageType: `Survey ${survey.title}`,
          recipientType: 'clientID',
          recipientId: clientId,
        };
        hc.api('global').sendEmailNotification(email, additionalInfo);
      } catch (e) {
        logger.error(e);
      }
    });
  },

  'responses.uploadEnrollment'(id) {
    logger.info(`METHOD[${this.userId}]: responses.uploadEnrollment`, id);

    // TODO: check if projectId and clientId are from the save schema
    let { activeProjectId } = Users.findOne(this.userId);
    if (!activeProjectId) {
      throw new Meteor.Error(400, 'Active project not selected');
    }

    const response = Responses.findOne(id);
    if (response.enrollmentInfo) {
      const { projectId } = response.enrollmentInfo;
      activeProjectId = projectId;
    }
    const { surveyId } = response;

    const hc = HmisClient.create(this.userId);

    // check if survey exists in hslynk
    let survey;
    try {
      survey = hc.api('survey2').getSurvey(surveyId);
    } catch (err) {
      Responses.update(id, { $set: { status: ResponseStatus.UPLOAD_ERROR } });
      logger.error(err);
      throw new Meteor.Error('error', `Survey ${surveyId} not uploaded.`);
    }

    const enrollmentUploader = new EnrollmentUploader(response, survey);

    // projectId is reqired field when creating an enrollment
    // FIXME: we should use project associated with the survey
    // instead of current active user project
    // VK: waiting for this assoc (survey-project) to be saved somewhere, note that si....
    const dataToSend = enrollmentUploader.questionResponsesToData(activeProjectId);
    const sortedData = enrollmentUploader.dataOrderedByUrlVariables(dataToSend);
    logger.debug('sorted', sortedData);
    const result = enrollmentUploader.upload(sortedData, hc.api('client'));

    logger.debug('enrollment upload result', result);

    Responses.update(id, {
      $set: {
        enrollment: result,
      },
    });

    return result;
  },

  'responses.uploadToHmis'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.uploadToHmis`, id);
    check(id, String);

    // TODO: check permissions

    Responses.update(id, { $set: { status: ResponseStatus.UPLOADIND } });

    const response = Responses.findOne(id);
    const { clientId, surveyId } = response;
    const values = unescapeKeys(response.values);

    const hc = HmisClient.create(Meteor.userId());

    // check if survey exists in hslynk
    let survey;
    try {
      survey = hc.api('survey2').getSurvey(surveyId);
    } catch (err) {
      Responses.update(id, { $set: { status: ResponseStatus.UPLOAD_ERROR } });
      logger.error(err);
      throw new Meteor.Error('error', `Survey ${surveyId} not uploaded.`);
    }

    const definition = JSON.parse(survey.surveyDefinition);

    // collect scores to send from scoring variables
    const client = hc.api('client').getClient(response.clientId, response.clientSchema);
    const formState = computeFormState(definition, values, {}, { client });
    const scores = getScoringVariables(formState); // each score is { name, value } object
    logger.debug('scores to upload', scores);

    // get existing (in HMIS) sections for this survey
    // there are 2 types of sections:
    // one default section for storing all question values,
    // any number of score sections (for storing each value with name score.*)
    const existingSectionsData = hc.api('survey').getSurveySections(surveyId);
    const existingSections = mapUploadedSurveySections(existingSectionsData);
    logger.debug('existing sections', existingSections);

    // discover sectionId of default section (which will be used to upload question values)
    const defaultSectionId = existingSections.find(s => s.type === 'default').hmisId;
    // tie together question values, questions and default section,
    const allQuestionValues = prepareValuesToUpload(values, definition, defaultSectionId);
    // we are only interested in values for questions which have hmisIds
    const questionVaules = allQuestionValues.filter(v => v.questionId);

    try {
      if (response.submissionId) {
        // if this response has already been submitted
        logger.info(`Deleting old submission ${id}`);

        // delete old submission
        hc.api('survey').deleteSubmission(clientId, surveyId, response.submissionId);
        Responses.update(id, { $unset: { submissionId: true } });
      }
      logger.info(`Submitting responses ${id}`);
      // create new submission - send all question values in one call
      const { submissionId } = hc.api('survey').createSubmission(
        clientId, surveyId, questionVaules
      );

      Responses.update(id, { $set: {
        submissionId,
        status: ResponseStatus.COMPLETED,
        submittedAt: new Date(),
      } });
    } catch (e) {
      logger.error(`Response upload ${e}`, e.stack);
      Responses.update(id, { $set: { status: ResponseStatus.UPLOAD_ERROR } });
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
        hc.api('survey').createSectionScores(clientId, surveyId, scoreSection.hmisId, {
          sectionScore: score.value,
        });
      });
    } catch (e) {
      logger.error(`Score upload ${e}`, e.stack);
      Responses.update(id, { $set: { status: ResponseStatus.UPLOAD_ERROR } });
      throw new Meteor.Error('responses', `Response submitted but failed to upload scores: ${e}`);
    }

    const invalidQuestionValues = allQuestionValues.filter(v => !v.questionId);
    return invalidQuestionValues;
  },

  'responses.uploadV1ToHmis'(id, defaultSectionId = '7db10270-ec7f-4b11-8d26-48e334c97b95') {
    logger.info(`METHOD[${this.userId}]: responses.uploadV1ToHmis`, id);

    function assertEqual(a, b, msg = '') {
      if (a !== b) throw new Error(`${a} !== ${b} ${msg}`);
    }

    const hc = HmisClient.create(this.userId);
    const response = Responses.findOne(id);

    assertEqual(response.version, 1, 'expected version === 1');
    assertEqual(response.status, 'Paused', 'expected Paused status');
    assertEqual(!!response.submissionId, false, 'Expected not submitted response');

    logger.debug('RESPONSE', response);

    const survey = Surveys.findOne(response.surveyId);

    logger.debug('SURVEY', survey);

    const questionResponses = response.section.reduce((all, s) => ([
      ...all,
      ...(s.response || []),
    ]), []);

    const questionValues = questionResponses
    .map((r) => {
      const question = Questions.findOne(r.questionID) || {};
      return {
        questionId: question.surveyServiceQuesId,
        responseText: r.answer,
        sectionId: defaultSectionId,
      };
    })
    .filter(x => x.questionId)
    .filter(x => x.responseText)
    .filter(x => !x.responseText.startsWith('This answer should be ignored'));

    const clientId = response.clientId;
    const surveyId = survey.apiSurveyServiceId;

    logger.debug({ clientId, surveyId, questionValues });

    const { submissionId } = hc.api('survey').createSubmission(
      clientId, surveyId, questionValues
    );
    Responses.update(id, {
      $set: {
        submissionId,
        status: ResponseStatus.COMPLETED,
        submittedAt: new Date(),
        version: 1,
      },
      $unset: {
        tmp: true,
      },
    }, { bypassCollection2: true });

    logger.info('DONE!', submissionId);
    return submissionId;
  },
});
