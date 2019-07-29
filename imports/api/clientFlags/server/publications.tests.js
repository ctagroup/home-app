/* eslint prefer-arrow-callback: "off", func-names: "off" */

import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { ClientFlags } from '../clientFlags';
import './publications';

describe('clients', function () {
  beforeEach(() => {
    resetDatabase();
  });

  describe('publications', function () {
    /*
    it('lists 0 clients if user is not authenticated', function (done) {
      ClientFlags.insert({
        firstName: 'client1',
        lastName: 'client1',
      });
      const collector = new PublicationCollector({ userId: undefined });
      collector.collect('clientFlags.all', (collections) => {
        chai.assert.typeOf(collections.clients, 'undefined');
        done();
      });
    });
    */
  });
  it('lists clients if user is authenticated', function (done) {
    ClientFlags.insert({
      firstName: 'client1',
      lastName: 'client1',
    });
    const collector = new PublicationCollector({ userId: 'some-id' });
    collector.collect('clientFlags.all', (collections) => {
      chai.assert.typeOf(collections.clients, 'array');
      chai.assert.equal(collections.clients.length, 1);
      done();
    });
  });
});
