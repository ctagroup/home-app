import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com/hmis-globalapi/rest';

export class GlobalApi extends ApiEndpoint {
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
