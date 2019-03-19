import RoiApiClient from '/imports/api/homeApi/roiApi';
import TagApiClient from '/imports/api/homeApi/tagApi';

Meteor.methods({
  'roiApi'(methodName, ...args) {
    const api = RoiApiClient.create(this.userId);
    const apiMethod = api[methodName];
    if (!apiMethod) {
      throw new Meteor.Error(400, `Method RoiApiClient.${methodName} not exits`);
    }
    return apiMethod.bind(api)(...args);
  },
  'tagApi'(methodName, ...args) {
    const api = TagApiClient.create(this.userId);
    const apiMethod = api[methodName];
    if (!apiMethod) {
      throw new Meteor.Error(400, `Method TagApiClient.${methodName} not exits`);
    }
    return apiMethod.bind(api)(...args);
  },
});
