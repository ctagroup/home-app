/**
 * Created by udit on 12/12/15.
 */

// Set up login services
Meteor.startup(
  () => {
    // Add Google configuration entry
    ServiceConfiguration.configurations.remove({service: 'google'});

    // Add HMIS configuration entry
    ServiceConfiguration.configurations.update(
      {
        service: 'HMIS',
      }, {
        $set: {
          hmisAPIEndpoints: HomeConfig.hmisAPIEndpoints,
          appId: '16631CFE-6909-4AC1-B4EB-57902AC7AF0A',
          appSecret: 'e7052d2a000447c8bd51cb88ab10ca17',
        },
      }, {
        upsert: true,
      }
    );
  }
);
