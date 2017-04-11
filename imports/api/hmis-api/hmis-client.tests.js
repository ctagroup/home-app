/* eslint prefer-arrow-callback: "off", func-names: "off" */

import { chai } from 'meteor/practicalmeteor:chai';
import { HmisClient, ApiRegistry } from './hmis-client';

class DummyApi {
  bar() {
    return 'baz';
  }
}

describe('hmis-api', function () {
  describe('client', function () {
    it('can use dummy api', function () {
      const registry = new ApiRegistry();
      registry.addApi('dummy', DummyApi);

      const client = new HmisClient('userId', 'appId', 'appSecret', registry);
      chai.assert.equal(client.api('dummy').bar(), 'baz');
    });
    it('will throw an error if unknown api is used', function () {
      const emptyRegistry = new ApiRegistry();
      const client = new HmisClient('userId', 'appId', 'appSecret', emptyRegistry);
      chai.assert.throws(() => client.api('non-existent').bar(), Meteor.Error);
    });
  });
});
