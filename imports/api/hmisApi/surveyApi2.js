import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/survey-api/rest/v2';

const DEFAULT_GROUP_ID = '95bdca23-5135-4552-9f11-819cab1aaa45';

export class SurveyApi2 extends ApiEndpoint {
  createSurvey(survey) {
    const hmisUserData = Meteor.user().services.HMIS;
    const url = `${BASE_URL}/surveys`;
    // TODO: move doc transformation to the caller
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

  updateSurvey(surveyId, survey) {
    const hmisUserData = Meteor.user().services.HMIS;
    const url = `${BASE_URL}/surveys/${surveyId}`;
    const body = {
      survey: {
        surveyTitle: survey.title,
        surveyOwner: hmisUserData.id,
        tagValue: 'SINGLE_ADULT', // TODO: ???
        surveyDefinition: survey.definition,
      },
    };
    return this.doPut(url, body);
  }

}


HmisApiRegistry.addApi('survey2', SurveyApi2);
