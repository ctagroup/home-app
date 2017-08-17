import moment from 'moment';

Meteor.publish(
  'housingMatch.list', function publishHousingMatch() {
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    let housingMatch = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      housingMatch = HMISAPI.getHousingMatchForPublish();
      // according to the content received.
      // Adding Dummy Data for testing.

      for (let i = 0; i < housingMatch.length && !stopFunction; i += 1) {
        if (housingMatch[i].links && housingMatch[i].links.length > 1) {
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

        // fetch client status
        const referralStatus = HMISAPI.getReferralStatusHistory(
          housingMatch[i].eligibleClients.clientId
        );
        // Sort based on Timestamp
        referralStatus.sort((a, b) => {
          const aTime = moment(a.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
          const bTime = moment(b.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
          return aTime - bTime;
        });
        housingMatch[i].eligibleClients.referralStatus = referralStatus;

        const housingUnit = HMISAPI.getHousingUnitForPublish(housingMatch[i].housingUnitId);

        let schema = 'v2015';
        if (housingUnit.links && housingUnit.links.length > 0
            && housingUnit.links[0].rel.indexOf('v2014') !== -1) {
          schema = 'v2014';
        }

        housingUnit.project = HMISAPI.getProjectForPublish(housingUnit.projectId, schema);

        housingMatch[i].housingUnit = housingUnit;

        self.added('localHousingMatch', housingMatch[i].reservationId, housingMatch[i]);
        self.ready();
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }

    return self.ready();
  }
);