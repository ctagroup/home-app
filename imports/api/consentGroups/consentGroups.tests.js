import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { loadConsentGroupsFixtures } from '/imports/__tests__/fixtures/consentGroups';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';


describe('api/consentGroups', () => {
  beforeEach(() => {
    resetDatabase();
    loadConsentGroupsFixtures();
  });

  it('will return all projects for a consent group with one agency', () => {
    const cg = ConsentGroups.findOne('cg2');
    const projects = cg.getAllProjects();
    expect(projects).to.deep.equal(['projectA2', 'projectB2']);
  });

  it('will return all projects for a consent group with many agencies', () => {
    const cg = ConsentGroups.findOne('cg5-6');
    const projects = cg.getAllProjects();
    expect(projects).to.deep.equal(['projectA5', 'projectA6']);
  });
});
