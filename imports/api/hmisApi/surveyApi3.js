import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';
// import { throws } from 'assert';

// const BASE_URL = 'https://api.hslynk.com/survey-api/rest/v3';

export class SurveyApi3 extends ApiEndpoint {}

HmisApiRegistry.addApi('survey3', SurveyApi3);
