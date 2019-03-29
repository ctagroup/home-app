import { HmisClient } from '/imports/api/hmisApi';
import Surveys from '/imports/api/surveys/surveys';
import Questions from '/imports/api/questions/questions';
import { mapUploadedSurveySections } from '/imports/api/surveys/helpers';
import { computeFormState, findItem, getScoringVariables } from '/imports/api/surveys/computations';
import { logger } from '/imports/utils/logger';
import { escapeKeys, unescapeKeys, fullName } from '/imports/api/utils';
import Responses, { ResponseStatus } from '/imports/api/responses/responses';
import { ResponsesAccessRoles } from '/imports/config/permissions';
import { EnrollmentUploader } from './helpers';
import Users from '/imports/api/users/users';
import { HmisCache } from '/imports/api/cache/hmisCache';
import { prepareEmails } from '../surveys/computations';
import ResponseImporter from './ResponseImporter';

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
    logger.info(`METHOD[${this.userId}]: responses.create`, doc);
    check(doc, Object);
    if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const surveyorId = Meteor.users.findOne(this.userId).services.HMIS.accountId;
    const response = Object.assign({}, doc, {
      surveyorId,
      status: ResponseStatus.PAUSED,
      submissionId: null,
      values: escapeKeys(doc.values),
    });

    check(response, Responses.schema);
    return Responses.insert(response);
  },

  'responses.update'(id, doc) {
    logger.info(`METHOD[${this.userId}]: responses.update`, id, doc);
    check(id, String);
    check(doc, Object);
    if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

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
    check(id, String);
    if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const localResponse = Responses.findOne(id);

    if (localResponse) {
      // response is stored in mongo
      try {
        const { clientId, surveyId, submissionId } = localResponse;
        const hc = HmisClient.create(this.userId);
        hc.api('survey').deleteSubmission(clientId, surveyId, submissionId);
        // Meteor.call('responses.deleteEnrollment', id);
      } catch (err) {
        logger.warn('Failed to delete response', err);
      } finally {
        Responses.remove(id);
      }
    } else {
      // remote response
      throw new Meteor.Error(400, 'Cannot remove HMIS response');
    }
  },

  'responses.sendEmails'(responseId) {
    logger.info(`METHOD[${Meteor.userId()}]: responses.emails`, responseId);
    check(responseId, String);
    if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

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
    check(id, String);
    if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const response = Responses.findOne(id);
    let projectId = null;
    let dataCollectionStage;
    if (response.enrollmentInfo) {
      projectId = response.enrollmentInfo.projectId;
      dataCollectionStage = response.enrollmentInfo.dataCollectionStage || 0;
    }
    const { surveyId } = response;

    if (!projectId) {
      projectId = Users.findOne(this.userId).activeProjectId;
    }

    if (!projectId) {
      throw new Meteor.Error(400, 'Active project not set');
    }

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
    const dataToSend = enrollmentUploader.questionResponsesToData(
      projectId,
      dataCollectionStage
    );
    const sortedData = enrollmentUploader.dataOrderedByUrlVariables(dataToSend);
    logger.debug('sorted', sortedData);
    const result = enrollmentUploader.upload(sortedData, hc.api('client'));

    logger.debug('enrollment upload result', result);
    if (Object.keys(result).length > 0) {
      // new enrollment has been crated
      Responses.update(id, {
        $set: {
          enrollment: result,
        },
      });
    }

    return result;
  },

  'responses.deleteEnrollment'(id) {
    logger.info(`METHOD[${this.userId}]: responses.uploadEnrollment`, id);
    const response = Responses.findOne(id);
    if (response.enrollment) {
      Object.values(response.enrollment).forEach(entry => {
        throw new Error('deleteEnrollment is not implemented yet', entry.updateUri);
      });
    }
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

    let submissionId = response.submissionId;
    try {
      if (submissionId) {
        // if this response has already been submitted
        logger.info(`Updating existing submission, doc id ${id}`);
        const submissionResponses = hc.api('survey').getSubmissionResponses(
          clientId, surveyId, submissionId
        );
        const updatedResponses = submissionResponses.map(r => {
          const newValue = questionVaules.find(qv => r.questionId === qv.questionId);
          return {
            ...r,
            responseText: newValue.responseText,
          };
        });
        hc.api('survey').updateSubmissionResponses(
          clientId, surveyId, submissionId, updatedResponses
        );
        Responses.update(id, { $set: {
          status: ResponseStatus.COMPLETED,
        } });
      } else {
        logger.info(`Sending new submission, response doc ${id}`);
        // create new submission - send all question values in one call
        submissionId = hc.api('survey').createSubmission(
          clientId, surveyId, questionVaules
        ).submissionId;

        Responses.update(id, { $set: {
          submissionId,
          status: ResponseStatus.COMPLETED,
          submittedAt: new Date(),
        } });
      }
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

  'responses.getPage'({ clientId, pageNumber = 0, pageSize = 50, sortBy = [], filterBy = [] }) {
    logger.info(`METHOD[${this.userId}]: responses.getPage(${pageNumber}, ${pageSize}, ${sortBy}, ${filterBy})`); // eslint-disable-line max-len
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }

    if (clientId) {
      filterBy.push({
        id: 'clientId',
        value: clientId,
      });
    }

    const clientFilter = filterBy.find(x => x.id === 'clientId');
    if (clientFilter) {
      // use HSLYNK to search for submissions
      const seachString = clientFilter.value;

      const hc = HmisClient.create(this.userId);
      const results = hc.api('survey').searchForClientSurveySubmissions(seachString);
      const all = results
        .map(s => Responses.findOne({ submissionId: s.submissionId }) || {
          _id: s.submissionId,
          client: s.client,
          clientId: s.clientId,
          status: 'not imported',
          submissionId: s.submissionId,
          surveyId: s.surveyId,
          updatedAt: new Date(),
          values: {},
          version: 'n/a',
        })
        .map(s => ({
          ...s,
          client: s.client || HmisCache.getClient(s.clientId, s.clientSchema, this.userId),
          survey: s.survey || HmisCache.getSurvey(s.surveyId, this.userId),
        }));

      return {
        content: all.sort((a, b) => {
          if (sortBy.length) {
            const column = sortBy[0].id;
            const direction = sortBy[0].desc ? -1 : 1;
            switch (column) {
              case 'surveyId':
                return (a.survey.surveyTitle || '')
                  .localeCompare(b.survey.surveyTitle || '') * direction;
              case 'clientId':
                return fullName(a.client).localeCompare(fullName(b.client)) * direction;
              default:
                return (a[column] - b[column]) * direction;
            }
          }
          return 0;
        }),
        page: {
          totalPages: 1,
        },
      };
    }

    // for now fetch all responses from Mongo
    this.unblock();
    const responsesCount = Responses.find().count();
    const sort = {
    };
    if (sortBy.length) {
      const column = sortBy[0].id;
      const direction = sortBy[0].desc ? -1 : 1;
      sort[column] = direction;
    }
    const pageData = Responses.find({}, {
      sort,
      skip: pageNumber * pageSize,
      limit: pageSize,
    }).fetch();

    return {
      content: pageData.map(r => ({
        ...r,
        client: HmisCache.getClient(r.clientId, r.clientSchema, this.userId),
        survey: HmisCache.getSurvey(r.surveyId, this.userId),
      })),
      page: {
        totalPages: Math.ceil(responsesCount / pageSize),
      },
    };
  },
  'responses.count'() {
    logger.info(`METHOD[${this.userId}]: responses.count`);

    function count() {
      return Responses._collection // eslint-disable-line
      .rawCollection().distinct('clientId');
    }

    return count();
  },
});


Meteor.injectedMethods({
  async 'responses.importAllSubmissionsFromHslynk'(start = 0, limit = Number.MAX_SAFE_INTEGER) {
    this.unblock();
    const schema = 'v2017';
    const { hmisClient } = this.context;
    const clientIds = hmisClient.api('client')
      .getClients(schema, 0, limit)
      .map(c => c.clientId);

    const importer = new ResponseImporter({
      responsesCollection: Responses,
      hmisClient,
    });

    const results = [];
    while (clientIds.length > 0) {
      const clientId = clientIds.shift();
      logger.info(`!!!!!!! importing responses for ${clientId}, ${clientIds.length} remaining`);
      const result = await importer.importResponsesForClientAsync(clientId, schema, this.userId);
      logger.info(`!!!!!!! done with ${clientId}, ${clientIds.length} remaining`);
      results.push(result);
    }
    return results;
  },

  'responses.importSubmissionFromHslynk'(clientId, clientSchema, surveyId, submissionId) {
    /*
    test with
    clientId: 56cdee0f-7219-44bf-93fa-d1caf1eb63de (schema=v2017)
    surveyId: 9fa355a4-7194-4ec1-821c-c5d7e72d93d5
    submissionId: df0c0e51-9ee7-4ed5-8d46-791b53137df1
    Meteor.call('responses.importSubmissionFromHslynk', '56cdee0f-7219-44bf-93fa-d1caf1eb63de',
      'v2017', '9fa355a4-7194-4ec1-821c-c5d7e72d93d5', 'df0c0e51-9ee7-4ed5-8d46-791b53137df1',
      (err,res) => console.log(err,res))
    */
    check(clientId, String);
    check(clientSchema, Match.OneOf(String, null)); // eslint-disable-line new-cap
    check(surveyId, String);
    check(submissionId, String);

    let foundSchema = null;
    if (!clientSchema) {
      foundSchema = ['v2014', 'v2015', 'v2016', 'v2017'].find(
        schema => !HmisCache.getClient(clientId, schema, this.userId).error
      );
    }

    const { hmisClient, logger } = this.context; // eslint-disable-line no-shadow
    logger.info(`METHOD[${this.userId}]: responses.importSubmissionFromHslynk`, submissionId);

    const importer = new ResponseImporter({
      responsesCollection: Responses,
      hmisClient,
    });
    return importer.importResposeFromSubmission(
      clientId, clientSchema || foundSchema, surveyId, submissionId, 'import');
  },
});
