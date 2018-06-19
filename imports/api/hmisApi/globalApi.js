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

  createClientConsent(clientId, consentGroupId, globalProjectIds,
    durationInSeconds, startTimestamp) {
    const startTime = startTimestamp || Math.floor(Date.now() / 1000);
    const url = `${BASE_URL}/clients/${clientId}/consents`;
    const body = {
      consent: {
        clientId,
        startTime,
        endTime: startTime + durationInSeconds,
        consentGroupId,
        globalProjects: globalProjectIds.map(id => ({ id })),
      },
    };
    const consentId = this.doPost(url, body);
    return consentId;
  }

  getClientConsents(clientId) {
    const url = `${BASE_URL}/clients/${clientId}/consents`;
    const { consents } = this.doGet(url).consents;
    return consents;
  }

  updateClientConsent(clientId, consentId, globalProjects) {
    const url = `${BASE_URL}/clients/${clientId}/consents/${consentId}/projects`;
    const data = {
      globalProjects: {
        globalProjects: globalProjects.map(id => ({ id })),
      },
    };
    this.doPut(url, data);
  }

  searchConsents(consentGroupId, start = 0, limit = 9999) {
    const url = `${BASE_URL}/search/consents?consentGroupId=${consentGroupId}&startIndex=${start}&maxItems=${limit}`; // eslint-disable-line
    const { pagination, consents } = this.doGet(url).consents;
    const remaining = limit - pagination.returned;
    if (remaining > 0 && pagination.returned > 0) {
      return [
        ...consents,
        ...this.searchConsents(consentGroupId, pagination.from + pagination.returned, remaining),
      ];
    }
    return consents;
  }
}

HmisApiRegistry.addApi('global', GlobalApi);

