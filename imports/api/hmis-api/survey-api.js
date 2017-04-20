import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

const BASE_URL = 'https://www.hmislynk.com/survey-api/rest';

export class SurveyApi extends ApiEndpoint {
  createSectionScores() {
    throw new Error('Not yet implemented');
  }

  createSurveyServiceQuestions() {
    throw new Error('Not yet implemented');
  }

  updateSurveyServiceQuestion() {
    throw new Error('Not yet implemented');
  }

  getSurveyServiceQuestion() {
    throw new Error('Not yet implemented');
  }

  deleteSurveyServiceQuestion() {
    throw new Error('Not yet implemented');
  }

  deletePickListGroup() {
    throw new Error('Not yet implemented');
  }

  createPickListGroup() {
    throw new Error('Not yet implemented');
  }

  createPickListValues() {
    throw new Error('Not yet implemented');
  }

  createSurvey() {
    throw new Error('Not yet implemented');
  }

  createSection() {
    throw new Error('Not yet implemented');
  }

  createSurveyQuestionMappings() {
    throw new Error('Not yet implemented');
  }

  updateHmisSurvey() {
    throw new Error('Not yet implemented');
  }

  updateHmisSurveySection() {
    throw new Error('Not yet implemented');
  }

  getHmisSurveySections() {
    throw new Error('Not yet implemented');
  }

  getHmisSurveyQuestionMappings() {
    throw new Error('Not yet implemented');
  }

  deleteHmisSurveyQuestionMapping() {
    throw new Error('Not yet implemented');
  }

  deleteHmisSurveySection() {
    throw new Error('Not yet implemented');
  }

  deleteQuestionMappings() {
    throw new Error('Not yet implemented');
  }

  addResponseToHmis(clientId, surveyId, responses) {
    const url = `${BASE_URL}/clients/${clientId}/surveys/${surveyId}/responses`;
    const body = { responses };
    const response = this.doPost(url, body).response;
    console.debug('xxxx', response);
    return response;
  }

  deleteSurveyScores() {
    throw new Error('Not yet implemented');
  }
}

HmisApiRegistry.addApi('survey', SurveyApi);
