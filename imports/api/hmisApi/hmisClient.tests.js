/* eslint prefer-arrow-callback: "off", func-names: "off" */

import { chai } from 'meteor/practicalmeteor:chai';
import { HmisClient } from './hmisClient';
import { ApiRegistry } from './apiRegistry';

class DummyApi {
  bar() {
    return 'baz';
  }
}

const fakeCollection = {
  findOne() {
    return {
      services: {
        HMIS: {},
      },
    };
  },
};

describe('hmisApi', function () {
  describe('client', function () {
    it('can use dummy api', function () {
      const registry = new ApiRegistry();
      registry.addApi('dummy', DummyApi);

      const config = {
        appId: 'appId',
        appSecret: 'secret',
      };
      const client = new HmisClient('userId', config, registry, fakeCollection);
      client.authData = { expiresAt: new Date().getTime() + 60 * 1000 };
      const api = client.api('dummy');
      chai.assert.equal(api.bar(), 'baz');
    });

    it('will throw an error if unknown api is used', function () {
      const emptyRegistry = new ApiRegistry();
      const config = {
        appId: 'appId',
        appSecret: 'secret',
      };
      const client = new HmisClient('userId', config, emptyRegistry, Meteor.users);
      chai.assert.throws(() => client.api('non-existent').bar(), Error);
    });
  });
});
