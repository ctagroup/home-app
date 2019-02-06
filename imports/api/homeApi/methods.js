import RoiApiClient from '/imports/api/homeApi/roiApi';

Meteor.methods({
  'roiApi'(methodName, ...args) {
    const api = RoiApiClient.create(this.userId);
    const apiMethod = api[methodName].bind(api);
    if (!apiMethod) {
      throw new Meteor.Error(400, `Method RoiApiClient.${methodName} not exits`);
    }
    return apiMethod(...args);
  },
});
