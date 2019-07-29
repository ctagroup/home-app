/**
 * Created by pgorecki on 09.04.17.
 */

// Run tests with: meteor test --driver-package practicalmeteor:mocha --port 4000

import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { ClientFlags } from './clientFlags';


describe('api/clientFlags', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('pending client can be added to a collection', () => {
    ClientFlags.insert({
      firstName: 'John',
      lastName: 'Doe',
    });
    chai.assert.equal(ClientFlags.find().count(), 1);
  });
  /*
  it('adding pending client without a first name will throw an error', () => {
    chai.assert.throws(() => {
      ClientFlags.insert({
        lastName: 'Doe',
      });
    }, Error);
  });
  */
});
