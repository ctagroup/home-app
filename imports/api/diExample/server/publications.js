Meteor.injectedPublish('diExample.test', function testInjection(arg1, arg2) {
  const { logger } = this.context;
  logger.info('diExample.test', arg1, arg2, this.userId, this.context.connectionString);
});
