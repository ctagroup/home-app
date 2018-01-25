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
    const body = {
      notification: {
        method: 'EMAIL',
        data: {
          recipients: {
            toRecipients: [
              email.recipient,
            ],
            bccRecipients: [],
            ccRecipients: [],
          },
          subject: email.title,
          body: email.body,
          priority: 1,
        },
        additionalInfo,
      },
    };
    const result = this.doPost(url, body);
    console.log(result);
    return result;
  }
}

HmisApiRegistry.addApi('global', GlobalApi);
