/* eslint prefer-arrow-callback: "off", func-names: "off" */

import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai } from 'meteor/practicalmeteor:chai';
import { PendingClients } from '../pending-clients';
import './publications';

describe('clients', function () {
  describe('publications', function () {
    it('lists 0 clients if user is not authenticated', function (done) {
      PendingClients.insert({
        firstName: 'client1',
        lastName: 'client1',
      });
      const collector = new PublicationCollector({ userId: 'some-id' });
      collector.collect('clients', (collections) => {
        chai.assert.typeOf(collections.clients, 'array');
        chai.assert.equal(collections.clients.length, 0);
        done();
      });
    });
  });
});
