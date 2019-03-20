import { logger } from '/imports/utils/logger';
import Services from '/imports/api/services/services';
// import { HmisClient } from '/imports/api/hmisApi';
// import AppSettings from '/imports/api/appSettings/appSettings';


Meteor.methods({
  'services.create'(data) {
    logger.info(`METHOD[${this.userId}]: services.create`, data);

    if (!data.projectId) {
      throw new Meteor.Error('Please select the project');
    }

    if (!data.serviceName) {
      throw new Meteor.Error('Please select the service');
    }

    if (!data.serviceDate) {
      throw new Meteor.Error('Please select the service date');
    }

    return Services.insert(data);
  },
});
