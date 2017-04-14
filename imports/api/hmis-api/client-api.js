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
        sourceSystemId: client._id,
        phoneNumber: client.phoneNumber,
        emailAddress: client.emailAddress,
      },
    };

    const url = `${BASE_URL}/${schema}/clients`;
    return this.doPost(url, body).client.clientId;
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

  getProjectsForPublish() {
    throw new Error('Not yet implemented');
  }

  getProjectForPublish() {
    throw new Error('Not yet implemented');
  }

  postQuestionAnswer() {
    throw new Error('Not yet implemented');
  }
}

HmisApiRegistry.addApi('client', ClientApi);
