/**
 * Created by pgorecki on 09.04.17.
 */

// Run tests with: meteor test --driver-package practicalmeteor:mocha --port 4000

import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { PendingClients } from './pendingClients';


describe('api/pendingClients', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('pending client can be added to a collection', () => {
    PendingClients.insert({
      firstName: 'John',
      lastName: 'Doe',
    });
    chai.assert.equal(PendingClients.find().count(), 1);
  });

  it('adding pending client without a first name will throw an error', () => {
    chai.assert.throws(() => {
      PendingClients.insert({
        lastName: 'Doe',
      });
    }, Error);
  });
});
