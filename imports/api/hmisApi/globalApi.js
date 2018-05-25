// API documentation:
// https://hmis-api.github.io/global-api/

import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/hmis-globalapi/rest';

export class GlobalApi extends ApiEndpoint {
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

  createClientConsent(clientId, globalProjectId, durationInDays = 30) {
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const durationInSeconds = durationInDays * 24 * 3600;
    const url = `${BASE_URL}/clients/${clientId}/consents`;
    const body = {
      consent: {
        clientId,
        startTime: nowTimestamp,
        endTime: nowTimestamp + durationInSeconds,
        globalProjects: [
          { id: globalProjectId },
        ],
      },
    };
    const consentId = this.doPost(url, body);
    return consentId;
  }

  getClientConsents(clientId) {
    const url = `${BASE_URL}/clients/${clientId}/consents`;
    return this.doGet(url).consents.consents;
  }
}

HmisApiRegistry.addApi('global', GlobalApi);
