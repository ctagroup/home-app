Meteor.injectedPublish('test.injection', function testInjection(id) {
  console.log('test.injection', id, this.userId, this.context.connectionString);
});
