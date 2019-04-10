import moment from 'moment';
import querystring from 'querystring';
import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/hmis-clientapi/rest';
const DEFAULT_PROJECT_SCHEMA = 'v2017';

export const ALL_CLIENT_SCHEMAS = ['v2014', 'v2015', 'v2016', 'v2017'];

export class ClientApi extends ApiEndpoint {
  postData(relativeUrl, data) {
    const url = relativeUrl.startsWith('/') ?
      `${BASE_URL}${relativeUrl}` : `${BASE_URL}/${relativeUrl}`;
    return this.doPost(url, data);
  }

  putData(relativeUrl, data) {
    const url = relativeUrl.startsWith('/') ?
      `${BASE_URL}${relativeUrl}` : `${BASE_URL}/${relativeUrl}`;
    return this.doPut(url, data);
  }

  getClient(clientId, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}`;
    const client = this.doGet(url).client;

    // TODO: remove .trim() when api returns the data without space-padding
    return {
      ...client,
      firstName: client.firstName ? client.firstName.trim() : '',
      middleName: client.middleName ? client.middleName.trim() : '',
      lastName: client.lastName ? client.lastName.trim() : '',
      nameSuffix: client.nameSuffix ? client.nameSuffix.trim() : '',
    };
  }

  getClients(schema = DEFAULT_PROJECT_SCHEMA, start = 0, limit = 9999) {
    const schemaPath = schema ? `/${schema}` : '';
    const url = `${BASE_URL}${schemaPath}/clients?startIndex=${start}&limit=${limit}`;
    const { clients, pagination } = this.doGet(url).Clients;
    const remaining = limit - pagination.returned;
    if (remaining > 0 && pagination.returned > 0) {
      return [
        ...clients,
        ...this.getClients(schema, pagination.from + pagination.returned, remaining),
      ];
    }
    return clients;
  }

  getAllClients(start = 0, limit = 9999) {
    const data =
      ALL_CLIENT_SCHEMAS.map((schema) => {
        try {
          return this.getClients(schema, start, limit);
        } catch (e) {
          return [];
        }
      });
    return _.flatten(data);
  }

  getNumberOfClients(schema) {
    const url = `${BASE_URL}/${schema}/clients?startIndex=0&limit=1`;
    const { pagination } = this.doGet(url).Clients;
    return pagination.total;
  }

  createClient(client, schema) {
    const dob = moment(client.dob);
    const body = {
      client: {
        firstName: client.firstName,
        middleName: client.middleName,
        lastName: client.lastName,
        nameSuffix: client.suffix,
        nameDataQuality: 1,
        ssn: client.ssn,
        ssnDataQuality: 1,
        dob: dob.isValid() ? dob.format('x') : 0,
        dobDataQuality: dob.isValid() ? 1 : 0,
        race: client.race,
        ethnicity: client.ethnicity,
        gender: client.gender,
        // Putting otherGender as null. Confirmed with Javier. Because it's of no use as of now.
        otherGender: 'null',
        veteranStatus: client.veteranStatus,
        disablingConditions: client.disablingConditions,
        sourceSystemId: client._id || '',
        phoneNumber: client.phoneNumber,
        emailAddress: client.emailAddress,
      },
    };

    const url = `${BASE_URL}/${schema}/clients`;
    const { clientId, dedupClientId } = this.doPost(url, body).client;
    return {
      clientId,
      dedupClientId,
      schema,
    };
  }

  updateClient(clientId, client, schema) {
    const dob = moment(client.dob);
    const body = {
      client: {
        firstName: client.firstName,
        middleName: client.middleName,
        lastName: client.lastName,
        nameSuffix: client.suffix,
        nameDataQuality: 1,
        ssn: client.ssn,
        ssnDataQuality: 1,
        dob: dob.isValid() ? dob.format('x') : 0,
        dobDataQuality: dob.isValid() ? 1 : 0,
        race: client.race,
        ethnicity: client.ethnicity,
        gender: client.gender,
        // Putting otherGender as null. Confirmed with Javier. Because it's of no use as of now.
        otherGender: 'null',
        veteranStatus: client.veteranStatus,
        disablingConditions: client.disablingConditions,
        sourceSystemId: clientId,
        // sourceSystemId: client._id,
        phoneNumber: client.phoneNumber,
        emailAddress: client.emailAddress,
      },
    };

    const url = `${BASE_URL}/${schema}/clients/${clientId}`;
    const result = this.doPut(url, body);
    return result;
  }

  deleteClient(clientId, schema) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}`;
    return this.doDel(url);
  }

  getClientFromUrl(apiUrl) {
    return this.doGet(`https://www.hmislynk.com${apiUrl}`).client;
  }

  searchClient(query, limit = 50, startIndex = 0, sort = 'firstName', order = 'asc') {
    const params = {
      q: query,
      maxItems: limit,
      sort,
      startIndex,
      order, // asc-desc
    };
    const url = `${BASE_URL}/search/client?${querystring.stringify(params)}`;
    return this.doGet(url).searchResults.items;
  }

  getClientEnrollment(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}?includeChildLinks=true`; // eslint-disable-line max-len
    // return this.doGet(url).enrollments.enrollments;
    return this.doGet(url).enrollment;
  }

  getClientEnrollments(clientId, schema = DEFAULT_PROJECT_SCHEMA, start = 0, limit = 9999) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).enrollments.enrollments;
  }

  getClientsEnrollmentExits(clientId, enrollmentId, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/exits`; // eslint-disable-line max-len
    return this.doGet(url).exits.exits;
  }

  updateClientEnrollment(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, data) {
    // TODO: verify data format
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}`;
    return this.doPut(url, data).enrollment;
  }

  removeClientEnrollment(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}`;
    return this.doDel(url);
  }

  /**
   * Enrollment Cocs:
   */
  getEnrollmentCocs(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/enrollmentcocs?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).enrollmentCocs.enrollmentCocs;
  }

  getEnrollmentCoc(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, enrollmentCocId) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/enrollmentcocs/${enrollmentCocId}`; // eslint-disable-line max-len
    return this.doGet(url).enrollmentCoc;
  }

  createEnrollmentCoc(enrollmentCoc, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/enrollmentcocs`; // eslint-disable-line max-len
    const body = { enrollmentCoc };
      // {
      //   "informationDate": "string",
      //   "dataCollectionStage": 0,
      //   "cocCode": "string"
      // }
    return this.doPost(url, body).enrollmentCoc;
  }

  removeEnrollmentCoc(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, enrollmentCocId) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/enrollmentcocs/${enrollmentCocId}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  /**
   * Enrollment Disabilities:
   */
  getEnrollmentDisabilities(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/disabilities?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).disabilitiesList.disabilitiesList;
  }

  getEnrollmentDisability(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, disabilityId) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/disabilities/${disabilityId}`; // eslint-disable-line max-len
    return this.doGet(url).disabilities;
  }

  createEnrollmentDisability(disabilities, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/disabilities`; // eslint-disable-line max-len
    const body = { disabilities };
    return this.doPost(url, body).disabilities;
  }

  removeEnrollmentDisability(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, disabilityId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/disabilities/${disabilityId}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  /**
   * Enrollment Domestic Violences:
   */
  getEnrollmentDomesticViolences(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/domesticviolences?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).domesticviolences.domesticviolences;
  }

  getEnrollmentDomesticViolence(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, domesticviolenceId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/domesticviolences/${domesticviolenceId}`; // eslint-disable-line max-len
    return this.doGet(url).domesticviolences;
  }

  createEnrollmentDomesticViolence(domesticviolence, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/domesticviolences`; // eslint-disable-line max-len
    const body = { domesticviolence };
    return this.doPost(url, body).domesticviolences;
  }

  removeEnrollmentDomesticViolence(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, domesticviolenceId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/domesticviolences/${domesticviolenceId}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  /**
   * Enrollment Employments:
   */
  getEnrollmentEmployments(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/employments?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).employments.employments;
  }

  getEnrollmentEmployment(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, employmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/employments/${employmentId}`; // eslint-disable-line max-len
    return this.doGet(url).employments;
  }

  createEnrollmentEmployment(employment, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/employments`; // eslint-disable-line max-len
    const body = { employment };
    return this.doPost(url, body).employments;
  }

  removeEnrollmentEmployment(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, employmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/employments/${employmentId}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  /**
   * Enrollment Exits:
   */
  getEnrollmentExits(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/exits?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).exits.exits;
  }

  getEnrollmentExit(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, exitId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/exits/${exitId}`; // eslint-disable-line max-len
    return this.doGet(url).exits;
  }

  createEnrollmentExit(exit, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/exits`; // eslint-disable-line max-len
    const body = { exit };
    return this.doPost(url, body).exits;
  }

  removeEnrollmentExit(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, exitId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/exits/${exitId}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  /**
   * Enrollment Health Insurances:
   */
  getEnrollmentHealthInsurances(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthinsurances?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).healthinsurances.healthinsurances;
  }

  getEnrollmentHealthInsurance(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, healthinsuranceid) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthinsurances/${healthinsuranceid}`; // eslint-disable-line max-len
    return this.doGet(url).healthinsurances;
  }

  createEnrollmentHealthInsurance(healthinsurance, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthinsurances`; // eslint-disable-line max-len
    const body = { healthinsurance };
    return this.doPost(url, body).healthinsurances;
  }

  removeEnrollmentHealthInsurance(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, healthinsuranceid) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthinsurances/${healthinsuranceid}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  /**
   * Enrollment Health Statuses:
   */
  getEnrollmentHealthStatuses(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthstatuses?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).healthstatuses.healthstatuses;
  }

  getEnrollmentHealthStatus(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, healthstatusid) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthstatuses/${healthstatusid}`; // eslint-disable-line max-len
    return this.doGet(url).healthstatuses;
  }

  createEnrollmentHealthStatus(healthstatus, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthstatuses`; // eslint-disable-line max-len
    const body = { healthstatus };
    return this.doPost(url, body).healthstatuses;
  }

  removeEnrollmentHealthStatus(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, healthstatusid) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/healthstatuses/${healthstatusid}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  /**
   * Enrollment Medical Assistances:
   */
  getEnrollmentMedicalAssistances(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, start = 0, limit = 9999) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/medicalassistances?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).medicalassistances.medicalassistances;
  }

  getEnrollmentMedicalAssistance(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, medicalassistanceid) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/medicalassistances/${medicalassistanceid}`; // eslint-disable-line max-len
    return this.doGet(url).medicalassistances;
  }

  createEnrollmentMedicalAssistance(medicalassistance, clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/medicalassistances`; // eslint-disable-line max-len
    const body = { medicalassistance };
    return this.doPost(url, body).medicalassistances;
  }

  removeEnrollmentMedicalAssistance(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId, medicalassistanceid) { // eslint-disable-line max-len
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/medicalassistances/${medicalassistanceid}`; // eslint-disable-line max-len
    return this.doDel(url);
  }

  createProjectSetup(projectName, projectCommonName, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/projects`;
    const body = {
      project: {
        projectName,
        projectCommonName,
        continuumProject: 0,
        projectType: 14, // Coordinated Assessment
        residentialAffiliation: 0,
        targetPopulation: 4,  // NA - Not Applicable
        trackingMethod: 0,
      },
    };
    return this.doPost(url, body).project.projectId;
  }

  getProjects(schema = DEFAULT_PROJECT_SCHEMA, start = 0, limit = 9999) {
    const url = `${BASE_URL}/${schema}/projects?startIndex=${start}&maxItems=${limit}`;
    return this.doGet(url).projects.projects;
  }

  getProject(projectId, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/projects/${projectId}`;
    return this.doGet(url).project;
  }

  createProject(project, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/projects`;
    return this.doPost(url, { project });
  }

  updateProject(projectId, project, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/projects/${projectId}`;
    return this.doPut(url, { project });
  }

  deleteProject(projectId, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/projects/${projectId}`;
    return this.doDel(url);
  }

  postQuestionAnswer(category, data) {
    const url = `${BASE_URL}/${category}`;
    return this.doPost(url, data);
  }

  getHudQuestions(schema) {
    const url = `${BASE_URL}/${schema}/questions`;
    return this.doGet(url);
  }
  // 4c1f2271-e836-4e0d-99ed-e9ffcdbe87f0
  getQuestions(schema = DEFAULT_PROJECT_SCHEMA, start = 0, limit = 9999) {
    const url = `${BASE_URL}/${schema}/questions?startIndex=${start}&maxItems=${limit}`;
    return this.doGet(url).questions.questions;
  }
  getV2Questions(schema = DEFAULT_PROJECT_SCHEMA, start = 0, limit = 9999) {
    const url = `${BASE_URL}/${schema}/v2/questions?startIndex=${start}&maxItems=${limit}`;

    const { pagination, questions } = this.doGet(url).questions;
    const remaining = limit - pagination.returned;
    if (remaining > 0 && pagination.returned > 0) {
      return [
        ...questions,
        ...this.getV2Questions(schema, pagination.from + pagination.returned, remaining),
      ];
    }
    return questions;
  }
}

HmisApiRegistry.addApi('client', ClientApi);
