import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/survey-api/rest';
const DEFAULT_GROUP_ID = '95bdca23-5135-4552-9f11-819cab1aaa45';

export class SurveyApi extends ApiEndpoint {

  createSurvey(survey) {
    const url = `${BASE_URL}/surveys`;
    const body = { survey };
    return this.doPost(url, body).survey;
  }

  updateSurvey(surveyId, survey) {
    const url = `${BASE_URL}/surveys/{surveyId}`;
    const body = { survey };
    return this.doPut(url, body);
  }

  createQuestion(question, groupId = DEFAULT_GROUP_ID) {
    const url = `${BASE_URL}/questiongroups/${groupId}/questions`;
    const body = { question };
    return this.doPost(url, body).question;
  }

  getQuestion(questionId, groupId = DEFAULT_GROUP_ID) {
    const url = `${BASE_URL}/questiongroups/${groupId}/questions/${questionId}`;
    return this.doGet(url).question;
  }

  updateQuestion(question, questionId, groupId = DEFAULT_GROUP_ID) {
    const url = `${BASE_URL}/questiongroups/${groupId}/questions/${questionId}`;
    const body = { question };
    return this.doPut(url, body);
  }

  deleteQuestion(questionId, groupId = DEFAULT_GROUP_ID) {
    const url = `${BASE_URL}/questiongroups/${groupId}/questions/${questionId}`;
    return this.doDel(url);
  }

  createPickListGroup(pickListGroup) {
    const url = `${BASE_URL}/picklistgroups`;
    const body = { pickListGroup };
    return this.doPost(url, body).pickListGroup;
  }

  deletePickListGroup(pickListGroupId) {
    const url = `${BASE_URL}/picklistgroups/${pickListGroupId}`;
    return this.doDel(url);
  }

  createPickListValues(pickListGroupId, pickListValues) {
    const url = `${BASE_URL}/picklistgroups/${pickListGroupId}/picklistvalues`;
    const body = { pickListValues };
    return this.doPost(url, body).pickListValues;
  }

  getSurveySections(surveyId) {
    const url = `${BASE_URL}/surveys/${surveyId}/surveysections`;
    return this.doGet(url).surveySections.surveySections;
  }

  createSurveySection(surveyId, surveySection) {
    const url = `${BASE_URL}/surveys/${surveyId}/surveysections`;
    const body = { surveySection };
    return this.doPost(url, body).surveySection;
  }

  updateSurveySection(surveySection, surveyId, sectionId) {
    const url = `${BASE_URL}/surveys/${surveyId}/surveysections/${sectionId}`;
    const body = { surveySection };
    return this.doPut(url, body);
  }

  deleteSurveySection(surveyId, sectionId) {
    const url = `${BASE_URL}/surveys/${surveyId}/surveysections/${sectionId}`;
    return this.doDel(url);
  }

  getQuestionMappings(surveyId, sectionId) {
    const url = `${BASE_URL}/surveys/${surveyId}/surveysections/${sectionId}/questions`;
    return this.doGet(url).sectionQuestionMappings.sectionQuestionMappings;
  }

  createQuestionMappings(surveyId, sectionId, sectionQuestionMappings) {
    const url = `${BASE_URL}/surveys/${surveyId}/surveysections/${sectionId}/questions`;
    const body = { sectionQuestionMappings };
    return this.doPost(url, body);
  }

  deleteQuestionMapping(surveyId, sectionId, questionId) {
    const url = `${BASE_URL}/surveys/${surveyId}/surveysections/${sectionId}/questions/${questionId}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  deleteQuestionMappings(surveyId, sectionId, questionIds) {
    questionIds.forEach(id => this.deleteQuestionMapping(surveyId, sectionId, id));
    return true;
  }

  createResponse(clientId, surveyId, responses) {
    // see: https://hmis-api.github.io/survey-service-api/#clients__clientid__surveys__surveyid__responses_post
    const url = `${BASE_URL}/clients/${clientId}/surveys/${surveyId}/responses`;
    const body = { responses: { responses } };
    return this.doPost(url, body).response;
  }

  updateResponse(clientId, surveyId, submissionId, responses) {
    const url = `${BASE_URL}/clients/${clientId}/surveys/${surveyId}/responses/${submissionId}`;
    const body = { responses: { responses } };
    return this.doPut(url, body).response;
  }

  deleteResponses(surveyId, clientId) {
    const url = `${BASE_URL}/clients/${clientId}/surveys/${surveyId}/responses`;
    return this.doDel(url);
  }

  createSectionScores(clientId, surveyId, sectionId, sectionScore) {
    const url = `${BASE_URL}/clients/${clientId}/surveys/${surveyId}/sections/${sectionId}/scores`;
    const body = { sectionScore };
    return this.doPost(url, body);
  }
  getSectionScores(clientId, surveyId, sectionId) {
    const url = `${BASE_URL}/clients/${clientId}/surveys/${surveyId}/sections/${sectionId}/scores`;
    return this.doGet(url);
  }

}

HmisApiRegistry.addApi('survey', SurveyApi);
