import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/survey-api/rest/v2';

export class SurveyApi2 extends ApiEndpoint {
  createSurvey(survey) {
    const hmisUserData = Meteor.user().services.HMIS;
    console.log('aaa', hmisUserData.id);
    const url = `${BASE_URL}/surveys`;
    const body = {
      survey: {
        surveyTitle: survey.title,
        surveyOwner: hmisUserData.id,
        tagValue: 'SINGLE_ADULT', // TODO: ???
        surveyDefinition: survey.definition,
      },
    };
    return this.doPost(url, body).survey;
  }

}
HmisApiRegistry.addApi('survey2', SurveyApi2);
