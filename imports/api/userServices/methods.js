import { logger } from '/imports/utils/logger';
import UserServices from '/imports/api/userServices/userServices';
// import { HmisClient } from '/imports/api/hmisApi';
// import AppSettings from '/imports/api/appSettings/appSettings';


Meteor.methods({
  'userServices.create'(data) {
    logger.info(`METHOD[${this.userId}]: userServices.create`, data);

    if (!data.projectId) {
      throw new Meteor.Error('Please select the project');
    }

    if (!data.serviceName) {
      throw new Meteor.Error('Please select the service');
    }

    if (!data.serviceDate) {
      throw new Meteor.Error('Please select the service date');
    }

    return UserServices.insert(data);
  },
});
