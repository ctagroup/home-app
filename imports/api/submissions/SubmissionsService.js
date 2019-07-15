import { itemsToArray, getQuestionItemOptions } from '/imports/api/surveys/computations';

function hasValidResponse(item, value) {
  if (item.category === 'select' || item.category === 'choice') {
    const options = getQuestionItemOptions(item);
    return !!options[value];
  }
  return true;
}

export default class SubmissionsService {
  constructor({ hmisClient, logger }) {
    this.logger = logger;
    this.hmisClient = hmisClient;
  }

  importSubmissionAsResponse(submissionResponses, survey) {
    const surveyItems = survey.definition ? itemsToArray(survey.definition) : [];
    const responses = this.matchSubmissionResponsesToSurveyItems(
      submissionResponses, surveyItems);
    return responses;
  }

  matchSubmissionResponsesToSurveyItems(submissionResponses, surveyItems) {
    const valid = [];
    const invalid = [];
    submissionResponses.forEach(response => {
      if (!response.questionId) {
        this.logger.warn('submissionResponse without questionId, skipping', response);
        invalid.push({
          value: response.responseText,
          error: 'response to non exiting question',
          response,
        });
        return;
      }

      const matchingItems = surveyItems
        .filter(x => x.hmisId === response.questionId)
        .filter(x => hasValidResponse(x, response.responseText));

      if (matchingItems.length === 0) {
        invalid.push({
          value: response.responseText,
          error: 'question not found in this survey',
          response,
        });
        return;
      }

      valid.push({
        itemId: matchingItems[0].id,
        value: response.responseText,
        response,
      });
    });

    return { valid, invalid };
  }
}
