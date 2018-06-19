import { Clients } from '/imports/api/clients/clients';
import Responses from '/imports/api/responses/responses';
import { canViewClient } from '/imports/api/consents/helpers';
import { AppController } from './controllers';


export const ClientConsentController = AppController.extend({
  onBeforeAction() {
    const client = Clients.findOne(this.params._id);
    console.log(client);
    if (client && client.consent && !canViewClient(client.consent.permission)) {
      this.redirect('viewClient', this.params, { query: this.params.query });
    }
    this.next();
  },
});


export const ResponseConsentController = AppController.extend({
  onBeforeAction() {
    const response = Responses.findOne(this.params._id);
    const client = Clients.findOne(response.clientId);
    console.log(response, client);
    if (client && client.consent && !canViewClient(client.consent.permission)) {
      this.redirect('viewClient', this.params, { query: this.params.query });
    }
    this.next();
  },
});
