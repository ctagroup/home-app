import { eachLimit } from 'async';
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
      const matchingItems = surveyDefinitionItems
        .filter(x => x.hmisId === response.questionId)
        .filter(x => hasValidResponse(x, response.responseText));

      if (matchingItems.length === 0) {
        logger.warn('cannot match submission response with any item', debugData, response);
        return all;
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

  importResponsesForClient(clientId, clientSchema, surveyorId) {
    const submissions = this.hmisClient.api('survey').getClientsSurveySubmissions(clientId);
    logger.info(`importing ${submissions.length} submissions for client ${clientId} ${clientSchema}`);
    eachLimit(submissions, Meteor.settings.connectionLimit,
      (submission, done) => {
        const { surveyId, submissionId } = submission;
        logger.debug(`importing submission ${submissionId} in survey ${surveyId}`);
        const surveyDefinitionItems = this.getSurveyDefinitionItems(surveyId);
        Meteor.defer(() => {
          if (this.responsesCollection.findOne(submissionId)) {
            logger.debug(`submission ${submissionId} skipped, already imported`);
          } else {
            const submissionResponses = this.hmisClient.api('survey')
              .getSubmissionResponses(clientId, surveyId, submissionId);
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
              values,
            };
            this.responsesCollection.insert(doc);
            logger.debug(`submission ${submissionId} imported`);
          }
          done();
        });
      });
  }
}
