import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import Agencies from './agencies';

describe('api/agencies', () => {
  beforeEach(() => {
    resetDatabase();
    Agencies.insert({
      _id: 'agency1',
      agencyName: 'Agency 1',
      members: ['user1'],
      projects: ['projectA1', 'projectB1'],
      projectsMembers: [
        { projectId: 'projectA1', userId: 'user1' },
      ],
    });
  });

  it('will not find agency whereUserCanAccessProject if project is not in projectsMembers', () => {
    const agencies = Agencies.whereUserCanAccessProject('user1', 'non-existing');
    chai.assert.equal(agencies.length, 0);
  });

  it('will find agency whereUserCanAccessProject if project is in projectsMembers', () => {
    const agencies = Agencies.whereUserCanAccessProject('user1', 'projectA1');
    chai.assert.equal(agencies.length, 1);
  });

  it('will find oneWhereUserHasActiveProject', () => {
    const agency = Agencies.oneWhereUserHasActiveProject('user1', 'projectA1');
    chai.assert.equal(agency._id, 'agency1');
  });

  it('will not find oneWhereUserHasActiveProject', () => {
    const agency = Agencies.oneWhereUserHasActiveProject('user1', 'projectB1');
    chai.assert.equal(agency, null);
  });
});
