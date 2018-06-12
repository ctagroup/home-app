/* eslint prefer-arrow-callback: "off", func-names: "off" */
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import Agencies from '/imports/api/agencies/agencies';
import Users from '/imports/api/users/users';
import { ConsentPermission } from '/imports/api/consents/consents';
import './methods';

chai.use(chaiSubset);

const WEEK_IN_SECONDS = 7 * 8600;

if (Meteor.isServer) {
  describe('consents', function () {
    beforeEach(function () {
      resetDatabase();
      // TODO: move to a file with fixutures to
      Agencies.insert({
        _id: 'agency1',
        agencyName: 'Agency 1',
        members: ['user1'],
        projects: ['projectA1', 'projectB1'],
        projectsMembers: [
          { projectId: 'projectA1', userId: 'user1' },
        ],
      });
      Users.insert({
        _id: 'user1',
        activeProject: 'projectA1',
        createdAt: new Date(),
      });
    });

    it('check access for client - edit permissions', function () {
      const consents = [
        {
          clientId: 'client1',
          status: 'APPROVED',
          startTime: moment().unix() - WEEK_IN_SECONDS,
          endTime: moment().unix() + WEEK_IN_SECONDS,
          globalProjects: [{ id: 'projectA1' }],
          consentId: 'f1e6be09-5d47-41a0-9273-3522921c3e67',
        },
      ];
      // user1 has active projectA1, so edit permission should be granted
      const method = Meteor.server.method_handlers['consents.checkClientAccessByConsents'];
      const result = method.apply({ userId: 'user1' }, [consents]);
      expect(result).to.equal(ConsentPermission.EDIT);
    });

    it('check access for client - view permissions', function () {
      const consents = [
        {
          clientId: 'client1',
          status: 'APPROVED',
          startTime: moment().unix() - WEEK_IN_SECONDS,
          endTime: moment().unix() + WEEK_IN_SECONDS,
          globalProjects: [{ id: 'projectB1' }],
        },
      ];
      // user1 has active projectA1, but can access projectA1 and projectB1,
      // consent is for projectB1
      // view permission should be granted
      const method = Meteor.server.method_handlers['consents.checkClientAccessByConsents'];
      const result = method.apply({ userId: 'user1' }, [consents]);
      expect(result).to.equal(ConsentPermission.VIEW);
    });

    it('check access for client - deny', function () {
      const consents = [
        {
          clientId: 'client1',
          status: 'APPROVED',
          startTime: moment().unix() - WEEK_IN_SECONDS,
          endTime: moment().unix() + WEEK_IN_SECONDS,
          globalProjects: [{ id: 'projectA1' }],
        },
      ];
      // user1 has active projectA1
      // consent is for projectA1
      // edit permission should be granted
      const method = Meteor.server.method_handlers['consents.checkClientAccessByConsents'];
      const result = method.apply({ userId: 'user1' }, [consents]);
      expect(result).to.equal(ConsentPermission.EDIT);
    });

    it('check access for client - denied (empty projects)', function () {
      const consents = [
        {
          clientId: 'client1',
          status: 'APPROVED',
          startTime: moment().unix() - WEEK_IN_SECONDS,
          endTime: moment().unix() + WEEK_IN_SECONDS,
          globalProjects: [],
        },
      ];
      // user1 has active projectA1
      // consent does not have projects
      // permission should be denied
      const method = Meteor.server.method_handlers['consents.checkClientAccessByConsents'];
      const result = method.apply({ userId: 'user1' }, [consents]);
      expect(result).to.equal(ConsentPermission.DENIED);
    });

    it('check access for client - denied (outdated)', function () {
      const consents = [
        {
          clientId: 'client1',
          status: 'APPROVED',
          startTime: moment().unix() - WEEK_IN_SECONDS,
          endTime: moment().unix() - WEEK_IN_SECONDS,
          globalProjects: [{ id: 'projectB1' }],
        },
      ];
      // user1 has active projectA1, but can access projectA1 and projectB1,
      // consent is for projectB1
      // view permission should be granted
      const method = Meteor.server.method_handlers['consents.checkClientAccessByConsents'];
      const result = method.apply({ userId: 'user1' }, [consents]);
      expect(result).to.equal(ConsentPermission.DENIED);
    });
  });
}
