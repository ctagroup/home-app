/**
 * Created by Anush-PC on 7/19/2016.
 */

Meteor.publish(
  'housingMatch', function publishHousingMatch() {
    const self = this;

    let housingMatch = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      housingMatch = HMISAPI.getHousingMatchForPublish();
      // according to the content received.
      // Adding Dummy Data for testing.

      for (let i = 0; i < housingMatch.length; i += 1) {
        if (housingMatch[i].links) {
          let schema = 'v2015';
          if (housingMatch[i].links[1].href.indexOf('v2014') !== -1) {
            schema = 'v2014';
          }
          housingMatch[i].eligibleClients.clientDetails = HMISAPI.getClient(
            housingMatch[i].eligibleClients.clientId,
            schema,
            // useCurrentUserObject
            false
          );
          housingMatch[i].eligibleClients.clientDetails.schema = schema;
        }

        // If client Id not found. So that we don't get any error.
        if (!housingMatch[i].eligibleClients.clientDetails) {
          const clientId = '';
          const firstName = '';
          const middleName = '';
          const lastName = '';
          const schema = '';
          housingMatch[i].eligibleClients.clientDetails = {
            clientId,
            firstName,
            middleName,
            lastName,
            schema,
          };
        }
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
    if (housingMatch) {
      logger.info(`Publishing Housing Match: ${housingMatch.length}`);
      for (let i = 0; i < housingMatch.length; i += 1) {
        self.added('housingMatch', housingMatch[i].reservationId, housingMatch[i]);
      }
    }
    self.ready();
  }
);
