import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/hmis-globalapi/rest';

export class GlobalApi extends ApiEndpoint {
  getGlobalProjects(start = 0, limit = 9999) {
    const url = `${BASE_URL}/global-projects?startIndex=${start}&maxItems=${limit}`;
    const { pagination, globalProjects } = this.doGet(url).globalProjects;
    const remaining = limit - pagination.returned;
    if (remaining > 0 && pagination.returned > 0) {
      return [
        ...globalProjects,
        ...this.getGlobalProjects(pagination.from + pagination.returned, remaining),
      ];
    }
    return globalProjects;
  }

  getGlobalProject(id) {
    const url = `${BASE_URL}/global-projects/${id}`;
    const data = this.doGet(url).globalProject;
    return {
      ...data,
      projects: data.projects.projects,
    };
  }

  getGlobalProjectUsers(id) {
    const url = `${BASE_URL}/global-projects/${id}/users`;
    return this.doGet(url).users.users;
  }

  createGlobalProject(data) {
    const url = `${BASE_URL}/global-projects`;
    const result = this.doPost(url, {
      globalProject: data,
    });
    return result;
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
