import moment from 'moment';
import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

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

  getClientFromUrl() {
    throw new Error('Not yet implemented');
  }

  searchClient() {
    throw new Error('Not yet implemented');
  }

  getEnrollmentsForPublish() {
    throw new Error('Not yet implemented');
  }

  getEnrollmentExitsForPublish() {
    throw new Error('Not yet implemented');
  }

  createProjectSetup() {
    throw new Error('Not yet implemented');
  }

  getProjects() {
    const url = `${BASE_URL}/v2015/projects?startIndex=0&maxItems=10000`;
    return this.doGet(url).projects.projects;
  }

  getProject(projectId, schema = 2015) {
    const url = `${BASE_URL}/${schema}/projects/${projectId}`;
    return this.doGet(url).project;
  }

  postQuestionAnswer() {
    throw new Error('Not yet implemented');
  }
}

HmisApiRegistry.addApi('client', ClientApi);
