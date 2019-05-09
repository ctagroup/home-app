import { eachLimit } from 'async';
import { escapeKeys } from '/imports/api/utils';
import { itemsToArray, getQuestionItemOptions } from '/imports/api/surveys/computations';
import { logger } from '/imports/utils/logger';

function hasValidResponse(item, value) {
  if (item.category === 'select' || item.category === 'choice') {
    const options = getQuestionItemOptions(item);
    return !!options[value];
  }
  return true;
}


export default class ResponseImporter {
  constructor({ responsesCollection, hmisClient }) {
    this.responsesCollection = responsesCollection;
    this.hmisClient = hmisClient;
    this.surveyCache = {};
  }

  submissionResponsesToValues(submissionResponses, surveyDefinitionItems, debugData) {
    return submissionResponses.reduce((all, response) => {
      if (!response.questionId) {
        logger.warn('response without questionId, skipping', response, debugData);
        return all;
      }
      const matchingItems = surveyDefinitionItems
        .filter(x => x.hmisId === response.questionId)
        .filter(x => hasValidResponse(x, response.responseText));

      if (matchingItems.length === 0) {
        logger.warn('cannot match response with any item', response, debugData);
        return {
          ...all,
          [`missing--question--${response.questionId}`]: response.responseText,
        };
      }
      // we have at least one matching item in the survey
      return {
        ...all,
        [matchingItems[0].id]: response.responseText,
      };
    }, {});
  }

  getSurveyDefinitionItems(surveyId) {
    if (!this.surveyCache[surveyId]) {
      const survey = this.hmisClient.api('survey2').getSurvey(surveyId);
      const items = itemsToArray(JSON.parse(survey.surveyDefinition));
      this.surveyCache[surveyId] = items;
    }
    return this.surveyCache[surveyId];
  }

  importResposeFromSubmission(clientId, clientSchema, surveyId, submissionId, surveyorId) {
    const surveyDefinitionItems = this.getSurveyDefinitionItems(surveyId);
    logger.debug(`importing submission ${submissionId} in survey ${surveyId}`,
      clientId, clientSchema
    );

    // Import submission
    if (this.responsesCollection.findOne(submissionId)) {
      logger.debug(`submission ${submissionId} skipped, already imported`);
      return false;
    }

    logger.debug(`new submission to import ${submissionId}`);
    const submissionResponses = this.hmisClient.api('survey')
      .getSubmissionResponses(clientId, surveyId, submissionId);

    const responseSubmissionDates = submissionResponses
      .map(x => x.effectiveDate)
      .filter(x => !!x)
      .map(x => new Date(x));

    const submissionDate = responseSubmissionDates.length ?
      Math.max(...responseSubmissionDates) : new Date();

    const values = this.submissionResponsesToValues(
      submissionResponses, surveyDefinitionItems, { clientId, submissionId, surveyId }
    );

    const doc = {
      _id: submissionId,
      clientId,
      clientSchema,
      status: 'completed',
      surveyId,
      surveyorId,
      submissionId,
      version: 2,
      values: escapeKeys(values),
      extraData: 'imported',
      createdAt: submissionDate,
    };
    logger.debug(doc);
    this.responsesCollection.insert(doc);

    return doc;
  }

  async importResponsesForClientAsync(clientId, clientSchema, surveyorId) {
    const submissions = this.hmisClient.api('survey').getClientSurveySubmissions(clientId);
    logger.info(`importing ${submissions.length} submissions for client ${clientId} ${clientSchema}`); // eslint-disable-line


    return new Promise((resolve) => {
      const results = [];
      if (submissions.length === 0) resolve(results);

      eachLimit(submissions, 20,
        (submission, callback) => {
          Meteor.setTimeout(() => {
            const { surveyId, submissionId } = submission;
            logger.debug(`importing submission ${submissionId} in survey ${surveyId}`);

            try {
              // Import submission
              this.importResposeFromSubmission(
                clientId, clientSchema, surveyId, submissionId, surveyorId
              );
            } catch (err) {
              // Log error, but continue
              logger.error(`Error in submission import ${submissionId}`, err);
            } finally {
              results.push(submissionId);
              logger.info(`*** import for client ${clientId} completed in ${results.length}/${submissions.length}`); // eslint-disable-line
              callback();
              if (results.length === submissions.length) {
                resolve(results);
              }
            }
          }, 1);
        });
    });
  }
}
