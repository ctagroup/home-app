/* eslint prefer-arrow-callback: "off", func-names: "off" */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { loadConsentGroupsFixtures } from '/imports/__tests__/fixtures/consentGroups';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import './methods.js';


chai.use(chaiSubset);

if (Meteor.isServer) {
  describe('consentGroups', function () {
    beforeEach(function () {
      resetDatabase();
      loadConsentGroupsFixtures();
    });

    it('getProjectsForCurrentUser will return empty lists for not logged in user', function () {
      const method = Meteor.server.method_handlers['consentGroups.getProjectsForCurrentUser'];
      const result = method.apply({ userId: undefined });
      expect(result).to.deep.equal({
        view: [],
        edit: [],
      });
    });

    it('getProjectsForCurrentUser will return projects for agency which is not in consent group', function () { // eslint-disable-line
      const method = Meteor.server.method_handlers['consentGroups.getProjectsForCurrentUser'];
      const result = method.apply({ userId: 'user1' });
      expect(result).to.deep.equal({
        view: ['projectA1', 'projectB1'],
        edit: ['projectA1'],
      });
    });

    it('getProjectsForCurrentUser will return projects within consent group and 1 agency', function () { // eslint-disable-line
      const method = Meteor.server.method_handlers['consentGroups.getProjectsForCurrentUser'];
      const result = method.apply({ userId: 'user2' });
      expect(result).to.deep.equal({
        view: ['projectA2', 'projectB2'],
        edit: ['projectB2'],
      });
    });

    it('getProjectsForCurrentUser will return projects within consent group with 2 agencies', function () { // eslint-disable-line
      ConsentGroups.update('cg2', { $set: { agencies: ['agency2', 'agency3'] } });
      const method = Meteor.server.method_handlers['consentGroups.getProjectsForCurrentUser'];
      console.log('zzz', ConsentGroups.findOne('cg2'));
      const result = method.apply({ userId: 'user2' });


      expect(result).to.deep.equal({
        view: ['projectA2', 'projectB2', 'projectA3'],
        edit: ['projectB2'],
      });
    });

    // agency with 2 consent groups
    it('getProjectsForCurrentUser will return projects for agency that belongs to 2 consent groups', function () { // eslint-disable-line
      ConsentGroups.update('cg4', { $set: { agencies: ['agency2', 'agency4'] } });
      const method = Meteor.server.method_handlers['consentGroups.getProjectsForCurrentUser'];
      const result = method.apply({ userId: 'user2' });
      expect(result).to.deep.equal({
        view: ['projectA2', 'projectB2', 'projectA4', 'projectB4', 'projectC4'],
        edit: ['projectB2'],
      });
    });
  });
}
