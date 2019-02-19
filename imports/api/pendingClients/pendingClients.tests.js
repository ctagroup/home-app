import chai from 'chai';
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
});
