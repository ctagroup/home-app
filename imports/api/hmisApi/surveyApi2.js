import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/survey-api/rest/v2';

export class SurveyApi2 extends ApiEndpoint {
  getSurveys(start = 0, limit = 9999) {
    const url = `${BASE_URL}/surveys?startIndex=${start}&limit=${limit}`;
    return this.doGet(url).survies;
  }

  createSurvey(survey) {
    const hmisUserData = Meteor.user().services.HMIS;
    const url = `${BASE_URL}/surveys`;
    // TODO: move doc transformation to the caller
    const body = {
      survey: {
        surveyTitle: survey.title,
        surveyOwner: hmisUserData.accountId,
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
        surveyOwner: hmisUserData.accountId,
        tagValue: 'SINGLE_ADULT', // TODO: ???
        surveyDefinition: survey.definition,
      },
    };
    return this.doPut(url, body);
  }

  getQuestions(groupId, start = 0, limit = 9999) {
    const url = `${BASE_URL}/questiongroups/${groupId}/questions?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line
    const { pagination, questions } = this.doGet(url).questions;
    const remaining = limit - pagination.returned;
    if (remaining > 0 && pagination.returned > 0) {
      return [
        ...questions,
        ...this.getQuestions(groupId, pagination.from + pagination.returned, remaining),
      ];
    }
    return questions;
  }

  getQuestionsCount(groupId) {
    const url = `${BASE_URL}/questiongroups/${groupId}/questions?startIndex=0&maxItems=1`; // eslint-disable-line
    return this.doGet(url).questions.pagination.total;
  }

  createQuestion(questionGroupId, question) {
    const url = `${BASE_URL}/questiongroups/${questionGroupId}/questions`;
    const body = { question };
    return this.doPost(url, body).question;
  }

}


HmisApiRegistry.addApi('survey2', SurveyApi2);
