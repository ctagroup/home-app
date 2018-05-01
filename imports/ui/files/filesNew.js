import Files from '/imports/api/files/files';
import './filesForm.js';
import './filesNew.html';

Template.filesNew.helpers({
  collection() {
    return Files;
  },
  doc() {
    return {
      clientId: this.client.clientId,
      clientSchema: this.client.schema,
    };
  },
  schema() {
    return Files.schema;
  },
});
