import moment from 'moment';
import querystring from 'querystring';
import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/hmis-clientapi/rest';
const DEFAULT_PROJECT_SCHEMA = 'v2017';

export class ClientApi extends ApiEndpoint {

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
    const url =
      `${BASE_URL}/${schema}/clients?startIndex=${start}&maxItems=${limit}`;
    const { pagination, clients } = this.doGet(url).Clients;

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
      ['v2014', 'v2015', 'v2016', 'v2017'].map((schema) => {
        try {
          return this.getClients(schema, start, limit);
        } catch (e) {
          // logger.warn(e);
          console.log(e);
          return [];
        }
      });
    return _.flatten(data);
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
    return {
      clientId: this.doPost(url, body).client.clientId,
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

  getClientEnrollments(clientId, schema = DEFAULT_PROJECT_SCHEMA, start = 0, limit = 9999) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments?startIndex=${start}&maxItems=${limit}`; // eslint-disable-line max-len
    return this.doGet(url).enrollments.enrollments;
  }

  getClientsEnrollmentExits(clientId, enrollmentId, schema = DEFAULT_PROJECT_SCHEMA) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}/exits`; // eslint-disable-line max-len
    return this.doGet(url).exits.exits;
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
}

HmisApiRegistry.addApi('client', ClientApi);
