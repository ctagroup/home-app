/**
 * Created by pgorecki on 09.04.17.
 */

// Run tests with: meteor test --driver-package practicalmeteor:mocha --port 4000

import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Clients } from './clients';


describe('api/clients', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('client can be added to a collection', () => {
    Clients.insert({
      firstName: 'John',
      lastName: 'Doe',
    });
    chai.assert.equal(Clients.find().count(), 1);
  });

  it('adding client without a first name will throw an error', () => {
    chai.assert.throws(() => {
      Clients.insert({
        lastName: 'Doe',
      });
    }, Error);
  });
});
