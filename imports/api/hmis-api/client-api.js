import moment from 'moment';
import { ApiEndpoint, HmisApiRegistry } from './api-registry';

const CLIENT_BASE_URL = 'https://www.hmislynk.com/hmis-clientapi/rest';

export class ClientApi extends ApiEndpoint {

  getClient() {}

  getClients() {
    const url = `${CLIENT_BASE_URL}/clients/`;
    const headers = this.getRequestHeaders();
    let response;
    try {
      response = HTTP.get(url, { headers }).data;
    } catch (err) {
      this.throwApiError(url, headers, err);
    }
    return response.Clients.clients;
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

    const headers = this.getRequestHeaders();
    const url = `${CLIENT_BASE_URL}/${schema}/clients/`;

    let result = false;
    try {
      const response = HTTP.post(url, {
        data: body,
        headers,
      }).data;
      result = response.client.clientId;
    } catch (err) {
      this.throwApiError(url, headers, err);
    }
    return result;
  }

  getClientFromUrl() {}

  searchClient() {}

  getEnrollmentsForPublish() {}

  getEnrollmentExitsForPublish() {}

  createProjectSetup() {}
  getProjectsForPublish() {}
  getProjectForPublish() {}

  postQuestionAnswer() {}
}

HmisApiRegistry.addApi('client', ClientApi);
