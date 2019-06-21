// API documentation:
// https://hmis-api.github.io/global-api/

import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/hmis-globalapi/rest';

export class GlobalApi extends ApiEndpoint {
  getClientVersions(dedupClientId) {
    const url = `${BASE_URL}/clients/${dedupClientId}`;
    const { clients } = this.doGet(url).clients;
    return clients.map(client => ({
      ...client,
      schema: client.link.split('/')[3],
    }));
  }

  getClientEnrollments(dedupClientId, start = 0, limit = 9999) {
    const options = `?startIndex=${start}&limit=${limit}`;
    const url = `${BASE_URL}/clients/${dedupClientId}/global-enrollments${options}`;
    const { pagination, globalEnrollments } = this.doGet(url).globalEnrollments;
    const remaining = limit - pagination.returned;
    if (remaining > 0 && pagination.returned > 0) {
      const startFrom = pagination.from + pagination.returned;
      return [
        ...globalEnrollments,
        ...this.getClientEnrollments(dedupClientId, startFrom, remaining),
      ];
    }
    return globalEnrollments;
  }

  getClientEnrollment(dedupClientId, globalEnrollmentId) {
    const url = `${BASE_URL}/clients/${dedupClientId}/global-enrollments/${globalEnrollmentId}`;
    return this.doGet(url).globalEnrollment;
  }

  createClientEnrollment(dedupClientId, enrollments) {
    const url = `${BASE_URL}/clients/${dedupClientId}/global-enrollments`;
    // enrollments example:
    // [{
    //   enrollmentId: '637fbfbb-e75c-49f1-900f-1aa0015aefab',
    //   source: '2016',
    //   clientId: '6bf95840-8567-469b-9efe-8c6351294e55',
    // }]
    const body = {
      globalEnrollment: {
        enrollments: {
          enrollments,
        },
      },
    };
    return this.doPost(url, body).globalEnrollment;
  }

  getGlobalProjects(start = 0, limit = 9999) {
    const url = `${BASE_URL}/global-projects?startIndex=${start}&maxItems=${limit}`;
    const { pagination, globalProjects } = this.doGet(url).globalProjects;
    const mapped = globalProjects.map((project) => (
      {
        ...project,
        projects: project.projects.projects,
      }
    ));
    const remaining = limit - pagination.returned;
    if (remaining > 0 && pagination.returned > 0) {
      return [
        ...mapped,
        ...this.getGlobalProjects(pagination.from + pagination.returned, remaining),
      ];
    }
    return mapped;
  }

  getNotifications() {
    const url = `${BASE_URL}/notifications`;
    return this.doGet(url);
  }
  sendEmailNotification(email, additionalInfo = {}) {
    const url = `${BASE_URL}/notifications`;

    const { recipient, ccRecipient, bccRecipient } = email;
    const recipients = {};
    if (recipient) {
      recipients.toRecipients = recipient.split(',');
    }
    if (ccRecipient) {
      recipients.ccRecipients = ccRecipient.split(',');
    }
    if (bccRecipient) {
      recipients.bccRecipients = bccRecipient.split(',');
    }

    const body = {
      notification: {
        method: 'EMAIL',
        data: {
          recipients,
          subject: email.title,
          body: email.body,
          priority: 1,
        },
        additionalInfo,
      },
    };
    const result = this.doPost(url, body);
    return result;
  }
}

HmisApiRegistry.addApi('global', GlobalApi);
