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

  getClients() {
    const url = `${BASE_URL}/clients`;
    return this.doGet(url).Clients.clients;
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
        sourceSystemId: client._id,
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

  // createClientEnrollment(clientId, schema = DEFAULT_PROJECT_SCHEMA) {
  //   const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments`;
  //   // TODO [VK]: replace with real data:
  //   const body = {
  //     continuouslyhomelessoneyear: 1,
  //     disablingcondition: 0,
  //     entrydate: 1459517941736,
  //     householdid: 'eca19be3-303b-47b0-a9ef-8832ab0fa13d',
  //     housingstatus: 3,
  //     monthshomelesspastthreeyears: 7,
  //     monthshomelessthistime: 1,
  //     otherresidenceprior: '1',
  //     personalid: 'ba0ce84a-412e-4f3b-ae93-b903eb349754',
  //     projectentryid: 'a70b3fe4-1e0f-4288-835f-d88dacd2b84c',
  //     projectid: 'c7c41281-411b-4c93-a382-2cb20bc24a34',
  //     relationshiptohoh: 2,
  //     residenceprior: 2,
  //     residencepriorlengthofstay: 4,
  //     statusdocumented: 1,
  //     timeshomelesspastthreeyears: 1,
  //     yearshomeless: 2,
  //     entryfromstreetessh: 2,
  //     datetostreetessh: 1,
  //   };
  //   console.log('url, body', url, body);
  //   // return this.doPost(url, body).enrollment;
  //   return;
  // }

  getClientEnrollment(clientId, schema = DEFAULT_PROJECT_SCHEMA, enrollmentId) {
    const url = `${BASE_URL}/${schema}/clients/${clientId}/enrollments/${enrollmentId}`; // eslint-disable-line max-len
    return this.doGet(url).enrollments.enrollments;
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
