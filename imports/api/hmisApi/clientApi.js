import moment from 'moment';
import querystring from 'querystring';
import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/hmis-clientapi/rest';

export class ClientApi extends ApiEndpoint {

  getClient(clientId, schema = 'v2015') {
    const url = `${BASE_URL}/${schema}/clients/${clientId}`;
    return this.doGet(url).client;
  }

  getClients() {
    const url = `${BASE_URL}/clients`;
    return this.doGet(url).Clients.clients;
  }

  createClient(client, schema = 'v2015') {
    const body = {
      client: {
        firstName: client.firstName,
        middleName: client.middleName,
        lastName: client.lastName,
        nameSuffix: client.suffix,
        nameDataQuality: 1,
        ssn: client.ssn,
        ssnDataQuality: 1,
        dob: moment(client.dob).format('x'),
        dobDataQuality: 1,
        race: client.race,
        ethnicity: client.ethnicity,
        gender: client.gender,
        // Putting otherGender as null. Confirmed with Javier. Because it's of no use as of now.
        otherGender: 'null',
        veteranStatus: client.veteranStatus,
        disablingConditions: client.disablingConditions,
        sourceSystemId: client._id,
        phoneNumber: client.phoneNumber,
        emailAddress: client.emailAddress,
      },
    };

    const url = `${BASE_URL}/${schema}/clients`;
    return this.doPost(url, body).client.clientId;
  }

  updateClient(clientId, client, schema = 'v2015') {
    const body = {
      client: {
        firstName: client.firstName,
        middleName: client.middleName,
        lastName: client.lastName,
        nameSuffix: client.suffix,
        nameDataQuality: 1,
        ssn: client.ssn,
        ssnDataQuality: 1,
        dob: moment(client.dob).format('x'),
        dobDataQuality: 1,
        race: client.race,
        ethnicity: client.ethnicity,
        gender: client.gender,
        // Putting otherGender as null. Confirmed with Javier. Because it's of no use as of now.
        otherGender: 'null',
        veteranStatus: client.veteranStatus,
        disablingConditions: client.disablingConditions,
        sourceSystemId: client._id,
        phoneNumber: client.phoneNumber,
        emailAddress: client.emailAddress,
      },
    };

    const url = `${BASE_URL}/${schema}/clients/${clientId}`;
    const result = this.doPut(url, body);
    return result;
  }

  getClientFromUrl(apiUrl) {
    return this.doGet(`https://www.hmislynk.com${apiUrl}`).client;
  }

  searchClient(query, limit = 10) {
    const params = {
      q: query,
      maxItems: limit,
      sort: 'firstName',
      order: 'asc',
    };
    const url = `${BASE_URL}/search/client?${querystring.stringify(params)}`;
    return this.doGet(url).searchResults.items;
  }

  getClientEnrollments(clientId, schema = 'v2015', start = 0, limit = 9999) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).enrollments.enrollments;
  }

  getClientsEnrollmentExits(clientId, enrollmentId, schema = 'v2015') {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/exits`; // eslint-disable-line max-len
    return this.doGet(url).exits.exits;
  }

  createProjectSetup(projectName, projectCommonName, schema = 'v2015') {
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

  getProjects(schema = 'v2015', start = 0, limit = 9999) {
    const url = `${BASE_URL}/${schema}/projects?startIndex=${start}&maxItems=${limit}`;
    return this.doGet(url).projects.projects;
  }

  getProject(projectId, schema = 'v2015') {
    const url = `${BASE_URL}/${schema}/projects/${projectId}`;
    return this.doGet(url).project;
  }

  postQuestionAnswer(category, data) {
    const url = `${BASE_URL}/${category}`;
    return this.doPost(url, data);
  }
}

HmisApiRegistry.addApi('client', ClientApi);
