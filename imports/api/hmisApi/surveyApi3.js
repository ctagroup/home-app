import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://api.hslynk.com/survey-api/rest/v3';

export class SurveyApi3 extends ApiEndpoint {
  createSubmission(dedupclientid, surveyId, responses) {
    // 'https://api.hslynk.com/?urls.primaryName=Survey%20Service%20Api#/default/POST_v3-clients-dedupclientid-surveys-surveyid-responses
    const url = `${BASE_URL}/clients/${dedupclientid}/surveys/${surveyId}/responses`;
    const body = { responses: { responses } };
    console.log(responses);
    // return this.doPost(url, body).response;
  }
}

HmisApiRegistry.addApi('survey3', SurveyApi3);
