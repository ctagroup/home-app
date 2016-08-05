/**
 * Created by udit on 12/12/15.
 */

// Set up login services
Meteor.startup(
  () => {
    // Add HMIS configuration entry
    ServiceConfiguration.configurations.update(
      {
        service: 'HMIS',
      }, {
        $set: {
          hmisAPIEndpoints: HomeConfig.hmisAPIEndpoints,
          appId: '16631CFE-6909-4AC1-B4EB-57902AC7AF0A',
          appSecret: 'appSecret',
        },
      }, {
        upsert: true,
      }
    );
  }
);
