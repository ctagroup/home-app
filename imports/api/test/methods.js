import awilix from 'awilix';
import { logger } from '/imports/utils/logger';
import container from '/imports/startup/server/diContainer';


Meteor.injectedMethods({
  'test.1'(a = 0, b = 0) {
    console.log('calling test.1', this.userId, a, b);
    return a + b;
  },
  'test.2'(c = 3) {
    console.log('calling test.2', this.userId, c);
    return 0;
  },
  'test.3'(a, b, ctx) {
    console.log(ctx.connectionString);
    return a + b;
  },
});
