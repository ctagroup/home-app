Meteor.injectedMethods({
  'hmisApi.get'(url) {
    const { hmisClient } = this.context;
    return hmisClient.api('client').doGet(url);
  },
});
