import RoiApiClient from '/imports/api/homeApi/roiApi';

Meteor.methods({
  'roiApi'(methodName, ...args) {
    const api = RoiApiClient.create(this.userId);
    return api[methodName](...args);
  },
});
